<script setup lang="ts">
// vue imports
import { ref } from "vue";

// constants
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from "@/settings";
import englishWords from "@/englishWordsWith5Letters.json";

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) =>
      wordGiven.length === 5 &&
      wordGiven === wordGiven.toUpperCase() &&
      englishWords.includes(wordGiven),
  },
});

const guessInProgress = ref("");
const guessSubmitted = ref("");
</script>

<template>
  <input
    type="text"
    v-model="guessInProgress"
    @keydown.enter="guessSubmitted = guessInProgress"
  />
  <p v-if="guessSubmitted.length > 0">
    {{ guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE }}
  </p>
</template>
