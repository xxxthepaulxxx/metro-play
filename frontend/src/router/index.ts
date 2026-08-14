import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/off-peak",
    },
    {
      path: "/off-peak",
      component: () => import("../views/off-peak/HomeView.vue"),
    },
    {
      path: "/off-peak/game-a",
      component: () => import("../views/off-peak/GameAPledgeView.vue"),
    },
    {
      path: "/off-peak/game-b",
      component: () => import("../views/off-peak/GameBGuessView.vue"),
    },
    {
      path: "/off-peak/settlement",
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
      redirect: "/off-peak",
    },
  ],
});

export default router;
