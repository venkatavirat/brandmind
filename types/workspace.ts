export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at?: string;
  brand_profile?: BrandProfile;
}

export interface BrandProfile {
  positioning: string;
  target_audience: string;
  tone_of_voice: string;
  core_differentiators: string[];
}

export interface WorkspaceMember {
  user_id: string;
  workspace_id: string;
  role: 'owner' | 'member';
  email?: string;
}
