import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { recallBrandMemory } from '@/lib/hindsight';
import type { EvaluationResponse, MarketingExperiment } from '@/types/experiment';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
const groq = new OpenAI({ baseURL: 'https://api.groq.com/openai/v1', apiKey: process.env.GROQ_API_KEY || 'dummy_build_key' });
const SYSTEM_PROMPT = `You are BrandMind's adversarial marketing evaluator. Return only valid JSON. Build three memory tiers: raw_experience with exact supporting experiment IDs and recorded metrics; tactical_learning with one direct takeaway; strategic_rule with one formal actionable brand directive. If the hypothesis repeats or substantially matches a historical FAILURE, explicitly disagree, return HIGH RISK, cite the verbatim experiment IDs, and explain the failure pattern. Return exactly {"verdict":"CLEAR"|"CAUTION"|"HIGH RISK","synthesis":"string","recommended_action":"string","supporting_experiments":[experiment objects],"tiers":{"raw_experience":{"experiment_ids":["id"],"recorded_metrics":["metric"]},"tactical_learning":"string","strategic_rule":"string"},"suggested_modifications":["string"]}`;

function isStatus(value: unknown): value is MarketingExperiment['outcome_status'] { return value === 'SUCCESS' || value === 'FAILURE' || value === 'INCONCLUSIVE'; }
function normalizeExperiment(value: unknown): MarketingExperiment | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;
  const required = ['objective', 'hypothesis', 'audience', 'strategy_used', 'result_metrics', 'audience_reaction', 'interpretation', 'learning'];
  if (!required.every((key) => typeof item[key] === 'string') || !isStatus(item.outcome_status)) return null;
  return { id: typeof item.id === 'string' ? item.id : undefined, objective: item.objective as string, hypothesis: item.hypothesis as string, audience: item.audience as string, strategy_used: item.strategy_used as string, variables: Array.isArray(item.variables) ? item.variables.filter((x): x is string => typeof x === 'string') : undefined, result_metrics: item.result_metrics as string, audience_reaction: item.audience_reaction as string, outcome_status: item.outcome_status, interpretation: item.interpretation as string, learning: item.learning as string, strategic_rule: typeof item.strategic_rule === 'string' ? item.strategic_rule : undefined, lineage_experiment_ids: Array.isArray(item.lineage_experiment_ids) ? item.lineage_experiment_ids.filter((x): x is string => typeof x === 'string') : undefined, created_at: typeof item.created_at === 'string' ? item.created_at : undefined, updated_at: typeof item.updated_at === 'string' ? item.updated_at : undefined };
}
function normalize(value: unknown, history: MarketingExperiment[]): EvaluationResponse {
  const item = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const supporting = Array.isArray(item.supporting_experiments) ? item.supporting_experiments.map(normalizeExperiment).filter((x): x is MarketingExperiment => x !== null) : [];
  const tierValue = item.tiers && typeof item.tiers === 'object' ? item.tiers as Record<string, unknown> : {};
  const raw = tierValue.raw_experience && typeof tierValue.raw_experience === 'object' ? tierValue.raw_experience as Record<string, unknown> : {};
  const fallback = supporting.length ? supporting : history.slice(0, 5);
  return { verdict: item.verdict === 'CLEAR' || item.verdict === 'CAUTION' || item.verdict === 'HIGH RISK' || item.verdict === 'VALIDATED' || item.verdict === 'CHALLENGED' || item.verdict === 'UNTESTED_HYPOTHESIS' ? item.verdict : 'CAUTION', synthesis: typeof item.synthesis === 'string' ? item.synthesis : 'No structured synthesis was generated.', recommended_action: typeof item.recommended_action === 'string' ? item.recommended_action : 'Run a measurable test and capture the outcome.', supporting_experiments: fallback, tiers: { raw_experience: { experiment_ids: Array.isArray(raw.experiment_ids) ? raw.experiment_ids.filter((x): x is string => typeof x === 'string') : fallback.flatMap((x) => x.id ? [x.id] : []), recorded_metrics: Array.isArray(raw.recorded_metrics) ? raw.recorded_metrics.filter((x): x is string => typeof x === 'string') : fallback.map((x) => x.result_metrics) }, tactical_learning: typeof tierValue.tactical_learning === 'string' ? tierValue.tactical_learning : fallback.map((x) => x.learning).join(' '), strategic_rule: typeof tierValue.strategic_rule === 'string' ? tierValue.strategic_rule : 'Make future campaign decisions conditional on audience, channel, and fatigue signals.' }, suggested_modifications: Array.isArray(item.suggested_modifications) ? item.suggested_modifications.filter((x): x is string => typeof x === 'string') : [] };
}
async function authorize(request: Request, workspaceId: string) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) throw new Error('AUTHENTICATION_REQUIRED');
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key', { global: { headers: { Authorization: authorization } } });
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error('SESSION_INVALID');
  const { data: membership } = await client.from('workspace_members').select('workspace_id').eq('workspace_id', workspaceId).eq('user_id', data.user.id).maybeSingle();
  if (!membership) throw new Error('WORKSPACE_FORBIDDEN');
  return client;
}
export async function POST(request: Request) {
  try {
    const body = await request.json() as { query?: unknown; workspace_id?: unknown };
    if (typeof body.query !== 'string' || !body.query.trim()) return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    if (typeof body.workspace_id !== 'string' || !body.workspace_id) return NextResponse.json({ error: 'Workspace is required' }, { status: 400 });
    const client = await authorize(request, body.workspace_id);
    const { data: rows } = await client.from('experiments').select('*').eq('workspace_id', body.workspace_id).order('created_at', { ascending: false }).limit(30);
    const history = (rows || []).map(normalizeExperiment).filter((x): x is MarketingExperiment => x !== null);
    let memories: unknown[] = [];
    try { const recalled = await recallBrandMemory(`Workspace ${body.workspace_id} only. Include SUCCESS and FAILURE campaign history for: ${body.query}`); const value = recalled?.memories || recalled || []; memories = Array.isArray(value) ? value : [value]; } catch (error) { console.warn('Hindsight recall warning:', error); }
    const completion = await groq.chat.completions.create({ model: 'llama-3.3-70b-versatile', response_format: { type: 'json_object' }, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: `Workspace: ${body.workspace_id}\nHypothesis: ${body.query}\nWorkspace experiments:\n${JSON.stringify(history)}\nRecalled memories:\n${JSON.stringify(memories)}` }], temperature: 0.2 });
    const parsed = JSON.parse((completion.choices[0]?.message?.content || '{}').replace(/^```json\s*|\s*```$/g, '')) as unknown;
    return NextResponse.json(normalize(parsed, history));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to evaluate strategy';
    const statusCode = message === 'AUTHENTICATION_REQUIRED' || message === 'SESSION_INVALID' ? 401 : message === 'WORKSPACE_FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ error: message === 'AUTHENTICATION_REQUIRED' ? 'Authentication required' : message === 'SESSION_INVALID' ? 'Your session is invalid or expired.' : message === 'WORKSPACE_FORBIDDEN' ? 'You do not have access to this workspace.' : message }, { status: statusCode });
  }
}
