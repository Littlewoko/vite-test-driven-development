<script setup lang="ts">
// vue imports
import { ref, watch } from "vue";

// constants
import { WORD_SIZE } from "@/settings";
import englishWords from "@/englishWordsWith5Letters.json";

const guessInProgress = ref<string>("");

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
};

watch(guessInProgress, (newVal) => {
  newVal = newVal ?? "";
  // guessInProgress.value = guessInProgress.value ?? "";

  guessInProgress.value = newVal
    .slice(0, WORD_SIZE)
    .toUpperCase()
    .replace(/[^A-Z]+/gi, "");
});
</script>

<template>
  <input type="text" v-model="guessInProgress" @keydown.enter="onSubmit" />
</template>

