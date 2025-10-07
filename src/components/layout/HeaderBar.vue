<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/10 dark:border-slate-700 dark:bg-slate-900/10">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <button class="mr-4 rounded p-2 text-slate-500 hover:text-brand md:hidden" @click="$emit('toggle-sidebar')">
        <span class="sr-only">Toggle navigation</span>
        ☰
      </button>
      <router-link to="/" class="flex items-center text-lg font-semibold text-brand">
        BlogX
      </router-link>
      <nav class="hidden items-center space-x-4 text-sm font-medium md:flex">
        <router-link class="hover:text-brand" to="/">首页</router-link>
        <router-link v-if="isAdmin" class="hover:text-brand" to="/editor">写作</router-link>
        <router-link class="hover:text-brand" to="/user">个人中心</router-link>
        <router-link v-if="isAdmin" class="hover:text-brand" to="/admin">管理后台</router-link>
      </nav>
      <div class="flex items-center space-x-3">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from './ThemeToggle.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

defineEmits(['toggle-sidebar'])

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.user?.role === 'admin')
</script>
