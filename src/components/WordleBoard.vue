<script setup lang="ts">
// vue imports
import { ref } from "vue";

// constants
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from "@/settings";
import englishWords from "@/englishWordsWith5Letters.json";

// components
import WordleGuessInput from "./WordleGuessInput.vue";

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) =>
      englishWords
        .map((word: string) => word.toUpperCase())
        .includes(wordGiven),
  },
});

const guessSubmitted = ref("");

const onSubmit = (guess: string) : void => {
  console.log(guess)
  guessSubmitted.value = guess ?? "";
};

</script>

<template>
  <WordleGuessInput @guess-submitted="onSubmit" />

  <p v-if="guessSubmitted.length > 0">
    {{ guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE }}
  </p>
</template>

