<template>
  <div class="flex flex-wrap items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
    <button class="flex items-center gap-1 hover:text-brand" @click="$emit('like')">
      ❤️ {{ likes }}
    </button>
    <button class="flex items-center gap-1 hover:text-brand" @click="$emit('favorite')">
      ⭐ {{ favorites }}
    </button>
    <button class="flex items-center gap-1 hover:text-brand" @click="$emit('tip')">
      ☕ 打赏
    </button>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ likes: number; favorites: number }>();
defineEmits<{ (event: 'like'): void; (event: 'favorite'): void; (event: 'tip'): void }>();
</script>
