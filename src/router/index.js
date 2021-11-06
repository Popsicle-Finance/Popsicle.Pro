import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    meta: { requireAuth: true },
    component: () => import("@/views/Dashboard/index"),
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("@/views/Dashboard/Stand")
      },
      {
        path: "pool/:id",
        name: "SorbettoPool",
        component: () => import("@/views/Dashboard/SorbettoPool")
      }
    ]
  },
  {
    path: "/stake",
    component: () => import("@/views/NIce"),
    children: [
      {
        path: "",
        name: "nIce",
        component: () => import("@/views/NIce/NIceStand")
      },
    ]
  },
  {
    path: "/bridge",
    component: () => import("@/views/Bridge"),
    children: [
      {
        path: "",
        name: "Bridge",
        component: () => import("@/views/Bridge/BridgeStand")
      },
    ]
  },
  {
    path: "/404",
    name: "Not found",
    component: () => import("../views/404.vue"),
  },
  {
    path: "/governance",
    name: "Governance",
    component: () => import("../views/Governance/Main.vue"),
    children: [
      {
        path: "proposal",
        name: "Governance.Proposal",
        component: () => import("../views/Governance/Proposal.vue"),
      },
      {
        path: "proposal/:id",
        component: () => import("../views/Governance/ProposalItem.vue"),
      },
      {
        path: "voting/:id",
        component: () => import("../views/Governance/VotingItem.vue"),
      },
      {
        path: "create",
        component: () => import("../views/Governance/Create.vue"),
      },
      {
        path: "rules",
        component: () => import("../views/Governance/Rules.vue"),
      },
    ],
  },
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((from, to, next) => {
  const requireAuth = from.meta.requireAuth || false;

  if (requireAuth) {
    const addressExist = localStorage.getItem("address") || undefined;

    if (!addressExist) next("/");
    else next();
  } else {
    next();
  }
});

export default router;
