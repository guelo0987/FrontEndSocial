export interface Template {
  id: number;
  client_id: number;
  name: string;
  description?: string;
  category?: string;
  thumbnail_url?: string;
  content_structure?: ContentStructure;
  default_style?: string;
  is_public: boolean;
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentStructure {
  title?: ContentField;
  subtitle?: ContentField;
  body?: ContentField;
  call_to_action?: ContentField;
  hashtags?: ContentField;
  image_placement?: string;
  layout_type?: string;
}

export interface ContentField {
  required: boolean;
  max_length?: number;
  placeholder?: string;
  field_type?: 'text' | 'textarea' | 'select' | 'multiselect';
  options?: string[];
}

export type TemplateCategory = 'promotional' | 'educational' | 'engagement' | 'announcement' | 'story' | 'product_showcase' | 'behind_scenes' | 'user_generated';

export interface TemplateCreateRequest {
  name: string;
  description?: string;
  category?: TemplateCategory;
  thumbnail_url?: string;
  content_structure?: ContentStructure;
  default_style?: string;
  is_public?: boolean;
}

export interface TemplateUpdateRequest {
  name?: string;
  description?: string;
  category?: TemplateCategory;
  thumbnail_url?: string;
  content_structure?: ContentStructure;
  default_style?: string;
  is_public?: boolean;
  is_active?: boolean;
}

export interface TemplateResponse {
  id: number;
  client_id: number;
  name: string;
  description?: string;
  category?: string;
  thumbnail_url?: string;
  content_structure?: ContentStructure;
  default_style?: string;
  is_public: boolean;
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
