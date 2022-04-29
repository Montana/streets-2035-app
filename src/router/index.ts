import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Disclaimer from '@/pages/Disclaimer.vue';
import Home from '@/pages/Home.vue';
import Login from '@/pages/Login.vue';
import OAuth from '@/pages/OAuth.vue';
import Streets from '@/pages/Streets.vue';
import StreetTypes from '@/pages/street-type/StreetTypes.vue';

import { useAuthStore } from '@/store/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/disclaimer',
    name: 'Disclaimer',
    component: Disclaimer,
  },
  {
    path: '/streets/:id?',
    name: 'Streets',
    component: Streets,
  },
  {
    path: '/street-types/:page?',
    name: 'StreetTypes',
    component: StreetTypes,
    props: true,
  },
  {
    path: '/cross-section/:width/:designClassification/:subClassification',
    name: 'CrossSection',
    component: () => import('@/pages/CrossSection.vue'),
    props: (route) => {
      const { designClassification, subClassification } = route.params;
      const width = Array.isArray(route.params.width)
        ? route.params.width[0]
        : route.params.width;
      return {
        width: Number.parseInt(width),
        designClassification,
        subClassification,
      };
    },
  },
  {
    path: '/oauth/callback',
    name: 'OAuthCallback',
    component: OAuth,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeResolve(async (to) => {
  const store = useAuthStore();
  if (!store.isLoggedIn) {
    console.log('initializing auth store');
    await store.initialize();
  }

  if (!store.user && to.name !== 'Login' && to.name !== 'OAuthCallback') {
    return { name: 'Login' };
  }
});

export default router;
