<template>
  <div class="relative min-h-screen overflow-hidden">
    <ParticlesBackground />
    <div
      class="relative z-10 flex min-h-screen flex-col transition"
      :class="shellTextClass"
    >
      <HeaderBar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <div class="h-16 md:h-20" aria-hidden="true"></div>
      <div class="flex flex-1">
        <!-- <SidebarNav :open="sidebarOpen" @close="sidebarOpen = false" /> -->
        <main
          class="flex-1 px-4 pb-16 pt-4 sm:px-6 lg:px-8"
          @keyup.escape="sidebarOpen = false"
        >
          <router-view />
        </main>
      </div>
      <FooterBar />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import HeaderBar from './HeaderBar.vue'
import SidebarNav from './SidebarNav.vue'
import FooterBar from './FooterBar.vue'
import ParticlesBackground from '@/components/visual/ParticlesBackground.vue'

const sidebarOpen = ref(false)
const shellTextClass = computed(() => 'text-slate-900 dark:text-slate-100')
</script>
