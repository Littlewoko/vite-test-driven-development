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

  <p v-if="guessSubmitted.length > 0" class="end-of-game">
    {{ guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE }}
  </p>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem

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

