<script lang="ts" setup>
import { ref } from "vue";

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

const activeLetter = ref<HTMLDivElement | null>(null);

const handleClick = (e: Event) => {
  props.action(props.letter);
};

const showActiveLetter = (e: Event) => {
  if (activeLetter.value) {
    activeLetter.value.style.display = "flex";
  }
};

const hideActiveLetter = (e: Event) => {
  if (activeLetter.value) {
    activeLetter.value.style.display = "none";
  }
};
</script>


<template>
  <button
    :data-key="letter"
    :data-used="used ?? false"
    @click="handleClick"
    @mousedown="showActiveLetter"
    @mouseup="hideActiveLetter"
    @mouseleave="hideActiveLetter"
    @mouseenter="showActiveLetter"
  >
    {{ letter }}
    <div ref="activeLetter" class="clone" @mouseenter="hideActiveLetter">{{ letter }}</div>
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

.clone {
  background-color: black;
  border: none;
  width: 3rem;
  height: 3rem;
  border-radius: 10%;
  transition: 50ms all;
  position: absolute;
  transform: translateY(-4em);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  display: none;
}
</style>