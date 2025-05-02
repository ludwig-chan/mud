<template>
  <div class="background-layer"></div>
</template>

<script setup lang="ts">
// 这里可以添加任何需要的逻辑
</script>

<style scoped>
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #333333; /* 深灰色背景 */
  z-index: -1; /* 确保背景在最底层 */
}
</style>
