export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at?: string;
}

export interface WorkspaceMember {
  user_id: string;
  workspace_id: string;
  role: 'owner' | 'member';
  email?: string;
}
