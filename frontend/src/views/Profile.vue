<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const getRoleLabel = (role) => {
  const labels = {
    user: 'Użytkownik',
    admin: 'Administrator',
    application_manager: 'Menedżer aplikacji',
  };
  return labels[role] || role;
};
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="page-header">
        <h1>Mój profil</h1>
      </div>

      <div class="card">
        <div class="profile-info">
          <div class="info-row">
            <span class="label">
              <i class="fa-solid fa-user"></i>
              Imię
            </span>
            <span class="value">{{ authStore.user?.firstName || '-' }}</span>
          </div>

          <div class="info-row">
            <span class="label">
              <i class="fa-solid fa-user"></i>
              Nazwisko
            </span>
            <span class="value">{{ authStore.user?.lastName || '-' }}</span>
          </div>

          <div class="info-row">
            <span class="label">
              <i class="fa-solid fa-id-card"></i>
              PESEL
            </span>
            <span class="value">{{ authStore.maskedPesel || '-' }}</span>
          </div>

          <div class="info-row highlight">
            <span class="label">
              <i class="fa-solid fa-wallet"></i>
              Saldo
            </span>
            <span class="value balance">{{ authStore.formattedBalance }}</span>
          </div>

          <div class="info-row">
            <span class="label">
              <i class="fa-solid fa-shield"></i>
              Rola
            </span>
            <span class="value">{{ getRoleLabel(authStore.user?.role) }}</span>
          </div>
        </div>

        <div class="actions">
          <router-link to="/recharge" class="action-button primary">
            <i class="fa-solid fa-plus"></i>
            Doładuj konto
          </router-link>
          <router-link to="/tickets" class="action-button secondary">
            <i class="fa-solid fa-ticket"></i>
            Kup bilet
          </router-link>
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
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.card {
  background: var(--card-background);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px var(--shadow-color);
}

.profile-info {
  margin-bottom: 32px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
}

.info-row:last-child {
  border-bottom: none;
}

.info-row.highlight {
  background: var(--background-additional);
  margin: 16px -16px;
  padding: 16px;
  border-radius: 12px;
  border-bottom: none;
}

.label {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-additional);
  font-size: 14px;
}

.label i {
  width: 20px;
  text-align: center;
  color: var(--background-main);
}

.value {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 16px;
}

.value.balance {
  color: var(--background-main);
  font-size: 20px;
}

.actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-button {
  flex: 1;
  min-width: 150px;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  border: none;
}

.action-button.primary {
  background: var(--background-main);
  color: var(--text-secondary);
}

.action-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 31, 63, 0.4);
}

.action-button.secondary {
  background: var(--background-tertiary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.action-button.secondary:hover {
  border-color: var(--background-main);
  color: var(--background-main);
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 24px;
  }

  .card {
    padding: 20px;
  }

  .actions {
    flex-direction: column;
  }

  .action-button {
    min-width: 100%;
  }
}
</style>
