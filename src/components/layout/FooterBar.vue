<template>
  <footer class="border-t border-slate-200 bg-white/10 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/10">
    <p>© {{ year }} BlogX. 仅演示用途，不用于生产。</p>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>
