import { FeedItem, FeedFilter } from './types';

// TODO: Swap this mock array for databases.listDocuments(DATABASE_ID, FEED_COLLECTION_ID, queries) 
// once the Appwrite Feed collection exists.
const mockFeed: FeedItem[] = [
  {
    id: '1',
    type: 'recall',
    title: '3 sunscreen brands pulled from shelves in Ghana',
    body: 'Benzene contamination found above regulatory limits. Check your bathroom cabinet against the affected batch codes.',
    sourceLabel: 'Recall · NAFDAC',
    publishedAt: '2h ago',
    helpfulCount: 312,
    jurisdiction: 'NAFDAC',
  },
  {
    id: '2',
    type: 'community',
    title: 'Brightening cream — different batch, different smell',
    body: '"Scanned two jars from the same shop, one came back flagged for BHT. Worth a second look before you buy."',
    sourceLabel: 'Ama K. flagged a product',
    publishedAt: '5h ago',
    helpfulCount: 84,
    authorName: 'Ama K.',
    authorInitials: 'AK',
    productId: 'prod_123',
    score: 28,
  },
  {
    id: '3',
    type: 'spotlight',
    title: 'What is phenoxyethanol, and why is it everywhere?',
    body: 'A common preservative capped at 1% under EU CosIng. Here\'s what the limit means and when it\'s worth a second thought.',
    sourceLabel: 'Ingredient spotlight',
    publishedAt: '1d ago',
    helpfulCount: 0,
    readMinutes: 4,
  },
  {
    id: '4',
    type: 'tip',
    title: '3 signs a sunscreen bottle may be counterfeit',
    body: 'Mismatched batch codes, a scent that\'s slightly off, and printing that doesn\'t match the brand\'s usual label.',
    sourceLabel: 'Tip',
    publishedAt: '2d ago',
    helpfulCount: 156,
    readMinutes: 0,
  },
  {
    id: '5',
    type: 'regulatory_update',
    title: 'Fragrance labeling rules tighten for cosmetics',
    body: 'Manufacturers must now disclose 12 additional allergens by name rather than grouping them under "parfum."',
    sourceLabel: 'Regulatory update · FDA-Ghana',
    publishedAt: '4d ago',
    helpfulCount: 0,
    jurisdiction: 'FDA-Ghana',
  }
];

export async function fetchFeed(filter?: FeedFilter): Promise<FeedItem[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!filter || filter.category === 'All') {
    return mockFeed;
  }

  return mockFeed.filter(item => {
    if (filter.category === 'Recalls') return item.type === 'recall' || item.type === 'regulatory_update';
    if (filter.category === 'Tips') return item.type === 'tip' || item.type === 'spotlight';
    if (filter.category === 'Community') return item.type === 'community';
    return true;
  });
}
