<script setup lang="ts">
// vue imports
import { ref, computed } from "vue";

// constants
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE } from "@/settings";
import englishWords from "@/englishWordsWith5Letters.json";

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => englishWords.map(word => word.toUpperCase()).includes(wordGiven),
  },
});

const guessInProgress = ref("");
const guessSubmitted = ref("");

const formattedGuessInProgress = computed({
  get() {
    return guessInProgress.value;
  }, 
  set(rawValue : string) {
    guessInProgress.value = rawValue.slice(0, WORD_SIZE);
  }
})
</script>

<template>
  <input
    type="text"
    maxlength="5"
    v-model="formattedGuessInProgress"
    @keydown.enter="guessSubmitted = guessInProgress"
  />
  <p v-if="guessSubmitted.length > 0">
    {{ guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE }}
  </p>
</template>

