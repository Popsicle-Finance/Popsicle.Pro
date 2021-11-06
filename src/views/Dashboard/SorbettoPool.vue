<template>
  <div class="sorbetto-pool-view" :class="{ alternative: showMore }">
    <div
      class="banner-container"
      v-if="pool && pool.showBanner && !showDepositDisableBanner"
    >
      <Banner :title="bannerTitle" />
    </div>

    <img class="bg-1" src="@/assets/images/sorbetto/pool-bg-1.png" alt="" />
    <img class="bg-2" src="@/assets/images/sorbetto/pool-bg-2.png" alt="" />

    <div
      class="content-wrap"
      v-if="pool"
      :class="{ 'out-banner': pool && pool.showBanner }"
    >
      <p class="back-link" @click="toStand">Back to all</p>

      <div class="pool-content">
        <PoolActions :pool="pool" @toggleMore="toggleMore" />
      </div>
    </div>
  </div>
</template>

<script>
const PoolActions = () => import("@/components/sorbetto/Pool/PoolAction");
const Banner = () => import("@/components/Banner");

export default {
  data() {
    return {
      showMore: false,

      bannerTitle: "The pool is temporarily out of range",
    };
  },
  computed: {
    showDepositDisableBanner() {
      return this.$store.getters.getShowDepositDisableBanner;
    },
    isSorbettoLoading() {
      return this.$store.getters.getSorbettoPoolsLoading;
    },
    pool() {
      const poolId = this.$route.params.id;

      return this.$store.getters.getSorbettoPoolById(poolId);
    },
  },
  methods: {
    toggleMore(value) {
      this.showMore = value;
    },
    toStand() {
      this.$router.push({ name: "Dashboard" });
    },
    async fetchPool() {
      if (this.isSorbettoLoading) {
        setTimeout(async () => {
          await this.fetchPool();
        }, 1000);

        return false;
      }
    },
  },
  async created() {
    if (!this.pool) {
      this.$router.push({ name: "Dashboard" });
      console.log("POOL IS UNDEFINED");
      return false;
    }

    console.log("POOL:", this.pool);
  },
  components: {
    PoolActions,
    Banner,
  },
};
</script>

<style lang="scss" scoped>
.banner-container {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 9999999;
}

.out-banner {
  margin-top: 80px;
}

p {
  margin: 0;
}

.sorbetto-pool-view {
  min-height: calc(100vh - 80px);
  position: relative;
  overflow-x: hidden;
  padding-top: 40px;
  padding-bottom: 60px;

  &.alternative {
    .content-wrap {
      max-width: 95%;
    }
  }

  .bg-1 {
    width: 400px;
    height: auto;
    position: absolute;
    bottom: 0;
    right: 55%;
  }

  .bg-2 {
    width: 715px;
    height: auto;
    position: absolute;
    top: -80px;
    left: 50%;
  }

  .back-link {
    font-size: 16px;
    line-height: 22px;
    color: #2bd2f7;
    display: block;
    width: max-content;
    margin-left: auto;
    cursor: pointer;
  }

  .content-wrap {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    max-width: 830px;
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
  }

  .pool-content {
    margin-top: 10px;
  }
}
</style>
