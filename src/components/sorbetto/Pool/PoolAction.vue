<template>
  <div class="action-content-wrap" :class="{ alternative: showMore }">
    <div class="main-col">
      <template v-if="!loading">
        <h3 class="action-title">
          {{ blockTitle }}
        </h3>

        <div class="tab-wrap">
          <div
            class="tab-item"
            :class="{ active: activeTab === 1 }"
            @click="setActiveTab(1)"
          >
            <p>Join</p>
          </div>
          <div
            class="tab-item"
            :class="{ active: activeTab === 2 }"
            @click="setActiveTab(2)"
          >
            <Loading v-if="isTokensListLoading" />
            <p v-else>Zap</p>
          </div>
        </div>

        <template v-if="activeTab === 1">
          <Input
            :value="amount0"
            :error="amount0Error"
            @update="updateValue0"
            :name="activeToken0.symbol"
            :max="activeToken0.balance"
          />
          <Input
            :value="amount1"
            :error="amount1Error"
            @update="updateValue1"
            :name="activeToken1.symbol"
            :max="activeToken1.balance"
          />

          <div class="settings-wrap">
            <div
              v-if="showDefaultBalanceCheckbox"
              class="checkbox-wrap"
              :class="{ active: useDefaultBalance }"
            >
              <div class="checkbox" @click="toggleDefaultBalance">
                <div class="indicator"></div>
              </div>
              <p class="label-text" @click="toggleDefaultBalance">
                Use {{ defaultBalanceSymbol }}
              </p>
            </div>

            <div class="checkbox-wrap" :class="{ active: joinPropotion }">
              <div class="checkbox" @click="toggleJoinProportion">
                <div class="indicator"></div>
              </div>
              <p class="label-text" @click="toggleJoinProportion">
                Join Proportionally
              </p>
            </div>
          </div>

          <SlipageBlock
            v-if="!joinPropotion"
            :slipage="slipage"
            @update="updateSlipage"
          />

          <div class="inform-board">
            <div class="text-wrap">
              <p v-if="joinPropotion">
                Sorbetto Fragola requires users to join their position using the
                token ratio that corresponds to the range in which Fragola is
                currently providing liquidity. Users can also zap-in using a
                single token, our Uniswap V3 Optimizer will swap them for the
                exact ratio! Just Select your slippage and join the position!
              </p>
              <p v-else>
                Sorbetto Fragola requires users to join their position using the
                token ratio that corresponds to the range in which Fragola is
                currently providing liquidity. Users can also zap-in using a
                single token, our Uniswap V3 Optimizer will swap them for the
                exact ratio! Just Select your slippage and join the position!
              </p>
            </div>
            <div class="inform-row" v-if="!joinPropotion">
              <div class="inform-item">
                <p>{{ pool.token0.symbol }}</p>
                <p>
                  {{
                    loadingProportion
                      ? 0
                      : parseFloat(expectedToken0AmountInUsd).toFixed(4)
                  }}
                </p>
              </div>
              <div class="like-border"></div>
              <div class="inform-item">
                <p>{{ pool.token1.symbol }}</p>
                <p>
                  {{
                    loadingProportion
                      ? 0
                      : parseFloat(expectedToken1AmountInUsd).toFixed(4)
                  }}
                </p>
              </div>
            </div>
          </div>

          <div class="btm-actions-wrap">
            <button
              class="action-btn"
              @click="actionHandler"
              :disabled="disabledActionBtn"
            >
              {{ actionBtnText }}
            </button>
          </div>
        </template>

        <template v-if="activeTab === 2 && !isTokensListLoading">
          <Input
            :value="zapinAmount"
            :error="zapinAmountError"
            @update="updateZapinAmount"
            :name="zapinActiveToken.symbol"
            :max="zapinActiveToken.parsedBalance"
            :imageUrl="zapinActiveToken.logoURI"
            :isTokenSelect="true"
            @selectClick="setTokenListPopupState(true)"
          />

          <div class="zapin-info-block">
            <div class="info-item">
              <span class="item-title">Minimum PLP Value</span>
              <span class="item-value"
                >~ ${{ parseFloat(expectedPLPAmountInUsd).toFixed(4) }}</span
              >
            </div>
            <div class="info-item">
              <span class="item-title"
                >Expected Amount of {{ pool.token0.symbol }}</span
              >
              <span class="item-value"
                >~ {{ parseFloat(expectedToken0AmountInUsd).toFixed(4) }}</span
              >
            </div>

            <div class="info-item">
              <span class="item-title"
                >Expected Amount of {{ pool.token1.symbol }}</span
              >
              <span class="item-value"
                >~ {{ parseFloat(expectedToken1AmountInUsd).toFixed(4) }}</span
              >
            </div>
          </div>

          <SlipageBlock :slipage="slipage" @update="updateSlipage" />

          <div class="inform-board">
            <div class="text-wrap">
              <p>
                Open a position zapping in from a token of our choice! Fragola
                will swap your tokens for the pool’s assets and provide them in
                the exact proportion in which we are currently providing
                liquidity! <a href="#" target="_blank">Find out more!</a>
              </p>
            </div>
          </div>

          <div class="btm-actions-wrap">
            <button
              class="action-btn"
              @click="joinWithAnotherTokenHandler"
              :disabled="zapinDisableBtn"
            >
              {{ zapinBtnText }}
            </button>
          </div>
        </template>
      </template>

      <div class="load-wrap" v-else>
        <Loading />
      </div>
    </div>

    <div class="aside-col">
      <!-- <img src="@/assets/images/sorbetto/more-info-btn.svg" alt="" class="show-more" @click="toggleMore"> -->
      <p class="show-more" @click="toggleMore">{{ expandText }}</p>

      <DepositItem :pool="pool" />

      <template v-if="pool.tickChartData">
        <TickChart
          :labels="pool.tickChartData.datesArray"
          :tickUpper="pool.tickChartData.tickUpperArray"
          :tickLower="pool.tickChartData.tickLowerArray"
          :currentTick="pool.tickChartData.currentTickArray"
        />
      </template>

      <div class="info-block">
        <PoolInfoItem
          v-for="(item, idx) in pool.poolInfoArray"
          :infoItem="item"
          :key="idx"
        />
      </div>
    </div>

    <transition name="fade">
      <TokensListPopup
        v-if="tokensList && showTokensListPopup"
        :tokensList="tokensList"
        @closePopup="showTokensListPopup = false"
        @tokenClick="setZapinToken"
      />
    </transition>
  </div>
</template>

<script>
const PoolInfoItem = () => import("@/components/sorbetto/Pool/PoolInfoItem");
const DepositItem = () => import("@/components/sorbetto/Pool/PoolDepositItem");
const Input = () => import("@/components/sorbetto/Pool/PoolInput");
const SlipageBlock = () =>
  import("@/components/sorbetto/Pool/PoolSlipageBlock");
const TickChart = () => import("@/components/sorbetto/Pool/TickChart");
const TokensListPopup = () => import("@/components/popups/TokensListPopup");

import { GetAmountForDesired } from "@/utils/sorbetto/libs/AmountsForDesired";
import { ConvertToProportion } from "@/utils/sorbetto/libs/ConvertToProportion";

import axios from "axios";

import abiERC20 from "@/farm/abi/abiERC20";
import swapAbi from "@/utils/sorbetto/swapAbi";

import tokensListMixin from "@/mixins/tokensList";

