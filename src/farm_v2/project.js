import store from "@/store/index"

import { MAX_VALUE_HEX, ICE_ADDR } from "./globals";
import { toWei, fromWei, numberWithCommas, tokenPrices } from "./helpers";

import abiERC20 from "./abi/abiERC20.json";

export default class Project {
  name = "";
  mainContract = null;
  iceContract = null;
  lpContract = null;
  testContract = null;

  images = {};
  publish = null;

  walletAddress = null;
  allowance = null;

  balance = null;

  maxDeposit = 0;
  maxWithdraw = 0;

  // proccessing fields
  proccessingDeposit = false;
  proccessingWithdraw = false;

  // table fields
  table = {
    tvl: 0,
    roi1: 0,
    roi2: 0,
    roi3: 0,
  };

  // prices
  icePrice = 0;
  lpPrice = 0;

  yieldPerDollarLP = "0.00";
  yieldPerDollarICE = "0.00";

  stakingTokenTotalAmount = null;

  weiFormat = null;

  accIcePerShare = "0";

  icePerSecond = "0";
  rewardPerSecond = "0";

  poolYield = "0";

  // yields
  poolYieldICE = "0";
  poolYieldLP = "0";

  constructor(
    id,
    name,
    mainContract,
    iceContract,
    lpContract,
    testContract,
    walletAddress,
    icePrice,
    images,
    publish
  ) {
    this.id = id;
    this.name = name;
    this.mainContract = mainContract;
    this.iceContract = iceContract;
    this.lpContract = lpContract;
    this.testContract = testContract;

    this.images = images;
    this.publish = publish;

    this.walletAddress = walletAddress;

    this.icePrice = icePrice;

    this.stakingToken = this.lpContract.address;

    this.erc20 = new store.getters.getWeb3Instance.eth.Contract(abiERC20, this.stakingToken);
    this.iceInstance = this.iceContract.instance;
  }

  setup = async () => {
    try {
      await this.getAllowance();
      await this.getBalance();
      await this.getInfo();
    } catch (error) {
      console.log(error);
    }
  };

  getAllowance = async () => {
    try {
      const contract = await this.lpContract.instance;

      const result = await contract.methods
        .allowance(this.walletAddress, this.mainContract.address)
        .call();

      this.allowance = +result > 0 ? true : false;
    } catch (error) {
      console.log(error);
    }
  };

  getBalance = async () => {
    try {
      const contract = this.lpContract.instance;

      const balance = await contract.methods
        .balanceOf(this.walletAddress)
        .call();

      const deposited = await this.mainContract.instance.methods
        .userInfo(this.walletAddress)
        .call();

      this.deposited = parseFloat(fromWei(deposited?.amount)).toFixed(2);

      this.maxWithdraw = fromWei(deposited?.amount);

      this.balance = parseFloat(fromWei(balance)).toFixed(2);
      this.maxDeposit = fromWei(balance);
    } catch (error) {
      console.log(error);
    }
  };

  getInfo = async () => {
    try {
      const contract = this.lpContract.instance;

      const stakingTokenTotalAmount = await contract.methods
        .balanceOf(this.mainContract.address)
        .call();

      this.stakingTokenTotalAmount = stakingTokenTotalAmount;

      this.table.tvl = await this.getTVL();

      this.accIcePerShare = await this.mainContract.instance.methods
        .accIcePerShare()
        .call();

      this.accRewardTokenPerShare = await this.mainContract.instance.methods
        .accRewardTokenPerShare()
        .call();

      this.icePerSecond = await this.mainContract.instance.methods
        .icePerSecond()
        .call();

      this.rewardPerSecond = await this.mainContract.instance.methods
        .rewardTokenPerSecond()
        .call();

      this.poolYield = await this.getLPYield();

      this.poolYieldICE = await this.getLPYield();
      this.poolYieldLP = await this.getLPYield("lp");

      await this.getRoi(this.poolYieldICE, this.poolYieldLP);
    } catch (error) {
      console.log(error);
    }
  };

  getTVL = async () => {
    try {
      const lpPrice = 1;

      const ttl = parseFloat(fromWei(this.stakingTokenTotalAmount)).toFixed(2);
      const tvl = parseFloat(ttl.toString()) * parseFloat(lpPrice.toString());

      return numberWithCommas(parseInt(tvl));
    } catch (error) {
      console.log(error);
    }
  };

