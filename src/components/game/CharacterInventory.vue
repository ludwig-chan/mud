<template>
  <div class="inventory">
    <div class="inventory-grid">
      <div v-for="i in 24" :key="i" class="inventory-slot">
        <div v-if="character.inventory[i-1]" class="item">
          <span class="item-icon">{{ character.inventory[i-1].icon }}</span>
          <div class="item-info">
            <span class="item-name">{{ character.inventory[i-1].name }}</span>
            <span class="item-quantity" v-if="character.inventory[i-1].quantity > 1">
              x{{ character.inventory[i-1].quantity }}
            </span>
          </div>
        </div>
        <div v-else class="empty-slot">
          <span>空</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCharacterStore } from '../../stores/character'

const character = useCharacterStore()
</script>

<style scoped>
.inventory {
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
  padding: 0.5rem;
}

.inventory-slot {
  aspect-ratio: 1;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.inventory-slot:hover {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.item {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.item-icon {
  font-size: 1.75rem;
}

.item-info {
  text-align: center;
  font-size: 0.8rem;
  width: 100%;
}

.item-name {
  display: block;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-quantity {
  color: #666;
  font-size: 0.75rem;
}

.empty-slot {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.8rem;
}
</style>
