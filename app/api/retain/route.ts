import { NextResponse } from 'next/server';
import { retainCampaignMemory } from '@/lib/hindsight';
import { MarketingExperiment } from '@/types/experiment';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const experiment: MarketingExperiment = await request.json();
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Authentication required to save experiments.' }, { status: 401 });
    }
    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
      { global: { headers: { Authorization: authorization } } },
    );
    const { data: userData, error: userError } = await authClient.auth.getUser();
    if (userError || !userData.user) {
      return NextResponse.json({ success: false, error: 'Your session is invalid or expired.' }, { status: 401 });
    }
    if (!experiment.workspace_id) {
      return NextResponse.json({ success: false, error: 'Workspace is required.' }, { status: 400 });
    }
    const { data: membership } = await authClient
      .from('workspace_members')
      .select('workspace_id')
      .eq('workspace_id', experiment.workspace_id)
      .eq('user_id', userData.user.id)
      .maybeSingle();
    if (!membership) {
      return NextResponse.json({ success: false, error: 'You do not have access to this workspace.' }, { status: 403 });
    }
    const ownedExperiment = { ...experiment, user_id: userData.user.id };

    const { data, error } = await authClient
      .from('experiments')
      .insert([ownedExperiment])
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    const memory = `WORKSPACE ${experiment.workspace_id} | EXPERIMENT OUTCOME [${experiment.outcome_status}]: Objective: ${experiment.objective} | Hypothesis: ${experiment.hypothesis} | Strategy: ${experiment.strategy_used} | Audience: ${experiment.audience} | Results: ${experiment.result_metrics} | Audience Reaction: ${experiment.audience_reaction} | Cumulative Learning: ${experiment.learning}`;
    await retainCampaignMemory({ content: memory });

    return NextResponse.json({ success: true, experimentId: data.id });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to retain memory' },
      { status: 500 }
    );
  }
}