export default {
  mixins: [tokensListMixin],
  props: {
    pool: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      joinPropotion: true,
      amount0: "",
      amount1: "",
      useDefaultBalance: false,

      proportionAmount0: "",
      proportionAmount1: "",

      proportion: "",

      slipage: 1,

      loading: true,

      updateProportionInterval: null,

      loadingProportion: false,

      loadingTicker: 0,

      showMore: false,

      zeroAddress: "0x0000000000000000000000000000000000000000",

      showTokensListPopup: false,

      activeTab: 1,

      zapinAmount: "",
      zapinTokenAddress: "",
    };
  },
  computed: {
    zapinAmountPrice() {
      if (this.zapinActiveToken?.price) {
        return this.zapinActiveToken.price * +this.zapinAmount || 0;
      }

      return false;
    },
    expectedPLPAmount() {
      if (this.zapinAmountPrice && this.activeTab === 2) {
        const slipageMultiplyer = (100 - +this.slipage) / 100;

        return (this.zapinAmountPrice / this.pool.plpPrice) * slipageMultiplyer;
      }

      if (!this.joinPropotion && this.activeTab === 1) {
        const slipageMultiplyer = (100 - +this.slipage) / 100;

        const tokensinUsd =
          +this.amount0 * this.pool.token0.price +
          +this.amount1 * this.pool.token1.price;

        return (tokensinUsd / this.pool.plpPrice) * slipageMultiplyer;
      }

      return 0;
    },
    expectedPLPAmountInUsd() {
      if (this.expectedPLPAmount)
        return this.expectedPLPAmount * this.pool.plpPrice;

      return 0;
    },
    expectedToken0Amount() {
      if (this.expectedPLPAmountInUsd) {
        return (
          (this.expectedPLPAmountInUsd / 100) *
          this.pool.proportion.token0Percent
        );
      }
      return 0;
    },
    expectedToken1Amount() {
      if (this.expectedPLPAmountInUsd) {
        return (
          (this.expectedPLPAmountInUsd / 100) *
          this.pool.proportion.token1Percent
        );
      }
      return 0;
    },
    expectedToken0AmountInUsd() {
      if (this.expectedToken0Amount) {
        return this.expectedToken0Amount / this.pool.token0.price;
      }
      return 0;
    },
    expectedToken1AmountInUsd() {
      if (this.expectedToken1Amount) {
        return this.expectedToken1Amount / this.pool.token1.price;
      }
      return 0;
    },
    blockTitle() {
      if (this.activeTab === 1) return "Join using pool’s Tokens";
      if (this.activeTab === 2) return "Zap-in from Any Assets";

      return "Open Position";
    },

    account() {
      return this.$store.getters.getAddress;
    },

    itsToken0() {
      return this.zapinActiveToken?.symbol == this.pool.token0.symbol;
    },
    itsToken1() {
      return this.zapinActiveToken?.symbol == this.pool.token1.symbol;
    },

    zapinActiveToken() {
      if (this.zapinTokenAddress)
        return this.tokensList.find(
          (item) => item.address === this.zapinTokenAddress
        );

      return this.tokensList[0];
    },
    zapinAmountError() {
      if (
        this.zapinAmount &&
        this.zapinAmount > +this.zapinActiveToken.parsedBalance
      ) {
        return `The value cannot be more than ${this.zapinActiveToken.parsedBalance}`;
      }

      return "";
    },
    expandText() {
      if (this.showMore) {
        return "Reduce";
      }
      return "Expand";
    },
    slipageMultiplyer() {
      return parseFloat((100 - this.slipage) / 100).toFixed(4);
    },
    showDefaultBalanceCheckbox() {
      if (this.pool.token0.canBeDefault) return true;
      if (this.pool.token1.canBeDefault) return true;

      return false;
    },
    defaultBalanceSymbol() {
      if (this.pool.token0.canBeDefault) return this.pool.token0.symbol;
      if (this.pool.token1.canBeDefault) return this.pool.token1.symbol;
      return "";
    },
    amountToSwap() {
      let amountResult;
      let symbol;

      if (!+this.amount0 && !+this.amount1) {
        return {
          symbol: this.activeToken0.symbol,
          value: 0,
        };
      }

      if (+this.amount0 && !+this.amount1) {
        symbol = this.activeToken0.symbol;

        const amountInWei = this.$ethers.utils.parseUnits(
          String(this.amount0),
          this.activeToken0.decimals
        );
        const amountToSwap =
          BigInt(amountInWei) - BigInt(this.proportionAmount0);

        amountResult = this.$ethers.utils.formatUnits(
          this.$ethers.BigNumber.from(amountToSwap),
          this.activeToken0.decimals
        );
      }

      if (!+this.amount0 && +this.amount1) {
        symbol = this.activeToken1.symbol;
        const amountInWei = this.$ethers.utils.parseUnits(
          String(this.amount1),
          this.activeToken1.decimals
        );

        const amountToSwap =
          BigInt(amountInWei) - BigInt(this.proportionAmount1);

        amountResult = this.$ethers.utils.formatUnits(
          this.$ethers.BigNumber.from(amountToSwap),
          this.activeToken1.decimals
        );
      }

      if (!amountResult) return 0;

      let re = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^-?\\d+(?:\.\\d{0,` + (4 || -1) + `})?`
      );
      return {
        symbol,
        value: amountResult.toString().match(re)[0],
      };
    },
    amountSwapResult() {
      let amountResult;
      let symbol;

      if (!+this.amount0 && !+this.amount1) {
        amountResult = 0;
        symbol = this.activeToken1.symbol;
      }

      if (+this.amount0 && !+this.amount1) {
        symbol = this.activeToken1.symbol;
        amountResult = this.parsedProportionAmount1;
      }

      if (!+this.amount0 && +this.amount1) {
        symbol = this.activeToken0.symbol;
        amountResult = this.parsedProportionAmount0;
      }

      return {
        symbol,
        value: amountResult,
      };
    },
    parsedProportionAmount0() {
      if (!this.proportionAmount0) return 0;

      const formatProportionAmount0 = this.$ethers.utils.formatUnits(
        this.proportionAmount0,
        this.activeToken0.decimals
      );

      let re = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^-?\\d+(?:\.\\d{0,` + (4 || -1) + `})?`
      );
      return formatProportionAmount0.toString().match(re)[0];
    },
    parsedProportionAmount1() {
      if (!this.proportionAmount1) return 0;

      const formatProportionAmount1 = this.$ethers.utils.formatUnits(
        this.proportionAmount1,
        this.activeToken1.decimals
      );

      let re = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^-?\\d+(?:\.\\d{0,` + (4 || -1) + `})?`
      );
      return formatProportionAmount1.toString().match(re)[0];
    },
    activeToken0() {
      if (this.useDefaultBalance) return this.pool.token0;

      if (this.pool.token0.canBeDefault) return this.pool.chainToken;

      return this.pool.token0;
    },
    activeToken1() {
      if (this.useDefaultBalance) return this.pool.token1;

      if (this.pool.token1.canBeDefault) return this.pool.chainToken;

      return this.pool.token1;
    },
    isToken0Enough() {
      return this.amount0 <= this.pool.token0.balance;
    },
    isToken1Enough() {
      return this.amount1 <= this.pool.token1.balance;
    },
    isChainBalanceEnough() {
      return this.amount0 <= this.pool.chainToken.balance;
    },
    amount0Error() {
      if (this.amount0 && this.amount0 > +this.activeToken0.balance) {
        return `The value cannot be more than ${this.activeToken0.balance}`;
      }

      return "";
    },
    amount1Error() {
      if (this.amount1 && this.amount1 > +this.activeToken1.balance) {
        return `The value cannot be more than ${this.activeToken1.balance}`;
      }

      return "";
    },
    actionBtnText() {
      if (this.amount0Error || this.amount1Error) {
        return "Open Position";
      }

      if (!this.joinPropotion) {
        if (this.amount0 && this.activeToken0.swapAllowance == 0)
          return `Approve ${this.activeToken0.symbol} Spending`;
        if (this.amount1 && this.activeToken1.swapAllowance == 0)
          return `Approve ${this.activeToken1.symbol} Spending`;

        if (this.amount0 && this.activeToken0.swapAllowance > 0) {
          if (this.loadingProportion) return "Calculating Proportions";
          return "Zap";
        }
        if (this.amount1 && this.activeToken1.swapAllowance > 0) {
          if (this.loadingProportion) return "Calculating Proportions";
          return "Zap";
        }
      }

      if (+this.amount0 && +this.amount1 && this.useDefaultBalance) {
        if (this.activeToken0.allowance == 0)
          return `Approve ${this.activeToken0.symbol} Spending`;
        if (this.activeToken1.allowance == 0)
          return `Approve ${this.activeToken1.symbol} Spending`;

        // return "Nothing to do";
        return "Open Position";
      }

      return "Open Position";
    },
    disabledActionBtn() {
      if (this.amount0Error || this.amount1Error) {
        return true;
      }

      if (+this.amount0 === 0 && +this.amount1 === 0) {
        return true;
      }

      return false;
    },
    zapinDisableBtn() {
      if (!+this.zapinAmount) return true;
      return false;
    },
    zapinBtnText() {
      return "Open Position";
    },
  },
  methods: {
    setZapinToken(address) {
      this.zapinTokenAddress = address;
      this.showTokensListPopup = false;
    },
    setTokenListPopupState(payload) {
      this.showTokensListPopup = payload;
    },
    setActiveTab(tab) {
      if (this.isTokensListLoading && tab === 2) {
        return false;
      }

      this.activeTab = tab;
    },
    toggleMore() {
      this.showMore = !this.showMore;

      this.$emit("toggleMore", this.showMore);
    },
    createNotification(msg, isError) {
      const id = this.$store.getters.getNotificationId;

      const notification = { id, msg, isError };

      this.$store.commit("addNotification", notification);

      return id;
    },
    updateSlipage(newVal) {
      this.slipage = newVal;
    },
    async actionHandler() {
      if (this.amount0Error || this.amount1Error) {
        return false;
      }

      if (!this.joinPropotion) {
        if (this.amount0 && this.activeToken0.swapAllowance == 0) {
          await this.approveToken(
            this.pool.swapAddress,
            this.pool.token0.contractInstance
          );
          return false;
        }

        if (this.amount1 && this.activeToken1.swapAllowance == 0) {
          await this.approveToken(
            this.pool.swapAddress,
            this.pool.token1.contractInstance
          );
          return false;
        }

        if (this.amount0 && this.activeToken0.swapAllowance > 0) {
          if (this.loadingProportion) return false;
          await this.optInTEST();
          return false;
        }

        if (this.amount1 && this.activeToken1.swapAllowance > 0) {
          if (this.loadingProportion) return false;
          await this.optInTEST();
          return false;
        }
      }

      if (+this.amount0 && +this.amount1) {
        if (this.useDefaultBalance) {
          if (this.activeToken0.allowance == 0) {
            await this.approveToken(
              this.pool.address,
              this.pool.token0.contractInstance
            );
            return false;
          }

          if (this.activeToken1.allowance == 0) {
            await this.approveToken(
              this.pool.address,
              this.pool.token1.contractInstance
            );
            return false;
          }

          await this.joinHandler();
          return false;
        }

        await this.depositInEthTEST();
      }
    },
    async joinHandler() {
      const { amount0, amount1 } = await this.fetchDesiredAmounts();

      let value = "0";

      if (this.activeToken0.symbol === "ETH") value = amount0;
      if (this.activeToken1.symbol === "ETH") value = amount1;

      const notifyId = this.createNotification("Join position in progress");

      try {
        const options = {
          from: this.account,
          value,
        };

        console.log(options);

        const resp = await this.pool.contractInstance.methods
          .deposit(amount0, amount1, this.account)
          .send(options);
        this.$store.commit("deleteNotification", notifyId);
        console.log(resp);
      } catch (e) {
        console.log("!!error:", e);
        this.$store.commit("deleteNotification", notifyId);
      }
    },
    async depositInEthTEST() {
      try {
        if (this.activeToken0.swapAllowance == 0) {
          await this.approveToken(
            this.pool.swapAddress,
            this.pool.token0.contractInstance
          );
          return false;
        }

        if (this.activeToken1.swapAllowance == 0) {
          await this.approveToken(
            this.pool.swapAddress,
            this.pool.token1.contractInstance
          );
          return false;
        }

        const optimizerAddr = this.pool.address;
        const IAggregationExecutor = this.zeroAddress;

        let srcToken;
        if (this.activeToken0.symbol === "ETH")
          srcToken = this.activeToken1.address;
        if (this.activeToken1.symbol === "ETH")
          srcToken = this.activeToken0.address;

        const dstToken = srcToken;
        const srcReceiver = this.zeroAddress;
        const dstReceiver = this.zeroAddress;
        const { amount0, amount1 } = await this.fetchDesiredAmounts();

        console.log(amount0, amount1);

        let amount;
        if (this.activeToken0.symbol !== "ETH") amount = amount0;
        if (this.activeToken1.symbol !== "ETH") amount = amount1;

        let value;
        if (this.activeToken0.symbol === "ETH") value = amount0;
        if (this.activeToken1.symbol === "ETH") value = amount1;

        const minReturnAmount = 0;
        const flags = 0;
        const permit = "0x00";

        const SwapDescription = this.$ethers.utils.defaultAbiCoder.encode(
          [
            "address",
            "address",
            "address",
            "address",
            "uint256",
            "uint256",
            "uint256",
            "bytes",
          ],
          [
            srcToken,
            dstToken,
            srcReceiver,
            dstReceiver,
            amount,
            minReturnAmount,
            flags,
            permit,
          ]
        );

        console.log("a", amount, minReturnAmount);

        const bytes = "0x00";

        const TokenData = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "bytes"],
          [IAggregationExecutor, SwapDescription, bytes]
        );

        console.log("TokenData", TokenData);

        const options = {
          from: this.account,
          value: value,
        };

        console.log("optimizerAddr", optimizerAddr);
        console.log("this.pool.swapContract", this.pool.swapContract);

        const swapStaticTx = await this.pool.swapContract.methods
          .DepositInEth(optimizerAddr, this.account, [
            false, // bool IsUno; false only here
            IAggregationExecutor,
            [
              srcToken,
              dstToken,
              srcReceiver,
              dstReceiver,
              amount,
              minReturnAmount,
              flags,
              permit,
            ],
            bytes,
            [], // pools
          ])
          .send(options);

        console.log("swapStaticTx", swapStaticTx);
      } catch (e) {
        console.log("depositInEthTEST err:", e);

        if (
          String(e).indexOf(
            "Invalid transaction params: params specify an EIP-1559 transaction but the current network does not support EIP-1559"
          ) !== -1
        ) {
          this.createNotification(
            "Trezor is currently not supported due to metamask limitations.",
            true
          );
          return false;
        }

        if (String(e).indexOf("MTS: execution reverted") !== -1) {
          this.createNotification(
            "This pool has currently reached its TVL limit. Please wait for this limit to be increased to deposit more funds.",
            true
          );
          return false;
        }
      }
    },
    async joinWithAnotherTokenHandler() {
      try {
        if (this.zapinActiveToken.symbol !== "ETH") {
          const swapTokenAbi = abiERC20;
          const swapTokenAddress = this.zapinActiveToken.address;

          const tokenContract = new this.web3.eth.Contract(
            swapTokenAbi,
            swapTokenAddress
          );

          const allowance = await this.getTokenAllowance(
            this.account,
            this.pool.swapAddress,
            tokenContract
          );

          console.log("allowance", allowance);

          if (!+allowance) {
            await this.approveToken(this.pool.swapAddress, tokenContract);
            return false;
          }
        }

        if (this.itsToken0 || this.itsToken1) {
          this.ZapIn(this.itsToken0, this.itsToken1);
          return false;
        }

        this.joinWithAnotherToken();
      } catch (e) {
        console.log("joinHandler err:", e);
      }
    },
    async ZapIn(itsToken0, itsToken1) {
      const notifyId = this.createNotification("Zappin and Join in Progress");
      try {
        let dataAmount;
        let tokenOutAddr;

        let tokenInAddr;
        let amount;
        let optimizerAddr = this.pool.address;
        let swapperAddr = this.pool.swapAddress;
        let toAddr = this.account;

        let value = 0;

        const {
          proportionAmount0,
          proportionAmount1,
        } = await this.fetchZapinProportion();

        if (itsToken0) {
          tokenInAddr = this.pool.token0.address;
          tokenOutAddr = this.pool.token1.address;

          amount = this.$ethers.utils.parseUnits(
            String(this.zapinAmount),
            this.pool.token0.decimals
          );

          console.log("amount", amount);

          dataAmount = +amount - +proportionAmount0;

          console.log("dataAmount", dataAmount);
        }

        if (itsToken1) {
          tokenInAddr = this.pool.token1.address;
          tokenOutAddr = this.pool.token0.address;

          amount = this.$ethers.utils.parseUnits(
            String(this.zapinAmount),
            this.pool.token1.decimals
          );

          dataAmount = +amount - +proportionAmount1;

          console.log("dataAmount", dataAmount);
        }

        dataAmount = this.web3.utils
          .toBN(dataAmount.toLocaleString("fullwide", { useGrouping: false }))
          .toString();

        const tokenDataRequestPayload = {
          fromTokenAddress: tokenInAddr,
          toTokenAddress: tokenOutAddr,
          amount: dataAmount,
          fromAddress: this.account,
          slippage: this.slipage,
          disableEstimate: true,
          destReceiver: swapperAddr,
        };

        console.log("tokenDataRequestPayload", tokenDataRequestPayload);

        const tokensData = await this.getTokensData(tokenDataRequestPayload);

        // TEMP remove abi import
        const dataInterface = new this.$ethers.utils.Interface(swapAbi);

        console.log("tokensData", tokensData.tx);

        const methodByte = tokensData.tx.data.substr(0, 10);

        let decodeResult;
        let isUno = false;

        let token0Data;
        let token1Data;

        if (methodByte === "0x2e95b6c8") {
          console.log("----0x2e95b6c8----");

          decodeResult = dataInterface.decodeFunctionData(
            "unoswap",
            tokensData.tx.data
          );
          isUno = true;

          console.log("decodeResult", decodeResult);

          if (itsToken0) {
            token0Data = [
              false, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                tokenInAddr, //srcToken
                this.pool.token0.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                proportionAmount0, //amount
                0, //minReturnAmount
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              [], // pools
            ];

            token1Data = [
              true, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                decodeResult.srcToken, //srcToken
                this.pool.token1.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                decodeResult.amount, //amount
                decodeResult.minReturn, //minReturnAmount
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              decodeResult[3], // pools
            ];
          }

          if (itsToken1) {
            console.log(decodeResult);
            token0Data = [
              true, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                decodeResult.srcToken, //srcToken
                this.pool.token0.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                decodeResult.amount, //amount
                decodeResult.minReturn, //minReturnAmount
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              decodeResult[3], // pools
            ];

            token1Data = [
              false, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                tokenInAddr, //srcToken
                this.pool.token1.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                proportionAmount1, //amount
                0, //minReturnAmount
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              [], // pools
            ];
          }
        }

        if (methodByte === "0x7c025200") {
          console.log("----0x7c025200----");

          decodeResult = dataInterface.decodeFunctionData(
            "swap",
            tokensData.tx.data
          );
          console.log("decodeResult DATA", decodeResult.data);

          isUno = false;

          if (itsToken0) {
            token1Data = [
              isUno, //isUno
              decodeResult.caller, //IAggregationExecutor
              [
                decodeResult.desc.srcToken, //srcToken
                decodeResult.desc.dstToken, //dstToken
                decodeResult.desc.srcReceiver, //srcReceiver
                decodeResult.desc.dstReceiver, //"0xc9755077348D1FDB438914Ed94ECDbF4601999F7",
                decodeResult.desc.amount, //amount
                decodeResult.desc.minReturnAmount, //minReturnAmount
                decodeResult.desc.flags, //flags
                decodeResult.desc.permit, //permit
              ],
              decodeResult.data, // bytes data
              [], // pools
            ];

            const amountToken0 = +amount - +decodeResult.desc.amount;

            token0Data = [
              isUno, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                tokenInAddr, //srcToken
                this.pool.token0.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                this.$ethers.BigNumber.from(
                  amountToken0.toLocaleString("fullwide", {
                    useGrouping: false,
                  })
                ), //amount
                0, //minReturnAmount
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              [], // pools
            ];
          }

          if (itsToken1) {
            token0Data = [
              isUno, //isUno
              decodeResult.caller, //IAggregationExecutor
              [
                decodeResult.desc.srcToken, //srcToken
                decodeResult.desc.dstToken, //dstToken
                decodeResult.desc.srcReceiver, //srcReceiver
                decodeResult.desc.dstReceiver, //"0xc9755077348D1FDB438914Ed94ECDbF4601999F7",
                decodeResult.desc.amount, //amount
                decodeResult.desc.minReturnAmount, //minReturnAmount
                decodeResult.desc.flags, //flags
                decodeResult.desc.permit, //permit
              ],
              decodeResult.data, // bytes data
              [], // pools
            ];

            const amountToken1 = +amount - +decodeResult.desc.amount;

            token1Data = [
              isUno, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                tokenInAddr, //srcToken
                this.pool.token1.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                this.$ethers.BigNumber.from(
                  amountToken1.toLocaleString("fullwide", {
                    useGrouping: false,
                  })
                ), //amount
                0, //minReturnAmount
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              [], // pools
            ];
          }
        }

        const options = {
          from: this.account,
          value,
        };

        console.log("OPTIONS", options);
        console.log("PARAMS", {
          tokenInAddr,
          amount,
          optimizerAddr,
          toAddr,
          token0Data,
          token1Data,
        });

        if (!+options.value) {
          try {
            const estimateGas = await this.pool.swapContract.methods
              .ZapIn(
                tokenInAddr,
                amount,
                optimizerAddr,
                toAddr,
                token0Data,
                token1Data
              )
              .estimateGas(options);

            console.log("estimateGas", estimateGas);
          } catch (e) {
            this.$store.commit("deleteNotification", notifyId);

            if (
              String(e).indexOf(
                "Invalid transaction params: params specify an EIP-1559 transaction but the current network does not support EIP-1559"
              ) !== -1
            ) {
              this.createNotification(
                "Trezor is currently not supported due to metamask limitations.",
                true
              );
              return false;
            }

            if (String(e).indexOf("MTS: execution reverted") !== -1) {
              this.createNotification(
                "This pool has currently reached its TVL limit. Please wait for this limit to be increased to deposit more funds.",
                true
              );
              return false;
            }

            this.createNotification(
              "The chosen Asset is currently experiencing high volatility. Please try again in a few minutes or select a different asset.",
              true
            );

            return false;
          }
        }

        const swapStaticTx = await this.pool.swapContract.methods
          .ZapIn(
            tokenInAddr,
            amount,
            optimizerAddr,
            toAddr,
            token0Data,
            token1Data
          )
          .send(options);

        console.log("swapStaticTx", swapStaticTx);
        this.$store.commit("deleteNotification", notifyId);
      } catch (e) {
        console.log("optInTEST err:", e);
        this.$store.commit("deleteNotification", notifyId);

        if (
          String(e).indexOf(
            "Invalid transaction params: params specify an EIP-1559 transaction but the current network does not support EIP-1559"
          ) !== -1
        ) {
          this.createNotification(
            "Trezor is currently not supported due to metamask limitations.",
            true
          );
          return false;
        }

        if (String(e).indexOf("MTS: execution reverted") !== -1) {
          this.createNotification(
            "This pool has currently reached its TVL limit. Please wait for this limit to be increased to deposit more funds.",
            true
          );
          return false;
        }
      }
    },
    async joinWithAnotherToken() {
      if (!+this.zapinAmount) return false;
      const notifyId = this.createNotification("Zappin and Join in Progress");
      try {
        const swapTokenAddress = this.zapinActiveToken.address;

        const swapperAddr = this.pool.swapAddress;
        const optimizerAddr = this.pool.address;
        const toAddr = this.account;

        const amountIn = this.$ethers.utils.parseUnits(
          this.zapinAmount,
          this.zapinActiveToken.decimals
        );

        let value = 0;

        if (this.zapinActiveToken.symbol === "ETH") {
          value = amountIn;
        }

        const amountIn0 = +parseFloat(
          (+amountIn / 100) * this.pool.proportion.token0Percent
        ).toFixed(0);

        const amountIn0Final = this.web3.utils
          .toBN(amountIn0.toLocaleString("fullwide", { useGrouping: false }))
          .toString();

        const amountIn1 = amountIn.sub(amountIn0Final);

        const amountIn1Final = this.web3.utils.toBN(amountIn1).toString();

        console.log("amountIn0Final", amountIn0Final);
        console.log("amountIn1Final", amountIn1Final);

        const tokenOut0Address = this.pool.token0.address;
        const tokenOut1Address = this.pool.token1.address;

        const tokenDataRequestPayload0 = {
          fromTokenAddress: swapTokenAddress,
          toTokenAddress: tokenOut0Address,
          amount: amountIn0Final,
          fromAddress: this.account,
          slippage: this.slipage,
          disableEstimate: true,
          destReceiver: swapperAddr,
        };

        const tokenDataRequestPayload1 = {
          fromTokenAddress: swapTokenAddress,
          toTokenAddress: tokenOut1Address,
          amount: amountIn1Final,
          fromAddress: this.account,
          slippage: this.slipage,
          disableEstimate: true,
          destReceiver: swapperAddr,
        };

        console.log("tokenDataRequestPayload0", tokenDataRequestPayload0);
        console.log("tokenDataRequestPayload1", tokenDataRequestPayload1);

        const tokensData0 = await this.getTokensData(tokenDataRequestPayload0);
        const tokensData1 = await this.getTokensData(tokenDataRequestPayload1);

        // TEMP remove abi import
        const dataInterface = new this.$ethers.utils.Interface(swapAbi);

        console.log("tokensData0", tokensData0.tx);
        console.log("tokensData1", tokensData1.tx);

        const methodByte0 = tokensData0.tx.data.substr(0, 10);

        let token0Data;

        if (methodByte0 === "0x2e95b6c8") {
          console.log("----TOKEN0 - 0x2e95b6c8----");

          const decodeResult0 = dataInterface.decodeFunctionData(
            "unoswap",
            tokensData0.tx.data
          );

          console.log("decodeResult TOKEN0", decodeResult);

          token0Data = [
            true, //isUno
            this.zeroAddress, //IAggregationExecutor
            [
              decodeResult0.srcToken, //srcToken
              tokenOut0Address, //dstToken
              this.zeroAddress, //srcReceiver
              this.zeroAddress, //dstReceiver
              decodeResult0.amount, //amount
              decodeResult0.minReturn, //minReturnAmount (decodeResult.minReturn TEMP)
              0, //flags
              "0x00", //permit
            ],
            "0x00", // bytes data
            decodeResult0[3], // pools
          ];
        }

        if (methodByte0 === "0x7c025200") {
          console.log("----0x7c025200----");

          const decodeResult0 = dataInterface.decodeFunctionData(
            "swap",
            tokensData0.tx.data
          );
          console.log("decodeResult DATA", decodeResult0.data);

          token0Data = [
            false, //isUno
            decodeResult0.caller, //IAggregationExecutor
            [
              decodeResult0.desc.srcToken, //srcToken
              decodeResult0.desc.dstToken, //dstToken
              decodeResult0.desc.srcReceiver, //srcReceiver
              decodeResult0.desc.dstReceiver, //"0xc9755077348D1FDB438914Ed94ECDbF4601999F7",
              decodeResult0.desc.amount, //amount
              decodeResult0.desc.minReturnAmount, //minReturnAmount decodeResult.desc.minReturnAmount
              decodeResult0.desc.flags, //flags
              decodeResult0.desc.permit, //permit
            ],
            decodeResult0.data, // bytes data
            [], // pools
          ];
        }

        const methodByte1 = tokensData0.tx.data.substr(0, 10);
        let token1Data;

        if (methodByte1 === "0x2e95b6c8") {
          console.log("----TOKEN0 - 0x2e95b6c8----");

          const decodeResult1 = dataInterface.decodeFunctionData(
            "unoswap",
            tokensData1.tx.data
          );

          console.log("decodeResult TOKEN0", decodeResult);

          token1Data = [
            true, //isUno
            this.zeroAddress, //IAggregationExecutor
            [
              decodeResult1.srcToken, //srcToken
              tokenOut1Address, //dstToken
              this.zeroAddress, //srcReceiver
              this.zeroAddress, //dstReceiver
              decodeResult1.amount, //amount
              decodeResult1.minReturn, //minReturnAmount (decodeResult.minReturn TEMP)
              0, //flags
              "0x00", //permit
            ],
            "0x00", // bytes data
            decodeResult1[3], // pools
          ];
        }

        if (methodByte1 === "0x7c025200") {
          console.log("----0x7c025200----");

          const decodeResult1 = dataInterface.decodeFunctionData(
            "swap",
            tokensData1.tx.data
          );
          console.log("decodeResult DATA", decodeResult1.data);

          token1Data = [
            false, //isUno
            decodeResult1.caller, //IAggregationExecutor
            [
              decodeResult1.desc.srcToken, //srcToken
              decodeResult1.desc.dstToken, //dstToken
              decodeResult1.desc.srcReceiver, //srcReceiver
              decodeResult1.desc.dstReceiver, //"0xc9755077348D1FDB438914Ed94ECDbF4601999F7",
              decodeResult1.desc.amount, //amount
              decodeResult1.desc.minReturnAmount, //minReturnAmount decodeResult.desc.minReturnAmount
              decodeResult1.desc.flags, //flags
              decodeResult1.desc.permit, //permit
            ],
            decodeResult1.data, // bytes data
            [], // pools
          ];
        }

        const options = {
          from: this.account,
          value,
        };

        console.log("OPTIONS", options);
        console.log("PARAMS", {
          swapTokenAddress,
          amountIn,
          optimizerAddr,
          toAddr,
          token0Data,
          token1Data,
        });

        if (!+options.value) {
          try {
            const estimateGas = await this.pool.swapContract.methods
              .ZapIn(
                swapTokenAddress,
                amountIn,
                optimizerAddr,
                toAddr,
                token0Data,
                token1Data
              )
              .estimateGas(options);

            console.log("estimateGas", estimateGas);
          } catch (e) {
            this.$store.commit("deleteNotification", notifyId);

            if (
              String(e).indexOf(
                "Invalid transaction params: params specify an EIP-1559 transaction but the current network does not support EIP-1559"
              ) !== -1
            ) {
              this.createNotification(
                "Trezor is currently not supported due to metamask limitations.",
                true
              );
              return false;
            }

            if (String(e).indexOf("MTS: execution reverted") !== -1) {
              this.createNotification(
                "This pool has currently reached its TVL limit. Please wait for this limit to be increased to deposit more funds.",
                true
              );
              return false;
            }

            this.createNotification(
              "The chosen Asset is currently experiencing high volatility. Please try again in a few minutes or select a different asset.",
              true
            );

            return false;
          }
        }

        const swapStaticTx = await this.pool.swapContract.methods
          .ZapIn(
            swapTokenAddress,
            amountIn,
            optimizerAddr,
            toAddr,
            token0Data,
            token1Data
          )
          .send(options);

        this.$store.commit("deleteNotification", notifyId);
        console.log("swapStaticTx", swapStaticTx);
      } catch (e) {
        this.$store.commit("deleteNotification", notifyId);
        console.log("joinWithAnotherToken err: ", e);

        if (
          String(e).indexOf(
            "Invalid transaction params: params specify an EIP-1559 transaction but the current network does not support EIP-1559"
          ) !== -1
        ) {
          this.createNotification(
            "Trezor is currently not supported due to metamask limitations.",
            true
          );
          return false;
        }

        if (String(e).indexOf("MTS: execution reverted") !== -1) {
          this.createNotification(
            "This pool has currently reached its TVL limit. Please wait for this limit to be increased to deposit more funds.",
            true
          );
          return false;
        }
      }
    },
    async optInTEST() {
      try {
        if (this.amount0 && this.amount1) return false;

        if (this.activeToken0.swapAllowance == 0 && this.amount0) {
          await this.approveToken(
            this.pool.swapAddress,
            this.pool.token0.contractInstance
          );
          return false;
        }

        if (this.activeToken1.swapAllowance == 0 && this.amount1) {
          await this.approveToken(
            this.pool.swapAddress,
            this.pool.token1.contractInstance
          );
          return false;
        }

        let dataAmount;
        let tokenOutAddr;

        let tokenInAddr;
        let amount;
        let optimizerAddr = this.pool.address;
        let swapperAddr = this.pool.swapAddress;
        let toAddr = this.account;

        let value = 0;

        if (this.amount0 && !this.amount1) {
          tokenInAddr = this.pool.token0.address;
          tokenOutAddr = this.pool.token1.address;

          amount = this.$ethers.utils.parseUnits(
            String(this.amount0),
            this.activeToken0.decimals
          );

          if (!this.useDefaultBalance && this.activeToken0.symbol === "ETH") {
            console.log("here");
            tokenInAddr = this.activeToken0.address;
            value = amount;
          }

          console.log("amount", amount);

          dataAmount = +amount - +this.proportionAmount0;

          console.log("dataAmount", dataAmount);
        }

        if (!this.amount0 && this.amount1) {
          tokenInAddr = this.pool.token1.address;
          tokenOutAddr = this.pool.token0.address;

          amount = this.amount1;

          amount = this.$ethers.utils.parseUnits(
            String(this.amount1),
            this.activeToken1.decimals
          );

          if (!this.useDefaultBalance && this.activeToken1.symbol === "ETH") {
            console.log("here");
            tokenInAddr = this.activeToken1.address;
            value = amount;
          }

          console.log("amount", amount);

          dataAmount = +amount - +this.proportionAmount1;

          console.log("dataAmount", dataAmount);
        }

        dataAmount = this.web3.utils
          .toBN(dataAmount.toLocaleString("fullwide", { useGrouping: false }))
          .toString();

        const tokenDataRequestPayload = {
          fromTokenAddress: tokenInAddr,
          toTokenAddress: tokenOutAddr,
          amount: dataAmount,
          fromAddress: this.account,
          slippage: this.slipage,
          disableEstimate: true,
          destReceiver: swapperAddr,
        };

        console.log("tokenDataRequestPayload", tokenDataRequestPayload);

        const tokensData = await this.getTokensData(tokenDataRequestPayload);

        // TEMP remove abi import
        const dataInterface = new this.$ethers.utils.Interface(swapAbi);

        console.log("tokensData", tokensData.tx);

        const methodByte = tokensData.tx.data.substr(0, 10);

        let decodeResult;
        let isUno = false;

        let token0Data;
        let token1Data;

        if (methodByte === "0x2e95b6c8") {
          console.log("----0x2e95b6c8----");

          decodeResult = dataInterface.decodeFunctionData(
            "unoswap",
            tokensData.tx.data
          );
          isUno = true;

          console.log("decodeResult", decodeResult);

          if (this.amount0 && !this.amount1) {
            token0Data = [
              false, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                tokenInAddr, //srcToken
                this.pool.token0.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                this.proportionAmount0, //amount
                0, //minReturnAmount
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              [], // pools
            ];

            token1Data = [
              true, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                decodeResult.srcToken, //srcToken
                this.pool.token1.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                decodeResult.amount, //amount
                decodeResult.minReturn, //minReturnAmount (decodeResult.minReturn TEMP)
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              decodeResult[3], // pools
            ];
          }

          if (!this.amount0 && this.amount1) {
            console.log(decodeResult);
            token0Data = [
              true, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                decodeResult.srcToken, //srcToken
                this.pool.token0.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                decodeResult.amount, //amount
                decodeResult.minReturn, //minReturnAmount (decodeResult.minReturn TEMP)
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              decodeResult[3], // pools
            ];

            token1Data = [
              false, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                tokenInAddr, //srcToken
                this.pool.token1.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                this.proportionAmount1, //amount
                0, //minReturnAmount
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              [], // pools
            ];
          }
        }

        if (methodByte === "0x7c025200") {
          console.log("----0x7c025200----");

          decodeResult = dataInterface.decodeFunctionData(
            "swap",
            tokensData.tx.data
          );
          console.log("decodeResult DATA", decodeResult.data);

          isUno = false;

          if (this.amount0 && !this.amount1) {
            token1Data = [
              isUno, //isUno
              decodeResult.caller, //IAggregationExecutor
              [
                decodeResult.desc.srcToken, //srcToken
                decodeResult.desc.dstToken, //dstToken
                decodeResult.desc.srcReceiver, //srcReceiver
                decodeResult.desc.dstReceiver, //"0xc9755077348D1FDB438914Ed94ECDbF4601999F7",
                decodeResult.desc.amount, //amount
                decodeResult.desc.minReturnAmount, //minReturnAmount decodeResult.desc.minReturnAmount
                decodeResult.desc.flags, //flags
                decodeResult.desc.permit, //permit
              ],
              decodeResult.data, // bytes data
              [], // pools
            ];

            const amountToken0 = +amount - +decodeResult.desc.amount;

            token0Data = [
              isUno, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                tokenInAddr, //srcToken
                this.pool.token0.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                this.$ethers.BigNumber.from(
                  amountToken0.toLocaleString("fullwide", {
                    useGrouping: false,
                  })
                ), //amount
                0, //minReturnAmount
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              [], // pools
            ];
          }

          if (!this.amount0 && this.amount1) {
            token0Data = [
              isUno, //isUno
              decodeResult.caller, //IAggregationExecutor
              [
                decodeResult.desc.srcToken, //srcToken
                decodeResult.desc.dstToken, //dstToken
                decodeResult.desc.srcReceiver, //srcReceiver
                decodeResult.desc.dstReceiver, //"0xc9755077348D1FDB438914Ed94ECDbF4601999F7",
                decodeResult.desc.amount, //amount
                decodeResult.desc.minReturnAmount, //minReturnAmount decodeResult.desc.minReturnAmount
                decodeResult.desc.flags, //flags
                decodeResult.desc.permit, //permit
              ],
              decodeResult.data, // bytes data
              [], // pools
            ];

            const amountToken1 = +amount - +decodeResult.desc.amount;

            token1Data = [
              isUno, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                tokenInAddr, //srcToken
                this.pool.token1.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                this.$ethers.BigNumber.from(
                  amountToken1.toLocaleString("fullwide", {
                    useGrouping: false,
                  })
                ), //amount
                0, //minReturnAmount
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              [], // pools
            ];
          }
        }

        const options = {
          from: this.account,
          value,
        };

        console.log("OPTIONS", options);
        console.log("PARAMS", {
          tokenInAddr,
          amount,
          optimizerAddr,
          toAddr,
          token0Data,
          token1Data,
        });

        const swapStaticTx = await this.pool.swapContract.methods
          .ZapIn(
            tokenInAddr,
            amount,
            optimizerAddr,
            toAddr,
            token0Data,
            token1Data
          )
          .send(options);

        console.log("swapStaticTx", swapStaticTx);
      } catch (e) {
        console.log("optInTEST err:", e);

        if (
          String(e).indexOf(
            "Invalid transaction params: params specify an EIP-1559 transaction but the current network does not support EIP-1559"
          ) !== -1
        ) {
          this.createNotification(
            "Trezor is currently not supported due to metamask limitations.",
            true
          );
          return false;
        }

        if (String(e).indexOf("MTS: execution reverted") !== -1) {
          this.createNotification(
            "This pool has currently reached its TVL limit. Please wait for this limit to be increased to deposit more funds.",
            true
          );
          return false;
        }
      }
    },
    async getTokensData(payload) {
      try {
        const url = `https://api.1inch.exchange/v3.0/${this.chainId}/swap`;

        const response = await axios.get(url, { params: payload });

        return response.data;
      } catch (e) {
        console.log("fetchUserPendingRewards error:", e);
      }
    },
    toggleDefaultBalance() {
      this.useDefaultBalance = !this.useDefaultBalance;
    },
    updateValue0(value) {
      this.amount0 = value;

      if (this.amount1) this.joinPropotion = true;

      if (this.joinPropotion) {
        const toProportion = +value / +this.proportion;

        const fixedProportion = parseFloat(toProportion).toFixed(20);

        let re = new RegExp(
          // eslint-disable-next-line no-useless-escape
          `^-?\\d+(?:\.\\d{0,` + (this.activeToken1.decimals || -1) + `})?`
        );

        this.amount1 = fixedProportion.toString().match(re)[0];

        return false;
      }

      this.fetchProportion();
    },
    updateValue1(value) {
      this.amount1 = value;

      if (this.amount0) this.joinPropotion = true;

      if (this.joinPropotion) {
        const toProportion = +value * +this.proportion;

        const fixedProportion = parseFloat(toProportion).toFixed(20);

        let re = new RegExp(
          // eslint-disable-next-line no-useless-escape
          `^-?\\d+(?:\.\\d{0,` + (this.activeToken0.decimals || -1) + `})?`
        );

        this.amount0 = fixedProportion.toString().match(re)[0];
        return false;
      }

      this.fetchProportion();
    },
    updateZapinAmount(value) {
      this.zapinAmount = value;
    },
    toggleJoinProportion() {
      if (this.joinPropotion) {
        this.amount0 = "";
        this.amount1 = "";
      }

      this.joinPropotion = !this.joinPropotion;

      if (+this.amount0) {
        this.updateValue0(this.amount0);
      }

      if (+this.amount1) {
        this.updateValue1(this.amount1);
      }
    },
    async fetchProportion() {
      this.loadingProportion = true;

      if (!+this.amount0 && !+this.amount1) {
        this.loadingProportion = false;
        return false;
      }

      const desiredAmount0 = String(
        this.$ethers.utils.parseUnits(
          this.amount0 || "0",
          this.activeToken0.decimals
        )
      );
      const desiredAmount1 = String(
        this.$ethers.utils.parseUnits(
          this.amount1 || "0",
          this.activeToken1.decimals
        )
      );

      let ticker = this.loadingTicker;

      const response = await ConvertToProportion(
        desiredAmount0,
        desiredAmount1,
        this.pool.contractInstance,
        this.pool.poolContractInstance
      );

      if (ticker !== this.loadingTicker) return false;

      this.loadingTicker++;

      let { amount0, amount1 } = response;

      this.proportionAmount0 = amount0 || this.proportionAmount0;
      this.proportionAmount1 = amount1 || this.proportionAmount1;

      this.loadingProportion = false;
    },
    async fetchZapinProportion() {
      const amount0Zapin = this.itsToken0 ? this.zapinAmount : "0";
      const amount1Zapin = this.itsToken1 ? this.zapinAmount : "0";

      const desiredAmount0 = String(
        this.$ethers.utils.parseUnits(
          amount0Zapin || "0",
          this.pool.token0.decimals
        )
      );
      const desiredAmount1 = String(
        this.$ethers.utils.parseUnits(
          amount1Zapin || "0",
          this.pool.token1.decimals
        )
      );

      const response = await ConvertToProportion(
        desiredAmount0,
        desiredAmount1,
        this.pool.contractInstance,
        this.pool.poolContractInstance
      );

      let { amount0, amount1 } = response;

      return {
        proportionAmount0: amount0,
        proportionAmount1: amount1,
      };
    },
    async fetchDesiredAmounts() {
      const amount0 = this.amount0 || 0;
      const amount1 = this.amount1 || 0;

      let re0 = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^-?\\d+(?:\.\\d{0,` + (this.activeToken0.decimals || -1) + `})?`
      );

      let re1 = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^-?\\d+(?:\.\\d{0,` + (this.activeToken1.decimals || -1) + `})?`
      );

      const amount0Format = amount0.toString().match(re0)[0];
      const amount1Format = amount1.toString().match(re1)[0];

      const desiredAmount0 = String(
        this.$ethers.utils.parseUnits(
          String(amount0Format),
          this.activeToken0.decimals
        )
      );
      const desiredAmount1 = String(
        this.$ethers.utils.parseUnits(
          String(amount1Format),
          this.activeToken1.decimals
        )
      );

      const response = await GetAmountForDesired(
        desiredAmount0,
        desiredAmount1,
        this.pool.contractInstance,
        this.pool.poolContractInstance
      );

      return response;
    },
    async getProportion() {
      const desiredAmount0 = String(
        this.$ethers.utils.parseUnits("1", this.activeToken0.decimals)
      );
      const desiredAmount1 = String(
        this.$ethers.utils.parseUnits("1", this.activeToken1.decimals)
      );

      const response = await ConvertToProportion(
        desiredAmount0,
        desiredAmount1,
        this.pool.contractInstance,
        this.pool.poolContractInstance
      );

      let { amount0, amount1 } = response;

      const proportionAmount0 = this.$ethers.utils.formatUnits(
        amount0,
        this.activeToken0.decimals
      );
      const proportionAmount1 = this.$ethers.utils.formatUnits(
        amount1,
        this.activeToken1.decimals
      );
      const proportion = proportionAmount0 / proportionAmount1;

      return proportion;
    },
    async getTokenAllowance(user, spenderAddr, tokenContract) {
      try {
        const allowance = await tokenContract.methods
          .allowance(user, spenderAddr)
          .call();

        return allowance;
      } catch (e) {
        console.log("getUserTokenBalance error:", e);
      }
    },
    async approveToken(spenderAddr, tokenContract) {
      const notifyId = this.createNotification("Approve in progress");

      try {
        const resp = await tokenContract.methods
          .approve(
            spenderAddr,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          )
          .send({ from: this.account });
        console.log(resp);
        this.$store.commit("deleteNotification", notifyId);
        return true;
      } catch (e) {
        console.log("approveToken error", e);
        this.$store.commit("deleteNotification", notifyId);

        if (
          String(e).indexOf(
            "Invalid transaction params: params specify an EIP-1559 transaction but the current network does not support EIP-1559"
          ) !== -1
        ) {
          this.createNotification(
            "Trezor is currently not supported due to metamask limitations.",
            true
          );
          return false;
        }
        return false;
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.updateProportionInterval);
  },
  async created() {
    this.proportion = await this.getProportion();

    this.loading = false;

    this.createUserTokenList(this.account);

    this.updateProportionInterval = setInterval(async () => {
      this.proportion = await this.getProportion();
    }, 15000);
  },
  components: {
    PoolInfoItem,
    Input,
    SlipageBlock,
    DepositItem,
    TickChart,
    TokensListPopup,
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.zapin-info-block {
  padding: 20px 10px;
  margin: 20px 0;
  background: linear-gradient(
    180deg,
    rgba(145, 255, 232, 0.1) 0%,
    rgba(164, 222, 255, 0.1) 96.16%
  );
  border-radius: 8px;

  .info-item {
    display: flex;
    justify-content: space-between;
    font-weight: 300;
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.02em;
  }

  .info-item:not(:last-child) {
    margin-bottom: 10px;
  }
}

.tab-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;

  .tab-item {
    background: #333333;
    border-radius: 12px;
    height: 50px;
    width: calc(50% - 10px);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover,
    &.active {
      background: #4d4d4d;
    }

    p {
      font-size: 16px;
      line-height: 22px;
    }
  }
}

