<script setup>
import API from '@/api/api.js';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { addNotification } from '@/stores/notifications.js';

const router = useRouter();

const username = ref('');
const password = ref('');
const login = ref('');
const email = ref('');
const error = ref('');

const currentForm = ref(1);

const postLogin = async () => {
  try {
    const res = await API.post('/api/user/login', {
      login: login.value,
      password: password.value,
    });

    if (!res.data?.success) {
      error.value = res.data?.message || 'Błąd logowania';
      return;
    }

    localStorage.setItem('token', res.data.token);
    addNotification('success', 'Pomyślnie zalogowano!');
    router.push('/user/select-country');
  } catch (err) {
    error.value = err.response?.data?.message || 'Błąd Serwera';
  }
};

const postRegister = async () => {
  try {
    const res = await API.post('/api/user/register', {
      username: username.value,
      login: login.value,
      email: email.value,
      password: password.value,
    });

    if (!res.data?.success) {
      error.value = res.data?.message || 'Błąd rejestracji';
      return;
    }

    localStorage.setItem('token', res.data.token);
    addNotification('success', 'Pomyślnie zarejestrowano!');
    router.push('/user/select-country');
  } catch (err) {
    error.value = err.response?.data?.message || 'Błąd Serwera';
  }
};

const changeForm = () => {
  currentForm.value = currentForm.value === 1 ? 2 : 1;
};
</script>

<template>
  <main>
    <div class="login-form" id="loginForm">
      <h1>Logowanie</h1>
      <form v-if="currentForm === 1" @submit.prevent="postLogin" novalidate>
        <div class="form-group">
          <i class="fa-solid fa-user"></i>
          <input type="text" v-model="login" placeholder="Login" required autocomplete="login" />
        </div>
        <div class="form-group">
          <i class="fa-solid fa-lock"></i>
          <input type="password" v-model="password" placeholder="Hasło" required autocomplete="current-password" />
        </div>
        <div class="error-message" v-if="error">{{ error }}</div>
        <button type="submit" class="auth-button">
          <i class="fa-solid fa-right-to-bracket"></i>
          Zaloguj
        </button>
        <span class="register-text">Nie masz Konta? <a @click="changeForm">Zarejestruj</a></span>
      </form>
      <form v-if="currentForm === 2" @submit.prevent="postRegister" novalidate>
        <div class="form-group">
          <i class="fa-solid fa-user"></i>
          <input type="text" v-model="username" placeholder="Username" required autocomplete="username" />
        </div>
        <div class="form-group">
          <i class="fa-solid fa-user-secret"></i>
          <input type="text" v-model="login" placeholder="Login" required autocomplete="login" />
        </div>
        <div class="form-group">
          <i class="fa-solid fa-envelope"></i>
          <input type="email" v-model="email" placeholder="Email" required autocomplete="email" />
        </div>
        <div class="form-group">
          <i class="fa-solid fa-lock"></i>
          <input type="password" v-model="password" placeholder="Hasło" required autocomplete="current-password" />
        </div>
        <div class="error-message" v-if="error">{{ error }}</div>
        <button type="submit" class="auth-button">
          <i class="fa-solid fa-right-to-bracket"></i>
          Zarejestruj się
        </button>
        <span class="register-text">Masz konto? <a @click="changeForm">Zaloguj się</a></span>
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

.login-form {
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

.register-text {
  color: var(--text-primary);
  font-size: 1em;
}

.register-text>a {
  color: #001f3f;
  font-weight: 600;
  cursor: pointer;
  margin-left: 5px;
  transition: scale 0.3s ease;
}

.register-text>a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .login-form {
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
