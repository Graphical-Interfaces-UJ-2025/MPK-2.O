<script setup>
defineProps({
  title: String,
  icon: String,
  isActive: Boolean,
});
</script>

<template>
  <button :class="{ active: isActive }">{{ title }}</button>
</template>

<style scoped>
button {
  padding: 10px 30px;
  min-width: 100px;
  font-size: 18px;
  font-family: 'Oswald';
  background: var(--background-additional);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
}

button.active {
  background: var(--background-main);
  color: var(--text-secondary);
}
</style>
