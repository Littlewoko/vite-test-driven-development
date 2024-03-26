<script setup lang="ts">
// constants
import { WORD_SIZE } from "@/settings";

// constants
withDefaults(defineProps<{ guess: string; shouldFlip?: boolean }>(), {
  shouldFlip: false,
});
</script>

<template>
  <ul class="word">
    <li
      v-for="(letter, index) in guess.padEnd(WORD_SIZE, ' ')"
      :key="`${letter}-${index}`"
      :class="{ 'with-flips': shouldFlip && letter !== ' ' }"
      :data-letter="letter"
      :data-letter-feedback="shouldFlip && letter !== ' ' ? 'unknown' : null"
      class="letter"
      v-text="letter"
    />
  </ul>
</template>

<style lang="scss" scoped>
.word {
  list-style: none;
  display: flex;
  flex-wrap: nowrap;
  gap: 0.25rem;
  width: 100%;
  padding: 0;
  margin: 0;
  justify-content: center;
}

.letter {
  --front-color: hsl(0, 0%, 99%);
  --back-color: hsl(0, 0%, 70%);
  background-color: var(--front-color);
  border: 1px solid --back-color;
  border: 1px solid grey;
  width: 2em;
  height: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.35rem;
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

$maxWordSize: 5;
@for $i from 1 through $maxWordSize {
  .with-flips:nth-of-type(#{$i}) {
    animation: flip-card 300ms forwards;
    animation-delay: #{250 * $i}ms;
  }
}

@keyframes flip-card {
  0% {
    transform: rotateY(0);
    background-color: var(--front-color);
  }

  49% {
    background-color: var(--front-color);
  }

  50% {
    transform: rotateY(-90deg);
    background-color: var(--back-color);
  }

  100% {
    transform: rotateY(0);
    background-color: var(--back-color);
  }
}
</style>

