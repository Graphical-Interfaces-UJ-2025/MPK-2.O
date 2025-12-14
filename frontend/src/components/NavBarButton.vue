<script setup>
defineProps({
  title: String,
});
</script>

<template>
  <a>{{ title }}</a>
</template>

<style scoped>
a {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.5s;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  font-family: 'Lato', sans-serif;
  color: var(--text-secondary);
  padding: 3px 3px 0 3px;
  border-bottom: 3px solid transparent;
}

a:hover {
  transform: scale(1.1);
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
  -o-transform: scale(1.1);
}
</style>
