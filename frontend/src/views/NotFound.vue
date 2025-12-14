<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <main class="not-found-container">
    <div class="not-found-content">
      <h1 class="not-found-title">404</h1>
      <h2 class="not-found-subtitle">Nie odnaleziono strony</h2>
      <p class="not-found-message">
        Nie mogliśmy znaleźć strony którą szukasz.
      </p>
      <RouterLink to="/" class="not-found-home-button">
        Wróć do głównej strony
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: var(--background-primary);
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 3rem;
  box-shadow: 0 4px 12px var(--card-shadow);
  max-width: 500px;
}

.not-found-title {
  font-size: 6rem;
  margin: 0;
  color: var(--text-main);
  font-weight: bold;
}

.not-found-subtitle {
  font-size: 2rem;
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.not-found-message {
  color: var(--text-additional);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.not-found-home-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--background-main);
  color: var(--text-secondary);
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: opacity 0.2s ease;
}

.not-found-home-button:hover {
  opacity: 0.9;
}
</style>
