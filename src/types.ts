export interface TransformedURL {
  id: string;
  originalUrl: string;
  transformedUrl: string;
  alias: string;
  transformationType: 'Shorten' | 'Clean';
  clicks: number;
  createdAt: string;
  status: 'Active' | 'Archived';
}

export interface URLStats {
  totalUrls: number;
  totalClicks: number;
  recentGrowth: string;
}
