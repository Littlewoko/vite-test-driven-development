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
</script>


<template>
  <button :data-key="letter" :data-used="used ?? false">{{ letter }}</button>
</template>