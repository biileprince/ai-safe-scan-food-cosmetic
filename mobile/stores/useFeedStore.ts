import { create } from 'zustand';
import { FeedItem, FeedFilter } from '../services/feed/types';
import { fetchFeed } from '../services/feed/feedService';

interface FeedState {
  items: FeedItem[];
  isLoading: boolean;
  filter: FeedFilter;
  setFilter: (category: FeedFilter['category']) => void;
  loadFeed: () => Promise<void>;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  items: [],
  isLoading: false,
  filter: { category: 'All' },
  
  setFilter: (category) => {
    set({ filter: { category } });
    get().loadFeed();
  },
  
  loadFeed: async () => {
    set({ isLoading: true });
    try {
      const items = await fetchFeed(get().filter);
      set({ items, isLoading: false });
    } catch (error) {
      console.error('Failed to load feed:', error);
      set({ isLoading: false });
    }
  },
}));
