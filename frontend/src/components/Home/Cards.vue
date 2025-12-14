<script setup>
const props = defineProps({
  cards: {
    type: Array,
  }
});
</script>

<template>
  <section class="offer-section">
    <div class="container">
      <div class="offer-grid">
        <div v-for="(card, index) in props.cards" :key="index" class="offer-item">
          <div class="offer-icon">
            <i :class="['fa-solid', card.icon]"></i>
          </div>
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.offer-section {
  padding: 80px 0;
  background-color: var(--background-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 50px;
  color: var(--text-primary);
}

.offer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.offer-item {
  background-color: var(--background-secondary);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.offer-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

.offer-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--background-main);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.offer-icon i {
  font-size: 32px;
  color: white;
}

.offer-item h3 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 15px;
  color: var(--text-primary);
}

.offer-item p {
  color: var(--text-additional);
  line-height: 1.6;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .offer-section {
    padding: 60px 0;
  }

  .section-title {
    font-size: 28px;
    margin-bottom: 40px;
  }

  .offer-grid {
    gap: 20px;
  }

  .offer-item {
    padding: 25px;
  }
}
</style>
