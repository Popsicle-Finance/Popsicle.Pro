<template>
  <Modal id="modal_erc" :title="title">
    <div class="select-modal">
      <button
        class="d-flex align-items-center"
        :class="{ active: activePoint === 1 }"
        @click="handleToggleNetwork('Ethereum Mainnet', 1)"
      >
        <img src="@/assets/images/eth-small.svg" alt="" />
        <span>ETH</span>
      </button>
      <button
        class="d-flex align-items-center"
        :class="{ active: activePoint === 2 }"
        @click="handleToggleNetwork('Smart Chain', 2)"
      >
        <img src="@/assets/images/bsc-small.svg" alt="" />
        <span>BSC</span>
      </button>
      <button
        class="d-flex align-items-center"
        :class="{ active: activePoint === 3 }"
        @click="handleToggleNetwork('Fantom Opera', 3)"
      >
        <img src="@/assets/images/networks/fantom.svg" alt="" />
        <span>Fantom</span>
      </button>
    </div>
    <img src="@/assets/images/fox.svg" alt="Select a wallet provider" />

    <div v-if="activePoint === 1">
      <p class="h5">Go to your MetaMask</p>
      <p class="h5">Change your network chain to</p>
    </div>
    <div v-else-if="activePoint === 2">
      <p class="h5">
        Your are currently browsing popsicle on Binance Smart Chain
      </p>
    </div>
    <div v-else-if="activePoint === 3">
      <p class="h5">
        Your are currently browsing popsicle on Fantom Opera Mainnet
      </p>
    </div>
    <div class="selected-network" v-if="activePoint === 1">
      <div class="point" :class="{ active: activePoint === 1 }"></div>
      <span class="selected-text">{{ selectedText }}</span>
    </div>
  </Modal>
</template>

<script>
export default {
  emits: ["toggle"],
  props: {
    title: {
      type: String,
      required: true,
    },
    activePoint: {
      type: Number,
      required: true,
    },
    selectedText: {
      type: String,
    },
  },
  methods: {
    handleToggleNetwork(name, point) {
      this.$emit("toggle", { name, point });
    },
  },
};
</script>

<style></style>
