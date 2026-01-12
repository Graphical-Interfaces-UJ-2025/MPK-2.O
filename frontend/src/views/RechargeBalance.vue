<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { addNotification } from '@/stores/notifications';
import { apiClient } from '@/api';
import router from '@/router';

const authStore = useAuthStore();

const amount = ref(50);
const isLoading = ref(false);

const presetAmounts = [50, 100, 200, 500];

const setAmount = (value) => {
  amount.value = value;
};

const handleRecharge = async () => {
  if (amount.value < 50) {
    addNotification('error', 'Minimalna kwota doładowania to 50 PLN');
    return;
  }

  isLoading.value = true;

  try {
    const amountInGrosze = Math.round(amount.value * 100);
    await apiClient.transactions.postApiTransactionsRecharge({
      requestBody: { amount: amountInGrosze },
    });

    await authStore.fetchCurrentUser();
    addNotification('success', `Konto doładowane o ${amount.value.toFixed(2)} PLN`);
    router.push('/profile');
  } catch (err) {
    const message = err.body?.message || err.message || 'Błąd doładowania konta';
    addNotification('error', message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="page-header">
        <h1>Doładuj konto</h1>
        <div class="balance-badge">
          <i class="fa-solid fa-wallet"></i>
          <span>{{ authStore.formattedBalance }}</span>
        </div>
      </div>

      <div class="card">
        <form @submit.prevent="handleRecharge">
          <div class="preset-section">
            <label>Szybki wybór kwoty</label>
            <div class="preset-buttons">
              <button
                v-for="preset in presetAmounts"
                :key="preset"
                type="button"
                class="preset-button"
                :class="{ active: amount === preset }"
                @click="setAmount(preset)"
              >
                {{ preset }} PLN
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="amount">
              <i class="fa-solid fa-coins"></i>
              Kwota doładowania (PLN)
            </label>
            <div class="input-wrapper">
              <input
                id="amount"
                type="number"
                v-model.number="amount"
                min="50"
                step="1"
                placeholder="Wprowadź kwotę"
                required
              />
              <span class="currency">PLN</span>
            </div>
            <span class="hint">Minimalna kwota: 50 PLN</span>
          </div>

          <div class="summary">
            <div class="summary-row">
              <span>Kwota doładowania:</span>
              <strong>{{ amount.toFixed(2) }} PLN</strong>
            </div>
            <div class="summary-row">
              <span>Saldo po doładowaniu:</span>
              <strong class="new-balance">
                {{ ((authStore.user?.balance || 0) / 100 + amount).toFixed(2) }} PLN
              </strong>
            </div>
          </div>

          <button type="submit" class="submit-button" :disabled="isLoading || amount < 50">
            <i v-if="!isLoading" class="fa-solid fa-credit-card"></i>
            <i v-else class="fa-solid fa-spinner fa-spin"></i>
            {{ isLoading ? 'Przetwarzanie...' : 'Doładuj konto' }}
          </button>
        </form>

        <router-link to="/profile" class="back-link">
          <i class="fa-solid fa-arrow-left"></i>
          Powrót do profilu
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  min-height: 100vh;
  background-color: var(--background-primary);
  padding: 40px 16px;
}

.container {
  max-width: 500px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.balance-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--background-additional);
  border-radius: 12px;
  font-weight: 600;
  color: var(--background-main);
}

.balance-badge i {
  font-size: 18px;
}

.card {
  background: var(--card-background);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px var(--shadow-color);
}

.preset-section {
  margin-bottom: 24px;
}

.preset-section label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.preset-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.preset-button {
  padding: 14px 8px;
  background: var(--background-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.preset-button:hover {
  border-color: var(--background-main);
  color: var(--background-main);
}

.preset-button.active {
  background: var(--background-main);
  border-color: var(--background-main);
  color: var(--text-secondary);
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-group label i {
  color: var(--background-main);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 16px;
  padding-right: 60px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  background: var(--background-primary);
  color: var(--text-main);
  transition: all 0.3s ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--background-main);
  box-shadow: 0 0 0 3px rgba(0, 31, 63, 0.1);
}

.input-wrapper .currency {
  position: absolute;
  right: 16px;
  color: var(--text-additional);
  font-weight: 600;
}

.hint {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-additional);
}

.summary {
  background: var(--background-additional);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  color: var(--text-primary);
}

.summary-row strong {
  font-size: 16px;
}

.summary-row .new-balance {
  color: var(--background-main);
  font-size: 18px;
}

.submit-button {
  width: 100%;
  padding: 16px;
  background: var(--background-main);
  color: var(--text-secondary);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 31, 63, 0.4);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  color: var(--text-additional);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--background-main);
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 24px;
  }

  .card {
    padding: 20px;
  }

  .preset-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
