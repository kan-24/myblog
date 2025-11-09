import { defineStore } from 'pinia'
import { getStorage, setStorage } from '@/utils/storage'
import { createPost, fetchPosts, fetchPostById, updatePost, deletePost, likePost, unlikePost } from '@/services/api/posts'
import { useAuthStore } from '@/stores/auth'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: getStorage('posts', []),
    loaded: false,
    favorites: getStorage('favorites', {}),
    likes: getStorage('likes', {}),
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false
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
    async ensureLoaded(reset = false) {
      if (this.loaded && !reset) return
      await this.fetchNextPage(true)
      this.loaded = true
    },
    async fetchNextPage(reset = false) {
      if (this.loading) return
      if (reset) {
        this.posts = []
        this.page = 1
        this.hasMore = true
      }
      if (!this.hasMore) return
      this.loading = true
      try {
        const data = await fetchPosts(this.page, this.pageSize)
        if (reset) {
          this.posts = data
        } else {
          this.posts = [...this.posts, ...data.filter((item) => !this.posts.some((existing) => existing.id === item.id))]
        }
        setStorage('posts', this.posts)
        if (data.length < this.pageSize) {
          this.hasMore = false
        } else {
          this.page += 1
        }
      } finally {
        this.loading = false
      }
    },
    async fetchById(postId) {
      const existing = this.posts.find((item) => item.id === postId)
      if (existing) return existing
      const fetched = await fetchPostById(postId)
      this.posts.push(fetched)
      setStorage('posts', this.posts)
      return fetched
    },
    async create(post) {
      // 将文章数据提交到后端 API（POST /api/posts），后端返回创建完成的文章对象
      const token = useAuthStore().token
      const created = await createPost(post, token)
      this.posts.unshift(created)
      setStorage('posts', this.posts)
      return created
    },
    async update(postId, changes) {
      const token = useAuthStore().token
      const updated = await updatePost(postId, changes, token)
      this.posts = this.posts.map((post) => (post.id === postId ? updated : post))
      setStorage('posts', this.posts)
      return updated
    },
    async remove(postId) {
      const token = useAuthStore().token
      const previousPosts = [...this.posts]
      this.posts = this.posts.filter((post) => post.id !== postId)
      setStorage('posts', this.posts)

      try {
        await deletePost(postId, token)
      } catch (error) {
        this.posts = previousPosts
        setStorage('posts', this.posts)
        throw error
      }
    },
    async toggleLike(postId) {
      const authStore = useAuthStore()
      const token = authStore.token
      if (!token) {
        throw new Error('LOGIN_REQUIRED')
      }
      const nextLiked = !this.likes[postId]
      const delta = nextLiked ? 1 : -1

      this.likes[postId] = nextLiked
      setStorage('likes', this.likes)

      const postIndex = this.posts.findIndex((item) => item.id === postId)

      if (postIndex === -1) {
        try {
          if (nextLiked) {
            await likePost(postId, token)
          } else {
            await unlikePost(postId, token)
          }
        } catch (error) {
          this.likes[postId] = !nextLiked
          setStorage('likes', this.likes)
          throw error
        }
        return
      }

      const previousPost = this.posts[postIndex]
      const previousLikes = previousPost.likes ?? 0
      const optimisticPost = { ...previousPost, likes: Math.max(0, previousLikes + delta) }
      this.posts.splice(postIndex, 1, optimisticPost)
      setStorage('posts', this.posts)

      try {
        const serverPost = nextLiked ? await likePost(postId, token) : await unlikePost(postId, token)
        this.posts.splice(postIndex, 1, serverPost)
        setStorage('posts', this.posts)
      } catch (error) {
        this.posts.splice(postIndex, 1, previousPost)
        this.likes[postId] = !nextLiked
        setStorage('likes', this.likes)
        throw error
      }
    }
  }
})
