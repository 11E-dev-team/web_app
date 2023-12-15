import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: () => import('../views/WelcomePageView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegistrationPageView.vue')
  },
  {
    path: '/log_in',
    name: 'log_in',
    component: () => import('../views/LogInPageView.vue')
  },
  {
    path: '/conference/:id',
    name: 'conference',
    component: () => import('../views/ConferenceView.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
