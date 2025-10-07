import { defineStore } from 'pinia'
import { getStorage, setStorage } from '@/utils/storage'
import { loadInitialVisitors } from '@/utils/dataLoader'

export const useVisitorsStore = defineStore('visitors', {
  state: () => ({
    visitors: getStorage('visitors', []),
    loaded: false
  }),
  actions: {
    async ensureLoaded() {
      if (this.loaded) return
      if (!this.visitors.length) {
        this.visitors = await loadInitialVisitors()
        setStorage('visitors', this.visitors)
      }
      this.loaded = true
    }
  }
})
