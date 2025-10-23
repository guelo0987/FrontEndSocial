export interface PostAnalytics {
  id: number;
  post_id: number;
  platform: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  reach: number;
  engagement_rate: number;
  clicks: number;
  saves: number;
  recorded_at: string;
}

export interface PostAnalyticsCreateRequest {
  post_id: number;
  platform: string;
  likes?: number;
  comments?: number;
  shares?: number;
  views?: number;
  reach?: number;
  engagement_rate?: number;
  clicks?: number;
  saves?: number;
}

export interface PostAnalyticsUpdateRequest {
  likes?: number;
  comments?: number;
  shares?: number;
  views?: number;
  reach?: number;
  engagement_rate?: number;
  clicks?: number;
  saves?: number;
}

export interface PostAnalyticsResponse {
  id: number;
  post_id: number;
  platform: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  reach: number;
  engagement_rate: number;
  clicks: number;
  saves: number;
  recorded_at: string;
}

export interface AnalyticsSummary {
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_views: number;
  total_reach: number;
  average_engagement_rate: number;
  total_clicks: number;
  total_saves: number;
  posts_count: number;
}
