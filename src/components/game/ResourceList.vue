<template>
  <ul class="resources-list">
    <li v-for="item in items" :key="item.id" class="resource-item">
      <span v-if="item.name" class="item-name">{{ item.name }}</span>
      <span v-if="item.count !== undefined" class="item-count">{{ item.count }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
interface ResourceItem {
  id: string | number
  name?: string
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
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 0;
}

.resource-item {
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 4px;
  font-size: 12px;
  position: relative;
}

.item-name {
  word-break: break-word;
  font-size: 10px;
}

.item-count {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 1px 3px;
  border-radius: 2px;
  font-size: 9px;
}
</style>
