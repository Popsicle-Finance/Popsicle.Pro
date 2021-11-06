<template>
  <div class="wrapper-networks">
    <DropdownNetworks
      :networks="fromChains"
      @changeChain="switchNetwork"
      :defaultChain="true"
    />
    <img
      class="swap-img"
      src="@/assets/images/bridge.svg"
      @click="switchNetwork(activeTo)"
      alt="Bridge"
    />
    <DropdownNetworks :networks="toChains" @changeChain="changeToChain" />
  </div>
</template>

<script>
const DropdownNetworks = () => import("@/components/bridge/DropdownNetwork");
import chainSwitch from "@/mixins/chainSwitch";
export default {
  mixins: [chainSwitch],

  props: {
    fromChains: {
      type: Array,
      required: true,
    },
    toChains: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      activeTo: "",
    };
  },

  methods: {
    changeToChain(chainId) {
      this.activeTo = chainId;
      this.$emit("changeToChain", chainId);
    },
  },

  components: {
    DropdownNetworks,
  },
};
</script>

<style lang="scss" scoped>
.wrapper-networks {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 14px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.swap-img {
  margin: 0 10px;
  cursor: pointer;
}

@media screen and (max-width: 600px) {
  .wrapper-networks {
    flex-direction: column;
  }
  .swap-img {
    margin: 15px 0;
    transform: rotate(90deg);
  }
}
</style>
