export interface GeneratedPost {
  id: number;
  client_id: number;
  company_id?: number;
  title?: string;
  subtitle?: string;
  content?: string;
  objective?: string;
  style?: string;
  image_url?: string;
  template_id?: number;
  status: PostStatus;
  platform?: string;
  scheduled_for?: string;
  published_at?: string;
  post_url?: string;
  created_at: string;
  updated_at: string;
}

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export type PostObjective = 'promotional' | 'educational' | 'engagement' | 'announcement' | 'sale' | 'other';

export type PostStyle = 'minimalist' | 'creative' | 'professional' | 'casual' | 'modern' | 'vintage';

export type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';

export interface GeneratedPostCreateRequest {
  company_id?: number;
  title?: string;
  subtitle?: string;
  content?: string;
  objective?: PostObjective;
  style?: PostStyle;
  template_id?: number;
  platform?: Platform;
  scheduled_for?: string;
}

export interface GeneratedPostUpdateRequest {
  title?: string;
  subtitle?: string;
  content?: string;
  objective?: PostObjective;
  style?: PostStyle;
  image_url?: string;
  template_id?: number;
  status?: PostStatus;
  platform?: Platform;
  scheduled_for?: string;
  published_at?: string;
  post_url?: string;
}

export interface GeneratedPostResponse {
  id: number;
  client_id: number;
  company_id?: number;
  title?: string;
  subtitle?: string;
  content?: string;
  objective?: string;
  style?: string;
  image_url?: string;
  template_id?: number;
  status: PostStatus;
  platform?: string;
  scheduled_for?: string;
  published_at?: string;
  post_url?: string;
  created_at: string;
  updated_at: string;
}
