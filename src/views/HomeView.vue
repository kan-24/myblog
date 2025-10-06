<template>
  <section class="mx-auto flex max-w-6xl flex-col gap-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold">BlogX 职业博客</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">展示你的专业形象，与招聘方建立连接。</p>
      </div>
      <router-link
        v-if="isAdmin"
        to="/editor"
        class="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
      >
        ✍️ 新建文章
      </router-link>
    </div>

    <ArticleFilters :categories="postsStore.categories" :tags="postsStore.tags" @change="onFiltersChange" />

    <VirtualList
      v-if="visiblePosts.length"
      :items="visiblePosts"
      :item-size="cardHeight"
      :height="listHeight"
      key-field="id"
      class="rounded-2xl border border-transparent bg-transparent"
    >
      <template #default="{ item }">
        <ArticleCard :post="item as any" class="mb-4" />
      </template>
    </VirtualList>

    <p v-else class="py-16 text-center text-slate-500">暂无匹配的文章。</p>

    <IntersectionObserver @intersect="loadMore" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { usePostsStore } from '@/stores/posts';
import { useCommentsStore } from '@/stores/comments';
import { useAuthStore } from '@/stores/auth';
import { useHead } from '@unhead/vue';
import ArticleFilters from '@/components/blog/ArticleFilters.vue';
import ArticleCard from '@/components/blog/ArticleCard.vue';
import VirtualList from '@/components/VirtualList.vue';
import IntersectionObserver from '@/components/IntersectionObserver.vue';

const postsStore = usePostsStore();
const commentsStore = useCommentsStore();
const authStore = useAuthStore();
const isAdmin = computed(() => authStore.user?.role === 'admin');

const state = reactive({
  search: '',
  category: '',
  tag: ''
});

const page = ref(1);
const pageSize = 10;
const cardHeight = 900;
const listHeight = 900;

const loadMore = () => {
  page.value += 1;
};

const onFiltersChange = (payload: { search: string; category: string; tag: string }) => {
  state.search = payload.search;
  state.category = payload.category;
  state.tag = payload.tag;
  page.value = 1;
};

const filteredPosts = computed(() => {
  const searchLower = state.search.toLowerCase();
  return postsStore.posts.filter((post) => {
    const matchesSearch =
      !state.search ||
      post.title.toLowerCase().includes(searchLower) ||
      post.summary.toLowerCase().includes(searchLower);
    const matchesCategory = !state.category || post.category === state.category;
    const matchesTag = !state.tag || post.tags.includes(state.tag);
    return matchesSearch && matchesCategory && matchesTag;
  });
});

const visiblePosts = computed(() => filteredPosts.value.slice(0, page.value * pageSize));

onMounted(async () => {
  await Promise.all([postsStore.ensureLoaded(), commentsStore.ensureLoaded()]);
});

useHead({
  title: 'BlogX | 现代职业博客',
  meta: [
    { name: 'description', content: 'BlogX —— 展示作品、分享洞察、连接机会的现代个人博客。' },
    { property: 'og:title', content: 'BlogX' },
    { property: 'og:description', content: '现代优雅的职业博客模版，助力跳槽与职业展示。' },
    { property: 'og:type', content: 'website' }
  ],
  link: [{ rel: 'canonical', href: 'https://example.com/' }]
});
</script>
