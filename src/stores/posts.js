import { defineStore } from 'pinia'
import { getStorage, setStorage } from '@/utils/storage'
import { createPost, fetchPosts, updatePost, togglePostLike, deletePost } from '@/services/api/posts'

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
      this.posts = await fetchPosts()
      setStorage('posts', this.posts)
      this.loaded = true
    },
    async create(post) {
      // 将文章数据提交到后端 API（POST /api/posts），后端返回创建完成的文章对象
      const created = await createPost(post)
      this.posts.unshift(created)
      setStorage('posts', this.posts)
      return created
    },
    async update(postId, changes) {
      const updated = await updatePost(postId, changes)
      this.posts = this.posts.map((post) => (post.id === postId ? updated : post))
      setStorage('posts', this.posts)
      return updated
    },
    async remove(postId) {
      const previousPosts = [...this.posts]
      this.posts = this.posts.filter((post) => post.id !== postId)
      setStorage('posts', this.posts)

      try {
        await deletePost(postId)
      } catch (error) {
        this.posts = previousPosts
        setStorage('posts', this.posts)
        throw error
      }
    },
    async toggleLike(postId) {
      const nextLiked = !this.likes[postId]
      const delta = nextLiked ? 1 : -1

      this.likes[postId] = nextLiked
      setStorage('likes', this.likes)

      const postIndex = this.posts.findIndex((item) => item.id === postId)

      if (postIndex === -1) {
        try {
          await togglePostLike(postId, nextLiked)
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
        const serverPost = await togglePostLike(postId, nextLiked)
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
