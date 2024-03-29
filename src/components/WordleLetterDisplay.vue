<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";

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

const letterButton = ref<HTMLButtonElement | null>(null);

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

onMounted(() => {
  document.addEventListener("keydown", (e : KeyboardEvent) => {
    if(letterButton.value != null) {
      if(e.key.toUpperCase() === display.value.toUpperCase()) {
        letterButton.value.setAttribute("data-active", "true");
      }
    }
  })

  document.addEventListener("keyup", (e : KeyboardEvent) => {
    if(letterButton.value != null) {
      console.log(e.key)
      if(e.key.toUpperCase() === display.value.toUpperCase()) {
        letterButton.value.setAttribute("data-active", "false");
      }
    }
  })
})
</script>


<template>
  <button ref="letterButton" :data-key="letter" :data-used="used ?? false" :data-active="false" @click="handleClick">
    {{ display }}
  </button>
</template>

<style scoped>
button {
  background-color: #c9c9c9;
  border: none;
  min-width: 2.15rem;
  min-height: 2.15rem;
  border-radius: 10%;
  transition: 50ms all;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

button:active, button[data-active=true] {
  transform: scale(0.8);
  background-color: black;
  color: white;
}

button[data-used=true] {
  background-color: #868685;
}


</style>