<template>
  <section class="info-panel">
    <div class="inventory">
      <ResourceList :items="items" />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Item {
  id: string;
  name: string;
  count: number;
}

defineProps<{
  items: Item[]
}>();
</script>

<style scoped>
.info-panel {
  background-color: #f5f5f5;
  border-radius: 8px;
  flex: 1;
}
</style>
