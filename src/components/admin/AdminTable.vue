<template>
  <div>
    <div class="mb-3 flex flex-wrap items-center gap-3">
      <input
        v-model="search"
        type="search"
        placeholder="搜索..."
        class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
      />
      <slot name="controls" />
    </div>
    <div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table class="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
        <thead class="bg-slate-100 dark:bg-slate-900">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-2 text-left font-medium text-slate-600 dark:text-slate-300"
            >
              <button class="flex items-center gap-1" @click="setSort(column.key)">
                {{ column.label }}
                <span v-if="sortKey === column.key">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
          <tr v-for="row in paginated" :key="rowKey(row)" class="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-950">
            <td v-for="column in columns" :key="column.key" class="px-4 py-2">
              <slot :name="column.key" :row="row">
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-4 flex items-center justify-between text-xs text-slate-500">
      <span>共 {{ filtered.length }} 条</span>
      <div class="flex items-center gap-2">
        <button class="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800" :disabled="page === 1" @click="page--">
          上一页
        </button>
        <span>第 {{ page }} / {{ totalPages }} 页</span>
        <button
          class="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          :disabled="page === totalPages"
          @click="page++"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Column {
  key: string;
  label: string;
}

const props = defineProps<{
  rows: Record<string, any>[];
  columns: Column[];
  pageSize?: number;
  rowKey: (row: any) => string;
}>();

const search = ref('');
const sortKey = ref('');
const sortDirection = ref<'asc' | 'desc'>('asc');
const page = ref(1);
const pageSize = computed(() => props.pageSize ?? 10);

const filtered = computed(() => {
  if (!search.value) return props.rows;
  return props.rows.filter((row) =>
    Object.values(row).some((value) => String(value).toLowerCase().includes(search.value.toLowerCase()))
  );
});

const sorted = computed(() => {
  if (!sortKey.value) return filtered.value;
  return [...filtered.value].sort((a, b) => {
    const direction = sortDirection.value === 'asc' ? 1 : -1;
    if (a[sortKey.value] > b[sortKey.value]) return direction;
    if (a[sortKey.value] < b[sortKey.value]) return -direction;
    return 0;
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(sorted.value.length / pageSize.value)));

const paginated = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return sorted.value.slice(start, start + pageSize.value);
});

const setSort = (key: string) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
};
</script>
