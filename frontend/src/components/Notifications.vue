<script setup>
import { notifications, removeNotification } from '@/stores/notifications.js';
import Notification from '@/components/Notification.vue';
</script>

<template>
  <div class="notifications">
    <TransitionGroup name="notification-list">
      <Notification v-for="notification in notifications" :key="notification.id" :title="notification.title"
        :type="notification.type" :class="{ closing: notification.closing }"
        @close="removeNotification(notification.id)" />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notifications {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 24px;
  right: 24px;
  width: min(360px, calc(100% - 48px));
  z-index: 1000;
  pointer-events: none;
  gap: 8px;
}

.notifications>* {
  pointer-events: auto;
}

.notification-list-move,
.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 0.3s ease;
}

.notification-list-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-list-leave-active {
  position: absolute;
}

@media (max-width: 768px) {
  .notifications {
    top: auto;
    bottom: 24px;
    right: 16px;
    left: 16px;
    width: auto;
  }

  .notification-list-enter-from {
    transform: translateY(100%);
  }

  .notification-list-leave-to {
    transform: translateY(100%);
  }
}
</style>
