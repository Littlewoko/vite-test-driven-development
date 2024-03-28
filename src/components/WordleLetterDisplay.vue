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
});

const emit = defineEmits<{
  (e: 'letter-clicked', letter: string): void
}>()

const handleClick = (e: Event) => {
    emit('letter-clicked', props.letter);
}
</script>


<template>
  <button :data-key="letter" :data-used="used ?? false" @click="handleClick">{{ letter }}</button>
</template>