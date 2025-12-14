<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  type: {
    type: String,
    default: 'primary',
  },
});

const emit = defineEmits(['close']);

const types = {
  success: {
    color: '#065F46',
    border: '#10B981',
    background: '#D1FAE5',
    icon: 'fa-solid fa-check',
  },
  error: {
    color: '#DC2626',
    border: '#EF4444',
    background: '#FEE2E2',
    icon: 'fa-solid fa-circle-exclamation',
  },
  warning: {
    color: '#D97706',
    border: '#F59E0B',
    background: '#FEF3C7',
    icon: 'fa-solid fa-triangle-exclamation',
  },
  info: {
    color: '#1D4ED8',
    border: '#3B82F6',
    background: '#C7D2FE',
    icon: 'fa-solid fa-circle-info',
  },
  primary: {
    color: '#1D4ED8',
    border: '#3B82F6',
    background: '#C7D2FE',
    icon: 'fa-solid fa-circle-info',
  },
};

const notificationStyle = computed(() => {
  const type = types[props.type] || types.info;
  return {
    color: type.color,
    backgroundColor: type.background,
    borderLeft: `4px solid ${type.border}`,
  };
});

const notificationIcon = computed(() => {
  const type = types[props.type] || types.info;
  return type.icon;
});

const closeNotification = () => {
  emit('close');
};
</script>

<template>
  <div class="notification" :style="notificationStyle">
    <div class="content">
      <i :class="[notificationIcon, 'notification-icon']"></i>
      <h4>{{ title }}</h4>
    </div>
    <button class="close-button" @click="closeNotification">
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
</template>

<style scoped>
.notification {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease forwards;
  backdrop-filter: blur(8px);
  gap: 12px;
}

.content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-grow: 1;
  min-width: 0;
}

.notification-icon {
  font-size: 18px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

.close-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  opacity: 0.6;
  flex-shrink: 0;
}

.close-button:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05);
}

.close-button i {
  font-size: 16px;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.notification.closing {
  animation: slideOut 0.3s ease forwards;
}

@media (max-width: 768px) {
  .notification {
    padding: 12px;
  }

  .content {
    gap: 8px;
  }

  .notification-icon {
    font-size: 16px;
    width: 20px;
    height: 20px;
  }

  .notification h4 {
    font-size: 13px;
  }

  .close-button {
    padding: 6px;
  }

  .close-button i {
    font-size: 14px;
  }

  @keyframes slideIn {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(100%);
      opacity: 0;
    }
  }
}
</style>
