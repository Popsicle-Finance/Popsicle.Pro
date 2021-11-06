<template>
  <div class="deposited-item" @click="toPool">
    <img v-if="bgImage" :src="bgImage" alt="" class="bg-image" />

    <img
      v-if="pool.isNew && !itsOpen"
      src="@/assets/images/sorbetto/new.png"
      alt=""
      class="new-flag"
    />

    <div class="item-head">
      <p class="status red" v-if="pool.isDiscontinued">Deprecated Pool</p>
      <p class="status" v-else-if="itsOpen">Sorbetto Position Active</p>
    </div>
    <div class="item-content-wrap">
      <div class="token-info">
        <div class="image-wrap">
          <img :src="poolImage" alt="" class="main-img" />
          <img
            src="@/assets/images/sorbetto/Chain_1.png"
            alt=""
            class="chain-img"
          />
        </div>
        <div class="item-info-wrap">
          <p>${{ lpInUsd }}</p>
          <p class="mini">{{ parsedLpBalance }} PLP</p>
        </div>
      </div>

      <div class="info-block">
        <div class="info-item">
          <p
            class="info-title"
            v-tooltip="{
              content: 'Assets and Tier Fee of the pool',
            }"
          >
            POOL
          </p>
          <p class="info-value">{{ pool.name }} {{ pool.poolPercent }}%</p>
        </div>
        <div class="info-item">
          <p
            class="info-title"
            v-tooltip="{
              content: 'Approximate Annualised Return on investment',
            }"
          >
            ~APR
          </p>
          <p class="info-value">{{ pool.poolApr }}%</p>
        </div>
        <div class="info-item">
          <p
            class="info-title"
            v-tooltip="{
              content: 'Total Value Locked in our pool',
            }"
          >
            ~TVL
          </p>
          <p class="info-value">${{ pool.poolTvl | formatNumber }}</p>
        </div>
        <div class="info-item">
          <p
            class="info-title"
            v-tooltip="{
              content: 'Maximum allowed amount of liquidity',
            }"
          >
            MAX CAP
          </p>
          <p class="info-value" v-if="+pool.maxCap <= 100000000">
            ${{ pool.maxCap | formatCap }}
          </p>
          <p class="info-value" v-else>NO MAX CAP</p>
        </div>
      </div>

      <div class="btns-wrap" v-if="itsOpen">
        <button class="action-btn" @click.stop="openWithdrawPopup">
          Withdraw
        </button>
        <!-- <button class="action-btn" @click.stop="openClaimFeesPopup">
          Claim Fees
        </button> -->
      </div>

      <div class="btns-wrap" v-else>
        <button class="action-btn" @click.stop="toPool">Join</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itsOpen: {
      type: Boolean,
      default: false,
    },
    pool: {
      type: Object,
      required: true,
    },
  },
  computed: {
    lpInUsd() {
      return +this.pool.userLpInUsd || 0;
    },
    bgImage() {
      if (this.itsOpen)
        return require("@/assets/images/sorbetto/active-pool-bg.svg");

      return false;
    },
    parsedLpBalance() {
      return this.pool.userLpBalanceParsed;
    },
    poolImage() {
      try {
        return require(`@/assets/images/sorbetto/${this.pool.poolImage}`);
      } catch (e) {
        return require(`@/assets/images/sorbetto/Token_ETH.svg`);
      }
    },
  },
  methods: {
    toPool() {
      this.$router.push({ name: "SorbettoPool", params: { id: this.pool.id } });
    },
    openWithdrawPopup() {
      this.$store.commit("setSorbettoPopupState", {
        showPopup: true,
        type: "withdraw",
        activePool: this.pool.id,
      });
    },
    openClaimFeesPopup() {
      this.$store.commit("setSorbettoPopupState", {
        showPopup: true,
        type: "claim",
        activePool: this.pool.id,
      });
    },
  },
  filters: {
    formatNumber(value) {
      if (!value) return value;
      if (Number(value) === 0) return value;

      const lookup = [
        { value: 0, symbol: "" },
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      let item = lookup
        .slice()
        .reverse()
        .find(function(item) {
          return parseFloat(value) >= item.value;
        });
      return (
        (parseFloat(value) / item.value).toFixed(2).replace(rx, "$1") +
        item.symbol
      );
    },
    formatCap(value) {
      if (!value) return value;
      if (Number(value) === 0) return value;

      if (value > 100000000) return "∞";

      const lookup = [
        { value: 0, symbol: "" },
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      let item = lookup
        .slice()
        .reverse()
        .find(function(item) {
          return parseFloat(value) >= item.value;
        });
      return (
        (parseFloat(value) / item.value).toFixed(2).replace(rx, "$1") +
        item.symbol
      );
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.action-btn {
  border: 1px solid #2bd2f7;
  box-sizing: border-box;
  border-radius: 12px;
  height: 40px;
  min-width: 125px;
  padding: 0 15px;
  background: transparent;
  outline: none;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
  color: #2bd2f7;
  transition: all 0.3s ease;

  &:disabled {
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.2);
  }

  &:hover {
    color: white;
    background: #2bd2f7;
  }
}

.deposited-item {
  padding: 20px;
  padding-bottom: 40px;
  background: #252423;
  box-shadow: 0px 0px 20px rgba(43, 210, 247, 0.4);
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 20px;

  &:hover {
    background: #161616;
  }

  .bg-image {
    position: absolute;
    top: 0;
    left: 0;
    width: auto;
    height: auto;
    z-index: 1;
    transform-origin: top left;
  }

  .new-flag {
    position: absolute;
    top: 0;
    left: 0;
    width: 70px;
    height: auto;
    object-fit: contain;
    z-index: 1;
  }

  .item-content-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 2;

    .btns-wrap {
      width: 125px;

      .action-btn:first-child {
        margin-bottom: 10px;
      }
    }

    .token-info {
      display: flex;
      align-items: center;

      .item-info-wrap {
        p {
          font-weight: bold;
          font-size: 28px;
          line-height: 38px;
          color: #fff;

          &.mini {
            font-weight: normal;
            font-size: 14px;
            line-height: 1.5;
          }
        }
      }

      .image-wrap {
        position: relative;
        margin-right: 20px;

        .chain-img {
          position: absolute;
          bottom: 0;
          left: -10px;
          width: 30px;
          height: 30px;
          object-fit: contain;
        }

        .main-img {
          width: 80px;
          height: 80px;
          object-fit: contain;
        }
      }
    }
  }

  .item-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    position: relative;
    z-index: 2;

    .status {
      margin-left: auto;
      color: #a4f3b6;

      &.red {
        color: #cc123f;
      }
    }

    p {
      font-size: 14px;
      line-height: 1.3;
      color: #868686;
    }
  }

  .info-block {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    flex: 1;
    padding: 0 20px;

    .info-item {
      padding: 10px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border-radius: 12px;
      text-align: center;
      width: calc(33.3% - 6px);
      max-width: 260px;
      margin: 10px;

      .info-title {
        font-weight: 600;
        font-size: 12px;
        line-height: 16px;
        color: #868686;
        margin-bottom: 5px;
      }

      .info-value {
        font-weight: 600;
        font-size: 14px;
        line-height: 19px;
        color: #ffffff;
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .deposited-item .item-content-wrap .token-info .item-info-wrap p {
    font-size: 20px;
    line-height: 1.3;
  }
}

@media screen and (max-width: 1024px) {
  .deposited-item .item-content-wrap {
    flex-wrap: wrap;
  }

  .deposited-item {
    padding-bottom: 20px;
  }

  .deposited-item .info-block {
    width: 100%;
    justify-content: space-between;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0;
    padding-top: 20px;

    .info-item {
      margin: 0;
      width: calc(25% - 6px);
    }
  }

  .deposited-item .item-content-wrap .token-info {
    order: 1;
    min-width: 50%;
  }

  .deposited-item .item-content-wrap .btns-wrap {
    order: 2;
  }

  .deposited-item .info-block {
    margin-top: 20px;
    order: 3;
    min-width: 100%;
  }
}

@media screen and (max-width: 560px) {
  .deposited-item .bg-image {
    display: none;
  }

  .deposited-item .item-content-wrap {
    flex-direction: column;
  }
  .deposited-item .item-content-wrap .token-info {
    width: 100%;
    margin-bottom: 20px;
  }

  .deposited-item .item-content-wrap .btns-wrap {
    width: 100%;

    .action-btn:first-child {
      margin-bottom: 10px;
    }

    .action-btn {
      width: 100%;
      min-width: 100px;
      margin-bottom: 10px;
    }
  }

  .deposited-item .info-block {
    flex-wrap: wrap;
  }

  .deposited-item .info-block .info-item {
    width: 100%;
    max-width: inherit;
    margin-bottom: 15px;
  }
}
</style>
