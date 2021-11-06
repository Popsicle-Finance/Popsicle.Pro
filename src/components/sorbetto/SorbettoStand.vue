<template>
  <div class="sorbetto-stand" :class="{ 'light-theme': theme === 'light' }">
    <div class="stand-head">
      <img src="@/assets/images/fragola-icon.png" class="icecream-icon" />
      <p class="stand-title">Your Positions</p>
      <button class="toggle-view-btn" @click="toggleView">
        <img :src="toggleViewIcon" alt="" />
      </button>
    </div>

    <div
      class="items-wrap"
      :class="{ table: viewType === 1 }"
      v-if="openPools.length"
    >
      <template v-if="viewType === 1">
        <DepositItemRow
          v-for="pool in openPools"
          :key="pool.id"
          :pool="pool"
          :itsOpen="true"
        />
      </template>
      <template v-else>
        <DepositItem
          v-for="pool in openPools"
          :key="pool.id"
          :pool="pool"
          :itsOpen="true"
        />
      </template>
    </div>

    <template v-else>
      <div class="empty-open-pools">
        <img
          src="@/assets/images/sorbetto/empty-open-position.svg"
          alt=""
          class="empty-img"
        />
        <div class="info-wrap">
          <p class="empty-block-title">
            Start a liquidity provider position now
          </p>
          <p class="empty-block-subtitle">
            Use our V3 Optimizer to maximise your yield!
          </p>
        </div>
      </div>
    </template>

    <div class="deposited-block" v-if="otherPools.length">
      <div class="block-head" :class="{ hidden: !showDeposited }">
        <p class="mini-title">Sorbetto Fragola Pools</p>

        <div
          class="show-more-btn"
          :class="{ hide: !showDeposited }"
          @click="toggleDeposited"
        >
          <img src="@/assets/images/sorbetto/arrow-down-white.svg" alt="" />
        </div>
      </div>

      <transition name="fade">
        <div
          class="items-wrap"
          :class="{ table: viewType === 1 }"
          v-if="showDeposited"
        >
          <template v-if="viewType === 1">
            <DepositItemRow
              v-for="pool in otherPools"
              :key="pool.id"
              :pool="pool"
            />
          </template>
          <template v-else>
            <DepositItem
              v-for="pool in otherPools"
              :key="pool.id"
              :pool="pool"
            />
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
const DepositItem = () => import("@/components/sorbetto/DepositItem");
const DepositItemRow = () => import("@/components/sorbetto/DepositItemRow");

export default {
  props: {
    pools: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showDeposited: true,
      viewType: 0,
    };
  },
  computed: {
    toggleViewIcon() {
      if (this.viewType === 0)
        return require("@/assets/images/sorbetto/table-view-icon.svg");
      return require("@/assets/images/sorbetto/grid-view-icon.svg");
    },
    openPools() {
      return this.pools.filter((pool) => +pool.userLpBalance > 0);
    },
    otherPools() {
      return this.pools.filter((pool) => +pool.userLpBalance === 0);
    },
    activePools() {
      const alwaysShowPools = this.pools.filter(
        (pool) => pool.id === 0 || pool.id === 1
      );
      const otherPools = this.pools.filter(
        (pool) => pool.id !== 0 && pool.id !== 1
      );

      const openOtherPools = otherPools.filter(
        (pool) => +pool.userLpBalance > 0
      );

      return [...alwaysShowPools, ...openOtherPools];
    },
  },
  methods: {
    toggleView() {
      this.viewType = this.viewType === 0 ? 1 : 0;
      localStorage.setItem("sorbettoViewType", this.viewType);
    },
    toggleDeposited() {
      this.showDeposited = !this.showDeposited;
    },
  },
  created() {
    this.viewType = localStorage.getItem("sorbettoViewType")
      ? +localStorage.getItem("sorbettoViewType")
      : 0;
  },
  components: {
    DepositItem,
    DepositItemRow,
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.toggle-view-btn {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
}

.empty-open-pools {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 60px;

  .info-wrap {
    .empty-block-title {
      font-weight: bold;
      font-size: 24px;
      line-height: 33px;
      letter-spacing: -0.5px;
      color: #ffffff;
    }

    .empty-block-subtitle {
      font-size: 20px;
      line-height: 27px;
      display: flex;
      align-items: center;
      text-align: center;
      color: #868686;
    }
  }

  .empty-img {
    width: 130px;
    height: auto;
    object-fit: contain;
    margin-right: 20px;
  }
}

.sorbetto-stand {
  background: #2c2c2c;
  box-shadow: 0px 0px 16px rgba(20, 20, 19, 0.05);
  border-radius: 16px;
  padding: 0 30px 10px 30px;

  .items-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    padding: 20px 0;

    &.table {
      display: block;
    }
  }

  &.light-theme {
    background: #ffffff;
    box-shadow: 0px 0px 16px rgba(20, 20, 19, 0.05);

    .stand-head {
      border-bottom: 1px solid #e4ecee;
    }

    .deposited-block {
      .block-head {
        border-bottom: 1px solid #e4ecee;

        .show-more-btn {
          background: #f6f9fa;
        }
      }
    }
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

  .stand-head {
    display: flex;
    align-items: center;
    height: 70px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 20px;

    .icecream-icon {
      width: 32px;
      height: 32px;
      object-fit: contain;
      margin-right: 10px;
    }

    .stand-title {
      font-size: 20px;
      line-height: 27px;
      color: #868686;
    }
  }

  .deposited-block {
    .block-head {
      padding: 20px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.3s ease;

      &.hidden {
        border-bottom: 1px solid transparent !important;
      }

      .mini-title {
        font-size: 20px;
        line-height: 27px;
        color: #868686;
      }

      .show-more-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #252423;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        &.hide {
          transform: rotate(180deg);
        }

        img {
          width: 10px;
          height: 10px;
          object-fit: contain;
        }
      }
    }
  }
}

@media screen and (max-width: 992px) {
  .sorbetto-stand .items-wrap {
    grid-template-columns: 1fr;
  }

  .empty-open-pools .info-wrap .empty-block-title {
    font-size: 20px;
  }

  .empty-open-pools .info-wrap .empty-block-subtitle {
    font-size: 16px;
  }
}

@media screen and (max-width: 640px) {
  .empty-open-pools {
    flex-direction: column;
    text-align: center;

    .info-wrap {
      width: 100%;
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .empty-open-pools .empty-img {
    margin-right: 0;
    margin-bottom: 20px;
  }
}

@media screen and (max-width: 460px) {
  .sorbetto-stand {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
