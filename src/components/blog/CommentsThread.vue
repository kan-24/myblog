<template>
  <section aria-label="评论区" class="space-y-6">
    <header class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">评论</h3>
      <button
        v-if="canComment"
        class="rounded bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        @click="startNewComment"
      >
        写评论
      </button>
    </header>

    <form
      v-if="activeForm"
      class="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
      @submit.prevent="submitComment"
    >
      <textarea
        v-model="formState.content"
        class="w-full rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        rows="3"
        placeholder="分享你的想法..."
        required
      />
      <EmojiPicker @select="appendEmoji" />
      <div class="flex justify-end gap-3">
        <button class="rounded px-3 py-2 text-sm" type="button" @click="cancel">取消</button>
        <button class="rounded bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark" type="submit">
          发布
        </button>
      </div>
    </form>

    <ul class="space-y-4">
      <li
        v-for="thread in threadedComments"
        :key="thread.id"
        class="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
      >
        <header class="flex items-center justify-between">
          <div>
            <span class="font-medium">{{ resolveAuthor(thread.authorId) }}</span>
            <time class="ml-2 text-xs text-slate-500">{{ formatDate(thread.createdAt) }}</time>
          </div>
          <button v-if="canComment" class="text-sm text-brand hover:underline" @click="replyTo(thread.id)">回复</button>
        </header>
        <p class="text-sm leading-relaxed">{{ thread.content }}</p>
        <div class="flex gap-2">
          <span
            v-for="reaction in thread.reactions"
            :key="reaction"
            class="rounded-full bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800"
          >
            {{ reaction }}
          </span>
        </div>
        <ul class="space-y-3 border-l border-slate-200 pl-4 dark:border-slate-800" v-if="thread.children.length">
          <li v-for="child in thread.children" :key="child.id" class="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-950">
            <div class="flex items-center justify-between">
              <div>
                <span class="font-medium">{{ resolveAuthor(child.authorId) }}</span>
                <time class="ml-2 text-xs text-slate-500">{{ formatDate(child.createdAt) }}</time>
              </div>
              <button v-if="canComment" class="text-xs text-brand hover:underline" @click="replyTo(child.id)">回复</button>
            </div>
            <p class="mt-2 leading-relaxed">{{ child.content }}</p>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useCommentsStore } from '@/stores/comments';
import { useAuthStore } from '@/stores/auth';
import type { Comment } from '@/types/blog';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import EmojiPicker from './EmojiPicker.vue';

const props = defineProps<{ postId: string }>();
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const authStore = useAuthStore();
const commentsStore = useCommentsStore();

const canComment = computed(() => Boolean(authStore.user));
const activeForm = computed(() => Boolean(formState.targetId));

const formState = reactive<{ targetId: string | null; content: string; parentId: string | null }>({
  targetId: null,
  content: '',
  parentId: null
});

const appendEmoji = (emoji: string) => {
  formState.content = `${formState.content}${emoji}`;
};

const startNewComment = () => {
  formState.targetId = 'new';
  formState.parentId = null;
};

const replyTo = (parentId: string) => {
  formState.targetId = parentId;
  formState.parentId = parentId;
};

const cancel = () => {
  formState.targetId = null;
  formState.content = '';
  formState.parentId = null;
};

const submitComment = () => {
  if (!authStore.user) return;
  const newComment: Comment = {
    id: crypto.randomUUID(),
    postId: props.postId,
    authorId: authStore.user.id,
    parentId: formState.parentId,
    content: formState.content.trim(),
    createdAt: new Date().toISOString(),
    reactions: []
  };
  commentsStore.add(newComment);
  cancel();
};

const formatDate = (value: string) => dayjs(value).fromNow();

const resolveAuthor = (authorId: string) => {
  const target = authStore.users.find((candidate) => candidate.id === authorId);
  return target?.name ?? '访客';
};

const threadedComments = computed(() => {
  const source = commentsStore.byPost(props.postId);
  const map = new Map<string, Comment & { children: Comment[] }>();
  const roots: (Comment & { children: Comment[] })[] = [];
  source.forEach((comment) => {
    map.set(comment.id, { ...comment, children: [] });
  });
  map.forEach((comment) => {
    if (comment.parentId && map.has(comment.parentId)) {
      map.get(comment.parentId)!.children.push(comment);
    } else {
      roots.push(comment);
    }
  });
  return roots;
});

onMounted(async () => {
  await authStore.ensureLoaded?.();
});
</script>
