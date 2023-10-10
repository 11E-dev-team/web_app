import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
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
    path: '/teacher',
    name: 'teacher',
    component: () => import('../views/TeacherView.vue'),
    children: [
      {
        path: '/teacher',
        name: 'teacher_home',
        component: () => import('../views/teacher/HomePageView.vue')
      }
    ]
  },
  {
    path: '/student',
    name: 'student',
    component: () => import('../views/StudentView.vue'),
    children: [
      {
        path: '/student',
        name: 'student_home',
        component: () => import('../views/student/HomePageView.vue')
      }
    ]
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
