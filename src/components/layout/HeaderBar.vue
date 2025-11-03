<template>
  <header class="fixed top-0 left-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <button class="mr-4 rounded p-2 text-slate-500 hover:text-brand md:hidden" @click="$emit('toggle-sidebar')">
        <span class="sr-only">{{ t('nav.toggle') }}</span>
        ☰
      </button>
      <router-link to="/" class="flex items-center text-lg font-semibold text-black dark:text-white">
        BlogX
      </router-link>

      <nav class="hidden items-center space-x-4 text-sm font-medium md:flex">
        <router-link class="hover:text-brand" to="/">{{ t('nav.home') }}</router-link>
        <router-link v-if="isAdmin" class="hover:text-brand" to="/editor">{{ t('nav.editor') }}</router-link>
        <router-link class="hover:text-brand" to="/user">{{ t('nav.user') }}</router-link>
        <router-link v-if="isAdmin" class="hover:text-brand" to="/admin">{{ t('nav.admin') }}</router-link>
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
import { useI18n } from 'vue-i18n'

defineEmits(['toggle-sidebar'])

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.user?.role === 'admin')
const { t } = useI18n()
</script>
