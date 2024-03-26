<script setup lang="ts">
import { ref } from "vue";

import englishWords from "@/englishWordsWith5Letters.json";

import WordleBoard from "./components/WordleBoard.vue";

const wordOfTheDay = ref(englishWords[Math.floor(Math.random() * englishWords.length)]);
</script>

<template>
  <WordleBoard :word-of-the-day="wordOfTheDay.toUpperCase()" />
</template>


