<template>
  <div class="nice-view">
    <img class="bg-1" src="@/assets/images/sorbetto/pool-bg-1.png" alt="" />
    <img class="bg-2" src="@/assets/images/sorbetto/pool-bg-2.png" alt="" />

    <div class="content-wrap">
      <!-- <div class="empty-block" v-if="nIceError">
        <p class="warning-text">{{ nIceError }}</p>
      </div> -->

      <div class="error-wrapper" v-if="nIceError">
        <Error :errorText="nIceError" />
      </div>

      <template v-if="!nIceError && tokensInfo">
        <div class="main-col">
          <div class="title-wrap">
            <p class="title">{{ action }}</p>
            <p class="additional" :class="{ highlight: isUserStake }">
              {{ rateInfo }}
            </p>
          </div>

          <template v-if="isUserLocked">
            <LockedTimer :finalTime="lockedUntil" />
          </template>

          <Input
            :name="fromToken.name"
            :max="isUserLocked ? null : fromToken.userBalance"
            @update="updateMainValue"
            :value="amount"
            :error="amountError"
            :disabled="isUserLocked"
          />

          <div class="toggle-btn" @click="toggleAction">
            <img src="@/assets/images/arrow-up-down.svg" alt="" />
          </div>

          <Input :name="toToken.name" :value="toTokenAmount" :disabled="true" />

          <div class="inform-board">
            <div class="text-wrap">
              <p>
                Stake your ICE tokens to obtain nICE in order to take part in
                the 20% fee sharing of Popsicle Finance fees. When you unstake
                your nICE tokens, you will receive your deposited ICE plus the
                additional fees collected! There is a 24 hours time lock on
                deposits, everytime you deposit, the 24 hours period starts from
                the beginning. Read more about how ICE staking works in our
                <a
                  target="_blank"
                  href="https://popsicle-finance-wiki.gitbook.io/popsicle-finance/"
                  >Docs</a
                >!
              </p>
            </div>
          </div>

          <div class="btm-actions-wrap">
            <button
              class="action-btn"
              :disabled="isActionDisabled"
              @click="actionHandler"
            >
              {{ actionBtnText }}
            </button>
          </div>
        </div>

        <InfoBlock :tokensInfo="tokensInfo" />
      </template>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import nIceMixin from "@/mixins/nIce";
const InfoBlock = () => import("@/components/nIce/InfoBlock");
const Input = () => import("@/components/sorbetto/Pool/PoolInput");
const LockedTimer = () => import("@/views/NIce/LockedTimer");
const Error = () => import("@/components/ui/Error");

