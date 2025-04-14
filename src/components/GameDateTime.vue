<template>
  <div class="game-date-time">
    <div class="date">第{{ year }}年 第{{ month }}月 第{{ day }}天</div>
    <div class="weather">天气：{{ weather }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const year = ref(1)
const month = ref(1)
const day = ref(1)
const weather = ref('晴朗') // 这里可以之后扩展成一个天气系统
</script>

<style scoped>
.game-date-time {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.date, .weather {
  font-size: 1rem;
}
</style>
