import store from "@/store/index"

import axios from "axios";

import {
  MAX_VALUE_HEX,
  ICE_ADDR,
  FUSDT_ADDR,
  YUSDT_ADDR,
  ELLIPSE_ADDR,
  LP_ADDR,
} from "./globals";
import { toWei, fromWei, numberWithCommas, tokenPrices } from "./helpers";

import abiERC20 from "./abi/abiERC20.json";
import abiYUSDT from "./abi/abiYUSDT.json";
import abiEllipseRewardIce from "./abi/abiEllipseRewardIce.json";

const POOLS_INFO = {
  "ICE-POOL": {
    id: 0,
    images: {
      ETH: "pools/ice.svg",
      BSC: "pools/ice.svg",
      FTM: "pools/ice.svg",
    },
    token: {
      ETH: "ICE",
      BSC: "ICE",
      FTM: "ICE",
    },
    descMultiplier:
      "Multiplier shows the priority of the pool.  For example, of a 1x pool will get 1 ICE per second, a 3x pool would be getting 3 ICE per second.",
    links: {
      ETH:
        "https://etherscan.io/address/0x07aB4886566B7aB782a9d627E8554dB66fb06357#code",
      BSC:
        "https://bscscan.com/address/0x05200cB2Cee4B6144B2B2984E246B52bB1afcBD0#code",
      FTM:
        "https://ftmscan.com/address/0x05200cB2Cee4B6144B2B2984E246B52bB1afcBD0#code",
    },
    lpsLink: {},
    processingDeposit: false,
    processingWithdraw: false,
    processHarvesting: false,
  },
  "SUSHI-POOL": {
    id: 7,
    token: {
      ETH: "ICE/ETH",
      BSC: "ICE/BNB",
      FTM: "ICE/FTM",
    },
    images: {
      ETH: "pools/ice_eth.svg",
      BSC: "pools/ice_bnb.svg",
      FTM: "pools/ice_ftm.svg",
    },
    descMultiplier:
      "Multiplier shows the priority of the pool.  For example, of a 1x pool will get 1 ICE per second, a 3x pool would be getting 3 ICE per second.",
    links: {
      ETH:
        "https://etherscan.io/address/0x07aB4886566B7aB782a9d627E8554dB66fb06357#code",
      BSC:
        "https://bscscan.com/address/0x05200cB2Cee4B6144B2B2984E246B52bB1afcBD0#code",
      FTM:
        " https://ftmscan.com/address/0x05200cB2Cee4B6144B2B2984E246B52bB1afcBD0#code",
    },
    lpsLink: {
      ETH:
        "https://app-uniswap-org.ipns.dweb.link/#/add/ETH/0xf16e81dce15B08F326220742020379B855B87DF9",
      BSC:
        "https://app.sushi.com/add/ETH/0xf16e81dce15B08F326220742020379B855B87DF9",
      FTM:
        " https://staging.sushi.com/#/add/ETH/0xf16e81dce15B08F326220742020379B855B87DF9",
    },
    processingDeposit: false,
    processingWithdraw: false,
    processHarvesting: false,
  },
  "LP-POOL": {
    id: 9,
    token: {
      ETH: "ICE/ETH",
      BSC: "ICE/BNB",
      FTM: "ICE/FTM",
    },
    images: {
      ETH: "pools/ice_eth.svg",
      BSC: "pools/ice_bnb.svg",
      FTM: "pools/ice_ftm.svg",
    },
    descMultiplier:
      "This pool is discontinued in favor of Sushiswap ICE/BNB pool. Please consider relocating your Pancake V1 LP's via sushi.com/migrate",
    links: {
      ETH:
        "https://etherscan.io/address/0x07aB4886566B7aB782a9d627E8554dB66fb06357#code",
      BSC:
        "https://bscscan.com/address/0x05200cB2Cee4B6144B2B2984E246B52bB1afcBD0#code",
      FTM:
        " https://ftmscan.com/address/0x05200cB2Cee4B6144B2B2984E246B52bB1afcBD0#code",
    },
    lpsLink: {
      ETH:
        "https://app-uniswap-org.ipns.dweb.link/#/add/ETH/0xf16e81dce15B08F326220742020379B855B87DF9",
      BSC: "https://app.sushi.com/migrate",
      FTM:
        " https://staging.sushi.com/#/add/ETH/0xf16e81dce15B08F326220742020379B855B87DF9",
    },
    processingDeposit: false,
    processingWithdraw: false,
    processHarvesting: false,
  },
  //
  "FUSDT-POOL": {
    id: 1,
    token: {
      ETH: "USDT",
      BSC: "fUSDT",
      FTM: "fUSDT",
    },
    images: {
      ETH: "pools/usdt.svg",
      BSC: "pools/usdt.svg",
      FTM: "pools/usdt.svg",
    },
    descMultiplier: `This pool has been discontinued, please unstake your coins. If you want to earn ice on your fusdt check how to in our Discord`,
    links: {
      bsc:
        "https://bscscan.com/address/0x2cce22c7a4a9f66ee589464d883e85d91f35dd6b#code",
      fantom:
        "https://ftmscan.com/address/0x2cce22c7a4a9f66ee589464d883e85d91f35dd6b#code",
    },
    lpsLink: {
      ETH:
        "https://app-uniswap-org.ipns.dweb.link/#/add/ETH/0xf16e81dce15B08F326220742020379B855B87DF9",
      BSC: "",
      FTM: "",
    },
    processingDeposit: false,
    processingWithdraw: false,
    processHarvesting: false,
  },
  "CURVE-POOL": {
    id: 3,
    token: {
      ETH: "fUSDT/DAI/USDC",
      BSC: "fUSDT/DAI/USDC",
      FTM: "fUSDT/DAI/USDC",
    },
    images: {
      ETH: "pools/ice_dai.svg",
      BSC: "pools/ice_dai.svg",
      FTM: "pools/ice_dai.svg",
    },
    descMultiplier: `This pool has been discontinued, please unstake your coins. If you want to earn ice on your fusdt check how to here: <a href="https://discord.com/invite/JkEwq5amqw">Discord</a>`,
    links: {
      ETH:
        "https://etherscan.io/address/0x2cce22c7a4a9f66ee589464d883e85d91f35dd6b#code",
      BSC:
        "https://bscscan.com/address/0x2cce22c7a4a9f66ee589464d883e85d91f35dd6b#code",
      FTM:
        "https://ftmscan.com/address/0x05200cB2Cee4B6144B2B2984E246B52bB1afcBD0#code",
    },
    lpsLink: {
      FTM: "https://ftm.curve.fi/fusdt/deposit",
    },
    processingDeposit: false,
    processingWithdraw: false,
    processHarvesting: false,
  },
  "STAKER-POOL": {
    id: 5,
    token: {
      ETH: "fUSDT+3pool",
      BSC: "fUSDT+3pool",
      FTM: "fUSDT+3pool",
    },
    images: {
      ETH: "pools/3pool.svg",
      BSC: "pools/3pool.svg",
      FTM: "pools/3pool.svg",
    },
    descMultiplier: `This pool has been discontinued, please unstake your coins. If you want to earn ice on your fusdt check how to here: <a href="https://discord.com/invite/JkEwq5amqw">Discord</a>`,
    links: {
      ETH:
        "https://etherscan.io/address/0x2cce22c7a4a9f66ee589464d883e85d91f35dd6b#code",
      BSC:
        "https://bscscan.com/address/0xcce949De564fE60e7f96C85e55177F8B9E4CF61b#code",
      FTM:
        "https://ftmscan.com/address/0x2cce22c7a4a9f66ee589464d883e85d91f35dd6b#code",
    },
    lpsLink: {
      BSC: "https://ellipsis.finance/fusdt/deposit",
      FTM: "https://ftm.curve.fi/fusdt/deposit",
    },
    processingDeposit: false,
    processingWithdraw: false,
    processHarvesting: false,
  },
  "YUSDT-POOL": {
    id: 4,
    token: {
      ETH: "yvUSDT",
      BSC: "yvUSDT",
      FTM: "yvUSDT",
    },
    images: {
      ETH: "tokens/yearn.svg",
      BSC: "tokens/yearn.svg",
      FTM: "tokens/yearn.svg",
    },
    descMultiplier: `This pool has been discontinued, please unstake your coins. If you want to earn ice on your fusdt check how to here: <a href="https://discord.com/invite/JkEwq5amqw">Discord</a>`,
    links: {
      ETH:
        "https://etherscan.io/address/0x2cce22c7a4a9f66ee589464d883e85d91f35dd6b#code",
      BSC:
        "https://bscscan.com/address/0x2cce22c7a4a9f66ee589464d883e85d91f35dd6b#code",
      FTM:
        "https://ftmscan.com/address/0x2cce22c7a4a9f66ee589464d883e85d91f35dd6b#code",
    },
    processingDeposit: false,
    processingWithdraw: false,
    processHarvesting: false,
  },
};

