<template>
  <select
    class="rounded border border-slate-200 bg-transparent px-2 py-1 text-sm dark:border-slate-700"
    :value="preferences.locale"
    @change="onSwitch"
  >
    <option value="zh-CN">中文</option>
    <option value="en">English</option>
  </select>
</template>

<script setup>
import { usePreferencesStore } from '@/stores/preferences'

const preferences = usePreferencesStore()

function onSwitch(event) {
  const target = event.target
  preferences.switchLocale(target.value)
}
</script>
