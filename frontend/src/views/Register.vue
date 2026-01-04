<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const email = ref('');
const pesel = ref('');
const password = ref('');
const firstName = ref('');
const lastName = ref('');

const postRegister = async () => {
  await authStore.register(email.value, pesel.value, password.value, firstName.value, lastName.value);
};
</script>

<template>
  <main>
    <div class="register-form">
      <h1>Rejestracja</h1>
      <form @submit.prevent="postRegister" novalidate>
        <div class="form-group">
          <i class="fa-solid fa-id-card"></i>
          <input type="email" v-model="email" placeholder="email" required autocomplete="off" />
        </div>
        <div class="form-group">
          <i class="fa-solid fa-id-card"></i>
          <input type="text" v-model="pesel" placeholder="PESEL" required autocomplete="off" />
        </div>
        <div class="form-group">
          <i class="fa-solid fa-user"></i>
          <input type="text" v-model="firstName" placeholder="Imię" required autocomplete="given-name" />
        </div>
        <div class="form-group">
          <i class="fa-solid fa-user"></i>
          <input type="text" v-model="lastName" placeholder="Nazwisko" required autocomplete="family-name" />
        </div>
        <div class="form-group">
          <i class="fa-solid fa-lock"></i>
          <input type="password" v-model="password" placeholder="Hasło" required autocomplete="new-password" />
        </div>
        <div class="error-message" v-if="authStore.error">{{ authStore.error }}</div>
        <button type="submit" class="auth-button" :disabled="authStore.isLoading">
          <i v-if="!authStore.isLoading" class="fa-solid fa-user-plus"></i>
          <i v-else class="fa-solid fa-spinner fa-spin"></i>
          {{ authStore.isLoading ? 'Rejestracja...' : 'Zarejestruj się' }}
        </button>
        <span class="login-text">Masz konto? <router-link to="/login">Zaloguj się</router-link></span>
      </form>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
}

.register-form {
  width: 100%;
  max-width: 450px;
  margin: 20px;
  padding: 40px;
  background: var(--background-secondary);
  border-radius: 20px;
  box-shadow: 0 10px 30px var(--shadow-color);
  text-align: center;
}

h1 {
  color: var(--text-primary);
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 30px;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.form-group i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-primary);
  font-size: 1.2em;
}

.form-group input {
  width: 100%;
  padding: 15px 15px 15px 45px;
  color: var(--text-main);
  border: 2px solid var(--border-color);
  background-color: var(--background-tertiary);
  border-radius: 10px;
  font-size: 1em;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:valid {
  background: var(--input-valid-background);
}

.form-group input:focus {
  border-color: var(--text-main);
  outline: none;
  box-shadow: 0 0 0 3px var(--shadow-color);
}

.auth-button {
  width: 100%;
  padding: 15px;
  background: #001f3f;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.auth-button:hover {
  background: #003366;
  transform: translateY(-2px);
}

.error-message {
  color: #dc3545;
  font-size: 1.2em;
  font-weight: 600;
  margin: 10px 0;
  min-height: 20px;
}

.login-text {
  color: var(--text-primary);
  font-size: 1em;
}

.login-text a {
  color: #001f3f;
  font-weight: 600;
  cursor: pointer;
  margin-left: 5px;
  transition: scale 0.3s ease;
  text-decoration: none;
}

.login-text a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .register-form {
    padding: 20px;
  }

  h1 {
    font-size: 2em;
  }

  .form-group input {
    padding: 12px 12px 12px 40px;
  }

  .auth-button {
    padding: 12px;
  }
}
</style>