export default class Pool {
  walletAddress = null;

  poolID = null;
  name = "";
  weiFormat = "";

  accIcePerShare = "";
  allocPoint = "";
  lastRewardTime = "";
  stakingToken = "";
  stakingTokenTotalAmount = "";

  address = "";
  contract = null;

  erc20 = null;
  iceInstance = null;
  fusdtInstance = null;
  stakerInstance = null;

  balance = null;
  roi = null;
  roiICE = 0;
  yieldPerDollar = null;
  yieldPerDollarEPS = null;
  tvl = null;
  ttl = null;

  deposited = 0;
  maxDeposit = 0;
  maxWithdraw = 0;

  icePrice = null;
  lpPrice = null;
  yusdtPrice = null;
  stakerPrice = 0;
  epsPrice = 0;

  epsPools = {
    1: {
      apy: 0,
    },
    2: {
      apy: 0,
    },
  };

  epsRewards = {
    ice: "",
    eps: "",
  };

  allowance = false;

  constructor(
    contract,
    name,
    poolID,
    weiFormat,
    walletAddress,
    {
      accIcePerShare,
      allocPoint,
      lastRewardTime,
      stakingToken,
      stakingTokenTotalAmount,
    },
    icePrice
  ) {
    this.name = name
      .toString()
      .toUpperCase()
      .trim();

    this.poolID = +poolID;
    this.icePrice = icePrice;
    this.weiFormat = weiFormat;

    this.allocPoint = allocPoint;
    this.stakingToken = stakingToken;
    this.accIcePerShare = accIcePerShare;
    this.lastRewardTime = lastRewardTime;
    this.stakingTokenTotalAmount = stakingTokenTotalAmount;

    this.contract = contract;
    this.address = stakingToken;

    const web3 = store.getters.getWeb3Instance;

    this.erc20 = new web3.eth.Contract(abiERC20, stakingToken);

    if (name !== "curve-pool") {
      this.iceInstance = new web3.eth.Contract(abiERC20, ICE_ADDR);
    }

    if (name === "curve-pool") {
      this.fusdtInstance = new web3.eth.Contract(abiERC20, FUSDT_ADDR);
    }

    if (name === "yusdt-pool") {
      this.fusdtInstance = new web3.eth.Contract(abiERC20, FUSDT_ADDR);
      this.yusdtInstance = new web3.eth.Contract(abiYUSDT, YUSDT_ADDR);
    }

    if (name === "staker-pool") {
      this.stakerInstance = new web3.eth.Contract(abiERC20, LP_ADDR);
      this.ellipseRewardInstance = new web3.eth.Contract(
        abiEllipseRewardIce,
        ELLIPSE_ADDR
      );
    }

    this.walletAddress = walletAddress;
    // this.getData();
  }

