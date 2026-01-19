<script setup>
import { ref, onMounted } from 'vue';
import { apiClient } from '@/api';
import { addNotification } from '@/stores/notifications';

const orders = ref([]);
const isLoading = ref(true);
const refundingTickets = ref(new Set());
const pagination = ref({
  total: 0,
  page: 1,
  pageSize: 20,
  hasNext: false,
  hasPrev: false,
});
const currentOffset = ref(0);

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

const formatPrice = (priceInGrosze) => {
  if (priceInGrosze === null || priceInGrosze === undefined) return 'Bezpłatny';
  return `${(priceInGrosze / 100).toFixed(2)} PLN`;
};

const fetchOrders = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.tickets.getApiTicketsOrdersHistory({
      limit: pagination.value.pageSize,
      offset: currentOffset.value,
    });
    orders.value = response.data || [];
    pagination.value = response.pagination || pagination.value;
  } catch (err) {
    console.error('Error fetching orders:', err);
    addNotification('Nie udało się pobrać historii zamówień', 'error');
    orders.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleRefund = async (order) => {
  if (!order.isRefundable) return;

  const confirmMessage = `Czy na pewno chcesz zwrócić bilet "${order.ticketName}"?\n\nZwrot: ${formatPrice(order.refundablePrice)}`;

  if (!confirm(confirmMessage)) {
    return;
  }

  refundingTickets.value.add(order.id);

  try {
    await apiClient.tickets.postApiTicketsReturn({ ticketOrderId: order.id })
    addNotification('Zwrot biletu został zainicjowany pomyślnie', 'success');

    // Refresh the orders list to reflect the change
    await fetchOrders();
  } catch (err) {
    console.error('Error refunding ticket:', err);
    const errorMessage = err.response?.data?.message || 'Nie udało się zwrócić biletu';
    addNotification(errorMessage, 'error');
  } finally {
    refundingTickets.value.delete(order.id);
  }
};

const nextPage = () => {
  if (pagination.value.hasNext) {
    currentOffset.value += pagination.value.pageSize;
    fetchOrders();
  }
};

const prevPage = () => {
  if (pagination.value.hasPrev) {
    currentOffset.value = Math.max(0, currentOffset.value - pagination.value.pageSize);
    fetchOrders();
  }
};

const isActive = (order) => {
  const now = new Date();
  const validTo = new Date(order.validTo);
  return validTo > now;
};

onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="page-header">
        <h1>Historia zamówień</h1>
        <p class="subtitle">Twoje zakupione bilety</p>
      </div>

      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Ładowanie...</p>
      </div>

      <div v-else-if="orders.length === 0" class="empty-state">
        <i class="fa-solid fa-ticket"></i>
        <p>Brak zamówień</p>
        <router-link to="/tickets" class="action-button primary">
          Kup pierwszy bilet
        </router-link>
      </div>

      <div v-else class="orders-list">
        <div
          v-for="order in orders"
          :key="`${order.ticketId}-${order.orderedAt}`"
          class="order-card"
          :class="{ active: isActive(order) }"
        >
          <div class="order-header">
            <span class="ticket-name">{{ order.ticketName || 'Bilet' }}</span>
            <span
              class="status-badge"
              :class="{
                refunded: order.isRefunded,
                active: !order.isRefunded && isActive(order),
                expired: !order.isRefunded && !isActive(order),
              }"
            >
              {{ order.isRefunded ? 'Zwrócony' : isActive(order) ? 'Aktywny' : 'Wygasły' }}
            </span>
          </div>

          <div class="order-details">
            <div class="detail-row">
              <span class="label">
                <i class="fa-solid fa-calendar"></i>
                Data zakupu
              </span>
              <span class="value">{{ formatDate(order.orderedAt) }}</span>
            </div>

            <div class="detail-row">
              <span class="label">
                <i class="fa-solid fa-clock"></i>
                Ważny od
              </span>
              <span class="value">{{ formatDate(order.validFrom) }}</span>
            </div>

            <div class="detail-row">
              <span class="label">
                <i class="fa-solid fa-clock"></i>
                Ważny do
              </span>
              <span class="value">{{ formatDate(order.validTo) }}</span>
            </div>

            <div class="detail-row highlight">
              <span class="label">
                <i class="fa-solid fa-money-bill"></i>
                Cena
              </span>
              <span class="value price">{{ formatPrice(order.price) }}</span>
            </div>

            <div v-if="order.isRefundable" class="refund-section">
              <div class="refund-info">
                <i class="fa-solid fa-info-circle"></i>
                <div class="refund-details">
                  <span class="refund-label">Możliwy zwrot</span>
                  <span class="refund-amount">{{ formatPrice(order.refundablePrice) }}</span>
                  <span class="refund-percent"
                    >({{ order.elapsedPercentage?.toFixed(1) || 0 }}% wykorzystane)</span
                  >
                </div>
              </div>
              <button
                @click="handleRefund(order)"
                :disabled="refundingTickets.has(order.id)"
                class="refund-button"
              >
                <i
                  class="fa-solid"
                  :class="refundingTickets.has(order.id) ? 'fa-spinner fa-spin' : 'fa-rotate-left'"
                ></i>
                {{ refundingTickets.has(order.id) ? 'Zwracanie...' : 'Zwróć bilet' }}
              </button>
            </div>
          </div>
        </div>

        <div class="pagination" v-if="pagination.total > pagination.pageSize">
          <button
            @click="prevPage"
            :disabled="!pagination.hasPrev"
            class="pagination-button"
          >
            <i class="fa-solid fa-chevron-left"></i>
            Poprzednia
          </button>
          <span class="page-info">
            Strona {{ pagination.page }} z {{ Math.ceil(pagination.total / pagination.pageSize) }}
          </span>
          <button
            @click="nextPage"
            :disabled="!pagination.hasNext"
            class="pagination-button"
          >
            Następna
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
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

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: var(--card-background);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px var(--shadow-color);
  border-left: 4px solid var(--text-additional);
  transition: all 0.3s ease;
}

.order-card.active {
  border-left-color: var(--background-main);
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-color);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.ticket-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.status-badge.expired {
  background: rgba(156, 163, 175, 0.15);
  color: #9ca3af;
}

.status-badge.refunded {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-row.highlight {
  background: var(--background-additional);
  margin: 8px -12px -12px;
  padding: 12px;
  border-radius: 0 0 12px 12px;
}

.label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-additional);
  font-size: 14px;
}

.label i {
  width: 16px;
  text-align: center;
  color: var(--background-main);
}

.value {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.value.price {
  color: var(--background-main);
  font-size: 16px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.pagination-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-background);
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-button:hover:not(:disabled) {
  border-color: var(--background-main);
  color: var(--background-main);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: var(--text-additional);
  font-size: 14px;
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

.refund-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.refund-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: rgba(34, 197, 94, 0.05);
  border-radius: 8px;
  border-left: 3px solid #22c55e;
}

.refund-info i {
  color: #22c55e;
  font-size: 18px;
  margin-top: 2px;
}

.refund-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.refund-label {
  font-size: 13px;
  color: var(--text-additional);
  font-weight: 500;
}

.refund-amount {
  font-size: 18px;
  font-weight: 700;
  color: #22c55e;
}

.refund-percent {
  font-size: 12px;
  color: var(--text-additional);
}

.refund-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: 2px solid #ef4444;
  border-radius: 8px;
  background: transparent;
  color: #ef4444;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refund-button:hover:not(:disabled) {
  background: #ef4444;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.refund-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refund-button i {
  font-size: 14px;
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 24px;
  }

  .order-card {
    padding: 16px;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .pagination {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
