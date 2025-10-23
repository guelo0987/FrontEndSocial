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
  created_at: string;
  updated_at: string;
}
