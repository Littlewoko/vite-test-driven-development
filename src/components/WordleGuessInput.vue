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

const keepFocus = (e: Event): void => {
  const target = e.target;
  if (target instanceof HTMLInputElement) {
    target.focus();
  }
};
</script>

<template>
  <ul class="word">
    <li
      v-for="(letter, index) in guessInProgress.padEnd(WORD_SIZE, ' ')"
      :key="`${letter}-${index}`"
      :data-letter="letter"
      class="letter"
      v-text="letter"
    />
  </ul>

  <input
    class="input"
    type="text"
    v-model="guessInProgress"
    @keydown.enter="onSubmit"
    autofocus
    @blur="keepFocus"
  />
</template>

<style scoped>
.input {
  opacity: 0;
  position: absolute;
}

.word {
  list-style: none;
  display: flex;
  flex-wrap: nowrap;
  gap: 0.25rem;
  width: 100%;
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

