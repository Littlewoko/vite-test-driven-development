<script setup lang="ts">
// vue imports
import { ref, computed } from "vue";

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

const guessInProgress = ref("");
const guessSubmitted = ref("");

const formattedGuessInProgress = computed({
  get() {
    return guessInProgress.value;
  },
  set(rawValue: string) {
    guessInProgress.value = rawValue.slice(0, WORD_SIZE);
  },
});

const onSubmit = () => {
  if (
    !englishWords
      .map((word: string) => word.toUpperCase())
      .includes(formattedGuessInProgress.value.toUpperCase())
  )
    return;

  guessSubmitted.value = guessInProgress.value;
};
</script>

<template>
  <input
    type="text"
    maxlength="5"
    v-model="formattedGuessInProgress"
    @keydown.enter="onSubmit"
  />
  <p v-if="guessSubmitted.length > 0">
    {{ guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE }}
  </p>
</template>

