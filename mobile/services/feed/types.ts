export interface FeedItemBase {
  id: string;
  type: 'recall' | 'community' | 'spotlight' | 'tip' | 'regulatory_update';
  title: string;
  body: string;
  publishedAt: string;
  helpfulCount: number;
  sourceLabel?: string;
}

export interface RecallFeedItem extends FeedItemBase {
  type: 'recall';
  jurisdiction: string;
}

export interface CommunityFeedItem extends FeedItemBase {
  type: 'community';
  authorInitials: string;
  score: number;
}

export interface SpotlightFeedItem extends FeedItemBase {
  type: 'spotlight';
  readMinutes: number;
}

export interface TipFeedItem extends FeedItemBase {
  type: 'tip';
}

export interface RegulatoryUpdateFeedItem extends FeedItemBase {
  type: 'regulatory_update';
  jurisdiction: string;
  readMinutes?: number;
}

export type FeedItem = RecallFeedItem | CommunityFeedItem | SpotlightFeedItem | TipFeedItem | RegulatoryUpdateFeedItem;

export interface FeedFilter {
  category: 'All' | 'Recalls' | 'Tips' | 'Community';
}
