<template>
  <div ref="containerRef" class="relative w-full overflow-y-auto" :style="{ height: `${height}px` }">
    <div class="relative w-full" :style="{ height: `${totalHeight}px` }">
      <div
        v-for="item in visibleItems"
        :key="item.key"
        class="absolute left-0 right-0"
        :style="{ transform: `translateY(${item.offset}px)` }"
      >
        <slot :item="item.data" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

interface Props<T> {
  items: T[];
  itemSize: number;
  height: number;
  keyField?: keyof T;
}

const props = defineProps<Props<Record<string, unknown>>>();
const containerRef = ref<HTMLDivElement | null>(null);
const scrollTop = ref(0);

const visibleCount = computed(() => Math.ceil(props.height / props.itemSize) + 1);
const totalHeight = computed(() => props.items.length * props.itemSize);

const visibleItems = computed(() => {
  const startIndex = Math.floor(scrollTop.value / props.itemSize);
  const endIndex = Math.min(startIndex + visibleCount.value, props.items.length);
  return props.items.slice(startIndex, endIndex).map((data, index) => ({
    key: props.keyField ? data[props.keyField] : startIndex + index,
    offset: (startIndex + index) * props.itemSize,
    data
  }));
});

const onScroll = () => {
  scrollTop.value = containerRef.value?.scrollTop ?? 0;
};

watch(
  () => props.items.length,
  () => {
    if (containerRef.value) {
      containerRef.value.scrollTop = 0;
      scrollTop.value = 0;
    }
  }
);

onMounted(() => {
  containerRef.value?.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  containerRef.value?.removeEventListener('scroll', onScroll);
});
</script>
