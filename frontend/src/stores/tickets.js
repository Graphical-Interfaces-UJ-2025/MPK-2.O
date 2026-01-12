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
    },
    isLoading: false,
    error: null,
  }),

  getters: {
    canPurchase: (state) => {
      const authStore = useAuthStore();
      if (!state.selectedTicket || !authStore.user) return false;

      const formValid = state.purchaseForm.ticketId && state.purchaseForm.validFrom;
      const sufficientBalance = authStore.user.balance >= state.selectedTicket.price;

      return formValid && sufficientBalance;
    },

    formattedTicketPrice: (state) => {
      if (!state.selectedTicket) return '0.00 PLN';
      const pln = (state.selectedTicket.price / 100).toFixed(2);
      return `${pln} PLN`;
    },

    // Monthly ticket - always 30 days
    purchaseDuration: () => 30,

    // Calculate validTo date (30 days from validFrom)
    calculatedValidTo: (state) => {
      if (!state.purchaseForm.validFrom) return '';
      const from = new Date(state.purchaseForm.validFrom);
      const to = new Date(from.getTime() + 30 * 24 * 60 * 60 * 1000);
      return to.toISOString().slice(0, 10);
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

        // Initialize validFrom to today
        const today = new Date();
        this.purchaseForm.validFrom = today.toISOString().slice(0, 10);
      }
    },

    // Clear selection
    clearSelection() {
      this.selectedTicket = null;
      this.purchaseForm = {
        ticketId: '',
        validFrom: '',
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

      if (!this.purchaseForm.validFrom) {
        return false;
      }

      const from = new Date(this.purchaseForm.validFrom);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if validFrom is not in the past
      if (from < today) {
        this.error = 'Data rozpoczęcia nie może być w przeszłości';
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

        // Call API with calculated validTo (30 days from validFrom)
        await apiClient.tickets.postApiTicketsPurchase({
          requestBody: {
            ticketId: this.purchaseForm.ticketId,
            validFrom: this.purchaseForm.validFrom,
            validTo: this.calculatedValidTo,
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
