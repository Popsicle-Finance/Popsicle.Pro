<template>
  <div>
    <section class="dashboard">
      <div class="container">
        <!-- Title -->
        <div class="row">
          <div class="col">
            <div class="dashboard-title">
              <h2 data-position="top">Let's get some Popsicles</h2>

              <p class="h5" data-position="top" data-delay="0.3">
                Your yield enhancement journey begins now
              </p>
            </div>
          </div>
        </div>

        <div class="dashobord-content-tabs">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'sorbetto' }"
            @click="activeTab = 'sorbetto'"
          >
            Sorbetto
          </button>
          <button
            class="tab-btn ml"
            :class="{ active: activeTab === 'stand' }"
            @click="activeTab = 'stand'"
            v-if="showStand"
          >
            Stand
          </button>
        </div>

        <!-- Tabs -->
        <section class="dashboard-tabs fade-in">
          <div class="row">
            <div class="col">
              <button class="btn-tab transparent fade-in no-cursor" v-if="info">
                <img src="@/assets/images/tokens/ice.svg" alt="" />
                <span>${{ info.price }}</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Dashboard -->
        <template v-if="activeTab === 'stand' && showStand">
          <StandContainer />
        </template>

        <template v-if="activeTab === 'sorbetto'">
          <SorbettoContainer :theme="theme" />
        </template>
      </div>
    </section>
  </div>
</template>

<script>
const SorbettoContainer = () => import("@/components/sorbetto/Container");
const StandContainer = () => import("@/components/StandContainer");
import global from "@/mixins/global";
// prod
export default {
  name: "Deposit",
  mixins: [global],
  data: () => ({
    activeTab: "sorbetto",
  }),
  computed: {
    chainId() {
      return this.$store.getters.getChain;
    },
    showStand() {
      const acceptedChains = [1, 250, 56];

      if (this.chainId) {
        const isAccepted = acceptedChains.indexOf(this.chainId) !== -1;

        return isAccepted;
      }

      return false;
    },
  },
  components: {
    SorbettoContainer,
    StandContainer,
  },
};
</script>

<style lang="scss" scoped src="@/assets/scss/views/dashboard.scss"></style>
