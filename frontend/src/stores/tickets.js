import { defineStore } from 'pinia';
import { addNotification } from './notifications.js';
import { apiClient } from '../api';
import { useAuthStore } from './auth';
import router from '@/router';


export const useTicketsStore = defineStore('tickets', {
  state: () => ({
    availableTickets: [],
    selectedTicket: null,
    purchaseForm: {
      ticketId: '',
      validFrom: '',
      validTo: '',
      concessionId: 0,
    },
    isLoading: false,
    error: null,
  }),

  getters: {
    canPurchase: (state) => {
      const authStore = useAuthStore();
      if (!state.selectedTicket || !authStore.user) return false;

      const formValid = state.purchaseForm.ticketId
        && state.purchaseForm.validFrom
        && state.purchaseForm.validTo;

      const sufficientBalance = authStore.user.balance >= state.selectedTicket.price;

      return formValid && sufficientBalance;
    },

    formattedTicketPrice: (state) => {
      if (!state.selectedTicket) return '0.00 PLN';
      const pln = (state.selectedTicket.price / 100).toFixed(2);
      return `${pln} PLN`;
    },

    purchaseDuration() {
      const { validFrom, validTo } = this.purchaseForm;
      if (!validFrom || !validTo) return 0;

      const from = new Date(validFrom);
      const to = new Date(validTo);
      const diffMs = to - from;

      if (diffMs < 0) return 0;

      // Calculate days
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return days;
    },
  },

  actions: {
    // Fetch all available tickets
    async fetchTickets() {
      this.isLoading = true;
      this.error = null;

      try {
        const res = await apiClient.tickets.getApiTickets();

        if (res.data) {
          this.availableTickets = res.data;
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Błąd pobierania biletów';
        this.error = message;
        addNotification('error', message);
      } finally {
        this.isLoading = false;
      }
    },

    // Select ticket for purchase
    selectTicket(ticketId) {
      const ticket = this.availableTickets.find(t => t.id === ticketId);
      if (ticket) {
        this.selectedTicket = ticket;
        this.purchaseForm.ticketId = ticketId;

        // Initialize dates to now and +1 day
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        this.purchaseForm.validFrom = now.toISOString().slice(0, 16);
        this.purchaseForm.validTo = tomorrow.toISOString().slice(0, 16);
      }
    },

    // Clear selection
    clearSelection() {
      this.selectedTicket = null;
      this.purchaseForm = {
        ticketId: '',
        validFrom: '',
        validTo: '',
        concessionId: 0,
      };
      this.error = null;
    },

    // Update purchase form field
    updatePurchaseForm(field, value) {
      if (field in this.purchaseForm) {
        this.purchaseForm[field] = value;
      }
    },

    // Validate purchase form
    validatePurchaseForm() {
      if (!this.purchaseForm.ticketId) {
        return false;
      }

      if (!this.purchaseForm.validFrom || !this.purchaseForm.validTo) {
        return false;
      }

      const from = new Date(this.purchaseForm.validFrom);
      const to = new Date(this.purchaseForm.validTo);
      const now = new Date();

      // Check if validFrom is not in the past
      if (from < now) {
        this.error = 'Data rozpoczęcia nie może być w przeszłości';
        return false;
      }

      // Check if validTo is after validFrom
      if (to <= from) {
        this.error = 'Data zakończenia musi być późniejsza niż data rozpoczęcia';
        return false;
      }

      return true;
    },

    // Calculate duration
    calculateDuration() {
      return this.purchaseDuration;
    },

    // Check if user has sufficient balance
    checkSufficientBalance(ticketPrice) {
      const authStore = useAuthStore();
      if (!authStore.user) return false;
      return authStore.user.balance >= ticketPrice;
    },

    // Purchase ticket
    async purchaseTicket() {
      this.isLoading = true;
      this.error = null;

      try {
        // Validate form
        if (!this.validatePurchaseForm()) {
          throw new Error(this.error || 'Uzupełnij wszystkie pola');
        }

        // Check balance
        if (!this.checkSufficientBalance(this.selectedTicket.price)) {
          throw new Error('Niewystarczające saldo');
        }

        // Call API
        await apiClient.tickets.postApiTicketsPurchase({
          requestBody: {
            ticketId: this.purchaseForm.ticketId,
            validFrom: this.purchaseForm.validFrom,
            validTo: this.purchaseForm.validTo,
            concessionId: this.purchaseForm.concessionId,
          },
        });

        // Update user balance
        const authStore = useAuthStore();
        await authStore.fetchCurrentUser();

        // Success notification
        addNotification('success', 'Bilet zakupiony pomyślnie!');

        // Clear form
        this.clearSelection();

        // Navigate to orders
        router.push('/orders');

      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Błąd zakupu biletu';
        this.error = message;
        addNotification('error', message);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
