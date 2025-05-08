<template>
  <section class="actions-panel translucent-white">
    <div class="action-buttons">
      <ActionButton
        v-for="action in actions"
        :key="action.name"
        :duration="action.duration"
        :disabled="action.disabled"
        :tooltip="action.tooltip"
        :before-click="() => checkEnergyCost(action.energyCost)"
        @click="action.handler"
      >
        {{ action.text }}
      </ActionButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCharacterStore } from '../../stores/character'
import { toast } from '../../utils/toast'

interface Action {
  name: string;
  text: string;
  duration: number;
  energyCost: number;
  handler: () => Promise<void>;
  disabled?: boolean;
  tooltip?: string;
}

defineProps<{
  actions: Action[]
}>();

const character = useCharacterStore();

function checkEnergyCost(cost: number) {  if (character.energy < cost) {
    const messages = [
      '你感到精疲力尽，需要休息一下...',
      '你的双腿像灌了铅一样沉重...',
      '你气喘吁吁，暂时无法继续...',
      '你的手臂已经抬不起来了...',
      '你需要缓一缓，恢复些体力...'
    ];
    toast({
      message: messages[Math.floor(Math.random() * messages.length)],
      type: 'warning'
    });
    return false;
  }
  return true;
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
