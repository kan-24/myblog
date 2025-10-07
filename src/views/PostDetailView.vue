<template>
  <article v-if="post" class="mx-auto max-w-3xl space-y-8">
    <header class="space-y-4">
      <p class="text-sm text-brand">{{ post.category }}</p>
      <h1 class="text-3xl font-bold leading-tight">{{ post.title }}</h1>
      <div class="flex flex-wrap items-center gap-4 text-sm text-slate-500">
        <span>发布于 {{ formatDate(post.publishedAt) }}</span>
        <span>{{ post.views }} 次浏览</span>
      </div>
      <EngagementBar :likes="post.likes" :favorites="post.favorites" @like="toggleLike" @favorite="toggleFavorite" @tip="onTip">
        <button class="rounded-full border border-slate-200 px-3 py-1 text-xs hover:border-brand hover:text-brand dark:border-slate-700">
          分享
        </button>
      </EngagementBar>
    </header>

    <img v-lazy="post.cover" :alt="post.title" class="h-auto w-full rounded-xl object-cover" />

    <div class="grid gap-6 lg:grid-cols-[3fr_1fr]">
      <MarkdownRenderer :content="post.content" />
      <aside class="space-y-4">
        <div class="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
          <h2 class="text-sm font-semibold uppercase text-slate-500">目录</h2>
          <nav aria-label="文章目录" class="mt-3 space-y-2 text-sm">
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
          <p>标签</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <span v-for="tag in post.tags" :key="tag" class="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
              #{{ tag }}
            </span>
          </div>
        </div>
      </aside>
    </div>

    <CommentsThread :post-id="post.id" />

    <section class="rounded-lg border border-slate-200 p-4 text-sm dark:border-slate-800">
      <h2 class="font-semibold">打赏渠道</h2>
      <p class="mt-2 text-slate-500">扫描二维码或复制账号，表达你的支持。</p>
      <div class="mt-4 flex flex-wrap items-center gap-3">
        <button class="rounded bg-brand px-3 py-2 text-white shadow hover:bg-brand-dark">支付宝</button>
        <button class="rounded bg-brand px-3 py-2 text-white shadow hover:bg-brand-dark">微信</button>
      </div>
    </section>
  </article>
  <p v-else class="py-16 text-center text-slate-500">文章不存在。</p>
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

const postsStore = usePostsStore()
const route = useRoute()
const postId = route.params.id ? String(route.params.id) : ''

const post = computed(() => postsStore.posts.find((item) => item.id === postId))

const toc = computed(() => (post.value ? extractHeadings(post.value.content) : []))

const formatDate = (value) => dayjs(value).format('YYYY-MM-DD')

const toggleLike = () => postsStore.toggleLike(postId)
const toggleFavorite = () => postsStore.toggleFavorite(postId)
const onTip = () => window.alert('感谢支持！(演示效果)')

onMounted(async () => {
  await postsStore.ensureLoaded()
})

useHead(() => ({
  title: post.value ? `${post.value.title} | BlogX` : 'BlogX 文章',
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
