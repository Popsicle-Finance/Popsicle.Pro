import axios from "axios";

import abiERC20 from "@/farm/abi/abiERC20";
import customTokenList from "@/utils/customTokensList";

export default {
  computed: {
    chainId() {
      return this.$store.getters.getChain;
    },
    tokensList() {
      return this.$store.getters.getTokensList;
    },
    tokenPrices() {
      return this.$store.getters.getTokenListPrices;
    },
    isTokensListLoading() {
      return this.$store.getters.getIsTokensListLoading;
    },
    userAccount() {
      return this.$store.getters.getAddress;
    },
  },
  methods: {
    async fetchDefaultToken() {
      try {
        const userChainBalance = await this.web3.eth.getBalance(this.userAccount);

        const chainToken = {
          allowance: 1,
          name: "Ethereum",
          symbol: "ETH",
          chainId: this.chainId,
          decimals: 18,
          balance: userChainBalance,
          parsedBalance: this.$ethers.utils.formatUnits(userChainBalance, 18),
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          logoURI:"https://etherscan.io/images/main/empty-token.png",
          priceAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        }

        if(this.chainId === 42161) {
          chainToken.priceAddress = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
        }

        return chainToken;
      } catch(e) {
        console.log("Error", e)
      }
    },
    async fetchTokenList() {
      try {
        if(this.$store.getters.getCoingeckoTokensList === null && this.chainId === 1) {
          try {
            const coingeckoListResp = await axios.get(
              "https://tokens.coingecko.com/uniswap/all.json"
            );

            console.log("coingeckoListResp", coingeckoListResp.data.tokens);

            this.$store.commit("setCoingeckoTokensList", coingeckoListResp.data.tokens)
          } catch(e) {
            console.log("coingeckoList request err:", e)
          }
        }

        const chainTokens = customTokenList.filter((tokenInfo) => tokenInfo.chainId === this.chainId);

        const basicTokens = chainTokens;

        return [
          ...basicTokens,
        ];
      } catch (e) {
        console.log("fetchTokenList err:", e);
      }
    },
    async createUserTokenList(user) {
      const tokensCommonList = await this.fetchTokenList();

      const userTokensArray = await Promise.all(
        tokensCommonList.map((tokenInfo) =>
          this.fetchUserTokenInfo(tokenInfo, user)
        )
      );

      const chainToken = await this.fetchDefaultToken();

      userTokensArray.push(chainToken)

      const activeTokens = userTokensArray.filter(
        (tokenInfo) => tokenInfo.address
      );

      const activeTokensAddresses = [];

      activeTokens.forEach((tokenInfo) => {
        if(+tokenInfo.balance) activeTokensAddresses.push(tokenInfo.priceAddress || tokenInfo.address);
      });

      console.log("activeTokensAddresses", activeTokensAddresses);

      const tokenPricesResp = await this.fetchTokenPrices(
        activeTokensAddresses
      );

      this.$store.commit("setTokenListPrices", tokenPricesResp);

      const pricesTokenArray = activeTokens.map((tokenInfo) => {
        const priceObject = this.tokenPrices.find(
          (item) => (item.address.toLowerCase() === tokenInfo.priceAddress?.toLowerCase()) || (item.address.toLowerCase() === tokenInfo.address.toLowerCase())
        );

        if (priceObject) {
          return {
            ...tokenInfo,
            price: priceObject.price,
          };
        }

        return tokenInfo;
      });

      const finalTokenArray = pricesTokenArray.sort((a, b) => {
        if (Number(a.balance) > Number(b.balance)) return -1;
        if (Number(a.balance) < Number(b.balance)) return 1;
        return 0;
      });

      this.$store.commit("setTokensList", finalTokenArray);
      this.$store.commit("setIsTokensListLoading", );
    },
    async fetchUserTokenInfo(tokenInfo, user) {
      try {
        const tokenContract = new this.web3.eth.Contract(
          abiERC20,
          tokenInfo.address
        );

        const userBalance = await tokenContract.methods
          .balanceOf(user)
          .call({ gas: 450000 });

        const parsedBalance = this.$ethers.utils.formatUnits(
          userBalance,
          tokenInfo.decimals
        );

        return {
          ...tokenInfo,
          balance: userBalance,
          parsedBalance: parsedBalance,
        };
      } catch (e) {
        // console.log("fetchUserTokenInfo err:", e)
        return {};
      }
    },
    async fetchTokenPrices(addressArr) {
      try {

        const chainId = this.chainId === 42161 ? 'arbitrum-one' : "ethereum";

        const pricesResponse = await axios.get(
          `https://api.coingecko.com/api/v3/simple/token_price/${chainId}?contract_addresses=${addressArr.join()}&vs_currencies=usd`
        );

        console.log("fetchTokenPrices", pricesResponse);

        const respToArray = [];

        for (const property in pricesResponse.data) {
          console.log(`${property}: ${pricesResponse.data[property].usd}`);

          respToArray.push({
            address: property.toLowerCase(),
            price: pricesResponse.data[property].usd,
          });
        }

        return respToArray;
      } catch (e) {
        console.log("fetchTokenPrices err: ", e);
      }
    },
  },
};