.info-block {
  margin-top: 20px;
}

.settings-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  .checkbox-wrap {
    width: 50%;
    padding-top: 5px;
    padding-bottom: 5px;

    &:nth-child(2) {
      padding-left: 25px;
    }
  }
}

.checkbox-wrap {
  display: flex;
  align-items: center;

  &.active-token {
    margin-right: 30px;
  }

  &.active {
    .checkbox {
      border: 1px solid #2bd2f7;

      .indicator {
        opacity: 1;
      }
    }
  }

  .checkbox {
    border: 1px solid #868686;
    border-radius: 6px;
    width: 24px;
    height: 24px;
    margin-right: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    .indicator {
      opacity: 0;
      width: 50%;
      height: 50%;
      border-radius: 3px;
      background-color: #2bd2f7;
      transition: all 0.3s ease;
    }
  }

  .label-text {
    cursor: pointer;
    font-size: 14px;
  }
}

.action-title {
  font-size: 20px;
  line-height: 27px;
  font-weight: normal;
  margin-bottom: 20px;
}

.inform-board {
  background: linear-gradient(
    180deg,
    rgba(145, 255, 232, 0.1) 0%,
    rgba(164, 222, 255, 0.1) 93.83%
  );
  border-radius: 8px;
  padding: 20px 10px;
  margin-bottom: 18px;

  .text-wrap {
    font-weight: 300;
    font-size: 13px;
    line-height: 1.5;
    text-align: center;

    a {
      color: #2bd2f7;
      transition: all 0.3s ease;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .inform-row {
    display: flex;
    align-items: center;
    border: 1px solid #252423;
    border-radius: 8px;
    padding: 10px;
    margin-top: 20px;

    .like-border {
      width: 1px;
      height: 20px;
      background: #868686;
      content: "";
      display: block;
      margin: 0 20px;
    }

    .inform-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1;
      font-size: 14px;
      line-height: 14px;
    }
  }
}

.load-wrap {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.btm-actions-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.action-content-wrap {
  display: flex;
  justify-content: space-between;
  width: 100%;

  &.alternative {
    .info-block {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 20px;
    }

    .main-col {
      width: 39%;
    }

    .aside-col {
      width: 60%;
    }
  }

  .main-col {
    width: 56.28%;
    background: #2c2c2c;
    box-shadow: 0px 0px 16px rgba(20, 20, 19, 0.05);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s ease;
  }

  .aside-col {
    width: 41.3%;
    background: #2c2c2c;
    box-shadow: 0px 0px 16px rgba(20, 20, 19, 0.05);
    border-radius: 12px;
    padding: 20px;
    position: relative;
    transition: all 0.3s ease;

    .show-more {
      cursor: pointer;
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 12px;
      color: #a4f3b6;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.action-btn {
  border: 1px solid #2bd2f7;
  box-sizing: border-box;
  border-radius: 12px;
  height: 40px;
  min-width: 125px;
  padding: 0 15px;
  background: transparent;
  outline: none;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
  color: #2bd2f7;
  transition: all 0.3s ease;
  display: block;
  margin-left: auto;

  &:disabled {
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.2);
  }

  &:hover {
    color: white;
    background: #2bd2f7;
  }
}

@media screen and (max-width: 1024px) {
  .action-content-wrap.alternative .aside-col,
  .action-content-wrap.alternative .main-col,
  .action-content-wrap .aside-col,
  .action-content-wrap .main-col {
    width: 49%;
  }

  .action-content-wrap.alternative .info-block {
    display: block;
  }

  .action-content-wrap .aside-col .show-more {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .action-content-wrap {
    flex-direction: column;

    .main-col {
      margin-bottom: 30px;
    }
  }

  .action-content-wrap.alternative .aside-col,
  .action-content-wrap.alternative .main-col,
  .action-content-wrap .aside-col,
  .action-content-wrap .main-col {
    width: 100%;
  }

  .pool-actions-wrap .action-content-wrap {
    flex-direction: column;
  }

  .pool-actions-wrap .action-board,
  .pool-actions-wrap .aside-wrap {
    width: 100%;
  }

  .pool-actions-wrap.light-theme .aside-wrap {
    margin-top: 30px;
  }
}

@media screen and (max-width: 460px) {
  .settings-wrap {
    flex-direction: column;
  }

  .settings-wrap .checkbox-wrap {
    width: 100%;
  }

  .settings-wrap .checkbox-wrap:nth-child(2) {
    border-left: none;
    padding-left: 0;
  }

  .pool-actions-wrap {
    padding: 30px 15px;
  }

  .settings-wrap {
    flex-direction: column;
    align-items: flex-start;
  }

  .checkbox-wrap.active-token {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>
