<template>
  <div
    class="popup-wrap"
    :class="{ 'dark-theme': theme === 'dark' }"
    @click="closePopup"
  >
    <div class="popup-content" @click.stop>
      <img
        v-if="theme === 'dark'"
        src="@/assets/images/sorbetto/close-btn-white.svg"
        alt=""
        class="close-btn"
        @click="closePopup"
      />
      <img
        v-else
        src="@/assets/images/sorbetto/close-btn.svg"
        alt=""
        class="close-btn"
        @click="closePopup"
      />
      <img src="@/assets/images/sorbetto/popups-bg.png" alt="" class="bg-img" />

      <p class="popup-title">Claim your fees</p>

      <Input
        :reward="priceAmount0"
        :alternative="true"
        :error="amount0Error"
        :value="amount0"
        :theme="theme"
        :name="pool.token0.symbol"
        :max="maxFistAmount"
        @update="updateValue0"
      />
      <Input
        :reward="priceAmount1"
        :alternative="true"
        :error="amount1Error"
        :value="amount1"
        :theme="theme"
        :name="pool.token1.symbol"
        :max="maxSecondAmount"
        @update="updateValue1"
      />

      <div class="btm-row">
        <p v-if="showInfoText">
          Your claimabale amount is different from amount earned, read the
          <a
            target="_blank"
            href="https://docs.popsicle.finance/our-products/sorbetto/sorbetto-fragola"
            >Docs.</a
          >
        </p>
        <button class="action-btn" @click="claimHandler">
          {{ actionBtnText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
const Input = () => import("@/components/sorbetto/Input");
import { GetAmountForDesired } from "@/utils/sorbetto/libs/AmountsForDesired";

export default {
  props: {
    theme: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      amount0: "",
      amount1: "",
      maxAmount0: "",
      maxAmount1: "",
      showInfoText: false,
    };
  },
  computed: {
    maxFistAmount() {
      return this.maxAmount0 || this.pool.token0.userReward;
    },
    maxSecondAmount() {
      return this.maxAmount1 || this.pool.token1.userReward;
    },
    priceAmount0() {
      return parseFloat(+this.maxFistAmount * this.pool.token0.price).toFixed(
        2
      );
    },
    priceAmount1() {
      return parseFloat(+this.maxSecondAmount * this.pool.token1.price).toFixed(
        2
      );
    },
    activePoolId() {
      return this.$store.getters.getSorbettoPopupPoolId;
    },
    pool() {
      return this.$store.getters.getSorbettoPoolById(this.activePoolId);
    },
    amount0Error() {
      if (this.amount0 && +this.amount0 > +this.maxFistAmount) {
        return `The value cannot be more than ${this.maxFistAmount}`;
      }

      return "";
    },
    amount1Error() {
      if (this.amount1 && +this.amount1 > +this.maxSecondAmount) {
        return `The value cannot be more than ${this.maxSecondAmount}`;
      }

      return "";
    },
    actionBtnText() {
      if (this.amount0Error || this.amount1Error) return "Nothing to do";

      if (!+this.amount0 && !+this.amount1) return "Nothing to do";

      return "Claim";
    },
  },
  methods: {
    createNotification(msg) {
      const id = this.$store.getters.getNotificationId;

      const notification = { id, msg };

      this.$store.commit("addNotification", notification);

      return id;
    },
    updateValue0(value) {
      this.amount0 = value;
    },
    updateValue1(value) {
      this.amount1 = value;
    },
    async claimHandler() {
      if (this.amount0Error || this.amount1Error) return false;

      if (!+this.amount0 && !+this.amount1) return false;

      const notifyId = this.createNotification("Claim fees in progress");

      try {
        const amount0 = this.$ethers.utils.parseUnits(
          String(this.amount0 || 0),
          this.pool.token0.decimals
        );
        const amount1 = this.$ethers.utils.parseUnits(
          String(this.amount1 || 0),
          this.pool.token1.decimals
        );
        const account = localStorage.getItem("address");
        const contract = this.pool.contractInstance;
        this.closePopup();

        await contract.methods
          .collectFees(amount0.toString(), amount1.toString())
          .send({ from: account });
        this.$store.commit("deleteNotification", notifyId);
      } catch (e) {
        this.$store.commit("deleteNotification", notifyId);
        console.log("withdraw err", e);
      }
    },
    async getMaxAmounts() {
      let max0 = "999999";
      let max1 = "999999";

      console.log("getMaxAmounts");

      if (this.pool.token0.decimals === 6) {
        max0 = "999999999999";
      }

      if (this.pool.token0.decimals === 8) {
        max0 = "99999999999999";
      }

      if (this.pool.token0.decimals === 18) {
        max0 = "999999999999999999999999";
      }

      if (this.pool.token1.decimals === 6) {
        max1 = "999999999999";
      }

      if (this.pool.token1.decimals === 8) {
        max1 = "99999999999999";
      }

      if (this.pool.token1.decimals === 18) {
        max1 = "999999999999999999999999";
      }

      const token0Reward = this.$ethers.utils.parseUnits(
        this.pool.token0.userReward > 0 ? this.pool.token0.userReward : "0",
        this.pool.token0.decimals
      );
      const token1Reward = this.$ethers.utils.parseUnits(
        this.pool.token1.userReward > 0 ? this.pool.token1.userReward : "0",
        this.pool.token1.decimals
      );

      const response1 = await GetAmountForDesired(
        token0Reward,
        max1,
        this.pool.contractInstance,
        this.pool.poolContractInstance
      );

      const response2 = await GetAmountForDesired(
        max0,
        token1Reward,
        this.pool.contractInstance,
        this.pool.poolContractInstance
      );

      console.log(response1, response2);

      if (
        +response1.amount0 < +response2.amount0 &&
        +response1.amount1 < +response2.amount1
      ) {
        if (!+response1.amount0 || !+response1.amount1) {
          this.setMaxFromPolls();
          return false;
        }

        this.maxAmount0 = this.$ethers.utils.formatUnits(
          response1.amount0,
          this.pool.token0.decimals
        );
        this.maxAmount1 = this.$ethers.utils.formatUnits(
          response1.amount1,
          this.pool.token1.decimals
        );
      }

      if (
        +response1.amount0 > +response2.amount0 &&
        +response1.amount1 > +response2.amount1
      ) {
        if (!+response2.amount0 || !+response2.amount1) {
          this.setMaxFromPolls();
          return false;
        }

        this.maxAmount0 = this.$ethers.utils.formatUnits(
          response2.amount0,
          this.pool.token0.decimals
        );
        this.maxAmount1 = this.$ethers.utils.formatUnits(
          response2.amount1,
          this.pool.token1.decimals
        );
      }
    },
    setMaxFromPolls() {
      console.log("setMaxFromPolls");

      const userMax0 = this.pool.token0.userReward;
      const userMax1 = this.pool.token1.userReward;

      const poolMax0 = this.pool.token0.poolBalance;
      const poolMax1 = this.pool.token1.poolBalance;

      let max0 = +userMax0 < +poolMax0 ? userMax0 : poolMax0;
      let max1 = +userMax1 < +poolMax1 ? userMax1 : poolMax1;

      this.maxAmount0 = max0;
      this.maxAmount1 = max1;
    },
    checkMaxAccepted() {
      const userMax0 = this.pool.token0.userReward;
      const userMax1 = this.pool.token1.userReward;

      const poolMax0 = this.pool.token0.poolBalance;
      const poolMax1 = this.pool.token1.poolBalance;

      if (+userMax0 < +poolMax0 && +userMax1 < +poolMax1) {
        console.log("ACCEPTED: LOWER", userMax0, userMax1);
        return false;
      }

      if (+userMax0 !== +poolMax0 && +userMax1 !== +poolMax1) {
        this.showInfoText = true;
      }

      //this.setMaxFromPolls();
      console.log("POOL BALANCE < USER");
      return true;
    },
    closePopup() {
      this.$store.commit("hideSorbettoPopups");
    },
  },
  async created() {
    console.log("POOL", this.pool);

    //this.setMaxFromPolls();
    const needUpdateMax = this.checkMaxAccepted();

    if (needUpdateMax) await this.getMaxAmounts();
  },
  components: {
    Input,
  },
};
</script>

<style lang="scss" scoped>
.popup-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.04) !important;
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;

  .btm-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
    p {
      font-size: 15px;
      padding-right: 20px;
    }

    a {
      text-decoration: underline;
    }
  }

  &.dark-theme {
    .popup-content {
      background: #2c2c2c;
    }

    .popup-title {
      color: #fff;
    }
  }

  .popup-content {
    width: 95%;
    max-width: 550px;
    background: #f6f9fa;
    border-radius: 20px;
    padding: 30px 30px 20px 30px;
    position: relative;
    overflow: hidden;

    .bg-img {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
      z-index: 1;
    }

    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 16px;
      height: 16px;
      object-fit: contain;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 2;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .popup-title {
    font-size: 28px;
    line-height: 38px;
    color: #252423;
    text-align: center;
    margin-bottom: 30px;
    font-weight: bold;
    position: relative;
    z-index: 2;
  }

  .action-btn {
    border: 1px solid #2bd2f7;
    box-sizing: border-box;
    border-radius: 12px;
    height: 40px;
    min-width: 126px;
    padding: 0 15px;
    background: transparent;
    outline: none;
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    text-align: center;
    color: #2bd2f7;
    transition: all 0.3s ease;
    display: block;
    margin-left: auto;
    position: relative;
    z-index: 2;

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
}

@media screen and (max-width: 460px) {
  .popup-wrap.dark-theme .popup-title {
    font-size: 24px;
  }
}
</style>
