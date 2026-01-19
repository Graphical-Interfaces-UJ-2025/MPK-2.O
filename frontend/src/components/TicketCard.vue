<script setup>
const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['select']);

const formatPrice = (grosze) => {
  return (grosze / 100).toFixed(2);
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

const handleSelect = () => {
  emit('select', props.ticket.id);
};
</script>

<template>
  <div class="ticket-card" :class="{ selected }">
    <div class="ticket-header">
      <h3 class="ticket-name">{{ ticket.name }}</h3>
      <i v-if="selected" class="fa-solid fa-check-circle selected-icon"></i>
    </div>
    <div class="ticket-price">
      <span class="price-amount">{{ formatPrice(ticket.price) }}</span>
      <span class="price-currency">PLN</span>
    </div>
    <div v-if="ticket.validTime" class="ticket-duration">
      <i class="fa-solid fa-clock"></i>
      <span>Ważność: {{ formatDuration(ticket.validTime) }}</span>
    </div>
    <button @click="handleSelect" class="select-button" :class="{ selected }">
      <i class="fa-solid" :class="selected ? 'fa-check' : 'fa-arrow-right'"></i>
      {{ selected ? 'Wybrano' : 'Wybierz' }}
    </button>
  </div>
</template>

<style scoped>
.ticket-card {
  background: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ticket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px var(--shadow-color);
  border-color: var(--background-main);
}

.ticket-card.selected {
  border-color: var(--background-main);
  background: var(--background-additional);
  box-shadow: 0 4px 12px rgba(0, 31, 63, 0.2);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.ticket-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.selected-icon {
  font-size: 20px;
  color: var(--background-main);
}

.ticket-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin: 8px 0;
}

.price-amount {
  font-size: 28px;
  font-weight: 700;
  color: var(--background-main);
}

.price-currency {
  font-size: 14px;
  color: var(--text-additional);
  font-weight: 600;
}

.ticket-duration {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--background-primary);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 500;
}

.ticket-duration i {
  color: var(--background-main);
  font-size: 14px;
}

.select-button {
  width: 100%;
  padding: 12px;
  background: var(--background-main);
  color: var(--text-secondary);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.select-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 31, 63, 0.3);
}

.select-button.selected {
  background: #28a745;
}

.select-button i {
  font-size: 14px;
}
</style>
