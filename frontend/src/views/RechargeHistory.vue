<script setup>
import { ref, onMounted, computed } from 'vue';
import { addNotification } from '@/stores/notifications';

const transactions = ref([]);
const isLoading = ref(true);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatAmount = (amount) => {
  if (amount === null || amount === undefined) return '-';
  return `${(Number(amount) / 100).toFixed(2)} PLN`;
};

const getTypeLabel = (type) => {
  const labels = {
    RECHARGE: 'Doładowanie',
    TICKET_PURCHASE: 'Zakup biletu',
    TICKET_REFUND: 'Zwrot biletu',
  };
  return labels[type] || type;
};

const getStatusLabel = (status) => {
  const labels = {
    PENDING: 'Oczekuje',
    COMPLETED: 'Zakończona',
    FAILED: 'Nieudana',
  };
  return labels[status] || status;
};

const getTypeIcon = (type) => {
  const icons = {
    RECHARGE: 'fa-plus-circle',
    TICKET_PURCHASE: 'fa-ticket',
    TICKET_REFUND: 'fa-rotate-left',
  };
  return icons[type] || 'fa-circle';
};

const isPositive = (type) => {
  return type === 'RECHARGE' || type === 'TICKET_REFUND';
};

const fetchTransactions = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/transactions/history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    const data = await response.json();
    transactions.value = data.data || [];
  } catch (err) {
    console.error('Error fetching transactions:', err);
    addNotification('Nie udało się pobrać historii transakcji', 'error');
    transactions.value = [];
  } finally {
    isLoading.value = false;
  }
};

const rechargeAndRefundTransactions = computed(() => {
  return transactions.value.filter((t) => t.type === 'RECHARGE' || t.type === 'TICKET_REFUND');
});

onMounted(() => {
  fetchTransactions();
});
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="page-header">
        <h1>Historia doładowań i zwrotów</h1>
        <p class="subtitle">Twoje doładowania konta i zwroty biletów</p>
      </div>

      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Ładowanie...</p>
      </div>

      <div v-else-if="rechargeAndRefundTransactions.length === 0" class="empty-state">
        <i class="fa-solid fa-wallet"></i>
        <p>Brak transakcji</p>
        <router-link to="/recharge" class="action-button primary">
          Doładuj konto
        </router-link>
      </div>

      <div v-else class="transactions-list">
        <div
          v-for="transaction in rechargeAndRefundTransactions"
          :key="transaction.id"
          class="transaction-card"
          :class="transaction.status.toLowerCase()"
        >
          <div class="transaction-icon" :class="{ positive: isPositive(transaction.type) }">
            <i :class="`fa-solid ${getTypeIcon(transaction.type)}`"></i>
          </div>

          <div class="transaction-content">
            <div class="transaction-header">
              <span class="transaction-type">{{ getTypeLabel(transaction.type) }}</span>
              <span class="transaction-amount" :class="{ positive: isPositive(transaction.type) }">
                {{ isPositive(transaction.type) ? '+' : '-' }}{{ formatAmount(transaction.amount) }}
              </span>
            </div>

            <div class="transaction-meta">
              <span class="transaction-date">
                <i class="fa-solid fa-calendar"></i>
                {{ formatDate(transaction.createdAt) }}
              </span>
              <span class="transaction-status" :class="transaction.status.toLowerCase()">
                {{ getStatusLabel(transaction.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions" v-if="!isLoading">
        <router-link to="/recharge" class="action-button primary">
          <i class="fa-solid fa-plus"></i>
          Nowe doładowanie
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
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.subtitle {
  color: var(--text-additional);
  font-size: 16px;
  margin: 0;
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
  color: var(--background-main);
}

.loading-state p,
.empty-state p {
  font-size: 18px;
  margin-bottom: 24px;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.transaction-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--card-background);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: all 0.3s ease;
}

.transaction-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.transaction-card.failed {
  opacity: 0.7;
}

.transaction-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-additional);
  color: var(--text-additional);
  font-size: 20px;
  flex-shrink: 0;
}

.transaction-icon.positive {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.transaction-content {
  flex: 1;
  min-width: 0;
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.transaction-type {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.transaction-amount {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-additional);
}

.transaction-amount.positive {
  color: #22c55e;
}

.transaction-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transaction-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-additional);
}

.transaction-date i {
  font-size: 12px;
}

.transaction-status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.transaction-status.completed {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.transaction-status.pending {
  background: rgba(234, 179, 8, 0.15);
  color: #eab308;
}

.transaction-status.failed {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.actions {
  display: flex;
  justify-content: center;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
}

.action-button.primary {
  background: var(--background-main);
  color: var(--text-secondary);
}

.action-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 31, 63, 0.4);
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 24px;
  }

  .transaction-card {
    padding: 16px;
  }

  .transaction-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .transaction-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .transaction-amount {
    font-size: 16px;
  }

  .transaction-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
