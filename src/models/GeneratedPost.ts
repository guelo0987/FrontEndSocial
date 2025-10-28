// Catálogo de objetivos de posts
export interface PostObjective {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

// Catálogo de estilos visuales
export interface VisualStyle {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface GeneratedPost {
  id: number;
  client_id: number;
  company_id?: number;
  title?: string;
  subtitle?: string;
  content?: string;
  objective_id: number;
  objective?: string;  // Nombre del objetivo (viene del JOIN)
  objective_description?: string;  // Descripción del objetivo
  style_id: number;
  style?: string;      // Nombre del estilo (viene del JOIN)
  style_description?: string;  // Descripción del estilo
  image_url?: string;
  template_id?: number;
  status: PostStatus;
  platform?: string;
  scheduled_for?: string;
  published_at?: string;
  post_url?: string;
  // Campos para variaciones
  is_variation?: boolean;  // Indica si es una variación de otro post
  parent_post_id?: number;  // ID del post original
  generation_type?: string;  // 'template_with_image', 'template_only', 'user_image', 'from_scratch'
  main_image_path?: string;  // Ruta de la imagen del usuario (si aplica)
  created_at: string;
  updated_at: string;
}

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';

export interface GeneratedPostCreateRequest {
  company_id?: number;
  title?: string;
  subtitle?: string;
  content?: string;
  objective_id?: number;
  post_objective?: string;  // Alternativa: nombre del objetivo
  style_id?: number;
  post_style?: string;      // Alternativa: nombre del estilo
  template_id?: number;
  platform?: Platform;
  scheduled_for?: string;
}

export interface GeneratedPostUpdateRequest {
  title?: string;
  subtitle?: string;
  content?: string;
  objective_id?: number;
  style_id?: number;
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
  objective_id: number;
  objective?: string;  // Nombre del objetivo
  objective_description?: string;  // Descripción del objetivo
  style_id: number;
  style?: string;      // Nombre del estilo
  style_description?: string;  // Descripción del estilo
  image_url?: string;
  template_id?: number;
  status: PostStatus;
  platform?: string;
  scheduled_for?: string;
  published_at?: string;
  post_url?: string;
  // Campos para variaciones
  is_variation?: boolean;  // Indica si es una variación de otro post
  parent_post_id?: number;  // ID del post original
  generation_type?: string;  // 'template_with_image', 'template_only', 'user_image', 'from_scratch'
  main_image_path?: string;  // Ruta de la imagen del usuario (si aplica)
  created_at: string;
  updated_at: string;
}
