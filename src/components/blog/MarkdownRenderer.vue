<template>
  <div class="prose max-w-none dark:prose-invert" v-html="html" />
</template>

<script setup>
import { computed } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

const html = computed(() => renderMarkdown(props.content))
</script>
