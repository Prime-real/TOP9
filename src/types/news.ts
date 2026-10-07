export interface NewsSource {
  name: string;
  outletType?: 'Wire Service' | 'Broadcast Network' | 'Official Government' | 'Major Newspaper' | 'Primary Court Record' | 'Specialized Journal';
  articleTitle?: string;
  channelOrDomain?: string;
  date: string;
  url: string;
  isVerified?: boolean;
}

export interface NewsMedia {
  type: 'image' | 'video' | 'broadcast';
  url: string; // real article image or broadcast video URL
  thumbnailUrl?: string; // real photograph thumbnail
  caption: string; // factual caption from the photojournalist / newsroom
  credit: string; // e.g. "CNN Breaking News", "Fox News Channel", "NBC News / AP Images", "ABC News Video"
  videoEmbedUrl?: string; // embeddable video or player link
  videoDuration?: string;
  isBroadcastClip?: boolean;
}

export type PopularTvNetwork = 'CNN' | 'Fox News' | 'NBC News' | 'ABC News';

export interface TvBroadcastAlert {
  network: PopularTvNetwork;
  alertType: 'Breaking News' | 'Special Report' | 'Developing Story' | 'Live Alert';
  onAirTimestamp?: string;
  channelTag?: string;
  videoClipUrl?: string;
}

export interface NewsStory {
  rank: number; // 1 to 9 (or 9 to 1)
  category: string;
  headline: string;
  location: string;
  date: string;
  summary: string;
  keyFacts: string[]; // exactly 3 key facts
  whyItMatters: string;
  whatHappensNext: string;
  sources: NewsSource[];
  significanceRating?: 'Critical' | 'High' | 'Notable';
  // Real media from Google search data & publisher article
  media?: NewsMedia;
  // Live Popular TV channel hunt metadata
  tvNetwork?: PopularTvNetwork | 'Multiple Networks' | 'Wire Service';
  tvBroadcastAlert?: TvBroadcastAlert;
}

export interface GoogleSearchData {
  searchQueries: string[]; // live Google Search queries executed for this hunt
  groundingSourcesCount: number;
  topDomains: string[];
  retrievedAt: string;
  tvNetworksHunted: PopularTvNetwork[];
}

export interface NewsReport {
  id: string;
  title: string;
  reportDate: string;
  generatedAt: string;
  storiesVerified: number;
  trendingTopic?: string;
  tvHuntTarget?: string; // e.g. "CNN · Fox News · NBC News · ABC News"
  googleSearchData?: GoogleSearchData;
  executiveSummary: string;
  tableOfContents: { rank: number; headline: string; category: string }[];
  stories: NewsStory[];
  keyDevelopmentsToWatch: string[];
  completeSources: { outlet: string; headline: string; url: string; date: string }[];
  disclaimer: string;
}

export interface GenerationProgress {
  stage: 0 | 1 | 2 | 3 | 4 | 5; // 0=idle, 1=searching, 2=verifying, 3=ranking, 4=writing, 5=finalizing
  message: string;
}
