<script setup lang="ts">
// vue imports
import { computed, ref } from "vue";

// constants
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, MAX_GUESSES_COUNT } from "@/settings";
import englishWords from "@/englishWordsWith5Letters.json";

// components
import WordleGuessInput from "./WordleGuessInput.vue";
import WordleGuessDisplay from "./WordleGuessDisplay.vue";

const props = defineProps({
  wordOfTheDay: {
    type: String,
    required: true,
    validator: (wordGiven: string) =>
      englishWords
        .map((word: string) => word.toUpperCase())
        .includes(wordGiven),
  },
});

const guessesSubmitted = ref<string[]>([]);

const isGameOver = computed(() => {
  const allGuessesUsed = guessesSubmitted.value.length === MAX_GUESSES_COUNT;
  const correctGuessPresent = guessesSubmitted.value.includes(
    props.wordOfTheDay
  );
  return allGuessesUsed || correctGuessPresent;
});

const onSubmit = (guess: string): void => {
  console.log(guess);
  guessesSubmitted.value.push(guess);
};
</script>

<template>
  <template
    v-for="index in MAX_GUESSES_COUNT"
    :key="`${index}`"
  >
    <WordleGuessDisplay :guess="guessesSubmitted[index - 1] ?? ''" :should-flip="true"/>
  </template>
  
  <br />

  <WordleGuessInput @guess-submitted="onSubmit" :disabled="isGameOver"/>

  <p v-if="isGameOver" class="end-of-game">
    {{
      guessesSubmitted.includes(wordOfTheDay) ? VICTORY_MESSAGE : DEFEAT_MESSAGE
    }}
  </p>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
}

.end-of-game {
  font-size: 3rem;
  animation: end-of-game-message-animation 700ms forwards;
  white-space: nowrap;
  text-align: center;
}

@keyframes end-of-game-message-animation {
  0% {
    opacity: 0;
    transform: rotateZ(0);
  }

  100% {
    opacity: 1;
    transform: translateY(2rem);
  }
}
</style>

