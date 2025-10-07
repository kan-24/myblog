<template>
  <button
    class="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
    @click="preferences.toggleTheme()"
  >
    {{ preferences.theme === 'light' ? '🌞' : '🌙' }}
  </button>
</template>

<script setup>
import { usePreferencesStore } from '@/stores/preferences'

const preferences = usePreferencesStore()
</script>
