import sorbettoInfo from "@/utils/sorbetto/sorbetto";
import { PoolV3Actions } from "@/utils/sorbetto/libs/PoolV3Actions";
import { Token0ValuePrice } from "@/utils/sorbetto/libs/PriceMath";
import { GetUserPendingRewards } from "@/utils/sorbetto/libs/UserReward";
import { ConvertToProportion } from "@/utils/sorbetto/libs/ConvertToProportion";
import { GetLiquidityForAmounts } from "@/utils/sorbetto/libs/LiquidityAmounts";
import { GetSqrtRatioAtTick } from "@/utils/sorbetto/libs/TickMath";
import moment from "moment";

import strategyAbi from "@/utils/sorbetto/abi/StrategyAbi";

export default {
  data() {
    return {
      fragollaApyArray: null,
      usedCoins: [
        "shiba-inu",
        "ice-token",
        "spell-token",
        "fantom",
        "dydx",
        "weth",
        "tether",
        "usd-coin",
        "wrapped-bitcoin",
        "dai",
        "uniswap",
        "chainlink",
        "axie-infinity",
        "tether-eurt",
        "smooth-love-potion",
        "yield-guild-games",
        "magic-internet-money",
        "gmx"
      ],
      tokenPrices: null,
    };
  },
  computed: {
    chainId() {
      return this.$store.getters.getChain;
    },
    userAccount() {
      return this.$store.getters.getAddress;
    },
  },
  methods: {
    async createSorbetto() {
      if (!sorbettoInfo) return false;

      if (this.chainId !== 1) {
        this.$store.commit(
          "setSorbettoError",
          `Our Multichain Yield Optimizer is Being Developed! While you wait, please consider using our V3 Optimizer on ETH!`
        );
        this.$store.commit("setSorbettoPoolsLoading", false);
        return false;
      }

      if (!this.userAccount) {
        console.log("ACCOUNT ERROR: NO ACCOUNT BRO!");
        this.$store.commit(
          "setSorbettoError",
          "Please connect to use V3 Optimizer"
        );
        this.$store.commit("setSorbettoPoolsLoading", false);
        return false;
      }

      this.fragollaApyArray = await this.getFragolasApy();

      const chainPools = sorbettoInfo.filter((pool) => pool.chain === this.chainId);

      this.tokenPrices = await this.fetchTokensPrice();

      const sorbettoPools = await Promise.all(
        chainPools.map((poolInfo) =>
          this.createSorbettoPool(poolInfo, this.userAccount)
        )
      );

      // console.log("SORBETTO POOLS", sorbettoPools);
      this.$store.commit("setSorbettoPoolsLoading", false);
      this.$store.commit("setSorbettoPools", sorbettoPools);
    },
    async createSorbettoPool(poolInfo, userAccount) {
      const mainContract = new this.web3.eth.Contract(
        poolInfo.contract.abi,
        poolInfo.contract.address
      );

      const poolContract = new this.web3.eth.Contract(
        poolInfo.poolContract.abi,
        poolInfo.poolContract.address
      );

      const swapContract = new this.web3.eth.Contract(
        poolInfo.swap.abi,
        poolInfo.swap.address
      );

      const token0Contract = new this.web3.eth.Contract(
        poolInfo.token0.abi,
        poolInfo.token0.address
      );
      const token1Contract = new this.web3.eth.Contract(
        poolInfo.token1.abi,
        poolInfo.token1.address
      );

      const userChainBalance = await this.web3.eth.getBalance(userAccount);

      const token0Price = this.tokenPrices[poolInfo.token0.coinId].usd;
      const token1Price = this.tokenPrices[poolInfo.token1.coinId].usd;

      const token0PoolBalance = await this.getUserTokenBalance(
        poolInfo.contract.address,
        token0Contract,
        poolInfo.token0.decimals
      );
      const token1PoolBalance = await this.getUserTokenBalance(
        poolInfo.contract.address,
        token1Contract,
        poolInfo.token1.decimals
      );

      const token0Balance = await this.getUserTokenBalance(
        userAccount,
        token0Contract,
        poolInfo.token0.decimals
      );
      const token1Balance = await this.getUserTokenBalance(
        userAccount,
        token1Contract,
        poolInfo.token1.decimals
      );

      const userLpBalance = await this.getUserTokenBalance(
        userAccount,
        mainContract,
        poolInfo.lpDecimals
      );

      const userLpBalanceParsed = this.parseLpBalance(userLpBalance);

      // Vitalik init pools
      const {
        tokensOwed0,
        tokensOwed1,
      } = await this.getUserPendingRewardsLocal(
        poolContract,
        mainContract,
        userAccount
      );

      // Vitalik init pools
      const userLpInUsdLocal = await this.getLpPrice(
        userLpBalance,
        mainContract,
        poolContract,
        poolInfo.token0.decimals,
        poolInfo.token1.decimals,
        token0Price,
        token1Price,
        tokensOwed0,
        tokensOwed1
      );

      const token0Allowance = await this.getTokenAllowance(
        userAccount,
        poolInfo.contract.address,
        token0Contract
      );
      const token1Allowance = await this.getTokenAllowance(
        userAccount,
        poolInfo.contract.address,
        token1Contract
      );

      const token0SwapAllowance = await this.getTokenAllowance(
        userAccount,
        poolInfo.swap.address,
        token0Contract
      );
      const token1SwapAllowance = await this.getTokenAllowance(
        userAccount,
        poolInfo.swap.address,
        token1Contract
      );

      let poolApr = "xx";
      let feesIn24Hours = "xx";
      let lastRerangeTime = "xx";
      let lastRerangeCompoundValue = "xx";

      if (this.fragollaApyArray) {
        const thisPoolInfo = this.fragollaApyArray.find(
          (item) => item.fragolaAddress === poolInfo.contract.address
        );
        if (thisPoolInfo) {
          poolApr = thisPoolInfo.apr;
          feesIn24Hours = thisPoolInfo.feesIn24Hours;
          lastRerangeTime = thisPoolInfo.lastRerangeTime;
          lastRerangeCompoundValue = thisPoolInfo.lastRerangeCompoundValue;
        }
      }

      // Vitalik init pools
      const {
        tvlLocal,
        proportion,
        showBanner,
        plpPrice,
      } = await this.getPoolTvl(
        poolContract,
        mainContract,
        poolInfo.token0.decimals,
        poolInfo.token1.decimals,
        token0Price,
        token1Price
      );

      const maxCap = await this.fetchMaxCap(mainContract, plpPrice)

      const poolTokenRateLocal = await this.getTokenRateLocal(
        poolInfo.token0.decimals,
        poolContract
      );
      
      // Vitalik init pools
      const totalRewardBalance = await this.getUserTotalBalance(
        mainContract,
        token0Price,
        token1Price,
        poolInfo.token0.decimals,
        poolInfo.token1.decimals,
        tokensOwed0,
        tokensOwed1
      );


      // Vitalik init pools
      // let userLpInUsdLocal = 1
      // let totalRewardBalance = 33;
      // const tvlLocal = 33;
      // const proportion = { token0Percent: 50, token1Percent: 50 };
      // const showBanner = false;
      // const plpPrice = 33;

      const poolInfoArray = await this.createPoolInfo(
        poolApr,
        token0Price,
        token1Price,
        proportion,
        totalRewardBalance,
        feesIn24Hours,
        lastRerangeTime,
        lastRerangeCompoundValue,
        poolInfo.token0.symbol,
        poolInfo.token1.symbol
      );

      const tickChartData = await this.getTickData(poolInfo.contract.address);

      return {
        id: poolInfo.poolId,
        isNew: poolInfo.isNew,
        proportion,
        isDiscontinued: poolInfo.isDiscontinued,
        name: poolInfo.name,
        poolImage: poolInfo.poolImage,
        contractInstance: mainContract,
        poolContractInstance: poolContract,
        address: poolInfo.contract.address,
        lpDecimals: poolInfo.lpDecimals,
        userLpBalance,
        userLpBalanceParsed,
        poolInfoArray,
        tickChartData,
        poolTvl: tvlLocal,
        poolTokenRate: poolTokenRateLocal,
        poolApr,
        plpPrice,
        userLpInUsd: userLpInUsdLocal,
        userChainBalance,
        lpIcon: poolInfo.lpIcon,
        swapContract,
        feesIn24Hours,
        swapAddress: poolInfo.swap.address,
        poolPercent: poolInfo.poolPercent,
        maxCap,
        chainToken: {
          allowance: 1,
          swapAllowance: 1,
          symbol: "ETH",
          decimals: 18,
          balance: this.$ethers.utils.formatUnits(userChainBalance, 18),
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        },
        token0: {
          price: token0Price,
          poolBalance: token0PoolBalance,
          canBeDefault: poolInfo.token0.canBeDefault,
          symbol: poolInfo.token0.symbol,
          decimals: poolInfo.token0.decimals,
          address: poolInfo.token0.address,
          contractInstance: token0Contract,
          balance: token0Balance,
          allowance: token0Allowance,
          swapAllowance: token0SwapAllowance,
        },
        token1: {
          price: token1Price,
          poolBalance: token1PoolBalance,
          canBeDefault: poolInfo.token1.canBeDefault,
          symbol: poolInfo.token1.symbol,
          decimals: poolInfo.token1.decimals,
          address: poolInfo.token1.address,
          contractInstance: token1Contract,
          balance: token1Balance,
          allowance: token1Allowance,
          swapAllowance: token1SwapAllowance,
        },
        showBanner,
      };
    },
    async fetchMaxCap(mainContract, plpPrice) {
      try {
        const strategyAddr = await mainContract.methods.strategy().call();

        const strategyContract = new this.web3.eth.Contract(
          strategyAbi,
          strategyAddr
        );

        const maxTotalSupply = await strategyContract.methods.maxTotalSupply().call();

        const maxTotalSupplyParsed = this.$ethers.utils.formatUnits(maxTotalSupply)


        const maxCap = +maxTotalSupplyParsed * plpPrice

        return maxCap;
      } catch(e) {
        console.log("fetchMaxCap err: ", e)
      }
    },
    parseLpBalance(userLpBalance) {
      if (!+userLpBalance) return 0;

      let re = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^-?\\d+(?:\.\\d{0,` + (4 || -1) + `})?`
      );

      if (+userLpBalance < 0.0001 && +userLpBalance !== 0) {
        const start = userLpBalance.slice(0, 1);
        const endToParse = `${userLpBalance.slice(1)}`;

        const persedEnd = endToParse.replace(
          new RegExp(
            // eslint-disable-next-line no-useless-escape
            `(?<=\.)[0]*`
          ),
          ""
        );

        return `${start}..${persedEnd.slice(0, 5)}`;
      }

      return userLpBalance.toString().match(re)[0];
    },
    async createPoolInfo(
      poolApr,
      token0Price,
      token1Price,
      poolProportion,
      totalRewardBalance,
      feesIn24Hours,
      lastRerangeTime,
      lastRerangeCompoundValue,
      token0Symbol,
      token1Symbol
    ) {
      return [
        {
          title: "Current Pool Ratio",
          value: `${parseFloat(poolProportion.token0Percent).toFixed(
            2
          )}/${parseFloat(poolProportion.token1Percent).toFixed(2)}`,
          type: 1,
        },
        {
          title: `Price ${token0Symbol}`,
          value: token0Price,
          type: 2,
        },
        {
          title: `Price ${token1Symbol}`,
          value: token1Price,
          type: 2,
        },
        {
          title: "APR",
          value: poolApr,
          type: 3,
        },
        {
          title: "Pool earnings 24h",
          value: feesIn24Hours,
          type: 2,
        },
        {
          title: "Pool total earnings",
          value: totalRewardBalance,
          type: 2,
        },
        {
          title: "Last rerange time",
          value:
            lastRerangeTime === 0
              ? "N/A"
              : moment.unix(lastRerangeTime).format("YYYY-MM-DD HH:mm"),
          type: 1,
        },
        // {
        //   title: "Last rerange compound value",
        //   value: lastRerangeCompoundValue,
        //   type: 2,
        // },
      ];
    },
    async getTickData(fragolaAddress) {
      const payload = {
        fragolaAddress,
      };

      const data = await this.$store.dispatch("fetchTickData", payload);

      if (!data) return false;

      // const datesFilterArray = data.filter(item => {
      //     const minutes = moment.unix(item.timestamp).format("mm");

      //     return +minutes%15 === 0
      // })

      const datesArray = data.map((item) => {
        return moment.unix(item.timestamp).format("HH:mm");
      });

      const tickUpperArray = data.map((item) => item.tickUpper);
      const tickLowerArray = data.map((item) => item.tickLower);
      const currentTickArray = data.map((item) => item.currentTick);

      const result = {
        datesArray,
        tickLowerArray,
        currentTickArray,
        tickUpperArray,
      };

      return result;
    },
    async getUserTotalBalance(
      fragolaInstance,
      token0Price,
      token1Price,
      token0Decimals,
      token1Decimals,
      tokensOwed0,
      tokensOwed1
    ) {
      try {
        const token0Balance = await fragolaInstance.methods.totalFees0().call();
        const token1Balance = await fragolaInstance.methods.totalFees1().call();

        const token0InUsdTotal = await this.getTokenPriceLocal(
          token0Balance,
          token0Price,
          token0Decimals
        );
        const token1InUsdTotal = await this.getTokenPriceLocal(
          token1Balance,
          token1Price,
          token1Decimals
        );
        const tokensOwed0InUsdTotal = await this.getTokenPriceLocal(
          tokensOwed0,
          token0Price,
          token0Decimals
        );
        const tokensOwed1InUsdTotal = await this.getTokenPriceLocal(
          tokensOwed1,
          token1Price,
          token1Decimals
        );

        return (
          +token0InUsdTotal +
          +token1InUsdTotal +
          +tokensOwed0InUsdTotal +
          +tokensOwed1InUsdTotal
        );
      } catch (e) {
        console.log("getUserTokenBalance error:", e);
      }
    },
    async getPoolProportion(
      token0Decimals,
      token1Decimals,
      fragolaContract,
      poolContract
    ) {
      const desiredAmount0 = String(
        this.$ethers.utils.parseUnits("1", token0Decimals)
      );
      const desiredAmount1 = String(
        this.$ethers.utils.parseUnits("1", token1Decimals)
      );

      const response = await ConvertToProportion(
        desiredAmount0,
        desiredAmount1,
        fragolaContract,
        poolContract
      );

      let { amount0, amount1 } = response;

      const proportionAmount0 = this.$ethers.utils.formatUnits(
        amount0,
        token0Decimals
      );
      const proportionAmount1 = this.$ethers.utils.formatUnits(
        amount1,
        token1Decimals
      );

      return `${parseFloat(proportionAmount0 * 100).toFixed(4)}/${parseFloat(
        proportionAmount1 * 100
      ).toFixed(4)}`;
    },
    async getUserTokenBalance(user, tokenContract, decimals) {
      try {
        const balance = await tokenContract.methods.balanceOf(user).call();
        const parsedResult = this.$ethers.utils.formatUnits(balance, decimals);

        if (decimals === 0) {
          return parseFloat(parsedResult).toFixed(0);
        }

        return parsedResult;
      } catch (e) {
        console.log("getUserTokenBalance error:", e);
      }
    },
    async getTokenAllowance(user, sorbettoAddr, tokenContract) {
      try {
        const allowance = await tokenContract.methods
          .allowance(user, sorbettoAddr)
          .call();

        return allowance;
      } catch (e) {
        console.log("getUserTokenBalance error:", e);
      }
    },
    async getTokenPriceLocal(amount, price, decimals) {
      try {
        if (+amount.toString() === 0) {
          return 0;
        }

        let parsedAmount = this.$ethers.utils.formatUnits(amount, decimals);

        const resultAmount = parsedAmount * price;

        let re = new RegExp(
          // eslint-disable-next-line no-useless-escape
          `^-?\\d+(?:\.\\d{0,` + (decimals || -1) + `})?`
        );

        const formatAmount = parseFloat(resultAmount)
          .toFixed(20)
          .toString()
          .match(re)[0];

        // const formarResult = this.$ethers.utils.formatUnits(formatAmount, decimals);

        return parseFloat(+formatAmount).toFixed(2);
      } catch (e) {
        console.log("getUserTokenBalance error:", e);
      }
    },
    async getLpPrice(
      amount,
      fragolaContract,
      poolContract,
      token0Decimals,
      token1Decimals,
      token0Price,
      token1Price,
      tokensOwed0,
      tokensOwed1
    ) {
      let sim = new PoolV3Actions(poolContract);
      const date = parseFloat(new Date() / 1000).toFixed(0);

      let tickLower = await fragolaContract.methods.tickLower().call();
      let tickUpper = await fragolaContract.methods.tickUpper().call();
      let position = await fragolaContract.methods.position().call();
      let totalBalance = await fragolaContract.methods.totalSupply().call();

      totalBalance = this.$ethers.BigNumber.from(totalBalance);

      amount = this.$ethers.utils.parseUnits(amount, 18);

      if (totalBalance.lte(0) || amount.eq(0) || amount.gt(totalBalance)) {
        return "insufficient amount";
      }

      const slot0Resp = await poolContract.methods.slot0().call();
      const sqrtRatioX96 = this.$ethers.BigNumber.from(slot0Resp.sqrtPriceX96);

      const sqrtRatioAX96 = GetSqrtRatioAtTick(tickLower);
      const sqrtRatioBX96 = GetSqrtRatioAtTick(tickUpper);

      const protocolFees0 = await fragolaContract.methods
        .protocolFees0()
        .call();
      const protocolFees1 = await fragolaContract.methods
        .protocolFees1()
        .call();

      const protocolLiquidity = GetLiquidityForAmounts(
        sqrtRatioX96,
        sqrtRatioAX96,
        sqrtRatioBX96,
        this.$ethers.BigNumber.from(protocolFees0),
        this.$ethers.BigNumber.from(protocolFees1)
      );

      let liquidityInPool = this.$ethers.BigNumber.from(position.liquidity);
      let liquidity = liquidityInPool
        .sub(protocolLiquidity)
        .mul(amount)
        .div(totalBalance);

      // user pending fees
      const tokensOwed0Local = tokensOwed0.mul(amount).div(totalBalance);
      const tokensOwed1Local = tokensOwed1.mul(amount).div(totalBalance);

      let { token0Amount, token1Amount } = await sim.Burn(
        tickLower,
        tickUpper,
        liquidity,
        fragolaContract._address,
        date
      );

      // user pending fees + aamounts
      token0Amount = token0Amount.add(tokensOwed0Local);
      token1Amount = token1Amount.add(tokensOwed1Local);

      let token0decimal = this.$ethers.utils.formatUnits(
        token0Amount,
        token0Decimals
      );
      let token1decimal = this.$ethers.utils.formatUnits(
        token1Amount,
        token1Decimals
      );

      let token0InUsd = token0decimal * token0Price;
      let token1InUsd = token1decimal * token1Price;

      const userLpInUsdLocal = parseFloat(token0InUsd + token1InUsd).toFixed(2);
      return userLpInUsdLocal;
    },
    async getPoolTvl(
      poolContract,
      fragolaContract,
      token0Decimals,
      token1Decimals,
      token0Price,
      token1Price
    ) {
      let sim = new PoolV3Actions(poolContract);
      const date = parseFloat(new Date() / 1000).toFixed(0);

      let tickLower = await fragolaContract.methods.tickLower().call();
      let tickUpper = await fragolaContract.methods.tickUpper().call();
      let position = await fragolaContract.methods.position().call();

      let liquidityInPool = this.$ethers.BigNumber.from(position.liquidity);

      await sim.Burn(
        tickLower,
        tickUpper,
        liquidityInPool,
        fragolaContract._address,
        date
      );

      const tokensOwed0 = sim.CurrentPosition.tokensOwed0;
      const tokensOwed1 = sim.CurrentPosition.tokensOwed1;

      const parsedToken0Amount = this.$ethers.utils.formatUnits(
        tokensOwed0,
        token0Decimals
      );
      const parsedToken1Amount = this.$ethers.utils.formatUnits(
        tokensOwed1,
        token1Decimals
      );

      const token0InUsd = +parsedToken0Amount.toString() * token0Price;
      const token1InUsd = +parsedToken1Amount.toString() * token1Price;

      const tvl = +token0InUsd + +token1InUsd;

      const token0Percent = (token0InUsd / tvl) * 100;
      const token1Percent = 100 - token0Percent;

      const tvlResult = parseFloat(tvl).toFixed(0);

      const showBanner =
        parseFloat(token0Percent) <= 0
          ? true
          : parseFloat(token1Percent) <= 0
          ? true
          : false;

      const totalSupply = await fragolaContract.methods.totalSupply().call();
      const totalSupplyParsed = this.$ethers.utils.formatUnits(totalSupply, 18);

      const plpPrice = tvlResult / totalSupplyParsed;

      return {
        tvlLocal: tvlResult,
        proportion: { token0Percent, token1Percent },
        showBanner,
        plpPrice,
      };
    },
    async getTokenRateLocal(token0Decimals, poolContract) {
      try {
        const slot0 = await poolContract.methods.slot0().call();

        const sqrtPriceX96 = this.$ethers.BigNumber.from(slot0.sqrtPriceX96);

        const decimalsBn = this.$ethers.utils.parseUnits("1", token0Decimals);

        const result = Token0ValuePrice(sqrtPriceX96, decimalsBn);

        return result.toString();
      } catch (e) {
        console.log("getTokenRateLocal", e);
      }
    },
    async getFragolasApy() {
      const apyArray = await this.$store.dispatch("fetchFragolaApy");
      return apyArray;
    },
    async getUserPendingRewardsLocal(
      poolContract,
      fragolaContract,
      userAccount
    ) {
      try {
        let sim = new PoolV3Actions(poolContract);
        const date = parseFloat(new Date() / 1000).toFixed(0);

        let tickLower = await fragolaContract.methods.tickLower().call();
        let tickUpper = await fragolaContract.methods.tickUpper().call();

        await sim.Burn(
          tickLower,
          tickUpper,
          this.$ethers.BigNumber.from("0"),
          fragolaContract._address,
          date
        );

        const tokensOwed0ContractPercent = this.$ethers.BigNumber.from(
          sim.CurrentPosition.tokensOwed0
        ).div(10);
        const tokensOwed1ContractPercent = this.$ethers.BigNumber.from(
          sim.CurrentPosition.tokensOwed1
        ).div(10);

        // івпекурп
        const tokensOwed0 = this.$ethers.BigNumber.from(
          sim.CurrentPosition.tokensOwed0
        ).sub(tokensOwed0ContractPercent);
        const tokensOwed1 = this.$ethers.BigNumber.from(
          sim.CurrentPosition.tokensOwed1
        ).sub(tokensOwed1ContractPercent);

        // const result = await GetUserPendingRewards(userAccount, fragolaContract, tokensOwed0, tokensOwed1);

        return { tokensOwed0, tokensOwed1 };
      } catch (e) {
        console.log("getUserPendingRewardsLocal err: ", e);
      }
    },
    async fetchTokensPrice() {
      const tokens = this.usedCoins.join();
      const tokenPrices = await this.$store.dispatch("fetchTokenPrice", tokens);
      return tokenPrices;
    },
  },
};
