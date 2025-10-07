<template>
  <article class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/65 shadow transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/65">
    <div class="relative aspect-[16/9] overflow-hidden">
      <img v-lazy="post.cover" alt="" class="h-full w-full object-cover transition group-hover:scale-105" />
    </div>
    <div class="flex flex-1 flex-col space-y-3 p-4">
      <div class="flex items-center gap-2 text-xs uppercase tracking-wide text-brand">
        <span>{{ post.category }}</span>
        <span>•</span>
        <time>{{ formattedDate }}</time>
      </div>
      <router-link :to="`/posts/${post.id}`" class="text-lg font-semibold leading-snug">
        {{ post.title }}
      </router-link>
      <p class="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{{ post.summary }}</p>
      <div class="mt-auto flex flex-wrap items-center justify-between text-xs text-slate-500">
        <div class="flex items-center gap-2">
          <span>👁️ {{ post.views }}</span>
          <span>❤️ {{ post.likes }}</span>
          <span>⭐ {{ post.favorites }}</span>
        </div>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const formattedDate = computed(() => dayjs(props.post.publishedAt).format('YYYY-MM-DD'))
</script>
