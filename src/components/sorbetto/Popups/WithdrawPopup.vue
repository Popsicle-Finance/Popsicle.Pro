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
      <p class="popup-title">
        Withdraw from your <br />
        PLP position
      </p>

      <Input
        :error="amountError"
        :value="amount"
        :theme="theme"
        :image="pool.lpIcon"
        :name="'PLP'"
        :max="pool.userLpBalance"
        @update="updateValue"
      />

      <div class="info-block">
        <div class="info-item">
          <span class="item-title"
            >Expected Amount of {{ pool.token0.symbol }} received</span
          >
          <span class="item-value"
            >~ {{ parseFloat(expectedToken0AmountInUsd).toFixed(4) }}</span
          >
        </div>

        <div class="info-item">
          <span class="item-title"
            >Expected Amount of {{ pool.token1.symbol }} received</span
          >
          <span class="item-value"
            >~ {{ parseFloat(expectedToken1AmountInUsd).toFixed(4) }}</span
          >
        </div>
      </div>

      <button
        class="action-btn"
        @click="withdrawHandler"
        :disabled="isBtnDisabled"
      >
        {{ actionBtnText }}
      </button>
    </div>
  </div>
</template>

<script>
const Input = () => import("@/components/sorbetto/Input");

export default {
  props: {
    theme: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      amount: "",
    };
  },
  computed: {
    userAccount() {
      return this.$store.getters.getAddress;
    },
    activePoolId() {
      return this.$store.getters.getSorbettoPopupPoolId;
    },
    pool() {
      return this.$store.getters.getSorbettoPoolById(this.activePoolId);
    },
    expectedPLPAmountInUsd() {
      if (this.amount) return this.amount * this.pool.plpPrice;

      return 0;
    },
    expectedToken0Amount() {
      if (this.expectedPLPAmountInUsd) {
        return (
          (this.expectedPLPAmountInUsd / 100) *
          this.pool.proportion.token0Percent
        );
      }
      return 0;
    },
    expectedToken1Amount() {
      if (this.expectedPLPAmountInUsd) {
        return (
          (this.expectedPLPAmountInUsd / 100) *
          this.pool.proportion.token1Percent
        );
      }
      return 0;
    },
    expectedToken0AmountInUsd() {
      if (this.expectedToken0Amount) {
        return this.expectedToken0Amount / this.pool.token0.price;
      }
      return 0;
    },
    expectedToken1AmountInUsd() {
      if (this.expectedToken1Amount) {
        return this.expectedToken1Amount / this.pool.token1.price;
      }
      return 0;
    },
    amountError() {
      if (this.amount && +this.amount > +this.pool.userLpBalance) {
        return `The value cannot be more than ${this.pool.userLpBalance}`;
      }

      return "";
    },
    actionBtnText() {
      return "Withdraw";
    },
    isBtnDisabled() {
      if (this.amountError) return true;

      if (!+this.amount) return true;

      return false;
    },
  },
  methods: {
    createNotification(msg) {
      const id = this.$store.getters.getNotificationId;

      const notification = { id, msg };

      this.$store.commit("addNotification", notification);

      return id;
    },
    updateValue(value) {
      this.amount = value;
    },
    async withdrawHandler() {
      if (this.amountError) return false;

      if (!+this.amount) return false;

      const notifyId = this.createNotification("Withdraw in progress");

      try {
        const amount = this.$ethers.utils.parseUnits(
          String(this.amount),
          this.pool.lpDecimals
        );
        const account = this.userAccount;
        const contract = this.pool.contractInstance;

        this.closePopup();

        await contract.methods
          .withdraw(String(amount), account)
          .send({ from: account });
        this.$store.commit("deleteNotification", notifyId);
      } catch (e) {
        this.$store.commit("deleteNotification", notifyId);
        console.log("withdraw err", e);
      }
    },
    closePopup() {
      this.$store.commit("hideSorbettoPopups");
    },
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

  .info-block {
    padding: 20px 10px;
    margin: 20px 0;
    background: #252423;
    border-radius: 8px;
    position: relative;
    z-index: 3;

    .info-item {
      display: flex;
      justify-content: space-between;
      font-weight: 300;
      font-size: 14px;
      line-height: 19px;
      letter-spacing: 0.02em;
    }

    .info-item:not(:last-child) {
      margin-bottom: 10px;
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
