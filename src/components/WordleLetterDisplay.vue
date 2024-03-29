<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  letter: {
    type: String,
    required: true,
    validator: (letterGiven: string) => {
      const pattern = /[A-Z+-]/;
      const match = letterGiven.match(pattern);

      return match !== null && letterGiven.length === 1;
    },
  },
  used: {
    type: Boolean,
    required: false,
  },
  action: {
    type: Function,
    required: true,
  },
});

const display = computed(() => {
  switch (props.letter) {
    case "+":
      return "Enter";
    case "-":
      return "Backspace";
    default:
      return props.letter;
  }
});

const handleClick = (e: Event) => {
  props.action(props.letter);
};
</script>


<template>
  <button :data-key="letter" :data-used="used ?? false" @click="handleClick">
    {{ display }}
  </button>
</template>

<style scoped>
button {
  background-color: #c9c9c9;
  border: none;
  width: 3rem;
  height: 3rem;
  border-radius: 10%;
  transition: 50ms all;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

button:active {
  transform: scale(0.8);
  background-color: black;
  color: white;
}
</style>