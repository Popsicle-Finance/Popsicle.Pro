<template>
  <div class="btn-grey" @click="showPopup">
    <img :src="activeNetwork.image" />
    <small class="ml-1 text-center">{{ activeNetwork.name }}</small>
  </div>
</template>

<script>
const ethNetwork = require("@/assets/images/networks/eth.svg");
const bscNetwork = require("@/assets/images/networks/bsc.svg");
const ftmNetwork = require("@/assets/images/networks/ftm.svg");
const avalancheNetwork = require("@/assets/images/networks/avalanche.png");
const arbitrumNetwork = require("@/assets/images/networks/arbitrum.svg");

export default {
  data() {
    return {
      networks: [
        {
          id: 1,
          name: "ETH",
          image: ethNetwork,
        },
        {
          id: 56,
          name: "BSC",
          image: bscNetwork,
        },
        {
          id: 250,
          name: "Fantom",
          image: ftmNetwork,
        },
        {
          id: 43114,
          name: "AVAX",
          image: avalancheNetwork,
        },
        {
          id: 42161,
          name: "AETH",
          image: arbitrumNetwork,
        },
      ],
    };
  },
  computed: {
    chain() {
      return this.$store.getters.getChain;
    },
    activeNetwork() {
      const network = this.networks.find((item) => item.id === this.chain);
      return network;
    },
  },
  methods: {
    showPopup() {
      this.$store.commit("setShowNetworkPopup", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.btn1,
.btn-grey {
  height: 40px !important;
  background: rgba(255, 255, 255, 0.04);
  border: 0.5px solid rgba(255, 255, 255, 0.2) !important;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04) !important;
    border: 0.5px solid #2bd2f7 !important;
  }
}

img {
  height: 20px;
  width: auto;
}
</style>
