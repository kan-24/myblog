<template>
  <section class="mx-auto max-w-4xl space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">写作编辑器</h1>
        <p class="text-sm text-slate-500">支持 Markdown 与实时预览，图片将以 base64 存储。</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="rounded border border-slate-200 px-3 py-2 text-sm hover:border-brand dark:border-slate-700" @click="resetDraft">
          重置
        </button>
        <button class="rounded bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark" @click="saveDraft">
          发布 / 更新
        </button>
      </div>
    </header>

    <div class="space-y-4">
      <input
        v-model="draft.title"
        type="text"
        placeholder="标题"
        class="w-full rounded border border-slate-200 px-3 py-3 text-lg font-semibold dark:border-slate-700 dark:bg-slate-900"
      />
      <input
        v-model="draft.summary"
        type="text"
        placeholder="摘要"
        class="w-full rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
      />
      <div class="grid gap-4 md:grid-cols-2">
        <input
          v-model="draft.category"
          type="text"
          placeholder="分类"
          class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
        <input
          v-model="tags"
          type="text"
          placeholder="标签（以逗号分隔）"
          class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
      </div>
      <input
        v-model="draft.cover"
        type="url"
        placeholder="封面图片 URL"
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
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import { LocalUploadAdapter } from '@/services/upload/LocalUploadAdapter'

const postsStore = usePostsStore()
const authStore = useAuthStore()
const editorRoot = ref(null)
let editor = null

const draft = reactive({
  id: crypto.randomUUID(),
  title: '',
  slug: '',
  summary: '',
  content: '',
  cover: '',
  category: '',
  tags: [],
  authorId: authStore.user?.id ?? '',
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  views: 0,
  likes: 0,
  favorites: 0,
  featured: false
})

const tags = ref('')

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
        callback(result.url, '插入图片')
        return false
      }
    }
  })
}

const resetDraft = () => {
  draft.title = ''
  draft.summary = ''
  draft.category = ''
  draft.cover = ''
  draft.tags = []
  tags.value = ''
  editor?.setMarkdown('')
}

const saveDraft = async () => {
  if (!authStore.user) {
    window.alert('请登录后写作')
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

  if (!draft.title) {
    window.alert('标题不能为空')
    return
  }

  draft.updatedAt = new Date().toISOString()
  draft.authorId = authStore.user.id

  try {
    const created = await postsStore.create({ ...draft, id: draft.id })
    draft.id = created.id
    window.alert('文章已提交到后端')
  } catch (error) {
    console.error(error)
    window.alert(error?.message ?? '文章保存失败，请稍后重试')
  }
}

onMounted(() => {
  initEditor()
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