  getYeild = async (type, amount = 1000) => {
    try {
      const divide = BigInt(
        parseInt(fromWei(this.stakingTokenTotalAmount, this.weiFormat)) + amount
      );

      const multiplier = 86400;

      let perSecond =
        type === "ice"
          ? BigInt(this.icePerSecond)
          : BigInt(this.rewardPerSecond);

      const iceReward = BigInt(BigInt(multiplier) * perSecond);

      let perShare =
        type === "ice" ? this.accIcePerShare : this.accRewardTokenPerShare;

      perShare = String(
        BigInt(perShare) +
          (BigInt(iceReward) * BigInt(Math.pow(10, 12))) / BigInt(divide)
      );

      // const accIcePerShare = BigInt(
      //   BigInt(this.accIcePerShare) +
      //     (BigInt(iceReward) * BigInt(Math.pow(10, 12))) / BigInt(divide)
      // );

      // const rewardDebt =
      //   (BigInt(amount) * BigInt(this.accIcePerShare)) /
      //   BigInt(Math.pow(10, 12));

      const pending = BigInt(
        (BigInt(amount) * BigInt(perShare)) / BigInt(Math.pow(10, 12))
      );

      const result = parseFloat(fromWei(pending.toString(), null)).toFixed(2);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  getLPYield = async (type = "ice") => {
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

      let IcePer1000Bucks;

      if (this.icePrice > 0) IcePer1000Bucks = 1000 / this.icePrice;
      if (this.icePrice === 0) IcePer1000Bucks = 0;

      let res = (IcePer1000Bucks * icePerLp) / 2; // for LP pool

      // const final = await this.getYeild(parseInt(res));
      const final = await this.getYeild(type);

      this.yieldPerDollarICE = final;
      this.yieldPerDollarLP = final;

      return final;
    } catch (error) {
      console.log(error);
    }
  };

  getRoi = async (valueIce, valueReward) => {
    try {
      const dollarPerDayIce =
        ((parseFloat(valueIce) * parseFloat(this.icePrice) * 100) / 1000) * 365;

      const dollarPerDayReward =
        ((parseFloat(valueReward) * parseFloat(this.icePrice) * 100) / 1000) *
        365;

      this.table.roi1 = parseFloat(
        dollarPerDayIce + dollarPerDayReward
      ).toFixed(2);
      this.table.roi2 = parseFloat(
        dollarPerDayIce + dollarPerDayReward * 7
      ).toFixed(2);
      this.table.roi3 = parseFloat(
        dollarPerDayIce + dollarPerDayReward * 365
      ).toFixed(2);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * const dollarPerDayIce =
        ((parseFloat(valueIce) * parseFloat(this.icePrice) * 100) / 1000) * 365;

      const dollarPerDayReward =
        ((parseFloat(valueReward) * parseFloat(this.icePrice) * 100) / 1000) * 365;

      this.table.roi1 = parseFloat(
        dollarPerDayIce + dollarPerDayReward
      ).toFixed(2);
      this.table.roi2 = parseFloat(
        dollarPerDayIce + dollarPerDayReward * 7
      ).toFixed(2);
      this.table.roi3 = parseFloat(
        dollarPerDayIce + dollarPerDayReward * 365
      ).toFixed(2);
   */

  // approve on LP
  // allowance LP token - popsicle stand
  // stake LP tokens - popsicle stand
  // unstake LP tokens - popsicle stand
  approve = async () => {
    try {
      const address = this.mainContract.address;

      await this.lpContract.instance.methods
        .approve(address, MAX_VALUE_HEX)
        .send({ from: this.walletAddress });
    } catch (error) {
      console.log(error);
    }
  };

  unstake = async (amount) => {
    try {
      const contract = this.mainContract.instance;

      return await contract.methods
        .withdraw(toWei(amount))
        .send({ from: this.walletAddress });
    } catch (error) {
      console.log(error);
    }
  };

  stake = async (amount) => {
    try {
      const contract = this.mainContract.instance;

      return await contract.methods
        .deposit(toWei(amount))
        .send({ from: this.walletAddress });
    } catch (error) {
      console.log(error);
    }
  };
}
