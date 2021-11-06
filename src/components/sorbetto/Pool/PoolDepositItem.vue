<template>
  <div class="deposited-item">
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
          <p class="mini">({{ pool.name }} {{ pool.poolPercent }}%)</p>
          <p class="mini">{{ parsedLpBalance }} PLP</p>
        </div>
      </div>

      <div class="btns-wrap">
        <button class="action-btn" @click="openWithdrawPopup">Withdraw</button>
        <!-- <button class="action-btn" @click="openClaimFeesPopup">
          Claim Fees
        </button> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pool: {
      type: Object,
      required: true,
    },
  },
  computed: {
    lpInUsd() {
      return +this.pool.userLpInUsd || 0;
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
  .item-content-wrap {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-right: 40px;

    .btns-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .action-btn {
        margin: 0 10px;
      }
    }

    .token-info {
      display: flex;
      align-items: center;
      min-width: 220px;
      margin-bottom: 20px;

      .item-info-wrap {
        p {
          font-weight: bold;
          font-size: 18px;
          line-height: 25px;
          color: #fff;

          &.mini {
            font-weight: normal;
            font-size: 12px;
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
}

@media screen and (max-width: 1200px) {
  .deposited-item .item-content-wrap .token-info .item-info-wrap p {
    font-size: 20px;
    line-height: 1.3;
  }
}

@media screen and (max-width: 460px) {
  .deposited-item .item-content-wrap {
    flex-direction: column;
  }
  .deposited-item .item-content-wrap .token-info {
    width: 100%;
    margin-bottom: 20px;
  }

  .deposited-item .item-content-wrap .btns-wrap {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;

    .action-btn:first-child {
      margin-bottom: 0;
    }

    .action-btn {
      width: 49%;
      min-width: 100px;
    }
  }
}
</style>
