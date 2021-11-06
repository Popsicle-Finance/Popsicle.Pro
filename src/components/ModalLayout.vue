<template>
  <div class="modal-layout">
    <ModalConnect />
    <ModalDeleteProposal />

    <ModalProvider />

    <Modal id="modalHarvestEPS" title="Token to harvest">
      <div class="harvesting-box">
        <div class="item">
          <div class="icon-harvest">
            <img src="@/assets/images/ice.svg" alt="" />
          </div>
          <div
            class="d-flex flex-column justify-content-center"
            v-if="epsRewards"
          >
            <p>ICE</p>
            <p>{{ epsRewards.ice }}</p>
            <button
              type="submit"
              class="btn-main btn-accent mt-3"
              @click="handleHarvestICE()"
            >
              <span class="text-white">Harvest</span>
            </button>
          </div>
        </div>
        <div class="item">
          <div class="icon-harvest">
            <img src="@/assets/images/Ellipsis.svg" alt="" />
          </div>
          <div v-if="epsRewards">
            <p>EPS</p>
            <p>{{ epsRewards.eps }}</p>
            <button
              type="submit"
              class="btn-main btn-accent mt-3"
              @click="handleHarvestEPS()"
            >
              <span class="text-white">Harvest</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>

    <ModalSelectNetwork
      title="Select your network"
      :activePoint="activePoint"
      :selectedText="selectedText"
      @toggle="handleToggleNetwork"
    />

    <!-- Popsicle stand modals -->
    <ModalDeposit
      id="modalIceDepositStand"
      image="tokens/ice.svg"
      title="Stake your"
      token="ICE"
      :pool="pool"
      :selectedBalance="selectedBalance"
      @deposit="handleDepositStand"
    />

    <!-- Deposit modal for pools -->
    <ModalDeposit
      id="modalIceDeposit"
      image="tokens/ice.svg"
      title="Stake your"
      token="ICE"
      :pool="pool"
      :selectedBalance="selectedBalance"
      @deposit="handleDeposit"
    />
    <ModalDeposit
      id="modalFUSDTDeposit"
      image="tokens/tether.svg"
      title="Stake your"
      token="USDT"
      :pool="pool"
      :selectedBalance="selectedBalance"
      @deposit="handleDeposit"
    />
    <ModalDeposit
      id="modalBNBDeposit"
      image="tokens/lp.svg"
      title="Stake your"
      token="LP"
      :pool="pool"
      :selectedBalance="selectedBalance"
      @deposit="handleDeposit"
    />
    <ModalDeposit
      id="modalCurveDeposit"
      image="tokens/lp.svg"
      title="Stake your"
      token="LP"
      :pool="pool"
      :selectedBalance="selectedBalance"
      @deposit="handleDeposit"
    />
    <ModalDeposit
      id="modalYUSDTDeposit"
      image="tokens/yearn.svg"
      title="Stake your"
      token="yvUSDT"
      :pool="pool"
      :selectedBalance="selectedBalance"
      @deposit="handleDeposit"
    />
    <ModalDeposit
      id="modalSTAKERDeposit"
      image="tokens/lp.svg"
      title="Stake your"
      token="LP's"
      :pool="pool"
      :selectedBalance="selectedBalance"
      @deposit="handleDeposit"
    />

    <!-- Withdraw modals for pools -->
    <ModalWithdraw
      id="modalIceWithdrawStand"
      image="tokens/ice.svg"
      title="Unstake your"
      token="ICE"
      :pool="pool"
      :selectedBalance="selectedBalance"
      @withdraw="handleWithdrawStand"
    />

    <ModalWithdraw
      id="modalIceWithdraw"
      image="tokens/ice.svg"
      title="Unstake your"
      token="ICE"
      :pool="pool"
      :selectedBalance="selectedBalance"
      @withdraw="handleWithdraw"
    />
    <ModalWithdraw
      id="modalFUSDTWithdraw"
      image="tokens/tether.svg"
      title="Unstake your"
      token="USDT"
      :pool="pool"
      :selectedBalance="selectedBalance"
      @withdraw="handleWithdraw"
    />
    <ModalWithdraw
      id="modalBNBWithdraw"
      image="tokens/lp.svg"
      title="Unstake your"
      token="LP"
      :pool="pool"
      :selectedBalance="selectedBalance"
      @withdraw="handleWithdraw"
    />
    <ModalWithdraw
      id="modalCurveWithdraw"
      image="tokens/lp.svg"
      title="Unstake your"
      token="LP"
      :pool="pool"
      :selectedBalance="selectedBalance"
      @withdraw="handleWithdraw"
    />
    <ModalWithdraw
      id="modalYUSDTWithdraw"
      image="tokens/yearn.svg"
      title="Unstake your"
      token="yvUSDT"
      :pool="pool"
      :selectedBalance="selectedBalance"
      @withdraw="handleWithdraw"
    />
    <ModalWithdraw
      id="modalSTAKERWithdraw"
      image="tokens/lp.svg"
      title="Unstake your"
      token="LP's"
      :pool="pool"
      :selectedBalance="selectedBalance"
      @withdraw="handleWithdraw"
    />
  </div>
</template>

<script>
export default {
  emits: ["deposit", "withdraw", "toggleNetwork"],
  props: {
    pool: {
      type: Object,
      required: true,
    },
    selectedBalance: {
      type: String,
    },
    activePoint: {
      type: Number,
    },
    selectedText: {
      type: String,
    },
    epsRewards: {
      type: Object,
    },
  },
  methods: {
    handleDeposit({ pool, amount }) {
      this.$emit("deposit", { pool, amount });
    },
    handleDepositStand({ pool, amount }) {
      this.$emit("depositStand", { pool, amount });
    },
    handleWithdraw({ pool, amount }) {
      this.$emit("withdraw", { pool, amount });
    },
    handleWithdrawStand({ pool, amount }) {
      this.$emit("withdrawStand", { pool, amount });
    },
    handleToggleNetwork({ name, point }) {
      this.$emit("toggleNetwork", { name, point });
    },
    handleHarvestEPS() {
      this.$emit("harvestEPS");
    },
    handleHarvestICE() {
      this.$emit("harvestICE");
    },
  },
};
</script>

<style></style>
