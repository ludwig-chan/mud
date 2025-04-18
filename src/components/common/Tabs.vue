<template>
  <div class="tabs">
    <div class="tab-header">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="['tab-button', { active: modelValue === tab.key }]"
        @click="$emit('update:modelValue', tab.key)"
      >
        {{ tab.title }}
      </button>
    </div>
  <div class="tab-content">
      <template v-for="tab in tabs" :key="tab.key">
        <div v-show="modelValue === tab.key">
          <slot :name="tab.key"></slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  tabs: Array<{
    key: string;
    title: string;
  }>;
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped>
.tabs {
  width: 100%;
}

.tab-header {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

.tab-button {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #4a5568;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-button:hover {
  color: #2d3748;
}

.tab-button.active {
  color: #2d3748;
  border-bottom-color: #4299e1;
}

.tab-content {
  padding: 0.5rem 0;
}
</style>
