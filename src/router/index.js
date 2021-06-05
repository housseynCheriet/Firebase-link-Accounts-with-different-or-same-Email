

// 
import { createRouter, createWebHistory } from "vue-router";
import AuthGuard from './AuthGuard.js'
import rouutes from './rouutes'

const routerHistory = createWebHistory();

const routes = [
  {
      path: '/',
      name: 'Home',
      component: () => import("../components/User.vue"),
      beforeEnter: AuthGuard
    },
    {
      path: '/login',
      name: 'Login',
     component: () => import("../components/Login.vue"),
      beforeEnter: AuthGuard //no if off
    },
    {
      path: '/user/:uid',
      name: 'User',
    component: () => import("../components/User.vue"),
      beforeEnter: AuthGuard //no if off
    },
   {
      path: '/*',
      redirect: '/login'
   },{
      path: '/hahahaahaahaaha',
   children: rouutes
   }
  
];

const router = createRouter({
  history: routerHistory,
  routes
});

export default router;
