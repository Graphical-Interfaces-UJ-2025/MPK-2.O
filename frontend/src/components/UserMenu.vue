<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const dropdownOpen = ref(false);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const handleLogout = () => {
  authStore.logout();
  dropdownOpen.value = false;
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.user-menu');
  if (dropdown && !dropdown.contains(event.target)) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="user-menu">
    <button @click="toggleDropdown" class="user-menu-button">
      <i class="fa-solid fa-user"></i>
      <span class="user-name">{{ authStore.userFullName }}</span>
      <i class="fa-solid fa-chevron-down" :class="{ rotated: dropdownOpen }"></i>
    </button>

    <div class="dropdown" v-if="dropdownOpen">
      <div class="balance-display">
        <i class="fa-solid fa-wallet"></i>
        <div>
          <span class="balance-label">Saldo:</span>
          <strong class="balance-amount">{{ authStore.formattedBalance }}</strong>
        </div>
      </div>

      <div class="dropdown-divider"></div>

      <router-link to="/profile" class="dropdown-item" @click="dropdownOpen = false">
        <i class="fa-solid fa-user"></i>
        <span>Profil</span>
      </router-link>

      <router-link to="/orders" class="dropdown-item" @click="dropdownOpen = false">
        <i class="fa-solid fa-receipt"></i>
        <span>Historia zamówień</span>
      </router-link>

      <router-link to="/recharge" class="dropdown-item" @click="dropdownOpen = false">
        <i class="fa-solid fa-wallet"></i>
        <span>Doładuj konto</span>
      </router-link>

      <router-link to="/recharge-history" class="dropdown-item" @click="dropdownOpen = false">
        <i class="fa-solid fa-clock-rotate-left"></i>
        <span>Historia doładowań</span>
      </router-link>

      <div class="dropdown-divider"></div>

      <button @click="handleLogout" class="dropdown-item logout-button">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Wyloguj</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.user-menu {
  position: relative;
}

.user-menu-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: var(--background-main);
  color: var(--text-secondary);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-menu-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 31, 63, 0.3);
}

.user-name {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fa-chevron-down {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.fa-chevron-down.rotated {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 280px;
  background: var(--background-secondary);
  border-radius: 12px;
  box-shadow: 0 10px 30px var(--shadow-color);
  padding: 8px;
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.balance-display {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--background-additional);
  border-radius: 8px;
  margin-bottom: 4px;
}

.balance-display i {
  font-size: 20px;
  color: var(--background-main);
}

.balance-label {
  display: block;
  font-size: 12px;
  color: var(--text-additional);
  margin-bottom: 2px;
}

.balance-amount {
  display: block;
  font-size: 16px;
  color: var(--background-main);
  font-weight: 700;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background: var(--background-tertiary);
  transform: translateX(4px);
}

.dropdown-item i {
  font-size: 16px;
  width: 20px;
  text-align: center;
  color: var(--text-additional);
}

.logout-button {
  color: #dc3545;
}

.logout-button i {
  color: #dc3545;
}

.logout-button:hover {
  background: rgba(220, 53, 69, 0.1);
}

/* Mobile responsive */
@media (max-width: 480px) {
  .user-name {
    display: none;
  }

  .dropdown {
    right: -10px;
    min-width: 260px;
  }
}
</style>
