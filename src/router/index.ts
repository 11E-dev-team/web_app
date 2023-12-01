import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
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
    path: '/home',
    name: 'home',
    component: () => import('../views/HomePageView.vue')
  },
  {
    path: '/conference/:id',
    name: 'conference',
    component: () => import('../views/conference/ConferenceView.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/hello',
    name: 'hello',
    component: () => import('../views/HomeView.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
