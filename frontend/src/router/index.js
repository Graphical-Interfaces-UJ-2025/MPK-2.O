import { createRouter, createWebHistory } from 'vue-router';

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

export default router;
