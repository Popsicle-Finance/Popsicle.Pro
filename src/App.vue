<template>
  <div id="app">
    <div v-if="!checkInProcess">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>

    <Banner v-if="showBanner" />

    <!-- TODO: Create popups contoller + common state -->
    <transition name="fade">
      <ConnectPopup v-if="showConnectPopup" />
    </transition>
    <transition name="fade">
      <NetworksPopup v-if="showNetworkPopup" />
    </transition>

    <NotificationContainer />
  </div>
</template>

<script>
const NotificationContainer = () =>
  import("@/components/sorbetto/Notifications/NotificationContainer");
const ConnectPopup = () => import("@/components/popups/ConnectPopup");
const NetworksPopup = () => import("@/components/popups/NetworksPopup");
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      bannetPath: ["Dashboard"],
    };
  },
  computed: {
    ...mapGetters({
      wallet: "getWallet",
      checkInProcess: "getWalletCheckInProccess",
    }),
    showBanner() {
      if (this.bannetPath.includes(this.$route.name)) {
        return true;
      }
      return false;
    },
    showConnectPopup() {
      return this.$store.getters.getShowConnectPopup;
    },
    showNetworkPopup() {
      return this.$store.getters.getShowNetworkPopup;
    },
  },
  watch: {
    wallet(wallet) {
      if (wallet && wallet.address && wallet.provider) {
        console.log(`%cWallet Connected.`, "font-weight: bold; color: green;");
        console.log(
          `Address: %c${wallet.address}`,
          "font-weight: bold; color: orange;"
        );
        console.log(wallet.provider);
      }
    },
  },
  components: {
    ConnectPopup,
    NetworksPopup,
    NotificationContainer,
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
