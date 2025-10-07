import { defineStore } from 'pinia'
import { getStorage, setStorage } from '@/utils/storage'
import { loadInitialComments } from '@/utils/dataLoader'

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    comments: getStorage('comments', []),
    loaded: false
  }),
  actions: {
    async ensureLoaded() {
      if (this.loaded) return
      if (!this.comments.length) {
        this.comments = await loadInitialComments()
        setStorage('comments', this.comments)
      }
      this.loaded = true
    },
    add(comment) {
      this.comments.push(comment)
      setStorage('comments', this.comments)
    }
  },
  getters: {
    byPost: (state) => (postId) => state.comments.filter((comment) => comment.postId === postId)
  }
})
