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
          <button v-if="canComment" class="text-sm text-brand hover:underline" @click="replyTo(thread.id)">{{ t('comments.reply') }}</button>
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
              <button v-if="canComment" class="text-xs text-brand hover:underline" @click="replyTo(child.id)">{{ t('comments.reply') }}</button>
            </div>
            <p class="mt-2 leading-relaxed">{{ child.content }}</p>
          </li>
        </ul>
      </li>
    </ul>
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

const canComment = computed(() => Boolean(authStore.user))
const activeForm = computed(() => Boolean(formState.targetId))

const formState = reactive({
  targetId: null,
  content: '',
  parentId: null
})

const appendEmoji = (emoji) => {
  formState.content = `${formState.content}${emoji}`
}

const startNewComment = () => {
  formState.targetId = 'new'
  formState.parentId = null
}

const replyTo = (parentId) => {
  formState.targetId = parentId
  formState.parentId = parentId
}

const cancel = () => {
  formState.targetId = null
  formState.content = ''
  formState.parentId = null
}

const submitComment = () => {
  if (!authStore.user) return
  const newComment = {
    id: crypto.randomUUID(),
    postId: props.postId,
    authorId: authStore.user.id,
    parentId: formState.parentId,
    content: formState.content.trim(),
    createdAt: new Date().toISOString(),
    reactions: []
  }
  commentsStore.add(newComment)
  cancel()
}

const formatDate = (value) => dayjs(value).fromNow()

const resolveAuthor = (authorId) => {
  const target = authStore.users.find((candidate) => candidate.id === authorId)
  return target?.name ?? t('comments.guest')
}

const threadedComments = computed(() => {
  const source = commentsStore.byPost(props.postId)
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

onMounted(async () => {
  await authStore.ensureLoaded?.()
})
</script>
