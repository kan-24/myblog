import { defineStore } from 'pinia'
import { getStorage, setStorage } from '@/utils/storage'
import { loadInitialPosts } from '@/utils/dataLoader'
import { createPost } from '@/services/api/posts'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: getStorage('posts', []),
    loaded: false,
    favorites: getStorage('favorites', {}),
    likes: getStorage('likes', {})
  }),
  getters: {
    categories(state) {
      return [...new Set(state.posts.map((post) => post.category))]
    },
    tags(state) {
      return [...new Set(state.posts.flatMap((post) => post.tags))]
    }
  },
  actions: {
    async ensureLoaded() {
      if (this.loaded) return
      if (!this.posts.length) {
        this.posts = await loadInitialPosts()
        setStorage('posts', this.posts)
      }
      this.loaded = true
    },
    async create(post) {
      const created = await createPost(post)
      this.posts.unshift(created)
      setStorage('posts', this.posts)
      return created
    },
    async update(postId, changes) {
      this.posts = this.posts.map((post) =>
        post.id === postId ? { ...post, ...changes, updatedAt: new Date().toISOString() } : post
      )
      setStorage('posts', this.posts)
    },
    async remove(postId) {
      this.posts = this.posts.filter((post) => post.id !== postId)
      setStorage('posts', this.posts)
    },
    toggleFavorite(postId) {
      this.favorites[postId] = !this.favorites[postId]
      setStorage('favorites', this.favorites)
      const post = this.posts.find((item) => item.id === postId)
      if (post) {
        post.favorites += this.favorites[postId] ? 1 : -1
      }
    },
    toggleLike(postId) {
      this.likes[postId] = !this.likes[postId]
      setStorage('likes', this.likes)
      const post = this.posts.find((item) => item.id === postId)
      if (post) {
        post.likes += this.likes[postId] ? 1 : -1
      }
    }
  }
})
