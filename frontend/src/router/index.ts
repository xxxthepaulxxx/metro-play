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
      path: "/blind-box",
      component: () => import("../views/blind-box/HomeView.vue"),
    },
    {
      path: "/blind-box/reveal",
      component: () => import("../views/blind-box/RevealView.vue"),
    },
    {
      path: "/blind-box/scan-station",
      component: () => import("../views/blind-box/ScanStationView.vue"),
    },
    {
      path: "/blind-box/scan-merchant",
      component: () => import("../views/blind-box/ScanMerchantView.vue"),
    },
    {
      path: "/privileges",
      component: () => import("../views/privileges/PrivilegesHomeView.vue"),
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
