<script setup>
import { onMounted, computed } from 'vue';
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

const formatDuration = (validTime) => {
  if (!validTime) return '';

  const unitLabels = {
    minutes: validTime.value === 1 ? 'minuta' : validTime.value < 5 ? 'minuty' : 'minut',
    days: validTime.value === 1 ? 'dzień' : 'dni',
    months: validTime.value === 1 ? 'miesiąc' : validTime.value < 5 ? 'miesiące' : 'miesięcy',
  };

  return `${validTime.value} ${unitLabels[validTime.unit]}`;
};

const calculateExpirationDate = computed(() => {
  if (!ticketsStore.selectedTicket?.validTime || !ticketsStore.purchaseForm.validFrom) {
    return null;
  }

  const startDate = new Date(ticketsStore.purchaseForm.validFrom);
  const { value, unit } = ticketsStore.selectedTicket.validTime;

  const expirationDate = new Date(startDate);

  switch (unit) {
    case 'minutes':
      expirationDate.setMinutes(expirationDate.getMinutes() + value);
      break;
    case 'days':
      expirationDate.setDate(expirationDate.getDate() + value);
      break;
    case 'months':
      expirationDate.setMonth(expirationDate.getMonth() + value);
      break;
  }

  return expirationDate;
});

const formattedExpirationDate = computed(() => {
  if (!calculateExpirationDate.value) return '';

  const date = calculateExpirationDate.value;
  const validTime = ticketsStore.selectedTicket?.validTime;

  // For minutes-based tickets, show date and time
  if (validTime?.unit === 'minutes') {
    return date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // For day/month-based tickets, show just the date
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
});

const handleDateChange = (event) => {
  const isoDate = event.target.value; // Native date input returns YYYY-MM-DD format
  ticketsStore.updatePurchaseForm('validFrom', isoDate);
};

const minDateISO = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

const isValidDate = computed(() => {
  if (!ticketsStore.purchaseForm.validFrom) return true; // Empty is valid (not yet filled)

  const selectedDate = new Date(ticketsStore.purchaseForm.validFrom);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return !isNaN(selectedDate.getTime()) && selectedDate >= today;
});
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
            <div v-if="ticketsStore.selectedTicket.validTime" class="summary-row">
              <span>Czas ważności:</span>
              <strong>{{ formatDuration(ticketsStore.selectedTicket.validTime) }}</strong>
            </div>
          </div>

          <!-- Valid From Date -->
          <div class="form-group">
            <label>
              <i class="fa-solid fa-calendar"></i>
              Ważny od
            </label>
            <div class="date-input-wrapper">
              <input
                type="date"
                :value="ticketsStore.purchaseForm.validFrom"
                @change="handleDateChange"
                :min="minDateISO"
                :class="{ 'invalid': !isValidDate }"
              />
            </div>
            <div v-if="!isValidDate && ticketsStore.purchaseForm.validFrom" class="validation-error">
              <i class="fa-solid fa-exclamation-circle"></i>
              <span>Data nie może być z przeszłości</span>
            </div>
          </div>

          <!-- Expiration Date Info -->
          <div v-if="formattedExpirationDate" class="expiration-info">
            <i class="fa-solid fa-calendar-check"></i>
            <div class="expiration-content">
              <span class="expiration-label">Bilet wygaśnie:</span>
              <strong class="expiration-date">{{ formattedExpirationDate }}</strong>
            </div>
          </div>

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

.date-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.date-input-wrapper input[type='date'] {
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

.date-input-wrapper input[type='date']:hover {
  border-color: var(--background-main);
}

.date-input-wrapper input[type='date']:focus {
  outline: none;
  border-color: var(--background-main);
  box-shadow: 0 0 0 3px rgba(0, 31, 63, 0.15);
}

.date-input-wrapper input[type='date'].invalid {
  border-color: #dc3545;
}

.date-input-wrapper input[type='date'].invalid:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
}

/* Style the calendar icon in date picker */
.date-input-wrapper input[type='date']::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: opacity(0.7);
  transition: filter 0.2s ease;
}

.date-input-wrapper input[type='date']::-webkit-calendar-picker-indicator:hover {
  filter: opacity(1);
}

.validation-error {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 6px;
  margin-top: 8px;
  font-size: 13px;
  color: #dc3545;
}

.validation-error i {
  font-size: 14px;
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

.expiration-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, rgba(0, 31, 63, 0.08) 0%, rgba(0, 31, 63, 0.04) 100%);
  border: 1px solid rgba(0, 31, 63, 0.15);
  border-radius: 10px;
  margin-bottom: 20px;
}

.expiration-info i {
  font-size: 20px;
  color: var(--background-main);
  flex-shrink: 0;
}

.expiration-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.expiration-label {
  font-size: 12px;
  color: var(--text-additional);
  font-weight: 500;
}

.expiration-date {
  font-size: 16px;
  color: var(--background-main);
  font-weight: 700;
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
