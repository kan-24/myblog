<template>
  <div class="relative">
    <select
      class="custom-select rounded border border-slate-200 bg-transparent px-3 py-1 pr-9 text-sm dark:border-slate-700"
      :value="preferences.locale"
      @change="onSwitch"
      :aria-label="t('language.label')"
    >
      <option value="zh-CN">{{ t('language.zh') }}</option>
      <option value="en-US">{{ t('language.en') }}</option>
      <option value="ja-JP">{{ t('language.ja') }}</option>
    </select>
    <ChevronDownIcon class="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
  </div>
</template>

<script setup>
import { usePreferencesStore } from '@/stores/preferences'
import { useI18n } from 'vue-i18n'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'

const preferences = usePreferencesStore()
const { t } = useI18n()

function onSwitch(event) {
  const target = event.target
  preferences.switchLocale(target.value)
}
</script>
