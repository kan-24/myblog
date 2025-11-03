<template>
  <select
    class="rounded border border-slate-200 bg-transparent px-2 py-1 text-sm dark:border-slate-700"
    :value="preferences.locale"
    @change="onSwitch"
    :aria-label="t('language.label')"
  >
    <option value="zh-CN">{{ t('language.zh') }}</option>
    <option value="en-US">{{ t('language.en') }}</option>
    <option value="ja-JP">{{ t('language.ja') }}</option>
  </select>
</template>

<script setup>
import { usePreferencesStore } from '@/stores/preferences'
import { useI18n } from 'vue-i18n'

const preferences = usePreferencesStore()
const { t } = useI18n()

function onSwitch(event) {
  const target = event.target
  preferences.switchLocale(target.value)
}
</script>
