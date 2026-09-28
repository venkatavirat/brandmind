import { NextResponse } from 'next/server';
import { recallBrandMemory } from '@/lib/hindsight';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export { POST } from '@/app/api/evaluate/route';

export async function GET(request: Request) {
	try {
		const workspaceId = new URL(request.url).searchParams.get('workspace_id');
		const authorization = request.headers.get('authorization');
		if (!workspaceId) return NextResponse.json({ error: 'Workspace is required.' }, { status: 400 });
		if (!authorization?.startsWith('Bearer ')) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
		const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key', { global: { headers: { Authorization: authorization } } });
		const { data: userData, error: userError } = await client.auth.getUser();
		if (userError || !userData.user) return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });
		const { data: membership } = await client.from('workspace_members').select('workspace_id').eq('workspace_id', workspaceId).eq('user_id', userData.user.id).maybeSingle();
		if (!membership) return NextResponse.json({ error: 'You do not have access to this workspace.' }, { status: 403 });
		const { data: experiments } = await client.from('experiments').select('id,learning,outcome_status,result_metrics').eq('workspace_id', workspaceId).order('created_at', { ascending: false }).limit(20);
		const recalled = await recallBrandMemory(`Workspace ${workspaceId} only. Identify up to three proactive actions worth reviewing from prior marketing experiments, citing exact experiment IDs and failure or success evidence.`);
		const memories = recalled?.memories || recalled || [];
		return NextResponse.json({ recommendations: Array.isArray(memories) ? memories.slice(0, 3) : [memories], experiment_count: experiments?.length || 0 });
	} catch (error: unknown) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to load recommendations' }, { status: 500 }); }
}