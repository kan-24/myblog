import { defineStore } from 'pinia'
import { fetchComments, createComment, deleteComment } from '@/services/api/comments'
import { useAuthStore } from '@/stores/auth'

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    items: {}, // { postId: { data: [], page, hasMore, loading } }
    submitting: false
  }),
  actions: {
    stateFor(postId) {
      if (!this.items[postId]) {
        this.items[postId] = {
          data: [],
          page: 1,
          hasMore: true,
          loading: false
        }
      }
      return this.items[postId]
    },
    async ensureLoaded(postId, reset = false) {
      const state = this.stateFor(postId)
      if (state.loading) return
      if (!reset && state.data.length && !state.hasMore) return
      if (reset) {
        state.data = []
        state.page = 1
        state.hasMore = true
      }
      if (!state.hasMore) return
      state.loading = true
      try {
        const data = await fetchComments(postId, state.page, 20)
        if (reset) {
          state.data = data
        } else {
          state.data = [...state.data, ...data]
        }
        if (data.length < 20) {
          state.hasMore = false
        } else {
          state.page += 1
        }
      } finally {
        state.loading = false
      }
    },
    async submit(postId, payload) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        throw new Error('LOGIN_REQUIRED')
      }
      this.submitting = true
      try {
        const created = await createComment(postId, payload, authStore.token)
        const state = this.stateFor(postId)
        state.data = [...state.data, created]
        return created
      } finally {
        this.submitting = false
      }
    },
    async remove(postId, commentId) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        throw new Error('LOGIN_REQUIRED')
      }
      await deleteComment(postId, commentId, authStore.token)
      const state = this.stateFor(postId)
      state.data = state.data.filter((comment) => comment.id !== commentId)
    }
  },
  getters: {
    listByPost: (state) => (postId) => state.items[postId]?.data ?? [],
    hasMore: (state) => (postId) => state.items[postId]?.hasMore ?? true,
    loading: (state) => (postId) => state.items[postId]?.loading ?? false
  }
})
