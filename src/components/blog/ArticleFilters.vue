<template>
  <div class="grid gap-3 md:grid-cols-[1fr_auto_auto]">
    <input
      v-model="searchText"
      type="search"
      placeholder="搜索文章..."
      class="w-full rounded border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-800"
    />
    <select v-model="selectedCategory" class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
      <option value="">全部分类</option>
      <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
    </select>
    <select v-model="selectedTag" class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
      <option value="">全部标签</option>
      <option v-for="tag in tags" :key="tag" :value="tag">#{{ tag }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  categories: string[];
  tags: string[];
}>();

const emit = defineEmits<{
  (event: 'change', payload: { search: string; category: string; tag: string }): void;
}>();

const searchText = ref('');
const selectedCategory = ref('');
const selectedTag = ref('');

watch([searchText, selectedCategory, selectedTag], () => {
  emit('change', {
    search: searchText.value,
    category: selectedCategory.value,
    tag: selectedTag.value
  });
});

const categories = computed(() => props.categories);
const tags = computed(() => props.tags);
</script>
