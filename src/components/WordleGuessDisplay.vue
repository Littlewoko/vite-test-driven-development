<script setup lang="ts">
// constants
import { WORD_SIZE } from "@/settings";

// constants
defineProps({
  guess: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <ul class="word">
    <li
      v-for="(letter, index) in guess.padEnd(WORD_SIZE, ' ')"
      :key="`${letter}-${index}`"
      :data-letter="letter"
      class="letter"
      v-text="letter"
    />
  </ul>
</template>

<style scoped>
.word {
  list-style: none;
  display: flex;
  flex-wrap: nowrap;
  gap: 0.25rem;
  width: 100%;
  padding: 0;
  justify-content: center;
}

.letter {
  border: 1px solid grey;
  width: 2em;
  height: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  font-weight: bold;
}

li:not([data-letter=" "]) {
  animation: pop 100ms;
}

@keyframes pop {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.4);
  }
}
</style>

