<script setup lang="ts">
defineProps<{
  wordOfTheDay: string
}>()
</script>

<template>
  <input type="text">
  <p>you won!</p>
  <p>{{ wordOfTheDay }}</p>
</template>

