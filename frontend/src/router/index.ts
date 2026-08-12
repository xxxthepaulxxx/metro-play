import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../views/Module1Home.vue"),
    },
    {
      path: "/game-a",
      component: () => import("../views/GameA.vue"),
    },
    {
      path: "/game-b",
      component: () => import("../views/GameB.vue"),
    },
    {
      path: "/settlement",
      component: () => import("../views/Settlement.vue"),
    },
    {
      path: "/module2",
      component: () => import("../views/Module2Placeholder.vue"),
    },
    {
      path: "/module3",
      component: () => import("../views/Module3Placeholder.vue"),
    },
    {
      path: "/module4",
      component: () => import("../views/Module4Placeholder.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
