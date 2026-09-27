import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const body = await request.json() as { email?: unknown; workspace_id?: unknown };
  if (typeof body.email !== 'string' || typeof body.workspace_id !== 'string') return NextResponse.json({ error: 'Email and workspace are required.' }, { status: 400 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
  const userClient = createClient(url, anon, { global: { headers: { Authorization: authorization } } });
  const { data: userData } = await userClient.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });
  const { data: workspace } = await userClient.from('workspaces').select('id').eq('id', body.workspace_id).eq('owner_id', userData.user.id).maybeSingle();
  if (!workspace) return NextResponse.json({ error: 'Only the workspace owner can invite members.' }, { status: 403 });
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: 'Invitation service is not configured yet.' }, { status: 503 });
  const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(body.email);
  if (inviteError || !invited.user) return NextResponse.json({ error: inviteError?.message || 'Unable to invite member.' }, { status: 500 });
  const { error: memberError } = await admin.from('workspace_members').upsert({ workspace_id: body.workspace_id, user_id: invited.user.id, role: 'member' });
  if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 });
  return NextResponse.json({ message: `Invitation sent to ${body.email}.` });
}
