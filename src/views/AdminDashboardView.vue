<template>
  <section class="mx-auto max-w-6xl space-y-10">
    <header>
      <h1 class="text-2xl font-bold">管理后台</h1>
      <p class="text-sm text-slate-500">文章、评论、用户与访客管理（演示数据）。</p>
    </header>

    <div class="space-y-6">
      <div>
        <h2 class="mb-3 text-lg font-semibold">文章管理</h2>
        <AdminTable :rows="postsStore.posts" :columns="postColumns" :row-key="rowKey">
          <template #actions="{ row }">
            <div class="flex gap-2">
              <button class="text-xs text-brand" @click="editPost(row.id)">编辑</button>
              <button class="text-xs text-red-500" @click="deletePost(row.id)">删除</button>
            </div>
          </template>
        </AdminTable>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold">评论管理</h2>
        <AdminTable :rows="commentsStore.comments" :columns="commentColumns" :row-key="rowKey" />
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold">用户管理</h2>
        <AdminTable :rows="authStore.users" :columns="userColumns" :row-key="rowKey" />
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold">访客记录</h2>
        <AdminTable :rows="visitorsStore.visitors" :columns="visitorColumns" :row-key="rowKey" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import { usePostsStore } from '@/stores/posts'
import { useCommentsStore } from '@/stores/comments'
import { useAuthStore } from '@/stores/auth'
import { useVisitorsStore } from '@/stores/visitors'

const postsStore = usePostsStore()
const commentsStore = useCommentsStore()
const authStore = useAuthStore()
const visitorsStore = useVisitorsStore()

const rowKey = (row) => row.id

const postColumns = [
  { key: 'title', label: '标题' },
  { key: 'category', label: '分类' },
  { key: 'publishedAt', label: '发布时间' },
  { key: 'views', label: '浏览' },
  { key: 'likes', label: '点赞' },
  { key: 'actions', label: '操作' }
]

const commentColumns = [
  { key: 'postId', label: '文章 ID' },
  { key: 'content', label: '内容' },
  { key: 'authorId', label: '作者' },
  { key: 'createdAt', label: '时间' }
]

const userColumns = [
  { key: 'name', label: '姓名' },
  { key: 'email', label: '邮箱' },
  { key: 'role', label: '角色' },
  { key: 'language', label: '语言' }
]

const visitorColumns = [
  { key: 'location', label: '来源' },
  { key: 'userAgent', label: '设备' },
  { key: 'referrer', label: '入口' },
  { key: 'enteredAt', label: '时间' }
]

const editPost = (id) => {
  window.alert(`编辑文章 ${id}（演示）`)
}

const deletePost = (id) => {
  postsStore.remove(id)
}

onMounted(async () => {
  await Promise.all([
    postsStore.ensureLoaded(),
    commentsStore.ensureLoaded(),
    authStore.ensureLoaded?.(),
    visitorsStore.ensureLoaded()
  ])
})
</script>
