import { ref } from 'vue';

export const notifications = ref([]);
let countId = 0;

const getId = () => {
  countId++;
  return countId;
};

export const addNotification = (title, type = 'info', duration = 5000) => {
  const id = getId();
  notifications.value.push({ id, title, type });

  setTimeout(() => removeNotification(id), duration);
};

export const removeNotification = (id) => {
  const notification = notifications.value.find((n) => n.id === id);
  if (notification) {
    notification.closing = true;
    setTimeout(() => {
      notifications.value = notifications.value.filter((n) => n.id !== id);
    }, 300);
  }
};
