<script setup lang="ts">
// vue imports
import { ref, watch, reactive } from "vue";

// constants
import { WORD_SIZE } from "@/settings";
import englishWords from "@/englishWordsWith5Letters.json";

// components
import WordleGuessDisplay from "./WordleGuessDisplay.vue";

const guessInProgress = ref<string>("");
const hasFailedValidation = ref<boolean>(false);
const shakeTimeout = ref<NodeJS.Timeout | null>(null);
const guessHistory = reactive<string[]>([]);

withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false });

const emit = defineEmits<{
  "guess-submitted": [guess: string];
}>();

const onSubmit = (): void => {
  if (shakeTimeout.value) {
    clearTimeout(shakeTimeout.value);
  }

  const isNotRealWord = !englishWords
      .map((word: string) => word.toUpperCase())
      .includes(guessInProgress.value.toUpperCase())

  if (isNotRealWord || guessHistory.includes(guessInProgress.value)) {
    hasFailedValidation.value = true;

    shakeTimeout.value = setTimeout(
      () => (hasFailedValidation.value = false),
      500
    );

    return;
  }

  emit("guess-submitted", guessInProgress.value);
  guessHistory.push(guessInProgress.value);
  guessInProgress.value = "";
};

watch(guessInProgress, (newVal) => {
  newVal = newVal ?? "";
  // guessInProgress.value = guessInProgress.value ?? "";

  guessInProgress.value = newVal
    .slice(0, WORD_SIZE)
    .toUpperCase()
    .replace(/[^A-Z]+/gi, "");
});

const keepFocus = (e: Event): void => {
  const target = e.target;
  if (target instanceof HTMLInputElement) {
    target.focus();
  }
};
</script>

<template>
  <WordleGuessDisplay
    v-if="!disabled"
    :class="{ shake: hasFailedValidation }"
    :guess="guessInProgress"
  />

  <input
    class="input"
    type="text"
    v-model="guessInProgress"
    @keydown.enter="onSubmit"
    autofocus
    @blur="keepFocus"
    :disabled="disabled"
  />
</template>

<style scoped>
.input {
  opacity: 0;
  position: absolute;
}

.shake {
  animation: shake;
  animation-duration: 100ms;
  animation-iteration-count: 2;
}

@keyframes shake {
  0% {
    transform: translateX(-2%);
  }

  25% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(2%);
  }
}
</style>

