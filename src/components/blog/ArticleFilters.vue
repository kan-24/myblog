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
    <div class="relative">
      <select
        v-model="selectedCategory"
        class="custom-select w-full rounded border border-slate-200 px-3 py-2 pr-10 text-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <option value="">{{ t('filters.allCategories') }}</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
      <ChevronDownIcon class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
    </div>
    <div class="relative">
      <select
        v-model="selectedTag"
        class="custom-select w-full rounded border border-slate-200 px-3 py-2 pr-10 text-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <option value="">{{ t('filters.allTags') }}</option>
        <option v-for="tag in tags" :key="tag" :value="tag">#{{ tag }}</option>
      </select>
      <ChevronDownIcon class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'

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
