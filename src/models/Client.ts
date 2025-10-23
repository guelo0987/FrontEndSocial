import type { SocialAccount } from './SocialAccount';

export interface Client {
  id: number;
  name: string;
  email: string;
  password_hash?: string; // Optional for frontend, should not be sent to client
  whatsapp_number: string;
  gemini_prompt_prefix?: string;
  created_at: string;
  updated_at: string;
  social_accounts?: SocialAccount[];
}

export interface ClientCreateRequest {
  name: string;
  email: string;
  password: string;
  whatsapp_number: string;
  gemini_prompt_prefix?: string;
}

export interface ClientUpdateRequest {
  name?: string;
  email?: string;
  whatsapp_number?: string;
  gemini_prompt_prefix?: string;
}

export interface ClientLoginRequest {
  email: string;
  password: string;
}

export interface ClientResponse {
  id: number;
  name: string;
  email: string;
  whatsapp_number: string;
  gemini_prompt_prefix: string;
  created_at: string;
  updated_at: string;
  social_accounts?: SocialAccount[];
}
