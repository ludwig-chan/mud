<template>
  <ul class="resources-list">
    <li v-for="item in items" :key="item.id" class="resource-item">
      <span v-if="item.label">{{ item.label }}</span>
      <span v-if="item.count !== undefined">{{ item.count }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
interface ResourceItem {
  id: string | number
  label?: string
  count?: number
}

defineProps<{
  items: ResourceItem[]
}>()
</script>

<style scoped>
.resources-list {
  list-style: none;
  padding: 0;
}

.resource-item {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
