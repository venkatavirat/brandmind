import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { retainCampaignMemory } from '@/lib/hindsight';
import type { MarketingExperiment } from '@/types/experiment';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
const groq = new OpenAI({ baseURL: 'https://api.groq.com/openai/v1', apiKey: process.env.GROQ_API_KEY || 'dummy_build_key' });
const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'will', 'from', 'into', 'your', 'our', 'are']);
const tokens = (value: string) => new Set(value.toLowerCase().split(/[^a-z0-9]+/).filter((x) => x.length > 3 && !stopWords.has(x)));
const overlap = (a: string, b: string) => { const left = tokens(a); const right = tokens(b); return [...left].filter((x) => right.has(x)).length >= 2; };
function fallbackRule(previous: MarketingExperiment, current: MarketingExperiment) { return `${previous.strategy_used} performs well for ${previous.audience}, but ${current.strategy_used.toLowerCase()} requires a separate audience or fatigue guardrail under ${current.audience}.`; }

export async function POST(request: Request) {
  try {
    const experiment = await request.json() as MarketingExperiment;
    if (!experiment.workspace_id) return NextResponse.json({ success: false, error: 'Workspace is required.' }, { status: 400 });
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) return NextResponse.json({ success: false, error: 'Authentication required to save experiments.' }, { status: 401 });
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key', { global: { headers: { Authorization: authorization } } });
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) return NextResponse.json({ success: false, error: 'Your session is invalid or expired.' }, { status: 401 });
    const { data: membership } = await client.from('workspace_members').select('workspace_id').eq('workspace_id', experiment.workspace_id).eq('user_id', userData.user.id).maybeSingle();
    if (!membership) return NextResponse.json({ success: false, error: 'You do not have access to this workspace.' }, { status: 403 });
    const { data: history } = await client.from('experiments').select('*').eq('workspace_id', experiment.workspace_id).order('created_at', { ascending: false }).limit(50);
    const prior = (history || []).find((item) => item.outcome_status === 'SUCCESS' && overlap(`${item.strategy_used} ${item.hypothesis}`, `${experiment.strategy_used} ${experiment.hypothesis}`));
    const conflict = Boolean(prior && experiment.outcome_status === 'FAILURE');
    const lineage = [...new Set([...(experiment.lineage_experiment_ids || []), ...(prior?.id ? [prior.id] : [])])];
    let rule = experiment.strategic_rule || '';
    if (conflict && prior) {
      try {
        const completion = await groq.chat.completions.create({ model: 'llama-3.3-70b-versatile', response_format: { type: 'json_object' }, messages: [{ role: 'system', content: 'Return JSON only: {"rule":"one conditional Level 3 brand rule"}. Refine the successful historical rule using the new failure, audience, and conditions.' }, { role: 'user', content: JSON.stringify({ previous: prior, current: experiment }) }], temperature: 0.1 });
        const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}') as { rule?: unknown };
        if (typeof parsed.rule === 'string' && parsed.rule) rule = parsed.rule;
      } catch (error) { console.warn('Rule refinement warning:', error); }
      if (!rule) rule = fallbackRule(prior, experiment);
    }
    const now = new Date().toISOString();
    const row = { ...experiment, user_id: userData.user.id, created_at: experiment.created_at || now, updated_at: now, strategic_rule: rule || null, lineage_experiment_ids: lineage };
    const { data, error } = await client.from('experiments').insert([row]).select('id').single();
    if (error) throw error;
    await retainCampaignMemory({ content: `WORKSPACE ${experiment.workspace_id} | EXPERIMENT OUTCOME [${experiment.outcome_status}] | ID ${data.id} | Metrics: ${experiment.result_metrics} | Learning: ${experiment.learning} | Level 3 Rule: ${rule || 'Pending refinement'} | Lineage: ${lineage.join(', ')}` });
    return NextResponse.json({ success: true, experimentId: data.id, contradiction: conflict, refined_rule: rule || null, lineage_experiment_ids: lineage });
  } catch (error: unknown) { return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Failed to retain memory' }, { status: 500 }); }
}
