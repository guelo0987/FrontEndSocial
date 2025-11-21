export interface CompanyInfo {
  id: number;
  client_id: number;
  company_name: string;
  business_description?: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  hashtags?: string;
  logo_path?: string;
  brand_colors?: BrandColors;
  template_style?: string;
  // Nuevos campos de contexto de negocio
  business_type?: string;  // 'retail', 'personal_brand', 'service', 'education', 'beauty', etc.
  photography_style?: string;  // 'professional_portrait', 'lifestyle', 'product_only', 'editorial', 'commercial'
  brand_personality?: string;  // Descripción de la personalidad de marca (elegante, juvenil, profesional, etc.)
  target_audience_details?: string;  // Descripción detallada del público objetivo
  visual_references?: string | string[];  // Referencias visuales o keywords de estilo (string para nuevo formato, array para compatibilidad)
  created_at: string;
  updated_at: string;
}

export interface BrandColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
}

export interface CompanyInfoCreateRequest {
  company_name: string;
  business_description?: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  hashtags?: string;
  logo_path?: string;
  brand_colors?: BrandColors;
  template_style?: string;
  // Nuevos campos de contexto de negocio
  business_type?: string;
  photography_style?: string;
  brand_personality?: string;
  target_audience_details?: string;
  visual_references?: string | string[];
}

export interface CompanyInfoUpdateRequest {
  company_name?: string;
  business_description?: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  hashtags?: string;
  logo_path?: string;
  brand_colors?: BrandColors;
  template_style?: string;
  // Nuevos campos de contexto de negocio
  business_type?: string;
  photography_style?: string;
  brand_personality?: string;
  target_audience_details?: string;
  visual_references?: string | string[];
}

export interface CompanyInfoResponse {
  id: number;
  client_id: number;
  company_name: string;
  business_description?: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  hashtags?: string;
  logo_path?: string;
  brand_colors?: BrandColors;
  template_style?: string;
  // Nuevos campos de contexto de negocio
  business_type?: string;
  photography_style?: string;
  brand_personality?: string;
  target_audience_details?: string;
  visual_references?: string | string[];
  created_at: string;
  updated_at: string;
}
