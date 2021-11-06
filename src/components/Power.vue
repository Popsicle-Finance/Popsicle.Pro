<template>
  <div class="voting-power">
    <img src="@/assets/images/tokens/ice.svg" alt="ice" />
    <span>Your voting power </span>
    <span v-if="wallet" class="mx-1 fade-in">{{ power(wallet.power) }}</span>
    <span
      v-if="!wallet"
      class="d-flex justify-content-center"
      style="width: 60px;"
    >
      <Loading />
    </span>
    <span>ICE</span>
  </div>
</template>

<script>
export default {
  props: {
    wallet: {
      type: Object,
    },
  },
  methods: {
    power(value) {
      return parseFloat(value).toFixed(2);
    },
  },
};
</script>

<style lang="scss">
.voting-power {
  padding: 10px 15px;
  position: relative;
  cursor: pointer;

  display: flex;
  align-items: center;

  img {
    width: 20px;
    margin-right: 5px;
  }

  border-radius: 12px;

  &:hover {
    &::after {
      content: "Your voting power is the amount of ICE you own square rooted";
      position: absolute;

      top: calc(-100% - 60px);
      width: 100%;
      right: 0;
      padding: 10px 15px;

      background: inherit;
      border-radius: 12px;
    }
  }

  // icons
  // wallet data
  // voting power of users

  // Wallet - copy to clipboard

  // Creating
}
</style>