export default {
  mixins: [nIceMixin],
  data() {
    return {
      action: "Stake",
      amount: "",
      amountError: "",
      lockedUntil: false,
      updateNIceInterval: null,
      nIceError: null,
    };
  },
  computed: {
    isUserLocked() {
      return (
        this.lockedUntil &&
        Number(this.lockedUntil) !== 0 &&
        this.action === "Unstake"
      );
    },
    isUserStake() {
      return (
        this.tokensInfo.mainToken.userBalance &&
        +this.tokensInfo.mainToken.userBalance > 0
      );
    },
    rateInfo() {
      if (
        this.tokensInfo.mainToken.userBalance &&
        +this.tokensInfo.mainToken.userBalance > 1
      ) {
        const rate = parseFloat(
          +this.tokensInfo.mainToken.userBalance / this.tokensInfo.tokensRate
        ).toFixed(2);

        const nICEParsed = parseFloat(
          +this.tokensInfo.mainToken.userBalance
        ).toFixed(2);

        return `${nICEParsed} ${
          this.tokensInfo.mainToken.name
        } = ${rate} ${this.tokensInfo.stakeToken.name.toUpperCase()}`;
      }

      const rate = parseFloat(1 / this.tokensInfo.tokensRate).toFixed(4);

      return `1 ${
        this.tokensInfo.mainToken.name
      } = ${rate} ${this.tokensInfo.stakeToken.name.toUpperCase()}`;
    },
    tokensInfo() {
      return this.$store.getters.getNIceStakeObject;
    },
    fromToken() {
      if (this.action === "Stake") return this.tokensInfo.stakeToken;
      if (this.action === "Unstake") return this.tokensInfo.mainToken;

      return "";
    },
    toToken() {
      if (this.action === "Stake") return this.tokensInfo.mainToken;
      if (this.action === "Unstake") return this.tokensInfo.stakeToken;

      return "";
    },
    toTokenAmount() {
      if (!this.amount) return "";

      // eslint-disable-next-line no-useless-escape
      let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (6 || -1) + `})?`);

      if (this.action === "Stake") {
        const amount = this.amount * this.tokensInfo.tokensRate;
        return amount.toString().match(re)[0];
      }
      if (this.action === "Unstake") {
        const amount = this.amount / this.tokensInfo.tokensRate;
        return amount.toString().match(re)[0];
      }
      return "";
    },

    isActionDisabled() {
      if (this.isUserLocked) return true;
      if (!+this.amount || this.amountError) return true;

      return false;
    },

    actionBtnText() {
      if (
        this.action === "Stake" &&
        !this.tokensInfo.stakeToken.isTokenApprowed
      )
        return "Approve ICE Spending";
      return this.action;
    },
    account() {
      return this.$store.getters.getAddress;
    },
  },
  methods: {
    toggleAction() {
      this.amount = "";
      this.amountError = "";

      if (this.action === "Stake") {
        this.action = "Unstake";
        return false;
      }

      if (this.action === "Unstake") {
        this.action = "Stake";
        return false;
      }
    },
    updateMainValue(value) {
      if (+value > +this.fromToken.userBalance) {
        this.amountError = `The value cannot be greater than ${this.fromToken.userBalance}`;
        return false;
      }

      this.amountError = "";
      this.amount = value;
    },
    async actionHandler() {
      if (this.isUserLocked) return false;
      if (!+this.amount || this.amountError) return false;

      if (this.action === "Stake") {
        if (this.tokensInfo.stakeToken.isTokenApprowed) {
          await this.stake();
          return false;
        }

        const approvedSuccess = await this.approveToken();
        if (approvedSuccess) await this.stake();
      }
      if (this.action === "Unstake") {
        await this.unstake();
      }
    },
    async stake() {
      console.log("STAKE");
      const notifyId = this.createNotification("Stake in progress");
      try {
        const amount = this.$ethers.utils.parseEther(this.amount);

        console.log("AMOUNT", amount.toString());

        const estimateGas = await this.tokensInfo.mainToken.contractInstance.estimateGas.mint(
          amount
        );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.tokensInfo.mainToken.contractInstance.mint(
          amount,
          {
            gasLimit,
          }
        );
        const receipt = await tx.wait();
        this.$store.commit("deleteNotification", notifyId);

        console.log("stake", receipt);
      } catch (e) {
        this.$store.commit("deleteNotification", notifyId);
        console.log("stake err:", e);
      }
    },
    async unstake() {
      console.log("UNSTAKE");
      const notifyId = this.createNotification("Unstake in progress");
      try {
        const amount = this.$ethers.utils.parseEther(this.amount);
        const userAccount = this.account;

        console.log("AMOUNT", amount.toString());

        const estimateGas = await this.tokensInfo.mainToken.contractInstance.estimateGas.burn(
          userAccount,
          amount
        );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.tokensInfo.mainToken.contractInstance.burn(
          userAccount,
          amount,
          {
            gasLimit,
          }
        );
        this.$store.commit("deleteNotification", notifyId);
        const receipt = await tx.wait();

        console.log("stake", receipt);
      } catch (e) {
        console.log("stake err:", e);
        this.$store.commit("deleteNotification", notifyId);
      }
    },
    async approveToken() {
      const notifyId = this.createNotification("Approve in progress");
      try {
        const estimateGas = await this.tokensInfo.stakeToken.contractInstance.estimateGas.approve(
          this.tokensInfo.mainToken.contractInstance.address,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.tokensInfo.stakeToken.contractInstance.approve(
          this.tokensInfo.mainToken.contractInstance.address,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          {
            gasLimit,
          }
        );
        const receipt = await tx.wait();

        this.isApproved = true;
        console.log("APPROVE RESP:", receipt);
        this.$store.commit("deleteNotification", notifyId);
        return true;
      } catch (e) {
        console.log("isApprowed err:", e);
        this.$store.commit("deleteNotification", notifyId);
        return false;
      }
    },
    async getUserLocked() {
      try {
        const userAccount = this.account;

        const infoResp = await this.tokensInfo.mainToken.contractInstance.users(
          userAccount,
          {
            gasLimit: 1000000,
          }
        );

        const lockTimestamp = infoResp.lockedUntil.toString();
        const currentTimestamp = moment()
          .unix()
          .toString();

        if (lockTimestamp && lockTimestamp > currentTimestamp)
          return lockTimestamp;
        return false;
      } catch (e) {
        console.log("isApprowed err:", e);
      }
    },
    createNotification(msg) {
      const id = this.$store.getters.getNotificationId;

      const notification = { id, msg };

      this.$store.commit("addNotification", notification);

      return id;
    },
  },
  beforeDestroy() {
    clearInterval(this.updateNIceInterval);
  },
  async created() {
    await this.createNIceStakePool();
    this.lockedUntil = await this.getUserLocked();

    this.updateNIceInterval = setInterval(async () => {
      await this.createNIceStakePool();
      this.lockedUntil = await this.getUserLocked();
    }, 15000);
  },
  components: {
    Input,
    InfoBlock,
    LockedTimer,
    Error,
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.error-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10%;
  margin-left: auto;
  margin-right: auto;
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

.nice-view {
  min-height: calc(100vh - 80px);
  position: relative;
  overflow-x: hidden;
  padding: 80px 15px;

  a {
    text-decoration: underline;
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

  .content-wrap {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    max-width: 830px;
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    width: 100%;

    .main-col {
      width: 56.28%;
      background: #2c2c2c;
      box-shadow: 0px 0px 16px rgba(20, 20, 19, 0.05);
      border-radius: 12px;
      padding: 20px;

      .title-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;

        .title {
          font-size: 20px;
        }

        .additional {
          display: block;
          font-weight: 600;
          font-size: 14px;
          border: 0.5px solid transparent;
          transition: all 0.3s ease;
          border-radius: 12px;
          min-height: 24px;
          padding: 0 10px;

          &.highlight {
            background: linear-gradient(
              101.11deg,
              rgba(164, 243, 182, 0.2) 0%,
              rgba(188, 85, 252, 0.2) 100%
            );
            border: 0.5px solid rgba(255, 255, 255, 0.2);
            box-sizing: border-box;
          }
        }
      }

      .toggle-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        background: #252423;
        border-radius: 50%;
        cursor: pointer;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: -20px;

        &:hover {
          img {
            transform: scale(1.1);
          }
        }

        img {
          width: 20px;
          height: 20px;
          object-fit: contain;
          transition: all 0.3s ease;
        }
      }

      .inform-board {
        background: linear-gradient(
          180deg,
          rgba(145, 255, 232, 0.1) 0%,
          rgba(164, 222, 255, 0.1) 93.83%
        );
        border-radius: 8px;
        padding: 20px 10px;
        margin-bottom: 18px;

        .text-wrap {
          text-align: center;
          font-size: 12px;
          line-height: 16px;
        }
      }

      .btm-actions-wrap {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
}

@media screen and (max-width: 740px) {
  .nice-view .content-wrap {
    flex-wrap: wrap;
  }
  .nice-view .content-wrap .main-col {
    width: 100%;
    margin-bottom: 30px;
    order: 2;
  }
}
</style>
