<script setup>
import { ref } from 'vue';

defineProps({
  title: String,
  link: String,
});
</script>

<template>
  <a :href="link">{{ title }}</a>
</template>

<style scoped>
a {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.5s;
  padding: 6px 10px;
  border-radius: 15px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  background-color: var(--background-secondary);
  font-family: 'Lato', sans-serif;
  color: var(--text-main);
  border: 3px solid var(--text-primary);
}

a:hover {
  background-color: var(--text-primary);
  color: var(--background-secondary);
  transform: scale(1.1);
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
  -o-transform: scale(1.1);
}
</style>
