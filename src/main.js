import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import moment from "moment";
import VTooltip from 'v-tooltip'

import { ethers } from "ethers";

import Farm3 from "./farm";
import Farm_v2 from "./farm_v2";

import connectWallet from "./plugins/connectWallet";
import clickOutside from "./directives/clickOutside";

/**
 * Web3 instances
 */
const Web3 = require("web3");
const web3Instance = new Web3();

if(window.ethereum) {
  web3Instance.currentProvider = window.ethereum;
}

const farm3 = new Farm3();
const farm_v2 = new Farm_v2();

// Web3 global instance
Vue.prototype.$web3 = web3Instance;
Vue.prototype.$farm3 = farm3;
Vue.prototype.$farm_v2 = farm_v2;
Vue.prototype.$ethers = ethers;
Vue.use(connectWallet);

Vue.directive("click-outside", clickOutside);

if (window.web3) {
  // Vue.prototype.$web3.currentProvider = window.web3.currentProvider;
  Vue.prototype.$web3.currentProvider = window.ethereum;
}

Vue.prototype.$interval = null;
Vue.prototype.$watcher = null;

if (!localStorage.getItem("theme")) {
  window.localStorage.setItem("theme", "light");
}

/**
 * End
 */

// Lib for working with time and date
Vue.prototype.$moment = moment;

// Load css files
import "./assets/scss/style.scss";
import "./assets/css/style.css";
import "./assets/css/bootstrap-grid.css";

// Slick slider
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";

// Global components
Vue.component("VueSlickCarousel", VueSlickCarousel);
Vue.component("Footer", () => import("./components/Footer.vue"));
Vue.component("Header", () => import("./components/Header.vue"));
Vue.component("Modal", () => import("./components/Modal.vue"));
Vue.component("Logo", () => import("./components/Logo.vue"));
Vue.component("Banner", () => import("./components/Banner.vue"));
Vue.component("Counter", () => import("./components/Counter.vue"));
Vue.component("SwitchTheme", () => import("./components/SwitchTheme.vue"));
Vue.component("Table", () => import("./components/Table.vue"));
Vue.component("TableItem", () => import("./components/TableItem.vue"));
Vue.component("Loading", () => import("./components/Loading.vue"));
Vue.component("Chart", () => import("./components/Chart.vue"));

Vue.use(VTooltip)

// Modals
Vue.component("ModalDeposit", () =>
  import("./components/modals/ModalDeposit.vue")
);
Vue.component("ModalWithdraw", () =>
  import("./components/modals/ModalWithdraw.vue")
);
Vue.component("ModalSelectNetwork", () =>
  import("./components/modals/ModalSelectNetwork.vue")
);
Vue.component("ModalConnect", () =>
  import("./components/modals/ModalConnect.vue")
);
Vue.component("ModalDeleteProposal", () =>
  import("./components/modals/ModalDeleteProposal.vue")
);
Vue.component("ModalProvider", () =>
  import("./components/modals/ModalProvider.vue")
);

Vue.component("ModalLayout", () => import("./components/ModalLayout.vue"));

Vue.component("Select", () => import("./components/Select.vue"));
Vue.component("Power", () => import("./components/Power.vue"));

Vue.config.productionTip = false;

// Vue.config.errorHandler = function(err, vm, info) {
//   console.log(info);
// };

Vue.mixin({
  computed: {
    web3() {
      if(this.$store.getters.getWeb3Instance) return this.$store.getters.getWeb3Instance
      console.log("here")
      return this.$web3
    }
  }
})

new Vue({
  router,
  store,
  created() {
    // const existNetwork = !!localStorage.getItem("network");
    // if (!existNetwork) localStorage.setItem("network", "bsc");
  },
  async mounted() {
    // setTimeout(async () => {
    //   const version = Number(window.ethereum.networkVersion);
    //   localStorage.setItem("networkVersion", version);
    //   await farm3.setup();
    //   await farm_v2.setup();

    //   //console.log(farm_v2);
    // }, 1000);
  },
  render: (h) => h(App),
}).$mount("#app");
