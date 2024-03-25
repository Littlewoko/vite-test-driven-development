<script setup lang="ts">
// vue imports
import { ref, computed, watch } from "vue";

// constants
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE } from "@/settings";
import englishWords from "@/englishWordsWith5Letters.json";

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) =>
      englishWords
        .map((word: string) => word.toUpperCase())
        .includes(wordGiven),
  },
});

const guessInProgress = ref<string>("");
const guessSubmitted = ref("");

const onSubmit = () : void => {
  if (
    !englishWords
      .map((word: string) => word.toUpperCase())
      .includes(guessInProgress.value.toUpperCase())
  )
    return;

  guessSubmitted.value = guessInProgress.value ?? "";
};

watch(guessInProgress, (newVal) => {
  newVal = newVal ?? "";
  // guessInProgress.value = guessInProgress.value ?? "";

guessInProgress.value = newVal
    .slice(0, WORD_SIZE)
    .toUpperCase()
    .replace(/[^A-Z]+/gi, "");
})
</script>

<template>
  <input
    type="text"
    v-model="guessInProgress"
    @keydown.enter="onSubmit"
  />
  <p v-if="guessSubmitted.length > 0">
    {{ guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE }}
  </p>
</template>