  /**
   * ----------------------------------------
   * Methods for getting data of current pool
   * ----------------------------------------
   */
  getData = async () => {
    try {
      await this.getPoolYield();
      await this.getPoolTvl();

      if (this.walletAddress && this.name !== "STAKER-POOL") {
        await this.getAllowance();
        await this.getBalance();
        await this.getDeposited();
      }

      if (this.walletAddress && this.name === "STAKER-POOL") {
        await this.getStakerPrice();
        await this.getDeposited();
        await this.getBalance();
        await this.getAllowance();

        const { data } = await axios.get(
          "https://api.ellipsis.finance/api/getPoolData"
        );

        this.epsPools = await data.data.pools;

        const contractD = new store.getters.getWeb3Instance.eth.Contract(abiEllipseRewardIce, LP_ADDR);

        this.epsRewards.ice = parseFloat(
          fromWei(
            await contractD.methods.earned(this.walletAddress, ICE_ADDR).call()
          ),
          this.weiFormat
        ).toFixed(2);

        const a = await this.contract.instance.methods
          .claimableReward(this.poolID, this.walletAddress)
          .call();

        this.epsRewards.eps = parseFloat(
          fromWei(
            await this.contract.instance.methods
              .claimableReward(this.poolID, this.walletAddress)
              .call(),
            this.weiFormat
          )
        ).toFixed(2);
      }
    } catch (error) {
      console.log(error);
    }
  };

