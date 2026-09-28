import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

type BrandProfile = {
  positioning: string;
  target_audience: string;
  tone_of_voice: string;
  core_differentiators: string[];
};

const emptyProfile: BrandProfile = {
  positioning: '',
  target_audience: '',
  tone_of_voice: '',
  core_differentiators: [],
};

async function workspaceClient(request: Request, workspaceId: string) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) throw new Error('AUTHENTICATION_REQUIRED');
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    { global: { headers: { Authorization: authorization } } },
  );
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error('SESSION_INVALID');
  const { data: membership } = await client
    .from('workspace_members')
    .select('workspace_id')
    .eq('workspace_id', workspaceId)
    .eq('user_id', data.user.id)
    .maybeSingle();
  if (!membership) throw new Error('WORKSPACE_FORBIDDEN');
  return client;
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : 'Brand profile request failed';
  const status = message === 'AUTHENTICATION_REQUIRED' || message === 'SESSION_INVALID' ? 401 : message === 'WORKSPACE_FORBIDDEN' ? 403 : 500;
  return NextResponse.json({ error: message === 'AUTHENTICATION_REQUIRED' ? 'Authentication required' : message === 'SESSION_INVALID' ? 'Your session is invalid or expired.' : message === 'WORKSPACE_FORBIDDEN' ? 'You do not have access to this workspace.' : message }, { status });
}

export async function GET(request: Request) {
  try {
    const workspaceId = new URL(request.url).searchParams.get('workspace_id');
    if (!workspaceId) return NextResponse.json({ error: 'Workspace is required.' }, { status: 400 });
    const client = await workspaceClient(request, workspaceId);
    const { data, error } = await client.from('workspaces').select('id,brand_profile').eq('id', workspaceId).single();
    if (error) throw error;
    return NextResponse.json({ workspace_id: workspaceId, brand_profile: { ...emptyProfile, ...(data.brand_profile || {}) } });
  } catch (error: unknown) { return errorResponse(error); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { workspace_id?: unknown; brand_profile?: Partial<BrandProfile> };
    if (typeof body.workspace_id !== 'string' || !body.workspace_id) return NextResponse.json({ error: 'Workspace is required.' }, { status: 400 });
    const profile = body.brand_profile || {};
    const brandProfile: BrandProfile = {
      positioning: typeof profile.positioning === 'string' ? profile.positioning.trim() : '',
      target_audience: typeof profile.target_audience === 'string' ? profile.target_audience.trim() : '',
      tone_of_voice: typeof profile.tone_of_voice === 'string' ? profile.tone_of_voice.trim() : '',
      core_differentiators: Array.isArray(profile.core_differentiators) ? profile.core_differentiators.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean) : [],
    };
    const client = await workspaceClient(request, body.workspace_id);
    const { data, error } = await client.from('workspaces').update({ brand_profile: brandProfile }).eq('id', body.workspace_id).select('id,brand_profile').single();
    if (error) throw error;
    return NextResponse.json({ workspace_id: data.id, brand_profile: data.brand_profile });
  } catch (error: unknown) { return errorResponse(error); }
}
