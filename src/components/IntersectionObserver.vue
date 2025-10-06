<template>
  <div ref="target" class="h-1 w-full" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits<{
  (event: 'intersect'): void;
}>();

const target = ref<HTMLDivElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!target.value) return;
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      emit('intersect');
    }
  });
  observer.observe(target.value);
});

onUnmounted(() => {
  if (observer && target.value) observer.unobserve(target.value);
});
</script>