  getStakerPrice = async () => {
    try {
      let p = await tokenPrices(["staker"]);

      this.epsPrice = p.staker;

      let erc20 = await this.erc20;
      let a = BigInt(this.stakingTokenTotalAmount);
      let b = BigInt(await erc20.methods.totalSupply().call());
      const price = parseFloat(a) / parseFloat(b);

      this.stakerPrice = price;
    } catch (error) {
      console.log(error);
    }
  };

  getAllowance = async () => {
    try {
      const contract = await this.erc20;

      const result = await contract.methods
        .allowance(this.walletAddress, this.contract.address)
        .call();

      this.allowance = +result > 0 ? true : false;
    } catch (error) {
      console.log(error);
    }
  };

  getBalance = async () => {
    try {
      const balance = await this.erc20.methods
        .balanceOf(this.walletAddress)
        .call();

      this.balance = parseFloat(fromWei(balance, this.weiFormat)).toFixed(2);
      this.maxDeposit = fromWei(balance, this.weiFormat);
    } catch (error) {
      console.log(error);
    }
  };

  getDeposited = async () => {
    try {
      const deposited = await this.contract.instance.methods
        .userInfo(this.poolID, this.walletAddress)
        .call();
      this.deposited = parseFloat(
        fromWei(deposited?.amount, this.weiFormat)
      ).toFixed(2);

      this.maxWithdraw = fromWei(deposited?.amount, this.weiFormat);
    } catch (error) {
      console.log(error);
    }
  };

