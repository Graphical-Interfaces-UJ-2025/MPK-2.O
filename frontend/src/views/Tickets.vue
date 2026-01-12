<script setup>
import { onMounted } from 'vue';
import { useTicketsStore } from '@/stores/tickets';
import { useAuthStore } from '@/stores/auth';
import TicketCard from '@/components/TicketCard.vue';

const ticketsStore = useTicketsStore();
const authStore = useAuthStore();

onMounted(() => {
  ticketsStore.fetchTickets();
});

const handleSelectTicket = (ticketId) => {
  ticketsStore.selectTicket(ticketId);
};

const handlePurchase = async () => {
  await ticketsStore.purchaseTicket();
};
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <!-- Header with balance -->
      <div class="page-header">
        <h1>Kup bilet</h1>
        <div v-if="authStore.isAuthenticated" class="balance-badge">
          <i class="fa-solid fa-wallet"></i>
          <span>{{ authStore.formattedBalance }}</span>
        </div>
      </div>

      <!-- Available Tickets Section -->
      <section class="tickets-section">
        <h2>Dostępne bilety</h2>

        <div v-if="ticketsStore.isLoading" class="loading-state">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <p>Ładowanie biletów...</p>
        </div>

        <div v-else-if="ticketsStore.availableTickets.length === 0" class="empty-state">
          <i class="fa-solid fa-ticket"></i>
          <p>Brak dostępnych biletów</p>
        </div>

        <div v-else class="tickets-grid">
          <TicketCard
            v-for="ticket in ticketsStore.availableTickets"
            :key="ticket.id"
            :ticket="ticket"
            :selected="ticketsStore.selectedTicket?.id === ticket.id"
            @select="handleSelectTicket"
          />
        </div>
      </section>

      <!-- Purchase Form Section -->
      <section v-if="ticketsStore.selectedTicket" class="purchase-section">
        <div class="card">
          <div class="section-header">
            <h2>Szczegóły zakupu</h2>
            <button @click="ticketsStore.clearSelection()" class="clear-button">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>

          <!-- Selected Ticket Summary -->
          <div class="selected-ticket-summary">
            <div class="summary-row">
              <span>Wybrany bilet:</span>
              <strong>{{ ticketsStore.selectedTicket.name }}</strong>
            </div>
            <div class="summary-row">
              <span>Cena:</span>
              <strong>{{ ticketsStore.formattedTicketPrice }}</strong>
            </div>
          </div>

          <!-- Valid From Date -->
          <div class="form-group">
            <label>
              <i class="fa-solid fa-calendar"></i>
              Ważny od
            </label>
            <input
              type="date"
              :value="ticketsStore.purchaseForm.validFrom"
              @input="ticketsStore.updatePurchaseForm('validFrom', $event.target.value)"
            />
          </div>

          <!-- Monthly Ticket Info -->
          <!-- <div class="ticket-info">
            <i class="fa-solid fa-info-circle"></i>
            <span>Bilet miesięczny ważny przez 30 dni od daty rozpoczęcia</span>
          </div> -->

          <!-- Balance Warning -->
          <div v-if="!ticketsStore.checkSufficientBalance(ticketsStore.selectedTicket.price)" class="warning-message">
            <i class="fa-solid fa-exclamation-triangle"></i>
            <span>Niewystarczające saldo. Doładuj konto aby kupić bilet.</span>
          </div>

          <!-- Error Message -->
          <div v-if="ticketsStore.error" class="error-message">
            <i class="fa-solid fa-exclamation-circle"></i>
            <span>{{ ticketsStore.error }}</span>
          </div>

          <!-- Purchase Button -->
          <button
            @click="handlePurchase"
            class="purchase-button"
            :disabled="!ticketsStore.canPurchase || ticketsStore.isLoading"
          >
            <i v-if="!ticketsStore.isLoading" class="fa-solid fa-shopping-cart"></i>
            <i v-else class="fa-solid fa-spinner fa-spin"></i>
            {{ ticketsStore.isLoading ? 'Przetwarzanie...' : 'Kup bilet' }}
          </button>
        </div>
      </section>
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
  max-width: 1200px;
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

.tickets-section {
  margin-bottom: 40px;
}

.tickets-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-additional);
}

.loading-state i,
.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  color: var(--text-additional);
}

.loading-state i {
  color: var(--background-main);
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.purchase-section {
  margin-top: 40px;
}

.card {
  background: var(--card-background);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px var(--shadow-color);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.clear-button {
  background: none;
  border: none;
  color: var(--text-additional);
  cursor: pointer;
  font-size: 20px;
  padding: 8px;
  transition: all 0.2s ease;
}

.clear-button:hover {
  color: var(--text-primary);
  transform: scale(1.1);
}

.selected-ticket-summary {
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
  color: var(--background-main);
  font-size: 18px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.form-group label i {
  color: var(--background-main);
  font-size: 16px;
}

.form-group input[type='date'] {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  background: var(--background-primary);
  color: var(--text-main);
  transition: all 0.3s ease;
  cursor: pointer;
}

.form-group input[type='date']:hover {
  border-color: var(--background-main);
}

.form-group input[type='date']:focus {
  outline: none;
  border-color: var(--background-main);
  box-shadow: 0 0 0 3px rgba(0, 31, 63, 0.15);
}

.ticket-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: var(--background-tertiary);
  border-radius: 10px;
  margin-bottom: 20px;
  color: var(--background-main);
  font-size: 14px;
}

.ticket-info i {
  font-size: 18px;
}

.warning-message,
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.warning-message {
  background: rgba(255, 193, 7, 0.1);
  color: #ff9800;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.error-message {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.purchase-button {
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

.purchase-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 31, 63, 0.4);
}

.purchase-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 24px;
  }

  .tickets-grid {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 20px;
  }
}
</style>
