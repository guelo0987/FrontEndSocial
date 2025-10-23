export interface Brand {
  id: number;
  client_id: number;
  name: string;
  tagline?: string;
  description?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_primary?: string;
  font_secondary?: string;
  tone_of_voice?: string;
  target_audience?: string;
  brand_values?: string[];
  brand_keywords?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandCreateRequest {
  name: string;
  tagline?: string;
  description?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_primary?: string;
  font_secondary?: string;
  tone_of_voice?: string;
  target_audience?: string;
  brand_values?: string[];
  brand_keywords?: string[];
}

export interface BrandUpdateRequest {
  name?: string;
  tagline?: string;
  description?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_primary?: string;
  font_secondary?: string;
  tone_of_voice?: string;
  target_audience?: string;
  brand_values?: string[];
  brand_keywords?: string[];
  is_active?: boolean;
}

export interface BrandResponse {
  id: number;
  client_id: number;
  name: string;
  tagline?: string;
  description?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_primary?: string;
  font_secondary?: string;
  tone_of_voice?: string;
  target_audience?: string;
  brand_values?: string[];
  brand_keywords?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ToneOfVoice = 'casual' | 'professional' | 'friendly' | 'authoritative' | 'playful' | 'serious' | 'inspirational';
