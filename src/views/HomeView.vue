<template>
  <section class="mx-auto flex max-w-6xl flex-col gap-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <!-- <h1 class="text-2xl font-bold">BlogX 职业博客</h1> -->
        <!-- <p class="text-sm text-slate-500 dark:text-slate-400">展示你的专业形象，与招聘方建立连接。</p> -->
      </div>
      <router-link v-if="isAdmin" to="/editor"
        class="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
        {{ t('home.newPost') }}
      </router-link>
    </div>

    <ArticleFilters :categories="postsStore.categories" :tags="postsStore.tags" @change="onFiltersChange" />

    <div v-if="visiblePosts.length" class="space-y-4">
      <ArticleCard v-for="post in visiblePosts" :key="post.id" :post="post" />
    </div>

    <p v-else class="py-16 text-center text-slate-500">{{ t('home.empty') }}</p>

    <IntersectionObserver v-if="postsStore.hasMore" @intersect="loadMore" />
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useCommentsStore } from '@/stores/comments'
import { useAuthStore } from '@/stores/auth'
import { useHead } from '@unhead/vue'
import ArticleFilters from '@/components/blog/ArticleFilters.vue'
import ArticleCard from '@/components/blog/ArticleCard.vue'
import IntersectionObserver from '@/components/IntersectionObserver.vue'
import { useI18n } from 'vue-i18n'

const postsStore = usePostsStore()
const commentsStore = useCommentsStore()
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.user?.role === 'admin')
const { t } = useI18n()

const state = reactive({
  search: '',
  category: '',
  tag: ''
})

const loadMore = async () => {
  if (postsStore.loading || !postsStore.hasMore) return
  await postsStore.fetchNextPage()
}

const onFiltersChange = (payload) => {
  state.search = payload.search
  state.category = payload.category
  state.tag = payload.tag
}

const filteredPosts = computed(() => {
  const searchLower = state.search.toLowerCase()
  return postsStore.posts.filter((post) => {
    const matchesSearch =
      !state.search ||
      post.title.toLowerCase().includes(searchLower) ||
      post.summary.toLowerCase().includes(searchLower)
    const matchesCategory = !state.category || post.category === state.category
    const matchesTag = !state.tag || post.tags.includes(state.tag)
    return matchesSearch && matchesCategory && matchesTag
  })
})

const visiblePosts = computed(() => filteredPosts.value)

onMounted(async () => {
  await Promise.all([postsStore.ensureLoaded(), commentsStore.ensureLoaded()])
})

useHead(() => ({
  title: t('home.title'),
  meta: [
    { name: 'description', content: t('home.description') },
    { property: 'og:title', content: t('home.ogTitle') },
    { property: 'og:description', content: t('home.ogDescription') },
    { property: 'og:type', content: 'website' }
  ],
  link: [{ rel: 'canonical', href: 'https://example.com/' }]
}))
</script>
