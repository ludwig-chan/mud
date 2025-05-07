<template>
  <section class="actions-panel translucent-white">
    <div class="action-buttons">
      <ActionButton
        v-for="action in actions"
        :key="action.name"
        :duration="action.duration"
        :disabled="action.disabled || !hasEnoughEnergy(action.energyCost)"
        :tooltip="getActionTooltip(action)"
        @click="action.handler"
      >
        {{ action.text }}
      </ActionButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCharacterStore } from '../../stores/character'

interface Action {
  name: string;
  text: string;
  duration: number;
  energyCost: number;
  handler: () => Promise<void>;
  disabled?: boolean;
  tooltip?: string;
}

interface TooltipData {
  description?: string;
  requirements?: string[];
  costs?: { label: string; value: string | number; sufficient?: boolean }[];
  warnings?: string[];
}

defineProps<{
  actions: Action[]
}>();

const character = useCharacterStore();

function hasEnoughEnergy(cost: number) {
  return character.energy >= cost;
}

function getActionTooltip(action: Action): TooltipData {
  const tooltipData: TooltipData = {
    description: action.tooltip,
    costs: [
      {
        label: '体力',
        value: action.energyCost,
        sufficient: hasEnoughEnergy(action.energyCost)
      }
    ]
  };

  if (!hasEnoughEnergy(action.energyCost)) {
    tooltipData.warnings = ['体力不足'];
  }

  return tooltipData;
}
</script>

<style scoped>
.actions-panel {
  border-radius: 8px;
  flex: 1;
  padding: 1rem;
  box-sizing: border-box;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
