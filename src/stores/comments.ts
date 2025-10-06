import { defineStore } from 'pinia';
import type { Comment } from '@/types/blog';
import { getStorage, setStorage } from '@/utils/storage';
import { loadInitialComments } from '@/utils/dataLoader';

interface CommentsState {
  comments: Comment[];
  loaded: boolean;
}

export const useCommentsStore = defineStore('comments', {
  state: (): CommentsState => ({
    comments: getStorage<Comment[]>('comments', []),
    loaded: false
  }),
  actions: {
    async ensureLoaded() {
      if (this.loaded) return;
      if (!this.comments.length) {
        this.comments = await loadInitialComments();
        setStorage('comments', this.comments);
      }
      this.loaded = true;
    },
    add(comment: Comment) {
      this.comments.push(comment);
      setStorage('comments', this.comments);
    }
  },
  getters: {
    byPost: (state) => (postId: string) =>
      state.comments.filter((comment) => comment.postId === postId)
  }
});
