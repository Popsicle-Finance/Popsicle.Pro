<template>
  <div class="aside-col">
    <div class="token-info">
      <div class="image-wrap">
        <img :src="tokenImage" alt="" class="main-img" />
        <img
          src="@/assets/images/sorbetto/Chain_1.png"
          alt=""
          class="chain-img"
        />
      </div>
      <div class="item-info-wrap">
        <p>{{ tokensInfo.mainToken.name }}</p>
        <p class="mini">
          {{ parseFloat(tokensInfo.mainToken.userBalance).toFixed(4) }}
        </p>
      </div>
    </div>

    <BalanceInfoItem
      :name="tokensInfo.stakeToken.name"
      :value="tokensInfo.stakeToken.userBalance"
      title="Balance"
    />

    <div class="divider"></div>

    <BalanceInfoItem
      :name="tokensInfo.mainToken.name"
      :value="tokensInfo.mainToken.userBalance"
      title="Stake"
    />

    <div class="inform-wrap">
      <InformItem
        v-for="(item, idx) in infoArray"
        :key="idx"
        :title="item.title"
        :value="item.value"
      />
    </div>
  </div>
</template>

<script>
const InformItem = () => import("@/components/nIce/InformItem");
const BalanceInfoItem = () => import("@/components/nIce/BalanceInfoItem");

export default {
  props: {
    tokensInfo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    infoArray() {
      return [
        {
          title: "Approximate Staking APR",
          value: `${this.tokensInfo.apr}%`,
        },
        {
          title: "Total ICE Locked",
          value: `${this.tokensInfo.tvl}`,
        },
        {
          title: "Staked Protocol Fees",
          value: `$${this.tokensInfo.iceAmount}`,
        },
      ];
    },
    tokenImage() {
      try {
        return require(`@/assets/images/sorbetto/Token_${this.tokensInfo.mainToken.name}.svg`);
      } catch (e) {
        return require(`@/assets/images/Token_${this.tokensInfo.mainToken.name}.svg`);
      }
    },
  },
  components: {
    BalanceInfoItem,
    InformItem,
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.aside-col {
  width: 41.3%;
  background: #2c2c2c;
  box-shadow: 0px 0px 16px rgba(20, 20, 19, 0.05);
  border-radius: 12px;
  padding: 20px;

  .inform-wrap {
    margin-top: 20px;
  }

  .divider {
    height: 1px;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    background: rgba(255, 255, 255, 0.1);
    content: "";
  }

  .token-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .item-info-wrap {
      p {
        font-weight: bold;
        font-size: 28px;
        line-height: 38px;
        color: #fff;

        &.mini {
          font-weight: normal;
          font-size: 14px;
          line-height: 1.5;
        }
      }
    }

    .image-wrap {
      position: relative;
      margin-right: 20px;

      .chain-img {
        position: absolute;
        bottom: 0;
        left: -10px;
        width: 30px;
        height: 30px;
        object-fit: contain;
      }

      .main-img {
        width: 80px;
        height: 80px;
        object-fit: contain;
      }
    }
  }
}

@media screen and (max-width: 740px) {
  .aside-col {
    width: 100%;
    margin-bottom: 30px;
    order: 1;
  }
}
</style>
