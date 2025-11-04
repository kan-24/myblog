<template>
  <div class="flex flex-wrap items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
    <button
      class="flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition"
      :class="liked ? 'border-red-500 text-red-500 hover:border-red-500 hover:text-red-500' : 'border-slate-400 text-slate-700 hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-200'"
      @click="$emit('like')"
    >
      <component
        :is="liked ? HandThumbUpSolid : HandThumbUpOutline"
        class="h-5 w-5"
        :class="liked ? 'fill-current' : 'stroke-current'"
        aria-hidden="true"
      />
      <span>{{ likes }}</span>
    </button>
    <button class="flex items-center gap-1 hover:text-brand" @click="$emit('tip')">
      ☕ {{ t('engagement.tip') }}
    </button>
    <slot />
  </div>
</template>

<script setup>
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { HandThumbUpIcon as HandThumbUpOutline } from '@heroicons/vue/24/outline'
import { HandThumbUpIcon as HandThumbUpSolid } from '@heroicons/vue/24/solid'

const props = defineProps({
  likes: {
    type: Number,
    required: true
  },
  liked: {
    type: Boolean,
    default: false
  }
})

const { liked } = toRefs(props)

defineEmits(['like', 'tip'])

const { t } = useI18n()

</script>
