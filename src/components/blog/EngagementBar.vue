<template>
  <div class="flex flex-wrap items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
    <button class="flex items-center gap-1 hover:text-brand" @click="$emit('like')">
      ❤️ {{ likes }}
    </button>
    <button class="flex items-center gap-1 hover:text-brand" @click="$emit('favorite')">
      ⭐ {{ favorites }}
    </button>
    <button class="flex items-center gap-1 hover:text-brand" @click="$emit('tip')">
      ☕ {{ t('engagement.tip') }}
    </button>
    <slot />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

defineProps({
  likes: {
    type: Number,
    required: true
  },
  favorites: {
    type: Number,
    required: true
  }
})

defineEmits(['like', 'favorite', 'tip'])

const { t } = useI18n()
</script>
