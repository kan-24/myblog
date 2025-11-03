<template>
  <div class="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
    <input
      v-model="searchText"
      type="search"
      :placeholder="t('filters.searchPlaceholder')"
      class="w-full rounded border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-800"
    />
    <button
      type="button"
      class="rounded border border-brand bg-brand px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
      @click="emitFilters"
    >
      {{ t('filters.searchButton') }}
    </button>
    <select v-model="selectedCategory" class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
      <option value="">{{ t('filters.allCategories') }}</option>
      <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
    </select>
    <select v-model="selectedTag" class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
      <option value="">{{ t('filters.allTags') }}</option>
      <option v-for="tag in tags" :key="tag" :value="tag">#{{ tag }}</option>
    </select>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  tags: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['change'])

const { t } = useI18n()

const searchText = ref('')
const selectedCategory = ref('')
const selectedTag = ref('')

const emitFilters = () => {
  emit('change', {
    search: searchText.value,
    category: selectedCategory.value,
    tag: selectedTag.value
  })
}

watch([searchText, selectedCategory, selectedTag], emitFilters)

const categories = computed(() => props.categories)
const tags = computed(() => props.tags)
</script>
