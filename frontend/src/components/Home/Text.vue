<script setup>
import { ref } from 'vue';

defineProps({
  title: String,
  text: String,
});
</script>

<template>
  <section>
    <h1>{{ title }}</h1>
    <span v-if="text">
      {{ text }}
    </span>
  </section>
</template>

<style scoped>
section {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding: 35px 0;
  background-color: var(--background-main);
  color: var(--text-secondary);
}

h1 {
  font-size: clamp(32px, 5vw, 40px);
  font-weight: 700;
  margin: 0;
  padding: 0;
  max-width: 90%;
}

span {
  margin-top: 30px;
  max-width: 90%;
  height: max-content;
  font-size: clamp(16px, 3vw, 18px);
  line-height: 1.5;
}
</style>
