export interface SocialAccount {
  id: number;
  client_id: number;
  platform: string;
  username: string;
  platform_user_id: string;
  access_token?: string; // Should be encrypted on backend
  refresh_token?: string;
  token_expires_at?: string;
  created_at: string;
}

export interface SocialAccountCreateRequest {
  platform: string;
  username: string;
  platform_user_id: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
}

export interface SocialAccountUpdateRequest {
  username?: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
}

export interface SocialAccountResponse {
  id: number;
  client_id: number;
  platform: string;
  username: string;
  platform_user_id: string;
  created_at: string;
  // Note: tokens are not included in response for security
}
