import { defineStore } from 'pinia';
import { addNotification } from './notifications.js';
import { apiClient } from '../api';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,

    userFullName: (state) => {
      if (!state.user) return '';
      return `${state.user.firstName} ${state.user.lastName}`;
    },

    formattedBalance: (state) => {
      if (!state.user || state.user.balance === undefined) return '0.00 PLN';
      const pln = (state.user.balance / 100).toFixed(2);
      return `${pln} PLN`;
    },

    maskedPesel: (state) => {
      if (!state.user || !state.user.pesel) return '';
      const pesel = state.user.pesel;
      if (pesel.length !== 11) return pesel;
      return `***${pesel.substring(3, 8)}**`;
    },
  },

  actions: {
    initializeAuth() {
      this.initialized = true;
      if (this.token) {
        this.fetchCurrentUser();
      }
    },

    validatePesel(pesel) {
      if (!pesel || typeof pesel !== 'string') {
        return false;
      }
      return /^\d{11}$/.test(pesel);
    },

    handleAuthError(error) {
      const message = error.response?.data?.message || error.message || 'Wystąpił błąd';
      this.error = message;
      addNotification('error', message);
      return message;
    },

    async login(email, password) {
      this.isLoading = true;
      this.error = null;

      try {

        if (!password) {
          throw new Error('Hasło jest wymagane');
        }

        // Call API
        const res = await apiClient.auth.postApiAuthLogin({
          requestBody: {
            email,
            password,
          },
        });

        if (!res.data?.token) {
          throw new Error('Błąd logowania - brak tokenu');
        }

        this.token = res.data.token;
        localStorage.setItem('token', this.token);

        await this.fetchCurrentUser();

        addNotification('success', 'Pomyślnie zalogowano!');

        const redirectPath = router.currentRoute.value.query.redirect || '/tickets';
        router.push(redirectPath);

      } catch (err) {
        this.handleAuthError(err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async register(email, pesel, password, firstName, lastName) {
      console.log(email, pesel, password, firstName, lastName)
      this.isLoading = true;
      this.error = null;

      try {
        if (!this.validatePesel(pesel)) {
          throw new Error('PESEL musi składać się z 11 cyfr');
        }

        if (!password || password.length < 6) {
          throw new Error('Hasło musi mieć co najmniej 6 znaków');
        }

        if (!firstName || !lastName) {
          throw new Error('Imię i nazwisko są wymagane');
        }

        const res = await apiClient.auth.postApiAuthRegister({
          requestBody: {
            email,
            pesel,
            password,
            firstName,
            lastName,
          },
        });

        if (!res.data?.token) {
          throw new Error('Błąd rejestracji - brak tokenu');
        }

        this.token = res.data.token;
        localStorage.setItem('token', this.token);

        await this.fetchCurrentUser();

        addNotification('success', 'Pomyślnie zarejestrowano!');

        router.push('/tickets');

      } catch (err) {
        this.handleAuthError(err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCurrentUser() {
      if (!this.token) return;

      try {
        const res = await apiClient.auth.getApiAuthMe();

        if (res.data) {
          this.user = res.data;
        }
      } catch (err) {
        if (err.response?.status === 401) {
          this.logout(false); // Don't show notification
        } else {
          console.error('Failed to fetch user:', err);
        }
      }
    },

    logout(showNotification = true) {
      this.user = null;
      this.token = null;
      this.error = null;
      localStorage.removeItem('token');

      if (showNotification) {
        addNotification('success', 'Wylogowano pomyślnie');
      }

      router.push('/');
    },

    updateBalance(newBalance) {
      if (this.user) {
        this.user.balance = newBalance;
      }
    },
  },
});
