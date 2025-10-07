<template>
  <div ref="target" class="h-1 w-full" />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits(['intersect'])

const target = ref(null)
let observer = null

onMounted(() => {
  if (!target.value) return
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      emit('intersect')
    }
  })
  observer.observe(target.value)
})

onUnmounted(() => {
  if (observer && target.value) observer.unobserve(target.value)
})
</script>
