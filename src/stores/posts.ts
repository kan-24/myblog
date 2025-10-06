import { defineStore } from 'pinia';
import type { Post } from '@/types/blog';
import { getStorage, setStorage } from '@/utils/storage';
import { loadInitialPosts } from '@/utils/dataLoader';

interface PostsState {
  posts: Post[];
  loaded: boolean;
  favorites: Record<string, boolean>;
  likes: Record<string, boolean>;
}

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => ({
    posts: getStorage<Post[]>('posts', []),
    loaded: false,
    favorites: getStorage<Record<string, boolean>>('favorites', {}),
    likes: getStorage<Record<string, boolean>>('likes', {})
  }),
  getters: {
    categories(state) {
      return [...new Set(state.posts.map((post) => post.category))];
    },
    tags(state) {
      return [...new Set(state.posts.flatMap((post) => post.tags))];
    }
  },
  actions: {
    async ensureLoaded() {
      if (this.loaded) return;
      if (!this.posts.length) {
        this.posts = await loadInitialPosts();
        setStorage('posts', this.posts);
      }
      this.loaded = true;
    },
    async create(post: Post) {
      this.posts.unshift(post);
      setStorage('posts', this.posts);
    },
    async update(postId: string, changes: Partial<Post>) {
      this.posts = this.posts.map((post) =>
        post.id === postId ? { ...post, ...changes, updatedAt: new Date().toISOString() } : post
      );
      setStorage('posts', this.posts);
    },
    async remove(postId: string) {
      this.posts = this.posts.filter((post) => post.id !== postId);
      setStorage('posts', this.posts);
    },
    toggleFavorite(postId: string) {
      this.favorites[postId] = !this.favorites[postId];
      setStorage('favorites', this.favorites);
      const post = this.posts.find((item) => item.id === postId);
      if (post) {
        post.favorites += this.favorites[postId] ? 1 : -1;
      }
    },
    toggleLike(postId: string) {
      this.likes[postId] = !this.likes[postId];
      setStorage('likes', this.likes);
      const post = this.posts.find((item) => item.id === postId);
      if (post) {
        post.likes += this.likes[postId] ? 1 : -1;
      }
    }
  }
});
