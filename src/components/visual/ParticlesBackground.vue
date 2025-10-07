<template>
  <vue-particles
    id="blogx-particles"
    class="particles"
    :style="particlesStyle"
    @particlesLoaded="onParticlesLoaded"
    :options="particlesOptions"
  />
</template>

<script setup>
import { computed } from 'vue'
import { usePreferencesStore } from '@/stores/preferences'

const preferences = usePreferencesStore()
const isDark = computed(() => preferences.theme === 'dark')

const backgroundGradient = computed(() =>
  isDark.value
    ? 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.35), transparent 55%), radial-gradient(circle at 80% 30%, rgba(248, 113, 113, 0.3), transparent 50%), radial-gradient(circle at 50% 80%, rgba(250, 204, 21, 0.25), transparent 50%)'
    : 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.38), transparent 55%), radial-gradient(circle at 80% 25%, rgba(249, 115, 22, 0.32), transparent 55%), radial-gradient(circle at 40% 85%, rgba(14, 165, 233, 0.3), transparent 55%)'
)

const particlesStyle = computed(() => ({
  position: 'fixed',
  inset: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 0,
  pointerEvents: 'none',
  backgroundImage: backgroundGradient.value,
  backgroundColor: isDark.value ? '#050a1a' : '#f8fafc'
}))

const particlesOptions = computed(() => {
  const particleColors = isDark.value
    ? ['#ffffff', '#bae6fd', '#fde68a']
    : ['#2563eb', '#f59e0b', '#f472b6']
  const linkColor = isDark.value ? '#e0f2fe' : '#94a3b8'

  return {
    fullScreen: false,
    detectRetina: true,
    background: {
      color: 'transparent'
    },
    backgroundMask: {
      enable: false
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'bubble'
        },
        resize: true
      },
      modes: {
        bubble: {
          distance: 120,
          duration: 2,
          opacity: 0.2,
          size: 40
        }
      }
    },
    particles: {
      number: {
        value: 90,
        density: {
          enable: true,
          area: 800
        }
      },
      color: {
        value: particleColors
      },
      opacity: {
        value: 1,
        animation: {
          enable: true,
          speed: 0.6
        }
      },
      size: {
        value: { min: 1, max: 5 }
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        outModes: 'out'
      },
      links: {
        enable: true,
        distance: 160,
        color: linkColor,
        opacity: 0.7,
        width: 1
      }
    }
  }
})

const onParticlesLoaded = async (container) => {
  if (import.meta.env.DEV) {
    console.debug('tsParticles container ready', container)
  }
}
</script>

<style scoped>
.particles {
  display: block;
  pointer-events: none;
}
</style>
