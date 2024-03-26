<script setup lang="ts">
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
      v-for="(letter, index) in guess"
      :key="`${letter}-${index}`"
      :data-letter="letter"
      class="letter"
      v-text="letter"
    />
  </ul>

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

