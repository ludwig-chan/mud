import { ref, computed } from 'vue';

export function useCountdown(duration: number = 0) {
  const isCountingDown = ref(false);
  const remainingTime = ref(0);
  let timer: number | null = null;

  const progressPercentage = computed(() => {
    const durationMs = duration * 1000;
    return ((durationMs - remainingTime.value) / durationMs) * 100;
  });

  const cancelCountdown = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    isCountingDown.value = false;
    remainingTime.value = 0;
  };

  const startCountdown = (onComplete?: () => void) => {
    isCountingDown.value = true;
    remainingTime.value = duration * 1000;

    timer = setInterval(() => {
      remainingTime.value -= 100;
      if (remainingTime.value <= 0) {
        cancelCountdown();
        onComplete?.();
      }
    }, 100);
  };

  return {
    isCountingDown,
    progressPercentage,
    startCountdown,
    cancelCountdown
  };
}
