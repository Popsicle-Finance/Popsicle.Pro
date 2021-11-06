<template>
  <div class="token-item" v-if="tokenItem" @click="setTokenActive">
    <div class="token-info">
      <div class="token-icon">
        <img :src="tokenImage" alt="" />
      </div>

      <p class="token-symbol">{{ tokenItem.symbol }}</p>
    </div>
    <div class="token-balance">
      <p>{{ tokenItem.parsedBalance }}</p>
      <p class="usd-info" v-if="tokenInUsd">${{ tokenInUsd }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tokenItem: {
      type: Object,
      required: true,
    },
  },
  computed: {
    tokenImage() {
      if (this.tokenItem.logoURI) return this.tokenItem.logoURI;
      return require(`@/assets/images/Token_ICE.svg`);
    },
    tokenInUsd() {
      if (this.tokenItem.price) {
        return parseFloat(
          this.tokenItem.parsedBalance * this.tokenItem.price
        ).toFixed(4);
      }

      return false;
    },
  },
  methods: {
    setTokenActive() {
      this.$emit("tokenClick", this.tokenItem.address);
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.token-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .token-info {
    display: flex;
    align-items: center;
    line-height: 1.5;

    .token-icon {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;

      img {
        max-height: 100%;
        max-width: 100%;
        height: auto;
      }
    }

    .token-symbol {
      font-size: 14px;
    }
  }

  .token-balance {
    text-align: right;

    .usd-info {
      color: #868686;
    }
  }
}
</style>
