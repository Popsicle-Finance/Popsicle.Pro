<template>
  <div class="bg dashboard-container dark-theme">
    <Header
      :stakingLink="stakingLink"
      :activeSelected="activePoint"
      :isAuthorized="isAuth"
      @showModal="showModal"
    />

    <transition name="fade">
      <router-view></router-view>
    </transition>

    <!-- <Footer /> -->

    <transition name="fade">
      <WithdrawPopup :theme="'dark'" v-if="showWithdrawPopup" />
    </transition>

    <transition name="fade">
      <ClaimFeesPopup :theme="'dark'" v-if="showClaimFeesPopup" />
    </transition>
  </div>
</template>

<script>
const WithdrawPopup = () =>
  import("@/components/sorbetto/Popups/WithdrawPopup");
const ClaimFeesPopup = () =>
  import("@/components/sorbetto/Popups/ClaimFeesPopup");
import global from "@/mixins/global";

export default {
  mixins: [global],
  data() {
    return {
      sorbettoUpdateInterval: null,
    };
  },
  computed: {
    showPopup() {
      return this.$store.getters.getShowSorbettoPopup;
    },
    showWithdrawPopup() {
      return (
        this.showPopup &&
        this.$store.getters.getSorbettoPopupType === "withdraw"
      );
    },
    showClaimFeesPopup() {
      return (
        this.showPopup && this.$store.getters.getSorbettoPopupType === "claim"
      );
    },
  },
  components: {
    WithdrawPopup,
    ClaimFeesPopup,
  },
};
</script>
