<template>
  <section class="mx-auto max-w-4xl space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">{{ t('editor.title') }}</h1>
        <p class="text-sm text-slate-500">{{ t('editor.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="rounded border border-slate-200 px-3 py-2 text-sm hover:border-brand dark:border-slate-700" @click="resetDraft">
          {{ t('editor.reset') }}
        </button>
        <button class="rounded bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark" @click="saveDraft">
          {{ t('editor.submit') }}
        </button>
      </div>
    </header>

    <div class="space-y-4">
      <input
        v-model="draft.title"
        type="text"
        :placeholder="t('editor.placeholders.title')"
        class="w-full rounded border border-slate-200 px-3 py-3 text-lg font-semibold dark:border-slate-700 dark:bg-slate-900"
      />
      <input
        v-model="draft.summary"
        type="text"
        :placeholder="t('editor.placeholders.summary')"
        class="w-full rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
      />
      <div class="grid gap-4 md:grid-cols-2">
        <input
          v-model="draft.category"
          type="text"
          :placeholder="t('editor.placeholders.category')"
          class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
        <input
          v-model="tags"
          type="text"
          :placeholder="t('editor.placeholders.tags')"
          class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
      </div>
      <input
        v-model="draft.cover"
        type="url"
        :placeholder="t('editor.placeholders.cover')"
        class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
      />

      <div
        ref="editorRoot"
        class="editor h-[600px] overflow-hidden rounded-xl bg-white shadow-xl"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import { LocalUploadAdapter } from '@/services/upload/LocalUploadAdapter'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})

const postsStore = usePostsStore()
const authStore = useAuthStore()
const router = useRouter()
const editorRoot = ref(null)
let editor = null
const { t } = useI18n()

const isEditing = computed(() => Boolean(props.id))
const draft = reactive({
  id: '',
  title: '',
  slug: '',
  summary: '',
  content: '',
  cover: '',
  category: '',
  tags: [],
  authorId: '',
  publishedAt: '',
  updatedAt: '',
  views: 0,
  likes: 0,
  favorites: 0,
  featured: false
})

const originalPost = ref(null)
const tags = ref('')

const applyPostToDraft = (post) => {
  draft.id = post.id
  draft.title = post.title ?? ''
  draft.slug = post.slug ?? ''
  draft.summary = post.summary ?? ''
  draft.content = post.content ?? ''
  draft.cover = post.cover ?? ''
  draft.category = post.category ?? ''
  draft.tags = Array.isArray(post.tags) ? [...post.tags] : []
  draft.authorId = post.authorId ?? (authStore.user?.id ?? '')
  draft.publishedAt = post.publishedAt ?? new Date().toISOString()
  draft.updatedAt = post.updatedAt ?? new Date().toISOString()
  draft.views = post.views ?? 0
  draft.likes = post.likes ?? 0
  draft.favorites = post.favorites ?? 0
  draft.featured = post.featured ?? false
  tags.value = draft.tags.join(', ')
}

const initNewDraft = () => {
  draft.id = crypto.randomUUID()
  draft.title = ''
  draft.slug = ''
  draft.summary = ''
  draft.content = ''
  draft.cover = ''
  draft.category = ''
  draft.tags = []
  draft.authorId = authStore.user?.id ?? ''
  const now = new Date().toISOString()
  draft.publishedAt = now
  draft.updatedAt = now
  draft.views = 0
  draft.likes = 0
  draft.favorites = 0
  draft.featured = false
  tags.value = ''
}

const initEditor = () => {
  if (!editorRoot.value) return
  const uploadAdapter = new LocalUploadAdapter()
  editor = new Editor({
    el: editorRoot.value,
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    height: '600px',
    minHeight: '400px',
    hooks: {
      async addImageBlobHook(blob, callback) {
        const result = await uploadAdapter.upload({ name: blob.name ?? 'image', file: blob })
        callback(result.url, t('editor.imageAlt'))
        return false
      }
    }
  })
  editor?.setMarkdown(draft.content ?? '')
}

const resetDraft = () => {
  if (isEditing.value && originalPost.value) {
    applyPostToDraft(originalPost.value)
    editor?.setMarkdown(draft.content ?? '')
    return
  }
  initNewDraft()
  editor?.setMarkdown('')
}

const saveDraft = async () => {
  if (!authStore.user) {
    window.alert(t('editor.alerts.loginRequired'))
    return
  }

  draft.content = editor?.getMarkdown() ?? ''
  draft.tags = tags.value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
  draft.slug = draft.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')

  if (!draft.slug) {
    draft.slug = draft.id
  }

  if (!draft.title) {
    window.alert(t('editor.alerts.titleRequired'))
    return
  }

  draft.updatedAt = new Date().toISOString()
  draft.authorId = authStore.user.id

  const payload = {
    title: draft.title,
    slug: draft.slug,
    summary: draft.summary,
    content: draft.content,
    cover: draft.cover,
    category: draft.category,
    tags: draft.tags,
    authorId: draft.authorId,
    publishedAt: draft.publishedAt,
    updatedAt: draft.updatedAt,
    views: draft.views,
    likes: draft.likes,
    favorites: draft.favorites,
    featured: draft.featured
  }

  try {
    if (isEditing.value) {
      const updated = await postsStore.update(draft.id, payload)
      originalPost.value = updated
      applyPostToDraft(updated)
      editor?.setMarkdown(draft.content ?? '')
      window.alert(t('editor.alerts.updateSuccess'))
    } else {
      const created = await postsStore.create({ ...payload, id: draft.id })
      draft.id = created.id
      originalPost.value = created
      applyPostToDraft(created)
      editor?.setMarkdown(draft.content ?? '')
      window.alert(t('editor.alerts.createSuccess'))
    }
  } catch (error) {
    console.error(error)
    window.alert(error?.message ?? t('editor.alerts.saveError'))
  }
}

onMounted(async () => {
  await postsStore.ensureLoaded()

  if (isEditing.value) {
    const existing = postsStore.posts.find((item) => item.id === props.id)
    if (!existing) {
      window.alert(t('editor.alerts.notFound'))
      router.replace({ name: 'admin-dashboard' })
      return
    }
    originalPost.value = existing
    applyPostToDraft(existing)
  } else {
    initNewDraft()
  }

  initEditor()
  editor?.setMarkdown(draft.content ?? '')
})

onBeforeUnmount(() => {
  editor?.destroy()
})
</script>

<style scoped>
.editor :deep(.toastui-editor-contents) {
  font-family: ui-sans-serif, system-ui;
}

.editor :deep(.toastui-editor-defaultUI) {
  height: 100%;
}

.editor :deep(.toastui-editor-main-container) {
  height: calc(100% - 4rem);
}

.editor :deep(.toastui-editor-md-container),
.editor :deep(.toastui-editor-ww-container),
.editor :deep(.toastui-editor-contents),
.editor :deep(.toastui-editor-md-preview),
.editor :deep(.toastui-editor-md-scroll) {
  background-color: #ffffff;
  color: #0f172a;
}

.editor :deep(.toastui-editor-md-container .toastui-editor-md-preview) {
  background-color: #ffffff;
}


.editor :deep(.toastui-editor-defaultUI) {
  background: #ffffff !important;
}

.editor :deep(.toastui-editor-mode-switch),
.editor :deep(.toastui-editor-md-tab-container) {
  background: #ffffff !important;
  border-top: 1px solid #e2e8f0 !important;
}

.editor :deep(.toastui-editor-md-tab-container .tab-item) {
  background: #ffffff !important;
  color: #0f172a !important;
  border: 1px solid #cbd5f5 !important;
}

.editor :deep(.toastui-editor-md-tab-container .tab-item.active) {
  background: #ffffff !important;
  color: #2563eb !important;
  border-bottom-color: #ffffff !important;
}
</style>
