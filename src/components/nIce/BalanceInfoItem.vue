<template>
  <div class="balance-info-item">
    <p class="item-title">{{ title }}</p>
    <div class="token-info">
      <div class="image-wrap">
        <img :src="tokenImage" alt="" class="main-img" />
      </div>
      <div class="item-info-wrap">
        <p class="token-name">{{ name }}</p>
        <p class="amount">{{ parseFloat(value).toFixed(4) }}</p>
        <!-- <p class="value">$1242 Value</p> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    tokenImage() {
      try {
        if (this.name === "nICE")
          return require(`@/assets/images/Token_nICE.svg`);
        if (this.name === "ICE")
          return require(`@/assets/images/Token_ICE.svg`);

        return require(`@/assets/images/sorbetto/Token_${this.name}.svg`);
      } catch (e) {
        return require(`@/assets/images/sorbetto/Token_ETH.svg`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.balance-info-item {
  margin: 10px 0;
  .item-title {
    font-size: 14px;
    color: #868686;
    margin-bottom: 10px;
  }

  .token-info {
    display: flex;
    align-items: center;

    .item-info-wrap {
      .token-name {
        font-size: 14px;
        line-height: 1.5;
      }

      .amount {
        font-size: 18px;
        line-height: 25px;
      }

      .value {
        font-size: 12px;
        line-height: 16px;
        color: #868686;
      }
    }

    .image-wrap {
      position: relative;
      margin-right: 10px;

      .main-img {
        width: 46px;
        height: 46px;
        object-fit: contain;
      }
    }
  }
}
</style>
