<template>
  <section class="info-panel">
    <div class="inventory">
      <ResourceList :items="inventoryItems" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useResourcesStore } from "../../stores/resources";
import ResourceList from "./ResourceList.vue";

const resources = useResourcesStore();

// 统一的资源列表计算属性
const inventoryItems = computed(() => {
  // 将资源转换为列表格式
  return Object.entries(resources.$state)
    .map(([id, item]) => ({
      id,
      name: item.name,
      count: item.count
    }))
    .filter(item => item.count > 0);
});
</script>

<style scoped>
.info-panel {
  background-color: #f5f5f5;
  border-radius: 8px;
  flex: 1;
}
</style>
