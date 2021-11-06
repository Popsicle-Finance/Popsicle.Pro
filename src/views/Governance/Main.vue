<template>
  <section class="governance" :class="{ 'dark-theme': theme === 'dark' }">
    <Header
      :stakingLink="stakingLink"
      :activeSelected="activePoint"
      :isAuthorized="isAuth"
      @showModal="showModal"
    />
    <main class="governance-container" v-if="isConnect">
      <router-view></router-view>
    </main>

    <div class="error-wrapper" v-if="!isConnect">
      <Error errorText="Please connect to use Governance" />
    </div>
    <!-- <Footer /> -->
    <!--  -->
    <!-- Modals -->
    <ModalLayout
      :pool="currentPool"
      :selectedBalance="selectedBalance"
      :activePoint="activePoint"
      :selectedText="selectedText"
      :epsRewards="currentPool.epsRewards"
      @deposit="handleDeposit"
      @withdraw="handleWithdraw"
      @toggleNetwork="handleToggleNetwork"
      @harvestEPS="handleHarvestEPS"
      @harvestICE="handleHarvestICE"
    />
  </section>
</template>

<script>
import global from "@/mixins/global";
const Error = () => import("@/components/ui/Error");

export default {
  mixins: [global],
  computed: {
    isConnect() {
      return !!this.$store.getters.getAddress;
    },
  },
  components: {
    Error,
  },
};
</script>

<style lang="scss" scoped>
.error-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10%;
  margin-left: auto;
  margin-right: auto;
}

.governance-container {
  h1 {
    text-transform: unset;
  }

  height: 100%;
  min-height: calc(100vh - 80px);
}
</style>
