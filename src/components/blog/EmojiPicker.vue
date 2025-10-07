<template>
  <div class="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-3 text-lg dark:border-slate-700 dark:bg-slate-900">
    <button v-for="emoji in emojis" :key="emoji" class="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800" @click="$emit('select', emoji)">
      {{ emoji }}
    </button>
  </div>
</template>

<script setup>
const emojis = ['👍', '🔥', '👏', '🤩', '💡', '🎯', '🙏', '🚀']
defineEmits(['select'])
</script>
