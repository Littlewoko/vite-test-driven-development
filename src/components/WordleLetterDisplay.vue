<script lang="ts" setup>
const props = defineProps({
  letter: {
    type: String,
    required: true,
    validator: (letterGiven: string) => {
      const pattern = /\b[A-Z]\b/;
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
    required: true
  }
});

const handleClick = (e: Event) => {
    props.action(props.letter);
}
</script>


<template>
  <button :data-key="letter" :data-used="used ?? false" @click="handleClick">{{ letter }}</button>
</template>

<style scoped>
button {
  background-color: #C9C9C9 ;
  border: none;
  width: 3rem;
  height: 3rem;
  border-radius: 10%;
  transition: 50ms all;
}

button:active {
  transform: scale(1.2) translateY(-3rem);
  background-color: black;
  color: white;
}
</style>