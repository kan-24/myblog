<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-30 w-64 transform shadow-lg transition md:static md:translate-x-0',
      open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      navBackgroundClass
    ]"
  >
    <div class="flex h-full flex-col">
      <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700 md:hidden">
        <span class="text-base font-semibold">导航</span>
        <button class="rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-800" @click="$emit('close')">✕</button>
      </div>
      <nav class="flex-1 space-y-1 overflow-y-auto px-4 py-6 text-sm">
        <router-link class="block rounded px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" to="/">文章列表</router-link>
        <router-link
          v-if="isAdmin"
          class="block rounded px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          to="/editor"
        >
          写作编辑器
        </router-link>
        <router-link class="block rounded px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" to="/user">账户与设置</router-link>
        <router-link
          v-if="isAdmin"
          class="block rounded px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          to="/admin"
        >
          管理后台
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { usePreferencesStore } from '@/stores/preferences';

defineProps<{ open: boolean }>();
defineEmits<{ (event: 'close'): void }>();

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.user?.role === 'admin');

const preferences = usePreferencesStore();
const isDark = computed(() => preferences.theme === 'dark');
const navBackgroundClass = computed(() =>
  isDark.value ? 'bg-slate-900/1 backdrop-blur' : 'bg-white/1 backdrop-blur'
);
</script>
