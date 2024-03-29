<script setup lang="ts">
// vue imports
import { ref, watch, reactive } from "vue";

// constants
import { WORD_SIZE } from "@/settings";
import englishWords from "@/englishWordsWith5Letters.json";

// components
import WordleGuessDisplay from "./WordleGuessDisplay.vue";
import WordleLetterDisplay from "./WordleLetterDisplay.vue";

const guessInProgress = ref<string>("");
const hasFailedValidation = ref<boolean>(false);
const shakeTimeout = ref<NodeJS.Timeout | null>(null);
const guessHistory = reactive<string[]>([]);
const QWERTYUIOP = "QWERTYUIOP";
const ASDFGHJKL = "ASDFGHJKL";
const ZXCVBNM = "ZXCVBNM";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false });

const emit = defineEmits<{
  "guess-submitted": [guess: string];
}>();

const onSubmit = (): void => {
  if (shakeTimeout.value) {
    clearTimeout(shakeTimeout.value);
  }

  const isNotRealWord = !englishWords
    .map((word: string) => word.toUpperCase())
    .includes(guessInProgress.value.toUpperCase());

  if (isNotRealWord || guessHistory.includes(guessInProgress.value)) {
    hasFailedValidation.value = true;

    shakeTimeout.value = setTimeout(
      () => (hasFailedValidation.value = false),
      500
    );

    return;
  }

  emit("guess-submitted", guessInProgress.value);
  guessHistory.push(guessInProgress.value);
  guessInProgress.value = "";
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

const letterUsed = (letter: string): boolean => {
  return guessHistory.some((word) => word.includes(letter));
};

const handleLetterClicked = (letter: string) => {
  if (letter != "-") {
    guessInProgress.value += letter;
  } else {
    guessInProgress.value = guessInProgress.value.slice(
      0,
      guessInProgress.value.length - 1
    );
  }
};
</script>

<template>
  <WordleGuessDisplay
    v-if="!disabled"
    :class="{ shake: hasFailedValidation }"
    :guess="guessInProgress"
  />

  <input
    id="wordleInput"
    class="input"
    type="text"
    v-model="guessInProgress"
    @keydown.enter="onSubmit"
    autofocus
    @blur="keepFocus"
    :disabled="disabled"
  />

  <br />

  <div style="display: flex; width: 100%; justify-content: center;">
    <div class="on-screen-keyboard">
      <div class="action-row">
        <WordleLetterDisplay letter="+" :used="false" :action="onSubmit" />
        <WordleLetterDisplay
          letter="-"
          :used="false"
          :action="handleLetterClicked"
        />
      </div>

      <div class="keyboard-line">
        <WordleLetterDisplay
          v-for="letter in QWERTYUIOP"
          :key="letter"
          :letter="letter"
          :used="letterUsed(letter)"
          :action="handleLetterClicked"
        />
      </div>
      <div class="keyboard-line">
        <WordleLetterDisplay
          v-for="letter in ASDFGHJKL"
          :key="letter"
          :letter="letter"
          :used="letterUsed(letter)"
          :action="handleLetterClicked"
        />
      </div>
      <div class="keyboard-line">
        <WordleLetterDisplay
          v-for="letter in ZXCVBNM"
          :key="letter"
          :letter="letter"
          :used="letterUsed(letter)"
          :action="handleLetterClicked"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.input {
  opacity: 0;
  position: absolute;
}

.on-screen-keyboard {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: fit-content;
}

.action-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.keyboard-line {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.4rem;
  width: 100%;
  justify-content: center;
}

.shake {
  animation: shake;
  animation-duration: 100ms;
  animation-iteration-count: 2;
}

@keyframes shake {
  0% {
    transform: translateX(-2%);
  }

  25% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(2%);
  }
}
</style>

