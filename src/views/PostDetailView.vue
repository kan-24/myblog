<template>
  <article v-if="post" class="mx-auto max-w-3xl space-y-8">
    <header class="space-y-4">
      <p class="text-sm text-brand">{{ post.category }}</p>
      <h1 class="text-3xl font-bold leading-tight">{{ post.title }}</h1>
      <div class="flex flex-wrap items-center gap-4 text-sm text-slate-500">
        <span>{{ t('post.publishedOn', { date: formatDate(post.publishedAt) }) }}</span>
        <span>{{ t('post.views', { count: post.views }) }}</span>
      </div>
      <EngagementBar :likes="post.likes" :liked="isLiked" @like="toggleLike" @tip="onTip">
        <button class="rounded-full border border-slate-200 px-3 py-1 text-xs hover:border-brand hover:text-brand dark:border-slate-700">
          {{ t('post.share') }}
        </button>
      </EngagementBar>
    </header>

    <img v-if="post.cover" v-lazy="post.cover" :alt="post.title" class="h-auto w-full rounded-xl object-cover" />

    <div class="grid gap-6 lg:grid-cols-[3fr_1fr]">
      <MarkdownRenderer :content="post.content" />
      <aside class="space-y-4">
        <div class="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
          <h2 class="text-sm font-semibold uppercase text-slate-500">{{ t('post.tableOfContents') }}</h2>
          <nav :aria-label="t('post.tableOfContents')" class="mt-3 space-y-2 text-sm">
            <a
              v-for="heading in toc"
              :key="heading.id"
              :href="`#${heading.id}`"
              class="block hover:text-brand"
              :style="{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }"
            >
              {{ heading.text }}
            </a>
          </nav>
        </div>
        <div class="rounded-lg border border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800">
          <p>{{ t('post.tags') }}</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <span v-for="tag in post.tags" :key="tag" class="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
              #{{ tag }}
            </span>
          </div>
        </div>
      </aside>
    </div>

    <div class="border-t border-slate-200 pt-8 dark:border-slate-800">
      <CommentsThread :post-id="post.id" />
    </div>
  </article>
  <p v-else class="py-16 text-center text-slate-500">{{ t('post.notFound') }}</p>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useHead } from '@unhead/vue'
import dayjs from 'dayjs'
import MarkdownRenderer from '@/components/blog/MarkdownRenderer.vue'
import EngagementBar from '@/components/blog/EngagementBar.vue'
import CommentsThread from '@/components/blog/CommentsThread.vue'
import { extractHeadings } from '@/utils/toc'
import { useI18n } from 'vue-i18n'

const postsStore = usePostsStore()
const route = useRoute()
const postId = route.params.id ? String(route.params.id) : ''
const { t } = useI18n()

const post = computed(() => postsStore.posts.find((item) => item.id === postId))
const isLiked = computed(() => Boolean(postsStore.likes[postId]))

const toc = computed(() => (post.value ? extractHeadings(post.value.content) : []))

const formatDate = (value) => dayjs(value).format('YYYY-MM-DD')

const toggleLike = async () => {
  try {
    await postsStore.toggleLike(postId)
  } catch (error) {
    console.error(error)
    window.alert(error?.message ?? t('common.operationFailed'))
  }
}
const onTip = () => window.alert(t('post.tipThanks'))

onMounted(async () => {
  await postsStore.ensureLoaded()
})

useHead(() => ({
  title: post.value ? `${post.value.title} | BlogX` : 'BlogX',
  meta: post.value
    ? [
        { name: 'description', content: post.value.summary },
        { property: 'og:title', content: post.value.title },
        { property: 'og:description', content: post.value.summary },
        { property: 'og:image', content: post.value.cover }
      ]
    : []
}))
</script>
