<script setup lang="ts">
// vue imports
import { ref, watch } from "vue";

// constants
import { WORD_SIZE } from "@/settings";
import englishWords from "@/englishWordsWith5Letters.json";

// components
import WordleGuessDisplay from "./WordleGuessDisplay.vue";

const guessInProgress = ref<string>("");

withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false });

const emit = defineEmits<{
  "guess-submitted": [guess: string];
}>();

const onSubmit = (): void => {
  if (
    !englishWords
      .map((word: string) => word.toUpperCase())
      .includes(guessInProgress.value.toUpperCase())
  )
    return;

  emit("guess-submitted", guessInProgress.value);
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
  <WordleGuessDisplay :guess="guessInProgress" />

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
</style>

