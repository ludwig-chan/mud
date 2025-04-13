<template>
  <section class="info-panel">
    <h2>个人信息</h2>
    <div class="inventory">
      <h3>物品栏</h3>
      <ul class="resources-list">
        <li>木材: {{ resources.wood }}</li>
        <li>果实: {{ resources.fruit }}</li>
        <li>矿石: {{ resources.ore }}</li>
      </ul>
    </div>
    <div class="status">
      <h3>状态</h3>
      <!-- 状态信息将在这里显示 -->
    </div>
  </section>
</template>

<script setup lang="ts">
import { useResourcesStore } from '../stores/resources'

const resources = useResourcesStore()
</script>

<style scoped>
.info-panel {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #2d3748;
}

h3 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #4a5568;
}

.resources-list {
  list-style: none;
  padding: 0;
}

.resources-list li {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