  getYield = async (amount = 1000) => {
    try {
      const divide = BigInt(
        parseInt(fromWei(this.stakingTokenTotalAmount, this.weiFormat)) + amount
      );

      const multiplier = 86400;

      const icePerSecond = BigInt(
        await this.contract.instance.methods.icePerSecond().call()
      );

      const totalAllocPoint = BigInt(
        await this.contract.instance.methods.totalAllocPoint().call()
      );

      let iceReward =
        BigInt(BigInt(multiplier) * icePerSecond * BigInt(this.allocPoint)) /
        BigInt(totalAllocPoint);

      this.accIcePerShare = String(
        BigInt(this.accIcePerShare) +
          (BigInt(iceReward) * BigInt(Math.pow(10, 12))) / BigInt(divide)
      );

      const accIcePerShare = BigInt(
        BigInt(this.accIcePerShare) +
          (BigInt(iceReward) * BigInt(Math.pow(10, 12))) / BigInt(divide)
      );

      const rewardDebt =
        (BigInt(amount) * BigInt(this.accIcePerShare)) /
        BigInt(Math.pow(10, 12));

      const pending = BigInt(
        (BigInt(amount) * BigInt(accIcePerShare)) / BigInt(Math.pow(10, 12)) -
          BigInt(rewardDebt)
      );

      const result = parseFloat(fromWei(pending.toString(), null)).toFixed(2);

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  getLPYield = async () => {
    try {
      const stakingToken = this.stakingToken;

      let erc20 = await this.erc20;
      let iceInstance = await this.iceInstance;

      let IceInSlpTotal = BigInt(
        await iceInstance.methods.balanceOf(stakingToken).call()
      );

      let totalTokensSLPMinted = BigInt(
        await erc20.methods.totalSupply().call()
      );

      let icePerLp;
      if (parseInt(IceInSlpTotal) > 0) {
        icePerLp = parseInt(totalTokensSLPMinted) / parseInt(IceInSlpTotal);
      }
      if (parseInt(IceInSlpTotal) === 0) {
        icePerLp = 0;
      }

      const lpPrice =
        (parseInt(IceInSlpTotal.toString()) /
          parseInt(totalTokensSLPMinted.toString())) *
        this.icePrice *
        2;

      let IcePer1000Bucks;

      if (this.icePrice > 0) IcePer1000Bucks = 1000 / this.icePrice;
      if (this.icePrice === 0) IcePer1000Bucks = 0;

      let res = (IcePer1000Bucks * icePerLp) / 2; // for LP pool

      const final = await this.getYield(parseInt(res));

      this.lpPrice = lpPrice;

      return final;
    } catch (error) {
      console.log(error);
    }
  };

  getCurveYield = async () => {
    try {
      const stakingToken = this.stakingToken;

      let erc20 = await this.erc20;
      let fusdtInstance = await this.fusdtInstance;

      let IceInSlpTotal = BigInt(
        await fusdtInstance.methods.balanceOf(stakingToken).call()
      );

      let totalTokensSLPMinted = BigInt(
        await erc20.methods.totalSupply().call()
      );

      let icePerLp;
      if (parseInt(IceInSlpTotal) > 0) {
        icePerLp =
          parseInt(totalTokensSLPMinted) /
          (parseInt(IceInSlpTotal) * 2 * Math.pow(10, 12));
      }
      if (parseInt(IceInSlpTotal) === 0) {
        icePerLp = 0;
      }

      const lpPrice =
        (parseInt(IceInSlpTotal.toString()) /
          parseInt(totalTokensSLPMinted.toString())) *
        2;

      let IcePer1000Bucks;

      if (this.icePrice > 0) IcePer1000Bucks = 1000;
      if (this.icePrice === 0) IcePer1000Bucks = 0;

      let res = icePerLp * IcePer1000Bucks; // for LP pool

      const final = await this.getYield(parseInt(res));

      this.lpPrice = lpPrice;

      return final;
    } catch (error) {
      console.log(error);
    }
  };

  getYUSDTYield = async (amount = 1000) => {
    try {
      const amountDprice = parseInt(amount / this.yusdtPrice);

      const divide = BigInt(
        parseInt(fromWei(this.stakingTokenTotalAmount, this.weiFormat)) +
          amountDprice
      );

      const multiplier = 86400;

      const icePerSecond = BigInt(
        await this.contract.instance.methods.icePerSecond().call()
      );

      const totalAllocPoint = BigInt(
        await this.contract.instance.methods.totalAllocPoint().call()
      );

      let iceReward =
        BigInt(BigInt(multiplier) * icePerSecond * BigInt(this.allocPoint)) /
        BigInt(totalAllocPoint);

      this.accIcePerShare = String(
        BigInt(this.accIcePerShare) +
          (BigInt(iceReward) * BigInt(Math.pow(10, 12))) / BigInt(divide)
      );

      const accIcePerShare = BigInt(
        BigInt(this.accIcePerShare) +
          (BigInt(iceReward) * BigInt(Math.pow(10, 12))) / BigInt(divide)
      );

      const rewardDebt =
        (BigInt(amountDprice) * BigInt(this.accIcePerShare)) /
        BigInt(Math.pow(10, 12));

      const pending = BigInt(
        (BigInt(amountDprice) * BigInt(accIcePerShare)) /
          BigInt(Math.pow(10, 12)) -
          BigInt(rewardDebt)
      );

      const result = parseFloat(fromWei(pending.toString(), null)).toFixed(2);

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  getYUSDTYieldMoked = async (amount = 1000) => {
    try {
      const amountDprice = parseInt(amount / this.yusdtPrice);

      const divide = BigInt(
        parseInt(fromWei(this.stakingTokenTotalAmount, this.weiFormat)) +
          amountDprice
      );

      const multiplier = 86400;

      const icePerSecond = BigInt("259548611111111111");

      const totalAllocPoint = BigInt("200");

      let iceReward =
        BigInt(BigInt(multiplier) * icePerSecond * BigInt("50")) /
        BigInt(totalAllocPoint);

      this.accIcePerShare = String(
        BigInt(this.accIcePerShare) +
          (BigInt(iceReward) * BigInt(Math.pow(10, 12))) / BigInt(divide)
      );

      const accIcePerShare = BigInt(
        BigInt(this.accIcePerShare) +
          (BigInt(iceReward) * BigInt(Math.pow(10, 12))) / BigInt(divide)
      );

      const rewardDebt =
        (BigInt(amountDprice) * BigInt(this.accIcePerShare)) /
        BigInt(Math.pow(10, 12));

      const pending = BigInt(
        (BigInt(amountDprice) * BigInt(accIcePerShare)) /
          BigInt(Math.pow(10, 12)) -
          BigInt(rewardDebt)
      );

      const result = parseFloat(fromWei(pending.toString(), null)).toFixed(2);

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  getSTAKERYield = async (id, price) => {
    try {
      const a = id === 1 ? "apy" : "rewardsAPY";

      const roi = this.epsPools[id][a] || 0;
      const result = (roi * 10) / 365 / price;

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  getPoolYield = async () => {
    try {
      let poolYield;

      if (this.name === "ICE-POOL") {
        poolYield = (await this.getYield()) / this.icePrice;
        this.yieldPerDollar = parseFloat(poolYield).toFixed(2);
        await this.getRoi(poolYield);
      }

      if (this.name === "FUSDT-POOL") {
        poolYield = await this.getYield();
        this.yieldPerDollar = parseFloat(poolYield).toFixed(2);
        await this.getRoi(poolYield);
      }

      if (this.name === "LP-POOL" || this.name === "SUSHI-POOL") {
        poolYield = await this.getLPYield();
        this.yieldPerDollar = parseFloat(poolYield).toFixed(2);
        await this.getRoi(poolYield);
      }

      if (this.name === "CURVE-POOL") {
        poolYield = await this.getCurveYield();
        this.yieldPerDollar = parseFloat(poolYield).toFixed(2);
        await this.getRoi(poolYield);
      }

      if (this.name === "YUSDT-POOL") {
        const a = fromWei(
          await this.yusdtInstance.methods.totalAssets().call(),
          this.weiFormat
        );
        const b = fromWei(
          await this.yusdtInstance.methods.totalSupply().call(),
          this.weiFormat
        );

        const price = parseFloat(parseFloat(a) / parseFloat(b)).toFixed(2);

        this.yusdtPrice = price;

        poolYield = await this.getYUSDTYield();
        // poolYield = await this.getYUSDTYieldMoked();
        this.yieldPerDollar = parseFloat(poolYield).toFixed(2);
        await this.getRoi(poolYield);
      }

      if (this.name === "STAKER-POOL") {
        let poolYieldEPS, poolYieldICE;

        poolYieldEPS = await this.getSTAKERYield(1, this.epsPrice);
        poolYieldICE = await this.getSTAKERYield(2, this.icePrice);

        this.yieldPerDollarEPS = parseFloat(poolYieldEPS).toFixed(2);
        this.yieldPerDollar = parseFloat(poolYieldICE).toFixed(2);

        await this.getRoiStaker();
      }
    } catch (error) {
      console.log(error);
    }
  };

  getTTL = async () => {
    try {
      return parseFloat(
        fromWei(this.stakingTokenTotalAmount, this.weiFormat)
      ).toFixed(2);
    } catch (error) {
      console.log(error);
    }
  };

  getICETvl = async () => {
    try {
      const ttl = await this.getTTL();
      const tvl = this.icePrice * parseFloat(ttl.toString());

      return numberWithCommas(parseInt(tvl));
    } catch (error) {
      console.log(error);
    }
  };

  getUSDTTvl = async () => {
    try {
      const ttl = await this.getTTL();
      this.ttl = numberWithCommas(parseInt(ttl));

      const tvl =
        parseFloat(this.yieldPerDollar.toString()) * parseFloat(ttl.toString());

      return numberWithCommas(parseInt(tvl));
    } catch (error) {
      console.log(error);
    }
  };

  getYUSDTTvl = async () => {
    try {
      const ttl = await this.getTTL();
      const tvl = parseFloat(this.yusdtPrice) * parseFloat(ttl.toString());

      return numberWithCommas(parseInt(tvl));
    } catch (error) {
      console.log(error);
    }
  };

  getLPTvl = async () => {
    try {
      const ttl = await this.getTTL();
      const tvl =
        parseFloat(ttl.toString()) * parseFloat(this.lpPrice.toString());

      return numberWithCommas(parseInt(tvl));
    } catch (error) {
      console.log(error);
    }
  };

  getCurveTvl = async () => {
    try {
      const ttl = await this.getTTL();
      const tvl = parseFloat(ttl.toString()) * parseFloat(1);

      return numberWithCommas(parseInt(tvl));
    } catch (error) {
      console.log(error);
    }
  };

  getSTAKERTvl = async () => {
    try {
      const ttl = await this.getTTL();
      const tvl =
        parseFloat(ttl.toString()) * parseFloat(this.stakerPrice.toString());

      return numberWithCommas(parseInt(tvl));
    } catch (error) {
      console.log(error);
    }
  };

  getPoolTvl = async () => {
    try {
      let tvl;

      if (this.name === "ICE-POOL") {
        tvl = await this.getICETvl();
      }

      if (this.name === "FUSDT-POOL") {
        tvl = await this.getUSDTTvl();
      }

      if (this.name === "LP-POOL") {
        tvl = await this.getLPTvl();
      }

      if (this.name === "CURVE-POOL") {
        tvl = await this.getCurveTvl();
      }

      if (this.name === "YUSDT-POOL") {
        tvl = await this.getYUSDTTvl();
      }

      if (this.name === "STAKER-POOL") {
        tvl = await this.getSTAKERTvl();
      }

      if (this.name === "SUSHI-POOL") {
        tvl = await this.getLPTvl();
      }

      this.tvl = tvl;
    } catch (error) {
      console.log(error);
    }
  };

  getRoi = async (value) => {
    try {
      const dollarPerDay =
        ((parseFloat(value) * parseFloat(this.icePrice) * 100) / 1000) * 365;

      this.roi = parseFloat(dollarPerDay).toFixed(2);
    } catch (error) {
      console.log(error);
    }
  };

  getRoiStaker = async () => {
    try {
      this.roi = this.epsPools[1].apy;

      // const contractD = new web3.eth.Contract(abiEllipseRewardIce, LP_ADDR);

      // let rewardData = await contractD.methods.rewardData(LP_ADDR).call();

      // let supply = await contractD.methods.totalSupply().call();

      // const iceToken = this.icePrice;

      // const x = Math.pow(10, 18);

      // let rate =
      //   ((604800 * (rewardData.rewardRate / x) * 365 * iceToken) /
      //     7 /
      //     ((iceToken * supply) / x)) *
      //   100;

      // console.log("RATE: ", rate);
      this.roiICE = this.epsPools[2].rewardsAPY;
    } catch (error) {
      console.log(error);
    }
  };

  getPoolInfo = async () => {
    await this.getData();
    await this.getPoolTvl();

    const info = POOLS_INFO[this.name];
    return Object.assign({ ...info, ...this });
  };

  /**
   * -------------------
   * Methods for buttons
   * -------------------
   */
  join = async () => {
    try {
      const address = this.contract.address;

      await this.erc20.methods
        .approve(address, MAX_VALUE_HEX)
        .send({ from: this.walletAddress });
    } catch (error) {
      console.log(error);
    }
  };

  harvest = async () => {
    try {
      return await this.contract.instance.methods
        .withdraw(this.poolID, 0)
        .send({ from: this.walletAddress });
    } catch (error) {
      console.log(error);
    }
  };

  harvestICE = async () => {
    try {
      const contractD = new store.getters.getWeb3Instance.eth.Contract(abiEllipseRewardIce, LP_ADDR);

      return await contractD.methods
        .getReward()
        .send({ from: this.walletAddress });
    } catch (error) {
      console.log(error);
    }
  };

  withdraw = async (amount) => {
    try {
      return await this.contract.instance.methods
        .withdraw(this.poolID, toWei(amount, this.weiFormat))
        .send({ from: this.walletAddress });
    } catch (error) {
      console.log(error);
    }
  };

  deposit = async (amount) => {
    try {
      return await this.contract.instance.methods
        .deposit(this.poolID, toWei(amount, this.weiFormat))
        .send({ from: this.walletAddress });
    } catch (error) {
      console.log(error);
    }
  };
}
