<template>
  <div class="tokens-list-popup" @click="closePopup">
    <div class="popup-content" @click.stop>
      <img
        src="@/assets/images/sorbetto/close-btn-white.svg"
        alt=""
        class="close-btn"
        @click="closePopup"
      />
      <div class="head-wrap">
        <p class="title-text">Choose Token</p>
      </div>

      <div class="search-input">
        <img src="@/assets/images/search-icon.svg" alt="" class="search-icon" />
        <input
          type="text"
          placeholder="Search Name or Paste Token Address"
          v-model.trim="searchKey"
        />
        <img
          src="@/assets/images/sorbetto/close-btn-white.svg"
          alt=""
          class="reset-icon"
          v-show="searchKey"
          @click="resetSearch"
        />
      </div>

      <div class="list-wrap" v-if="searchTokens.length">
        <TokenItem
          v-for="token in searchTokens"
          :key="token.address"
          :tokenItem="token"
          @tokenClick="tokenClick"
        />
      </div>

      <div class="loading-wrapper" v-else-if="createTokenInProgress">
        <Loading />
      </div>

      <div class="no-result-block" v-else>
        <img src="@/assets/images/no-result.png" alt="" class="no-result-img" />
        <p class="warn-text">No results found</p>
      </div>
    </div>
  </div>
</template>

<script>
const TokenItem = () => import("@/components/sorbetto/TokensListItem");

import abiERC20 from "@/farm/abi/abiERC20";
import axios from "axios";

export default {
  props: {
    tokensList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchKey: "",
      createTokenInProgress: false,
    };
  },
  computed: {
    searchTokens() {
      return this.tokensList.filter((token) => {
        const isName =
          token.name.toLowerCase().indexOf(this.searchKey.toLowerCase()) !== -1;
        const isSymbol =
          token.symbol.toLowerCase().indexOf(this.searchKey.toLowerCase()) !==
          -1;
        const isAddress =
          token.address.toLowerCase().indexOf(this.searchKey.toLowerCase()) !==
          -1;
        return isName || isSymbol || isAddress;
      });
    },
    coingeckoTokensList() {
      return this.$store.getters.getCoingeckoTokensList;
    },
    userAccount() {
      return this.$store.getters.getAddress;
    },
  },
  watch: {
    searchKey(value) {
      if (value && !this.createTokenInProgress) this.checkTokenAddress(value);
    },
  },
  methods: {
    async checkTokenAddress(address) {
      try {
        const isAddress = this.$ethers.utils.isAddress(address);

        if (!isAddress) return false;

        const isAlreadyInList = this.tokensList.find(
          (token) =>
            token.address.toLowerCase().indexOf(address.toLowerCase()) !== -1
        );

        if (isAlreadyInList) return false;

        if (this.coingeckoTokensList === null) return false;

        const isInCoingeckoList = this.coingeckoTokensList.find(
          (token) =>
            token.address.toLowerCase().indexOf(address.toLowerCase()) !== -1
        );

        if (isInCoingeckoList) this.createTokenToList(isInCoingeckoList);
      } catch (e) {
        console.log("checkTokenAddress err:", e);
      }
    },
    async createTokenToList(tokenInfo) {
      try {
        this.createTokenInProgress = true;

        const tokenContract = new this.web3.eth.Contract(
          abiERC20,
          tokenInfo.address
        );

        const userBalance = await tokenContract.methods
          .balanceOf(this.userAccount)
          .call({ gas: 450000 });

        const parsedBalance = this.$ethers.utils.formatUnits(
          userBalance,
          tokenInfo.decimals
        );

        const pricesResponse = await axios.get(
          `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenInfo.address}&vs_currencies=usd`
        );

        let price = null;

        for (const property in pricesResponse.data) {
          console.log(`${property}: ${pricesResponse.data[property].usd}`);

          price = pricesResponse.data[property]?.usd;
        }

        const tokenObject = {
          ...tokenInfo,
          balance: userBalance,
          parsedBalance: parsedBalance,
          price,
        };

        console.log("RESULT TOKEN", tokenObject);

        const newList = [...this.tokensList, tokenObject];

        this.$store.commit("setTokensList", newList);

        this.createTokenInProgress = false;
      } catch (e) {
        console.log("createTokenToList err:", e);
        this.createTokenInProgress = false;
      }
    },
    tokenClick(payload) {
      this.$emit("tokenClick", payload);
    },
    resetSearch() {
      this.searchKey = "";
    },
    closePopup() {
      this.$emit("closePopup");
    },
  },
  components: {
    TokenItem,
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  min-height: 400px;
}

.no-result-block {
  text-align: center;
  min-height: 400px;

  .no-result-img {
    max-width: 100%;
    height: auto;
  }

  .warn-text {
    margin-top: -20px;
    font-weight: 600;
    font-size: 20px;
    line-height: 27px;
  }
}

.list-wrap {
  max-height: 400px;
  min-height: 400px;
  overflow-y: scroll;
  padding-right: 5px;
}

.search-input {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 8px 10px;
  margin-bottom: 20px;

  .search-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  input {
    flex: 1;
    background-color: transparent;
    padding: 0 11px;
    color: #fff;

    &::placeholder {
      color: #868686;
    }
  }

  .reset-icon {
    width: 16px;
    height: 16px;
    object-fit: contain;
    font-size: 14px;
    cursor: pointer;
  }
}

.tokens-list-popup {
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
  z-index: 2000;

  .head-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 23px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 20px;

    .title-text {
      text-align: left;
      font-size: 20px;
    }
  }

  .popup-content {
    max-width: 446px;
    width: 95%;
    position: relative;
    padding: 20px;
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
      width: 20px;
      height: 20px;
      object-fit: contain;
      z-index: 2;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>
