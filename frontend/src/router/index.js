import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Main.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'tickets',
        name: 'Tickets',
        component: () => import('@/views/Tickets.vue'),
      },
      {
        path: 'lines',
        name: 'Lines',
        component: () => import('@/views/Lines.vue'),
      },
      {
        path: 'stops',
        name: 'Stops',
        component: () => import('@/views/Stops.vue'),
      },
      {
        path: 'travel-planner',
        name: 'TravelPlanner',
        component: () => import('@/views/TravelPlanner.vue'),
      },
      {
        path: 'interactive-map',
        name: 'InteractiveMap',
        component: () => import('@/views/InteractiveMap.vue'),
      },
      {
        path: 'trains',
        name: 'Trains',
        component: () => import('@/views/Trains.vue'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/Register.vue'),
      },
      // {
      //   path: 'profile',
      //   name: 'Profile',
      //   component: () => import('@/views/Profile.vue'),
      //   meta: { requiresAuth: true },
      // },
      // {
      //   path: 'orders',
      //   name: 'OrderHistory',
      //   component: () => import('@/views/OrderHistory.vue'),
      //   meta: { requiresAuth: true },
      // },
      // {
      //   path: 'recharge',
      //   name: 'RechargeBalance',
      //   component: () => import('@/views/RechargeBalance.vue'),
      //   meta: { requiresAuth: true },
      // },
      // {
      //   path: 'recharge-history',
      //   name: 'RechargeHistory',
      //   component: () => import('@/views/RechargeHistory.vue'),
      //   meta: { requiresAuth: true },
      // },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }
    return savedPosition || { top: 0 };
  },
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Initialize auth state from localStorage on first load
  if (!authStore.initialized) {
    authStore.initializeAuth();
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
