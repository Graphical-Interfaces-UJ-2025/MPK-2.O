<template>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <h1>Zakup biletów</h1>
        <p class="subtitle">Wybierz parametry i dokonaj płatności</p>
      </div>

      <form @submit.prevent="handlePayment">
        <section class="form-section">
          <div class="section-header">
            <span class="step-number">1</span>
            <h2>Wybierz strefę</h2>
          </div>
          <div class="options zones-grid">
            <label v-for="z in zones" :key="z.name" class="option-card" :class="{ active: zone?.name === z.name }">
              <input type="radio" v-model="zone" :value="z" />
              <div class="option-content">
                <span class="zone-badge">{{ z.name }}</span>
                <span class="multiplier">{{ z.multiplier }}x</span>
              </div>
            </label>
          </div>
        </section>

        <section class="form-section">
          <div class="section-header">
            <span class="step-number">2</span>
            <h2>Typ biletu</h2>
          </div>
          <div class="options types-grid">
            <label v-for="t in types" :key="t.name" class="option-card" :class="{ active: type?.name === t.name }">
              <input type="radio" v-model="type" :value="t" />
              <div class="option-content">
                <span class="type-name">{{ t.name }}</span>
                <span class="base-price">{{ t.base }} zł/dzień</span>
              </div>
            </label>
          </div>
        </section>

        <section class="form-section">
          <div class="section-header">
            <span class="step-number">3</span>
            <h2>Okres ważności</h2>
          </div>
          <div class="dates">
            <div class="date-input-group">
              <label for="dateFrom">Od</label>
              <input type="date" id="dateFrom" v-model="dateFrom" />
            </div>
            <div class="date-input-group">
              <label for="dateTo">Do</label>
              <input type="date" id="dateTo" v-model="dateTo" />
            </div>
          </div>
          <div v-if="days > 0" class="days-info">
            Liczba dni: <strong>{{ days }}</strong>
          </div>
        </section>

        <div class="price-summary" v-if="canCalculate">
          <div class="summary-label">Kwota do zapłaty</div>
          <div class="summary-price">{{ price }} zł</div>
        </div>

        <button type="submit" :disabled="!canCalculate" class="pay-button">
          <span v-if="canCalculate">Dokonaj płatności</span>
          <span v-else>Uzupełnij wszystkie pola</span>
        </button>
      </form>

      <p class="note">Pola oznaczone krokami są obowiązkowe</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const zones = [
  { name: 'I', multiplier: 1 },
  { name: 'II', multiplier: 1.2 },
  { name: 'III', multiplier: 1.4 },
  { name: 'I + II', multiplier: 1.6 },
  { name: 'II + III', multiplier: 1.8 },
  { name: 'I + II + III', multiplier: 2 }
]

const types = [
  { name: 'Normalny', base: 10 },
  { name: 'Ulgowy', base: 6 }
]

const zone = ref(null)
const type = ref(null)
const dateFrom = ref('')
const dateTo = ref('')

const days = computed(() => {
  if (!dateFrom.value || !dateTo.value) return 0
  const a = new Date(dateFrom.value)
  const b = new Date(dateTo.value)
  const diff = b - a
  return diff >= 0 ? diff / 86400000 + 1 : 0
})

const canCalculate = computed(() =>
  zone.value && type.value && days.value > 0
)

const price = computed(() =>
  Math.round(days.value * type.value.base * zone.value.multiplier)
)

function handlePayment() {
  // Payment handling logic
  alert('Płatność została przetworzona!')
}
</script>

<style scoped>
.wrapper {
  min-height: 100vh;
  background-color: var(--background-primary);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.card {
  width: 100%;
  max-width: 600px;
  background: var(--card-background);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px var(--shadow-color);
  color: var(--text-main);
}

.header {
  text-align: center;
  margin-bottom: 36px;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: var(--text-additional);
  margin: 0;
}

form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--background-main);
  color: var(--text-secondary);
  border-radius: 50%;
  font-weight: 600;
  font-size: 14px;
}

h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.zones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 10px;
}

.types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.option-card {
  position: relative;
  cursor: pointer;
}

.option-card input {
  display: none;
}

.option-card input:checked+.option-content {
  background: var(--background-main);
  color: var(--text-secondary);
  border-color: var(--background-main);
  box-shadow: 0 4px 12px rgba(0, 31, 63, 0.3);
}

.option-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s ease;
  text-align: center;
  gap: 4px;
  color: var(--text-main);
}

.option-card:hover .option-content {
  border-color: var(--background-main);
}

.zone-badge {
  font-size: 16px;
  font-weight: 700;
  color: inherit;
}

.multiplier {
  font-size: 12px;
  opacity: 0.7;
  color: inherit;
}

.type-name {
  font-size: 14px;
  font-weight: 600;
  color: inherit;
}

.base-price {
  font-size: 12px;
  opacity: 0.7;
  color: inherit;
}

.dates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.date-input-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

input[type="date"] {
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  font-family: inherit;
  background: var(--background-primary);
  color: var(--text-main);
}

input[type="date"]:focus {
  outline: none;
  border-color: var(--background-main);
  box-shadow: 0 0 0 3px rgba(0, 31, 63, 0.1);
}

.days-info {
  padding: 12px;
  background: var(--background-tertiary);
  border-radius: 10px;
  font-size: 13px;
  color: var(--background-main);
  text-align: center;
  border: 1px solid var(--border-color);
}

.price-summary {
  padding: 24px;
  background: var(--background-additional);
  border-radius: 14px;
  text-align: center;
  border: 2px solid var(--border-color);
}

.summary-label {
  font-size: 13px;
  color: var(--text-additional);
  margin-bottom: 8px;
  font-weight: 500;
}

.summary-price {
  font-size: 32px;
  font-weight: 700;
  color: var(--background-main);
}

.pay-button {
  padding: 16px;
  background: var(--background-main);
  color: var(--text-secondary);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 31, 63, 0.3);
}

.pay-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 31, 63, 0.4);
}

.pay-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.note {
  margin-top: 16px;
  font-size: 12px;
  color: var(--text-additional);
  text-align: center;
  margin-bottom: 0;
}

@media (max-width: 480px) {
  .card {
    padding: 24px;
  }

  h1 {
    font-size: 24px;
  }

  .zones-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .types-grid {
    grid-template-columns: 1fr;
  }

  .dates {
    grid-template-columns: 1fr;
  }
}
</style>