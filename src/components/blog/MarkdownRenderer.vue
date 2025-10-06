<template>
  <div class="prose max-w-none dark:prose-invert" v-html="html" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { renderMarkdown } from '@/utils/markdown';

const props = defineProps<{ content: string }>();
const html = computed(() => renderMarkdown(props.content));
</script>
