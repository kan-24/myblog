<template>
  <section :aria-label="t('comments.sectionAria')" class="space-y-6">
    <header class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">{{ t('comments.title') }}</h3>
      <button
        v-if="canComment"
        class="rounded bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        @click="startNewComment"
      >
        {{ t('comments.write') }}
      </button>
      <button
        v-else
        class="rounded border border-slate-200 px-3 py-2 text-sm hover:border-brand dark:border-slate-700"
        @click="promptLogin"
      >
        {{ t('comments.loginButton') }}
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
        :placeholder="t('comments.placeholder')"
        required
      />
      <EmojiPicker @select="appendEmoji" />
      <div class="flex justify-end gap-3">
        <button class="rounded px-3 py-2 text-sm" type="button" @click="cancel">{{ t('comments.cancel') }}</button>
        <button class="rounded bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark" type="submit">
          {{ t('comments.submit') }}
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
          <div class="flex items-center gap-3">
            <span
              v-if="thread.status !== 'VISIBLE'"
              class="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-slate-900"
            >
              {{ thread.status === 'PENDING' ? t('comments.pending') : t('comments.hidden') }}
            </span>
            <button v-if="canComment" class="text-sm text-brand hover:underline" @click="replyTo(thread.id)">{{ t('comments.reply') }}</button>
            <button
              v-if="canModerate"
              class="text-xs text-red-500 hover:underline"
              @click="requestDelete(thread.id)"
            >
              {{ t('comments.delete') }}
            </button>
          </div>
        </header>
        <p class="text-sm leading-relaxed">{{ thread.content }}</p>
        <ul class="space-y-3 border-l border-slate-200 pl-4 dark:border-slate-800" v-if="thread.children.length">
          <li v-for="child in thread.children" :key="child.id" class="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-950">
            <div class="flex items-center justify-between">
              <div>
                <span class="font-medium">{{ resolveAuthor(child.authorId) }}</span>
                <time class="ml-2 text-xs text-slate-500">{{ formatDate(child.createdAt) }}</time>
              </div>
              <div class="flex items-center gap-3">
                <span
                  v-if="child.status !== 'VISIBLE'"
                  class="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-slate-900"
                >
                  {{ child.status === 'PENDING' ? t('comments.pending') : t('comments.hidden') }}
                </span>
                <button v-if="canComment" class="text-xs text-brand hover:underline" @click="replyTo(child.id)">{{ t('comments.reply') }}</button>
                <button
                  v-if="canModerate"
                  class="text-xs text-red-500 hover:underline"
                  @click="requestDelete(child.id)"
                >
                  {{ t('comments.delete') }}
                </button>
              </div>
            </div>
            <p class="mt-2 leading-relaxed">{{ child.content }}</p>
          </li>
        </ul>
      </li>
    </ul>

    <div v-if="hasMore" class="text-center">
      <button
        class="rounded border border-slate-200 px-4 py-2 text-sm hover:border-brand dark:border-slate-700"
        :disabled="loading"
        @click="loadMore"
      >
        <span v-if="loading">{{ t('comments.loading') }}</span>
        <span v-else>{{ t('comments.loadMore') }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import { useCommentsStore } from '@/stores/comments'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import 'dayjs/locale/ja'
import EmojiPicker from './EmojiPicker.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  postId: {
    type: String,
    required: true
  }
})

dayjs.extend(relativeTime)

const localeMap = {
  'zh-CN': 'zh-cn',
  'en-US': 'en',
  'ja-JP': 'ja'
}

const authStore = useAuthStore()
const commentsStore = useCommentsStore()
const { t, locale } = useI18n()

watch(
  () => locale.value,
  (value) => {
    dayjs.locale(localeMap[value] ?? 'zh-cn')
  },
  { immediate: true }
)

const canComment = computed(() => Boolean(authStore.token))
const canModerate = computed(() => authStore.user?.role === 'admin')
const activeForm = computed(() => Boolean(formState.targetId))
const commentsList = computed(() => commentsStore.listByPost(props.postId))
const hasMore = computed(() => commentsStore.hasMore(props.postId))
const loading = computed(() => commentsStore.loading(props.postId))

const formState = reactive({
  targetId: null,
  content: '',
  parentId: null
})

const appendEmoji = (emoji) => {
  formState.content = `${formState.content}${emoji}`
}

const ensureLoggedIn = () => {
  if (authStore.token) return true
  promptLogin()
  return false
}

const startNewComment = () => {
  if (!ensureLoggedIn()) return
  formState.targetId = 'new'
  formState.parentId = null
}

const replyTo = (parentId) => {
  if (!ensureLoggedIn()) return
  formState.targetId = parentId
  formState.parentId = parentId
}

const cancel = () => {
  formState.targetId = null
  formState.content = ''
  formState.parentId = null
}

const submitComment = async () => {
  if (!ensureLoggedIn()) return
  try {
    await commentsStore.submit(props.postId, {
      content: formState.content,
      parentId: formState.parentId
    })
    await commentsStore.ensureLoaded(props.postId, true)
    cancel()
  } catch (error) {
    console.error(error)
    window.alert(error?.message ?? t('common.operationFailed'))
  }
}

const formatDate = (value) => dayjs(value).fromNow()

const resolveAuthor = (authorId) => {
  const target = authStore.users.find((candidate) => candidate.id === authorId)
  return target?.name ?? t('comments.guest')
}

const promptLogin = () => {
  window.alert(t('comments.loginRequired'))
}

const threadedComments = computed(() => {
  const source = commentsList.value
  const map = new Map()
  const roots = []

  source.forEach((comment) => {
    map.set(comment.id, { ...comment, children: [] })
  })

  map.forEach((comment) => {
    if (comment.parentId && map.has(comment.parentId)) {
      const parent = map.get(comment.parentId)
      if (parent) parent.children.push(comment)
    } else {
      roots.push(comment)
    }
  })

  return roots
})

const loadMore = async () => {
  if (!loading.value && hasMore.value) {
    await commentsStore.ensureLoaded(props.postId)
  }
}

const requestDelete = async (commentId) => {
  if (!canModerate.value) return
  const confirmed = window.confirm(t('comments.confirmDelete'))
  if (!confirmed) return
  try {
    await commentsStore.remove(props.postId, commentId)
    await commentsStore.ensureLoaded(props.postId, true)
  } catch (error) {
    console.error(error)
    window.alert(error?.message ?? t('common.operationFailed'))
  }
}

watch(
  () => props.postId,
  async (next) => {
    if (!next) return
    await commentsStore.ensureLoaded(next, true)
  },
  { immediate: true }
)

authStore.ensureLoaded?.()
</script>
