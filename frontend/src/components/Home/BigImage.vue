<script setup>
defineProps({
  src: String,
  redirect: String,
});
</script>

<template>
  <section>
    <img v-if="redirect" style="cursor: pointer" @click="$router.push(redirect)" :src="src" loading="lazy" />
    <img v-if="!redirect" :src="src" loading="lazy" />
  </section>
</template>

<style scoped>
section {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

img {
  max-width: 100%;
  display: block;
}
</style>
