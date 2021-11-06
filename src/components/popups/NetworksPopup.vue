<template>
  <div class="network-popup" @click="closePopup">
    <div class="popup-content" @click.stop>
      <img
        src="@/assets/images/sorbetto/close-btn-white.svg"
        alt=""
        class="close-btn"
        @click="closePopup"
      />
      <img src="@/assets/images/network-popup-bg.png" alt="" class="bg-img" />

      <p class="title">Select your network</p>

      <div class="inner-block">
        <div class="items-wrap">
          <div
            class="network-item"
            v-for="network in networks"
            :key="network.chainId"
            @click="switchNetwork(network.chainId)"
          >
            <img :src="network.image" alt="" />
            <p>{{ network.symbol }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const ethNetwork = require("@/assets/images/networks/eth.svg");
const bscNetwork = require("@/assets/images/networks/bsc.svg");
const ftmNetwork = require("@/assets/images/networks/ftm.svg");
const avalancheNetwork = require("@/assets/images/networks/avalanche.png");
const arbitrumNetwork = require("@/assets/images/networks/arbitrum.svg");

import chainSwich from "@/mixins/chainSwitch";

export default {
  mixins: [chainSwich],
  data: () => ({
    networks: [
      {
        chainId: "0x1",
        chainId: 1,
        symbol: "ETH",
        name: "Ethereum Mainnet",
        image: ethNetwork,
      },
      {
        chainId: "0x38",
        chainId: 56,
        symbol: "BSC",
        name: "Smart Chain",
        image: bscNetwork,
      },
      {
        chainId: "0xfa",
        chainId: 250,
        symbol: "FTM",
        name: "Fantom Opera",
        image: ftmNetwork,
      },
      {
        chainId: "0xa86a",
        chainId: 43114,
        symbol: "AVAX",
        name: "Avalanche Mainnet",
        image: avalancheNetwork,
      },
      {
        chainId: "0xa4b1",
        chainId: 42161,
        symbol: "AETH",
        name: "Arbitrum One",
        image: arbitrumNetwork,
      },
    ],
  }),
  methods: {
    closePopup() {
      this.$store.commit("setShowNetworkPopup", false);
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.network-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 500;
  display: grid;
  place-items: center;
  overflow-y: auto;
  padding: 70px 10px;
  background: rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  z-index: 1000;

  .inner-block {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    width: 90%;
    max-width: 300px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;

    .info-wrap {
      padding: 20px 15px 30px 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      .network-block {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 58px;
        padding: 10px 20px;
        margin-top: 10px;

        p {
          font-size: 16px;
        }

        .point {
          content: "";
          width: 10px;
          height: 10px;
          background: #59b3ae;
          display: block;
          margin-right: 10px;
          border-radius: 50%;
        }
      }

      .info-text {
        font-size: 16px;
      }

      .metamask-img {
        width: 56px;
        height: 56px;
        margin-bottom: 10px;
        object-fit: contain;
      }
    }

    .items-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      padding: 30px 0 20px 0;

      .network-item {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
        margin: 5px;
        width: 85px;
        height: 40px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid transparent;

        &:hover,
        &.active {
          border: 1px solid #2bd2f7;
          color: #fff;
        }

        img {
          height: 17px;
          width: auto;
          object-fit: contain;
          margin-right: 3px;
        }
      }
    }
  }

  .popup-content {
    max-width: 446px;
    width: 95%;
    position: relative;
    padding: 30px 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    overflow: hidden;
    background: #252423;
    border-radius: 12px;
    color: #fff;

    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 18px;
      height: 18px;
      object-fit: contain;
      z-index: 2;

      &:hover {
        transform: scale(1.1);
      }
    }

    .title {
      font-size: 28px;
      line-height: 38px;
      margin-bottom: 10px;
      z-index: 2;
      font-weight: bold;
    }

    .bg-img {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
      z-index: 1;
    }
  }
}

@media screen and (max-width: 460px) {
  .network-popup .popup-content .title {
    font-size: 24px;
  }
}

@media screen and (max-width: 400px) {
  .network-popup .inner-block {
    width: 100%;
  }
}
</style>
