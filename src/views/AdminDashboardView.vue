<template>
  <section class="mx-auto max-w-6xl space-y-10">
    <header>
      <h1 class="text-2xl font-bold">{{ t('admin.title') }}</h1>
      <p class="text-sm text-slate-500">{{ t('admin.description') }}</p>
    </header>

    <div class="space-y-6">
      <div>
        <h2 class="mb-3 text-lg font-semibold">{{ t('admin.sections.posts') }}</h2>
        <AdminTable :rows="postsStore.posts" :columns="postColumns" :row-key="rowKey">
          <template #actions="{ row }">
            <div class="flex gap-2">
              <button class="text-xs text-brand" @click="editPost(row.id)">{{ t('admin.posts.actions.edit') }}</button>
              <button class="text-xs text-red-500" @click="deletePost(row.id)">{{ t('admin.posts.actions.delete') }}</button>
            </div>
          </template>
        </AdminTable>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold">{{ t('admin.sections.comments') }}</h2>
        <AdminTable :rows="commentsStore.comments" :columns="commentColumns" :row-key="rowKey" />
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold">{{ t('admin.sections.users') }}</h2>
        <AdminTable :rows="authStore.users" :columns="userColumns" :row-key="rowKey" />
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminTable from '@/components/admin/AdminTable.vue'
import { usePostsStore } from '@/stores/posts'
import { useCommentsStore } from '@/stores/comments'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const postsStore = usePostsStore()
const commentsStore = useCommentsStore()
const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()

const rowKey = (row) => row.id

const postColumns = computed(() => [
  { key: 'title', label: t('admin.posts.columns.title') },
  { key: 'category', label: t('admin.posts.columns.category') },
  { key: 'publishedAt', label: t('admin.posts.columns.publishedAt') },
  { key: 'views', label: t('admin.posts.columns.views') },
  { key: 'likes', label: t('admin.posts.columns.likes') },
  { key: 'actions', label: t('admin.posts.columns.actions') }
])

const commentColumns = computed(() => [
  { key: 'postId', label: t('admin.comments.columns.postId') },
  { key: 'content', label: t('admin.comments.columns.content') },
  { key: 'authorId', label: t('admin.comments.columns.author') },
  { key: 'createdAt', label: t('admin.comments.columns.createdAt') }
])

const userColumns = computed(() => [
  { key: 'name', label: t('admin.users.columns.name') },
  { key: 'email', label: t('admin.users.columns.email') },
  { key: 'role', label: t('admin.users.columns.role') },
  { key: 'language', label: t('admin.users.columns.language') }
])

const editPost = (id) => {
  router.push({ name: 'editor', params: { id } })
}

const deletePost = async (id) => {
  const confirmed = window.confirm(t('admin.alerts.confirmDelete'))
  if (!confirmed) return

  try {
    await postsStore.remove(id)
    window.alert(t('admin.alerts.deleteSuccess'))
  } catch (error) {
    console.error(error)
    window.alert(error?.message ?? t('admin.alerts.deleteError'))
  }
}

onMounted(async () => {
  await Promise.all([
    postsStore.ensureLoaded(),
    commentsStore.ensureLoaded(),
    authStore.ensureLoaded?.()
  ])
})
</script>
