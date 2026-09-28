import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { recallBrandMemory } from '@/lib/hindsight';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
const groq = new OpenAI({ baseURL: 'https://api.groq.com/openai/v1', apiKey: process.env.GROQ_API_KEY || 'dummy_build_key' });
const SYSTEM_PROMPT = `You are BrandMind's memory-informed ideation engine. You are not a generic content generator. Use the brand profile and recalled workspace experiments to refine the user's rough idea into practical concepts. Cite exact historical experiment IDs when available, name avoided repeats, and keep every recommendation anchored to what this workspace has tried. Return only JSON: {"concepts":[{"title":"string","concept":"string","memory_basis":"string","avoid":"string","measure":"string"}]}`;

export async function POST(request: Request) {
  try {
    const body = await request.json() as { query?: unknown; workspace_id?: unknown };
    if (typeof body.query !== 'string' || !body.query.trim()) return NextResponse.json({ error: 'An idea or direction is required.' }, { status: 400 });
    if (typeof body.workspace_id !== 'string' || !body.workspace_id) return NextResponse.json({ error: 'Workspace is required.' }, { status: 400 });
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key', { global: { headers: { Authorization: authorization } } });
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });
    const { data: membership } = await client.from('workspace_members').select('workspace_id').eq('workspace_id', body.workspace_id).eq('user_id', userData.user.id).maybeSingle();
    if (!membership) return NextResponse.json({ error: 'You do not have access to this workspace.' }, { status: 403 });
    const [{ data: workspace }, { data: experiments }] = await Promise.all([
      client.from('workspaces').select('brand_profile').eq('id', body.workspace_id).single(),
      client.from('experiments').select('id,objective,hypothesis,strategy_used,result_metrics,outcome_status,learning').eq('workspace_id', body.workspace_id).order('created_at', { ascending: false }).limit(30),
    ]);
    let memories: unknown[] = [];
    try {
      const recalled = await recallBrandMemory(`Workspace ${body.workspace_id} only. Refine this idea using brand identity, successful experiments, failed experiments, and avoided repeats: ${body.query}`);
      const value = recalled?.memories || recalled || [];
      memories = Array.isArray(value) ? value : [value];
    } catch (error) { console.warn('Hindsight recall warning:', error); }
    const completion = await groq.chat.completions.create({ model: 'llama-3.3-70b-versatile', response_format: { type: 'json_object' }, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: `Workspace: ${body.workspace_id}\nBrand profile:\n${JSON.stringify(workspace?.brand_profile || {})}\nRough idea:\n${body.query}\nExperiments:\n${JSON.stringify(experiments || [])}\nHindsight memories:\n${JSON.stringify(memories)}` }], temperature: 0.35 });
    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{"concepts":[]}') as { concepts?: unknown };
    return NextResponse.json({ concepts: Array.isArray(parsed.concepts) ? parsed.concepts : [], memory_used: true });
  } catch (error: unknown) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to refine the idea' }, { status: 500 }); }
}
