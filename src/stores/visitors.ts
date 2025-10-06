import { defineStore } from 'pinia';
import type { Visitor } from '@/types/blog';
import { getStorage, setStorage } from '@/utils/storage';
import { loadInitialVisitors } from '@/utils/dataLoader';

interface VisitorsState {
  visitors: Visitor[];
  loaded: boolean;
}

export const useVisitorsStore = defineStore('visitors', {
  state: (): VisitorsState => ({
    visitors: getStorage<Visitor[]>('visitors', []),
    loaded: false
  }),
  actions: {
    async ensureLoaded() {
      if (this.loaded) return;
      if (!this.visitors.length) {
        this.visitors = await loadInitialVisitors();
        setStorage('visitors', this.visitors);
      }
      this.loaded = true;
    }
  }
});
