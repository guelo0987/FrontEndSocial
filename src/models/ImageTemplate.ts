export interface ImageTemplate {
  id: number;
  client_id: number;
  template_name: string;
  storage_path: string;
  created_at: string;
}

export interface ImageTemplateCreateRequest {
  template_name: string;
  storage_path: string;
}

export interface ImageTemplateUpdateRequest {
  template_name?: string;
  storage_path?: string;
}

export interface ImageTemplateResponse {
  id: number;
  client_id: number;
  template_name: string;
  storage_path: string;
  created_at: string;
}
