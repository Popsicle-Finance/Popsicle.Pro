import gsap from "gsap";
import { mapGetters } from "vuex";
import { InitWallet } from "@/services/wallet";

export default {
  data: () => ({
    updateInterval: null,
    currentModal: 0,
    finishFetchingData: false,
    loading: false,

    prices: {},

    selectedText: "Smart Chain",
    activePoint: 2,

    showExp: null,

    //
    farmData: null,
    farm2Data: null,
    openToDeposit: false,
    openWithdraw: false,

    //
    selectedBalance: "",
    balanceAmount: "",
    withdrawAmount: "",

    harvestProcess: false,

    currentPool: {
      id: 0,
    },

    info: null,
  }),
  computed: {
    isAuth() {
      return this.$store.getters.getIsAuth
    },
    // theme
    ...mapGetters({
      theme: "getTheme",
      pools: "getPools",
      poolsList: "getPoolsArr",
    }),
    stakingLink() {
      return !this.$farm3.walletAddress
        ? "staking-unlock-wallet"
        : "staking-deposit";
    },
  },
  methods: {
    handleChangeText(e, text) {
      this.joinText = text;
    },

    extractBalance(str, uint) {
      const num = parseFloat(
        fromWei(str ? BigInt(str).toString() : "0", uint)
      ).toFixed(2);
      return num;
    },

    // Network
    async handleToggleNetwork({ name, point }) {
      const status = await this.$farm3.switchChain(point);

      if (status) {
        if (point === 1) {
          localStorage.setItem("network", "eth");
        } else if (point === 2) {
          localStorage.setItem("network", "bsc");
        } else {
          localStorage.setItem("network", "fantom");
        }

        this.selectedText = name;
        this.activePoint = point;
      }

      return status;
    },

    // Animations
    enter(el) {
      const position = el.dataset.position ? el.dataset.position : "left";

      el.style.opacity = 0;

      switch (position) {
        case "left":
          el.style.transform = "translateX(-100px)";
          break;
        case "right":
          el.style.transform = "translateX(100px)";
          break;
        case "top":
          el.style.transform = "translateY(-100px)";
          break;
        case "bottom":
          el.style.transform = "translateY(100px)";
          break;
        default:
          break;
      }
    },

    beforeEnter(el, done) {
      gsap.to(el, {
        x: 0,
        y: 0,
        opacity: 1,
        delay: el.dataset.delay,
        duration: 0.5,
        onComplete: done,
      });
    },

    // Farm v3
    async connectWallet() {
      try {
        // await this.$farm3.connectWallet();
        // await InitWallet();
      } catch (error) {
        console.log(error);
      }
    },

    async updatePools() {
      const arr = await this.$farm3.getPools();
      this.info = await this.$farm3.getInfo();
      this.$store.commit("SET_POOLS", arr);
    },

    closeModals() {
      $("#modalIceDeposit").modal("hide");
      $("#modalIceDepositStand").modal("hide");
      $("#modalFUSDTDeposit").modal("hide");
      $("#modalBNBDeposit").modal("hide");
      $("#modalIceWithdraw").modal("hide");
      $("#modalIceWithdrawStand").modal("hide");
      $("#modalFUSDTWithdraw").modal("hide");
      $("#modalBNBWithdraw").modal("hide");
      $("#modalCurveWithdraw").modal("hide");
      $("#modalCurveDeposit").modal("hide");
      $("#modalYUSDTDeposit").modal("hide");
      $("#modalYUSDTDeposit").modal("hide");
      $("#modalSTAKERDeposit").modal("hide");
      $("#modalSTAKERDeposit").modal("hide");
      $("#modalHarvestEPS").modal("hide");
      //
    },

    handleJoinToPool(pool) {
      pool.join();
    },

    handleProcess(value, type = "deposit") {
      this.$store.dispatch("handleUpdatePoolProcess", {
        id: parseInt(this.currentPool.id),
        payload: value,
        processType: type,
      });
    },

    async handleDeposit({ pool, amount }) {
      try {
        this.closeModals();
        this.handleProcess(true);

        const result = await pool.deposit(amount);

        if (result.status) {
          await this.updatePools();
          this.handleProcess(false);
        }
      } catch (error) {
        console.log(error);
        this.handleProcess(false);
      }
    },

    async handleDepositStand({ pool, amount }) {
      try {
        this.closeModals();

        const result = await pool.stake(amount);

        if (result.status) {
          await this.updatePools();
        }
      } catch (error) {
        console.log(error);
      }
    },

    async handleWithdraw({ pool, amount }) {
      try {
        this.closeModals();
        this.handleProcess(true, "withdraw");

        const result = await pool.withdraw(amount);

        if (result.status) {
          await this.updatePools();
          this.handleProcess(false, "withdraw");
        }
      } catch (error) {
        console.log(error);
        this.handleProcess(false, "withdraw");
      }
    },

    async handleWithdrawStand({ pool, amount }) {
      try {
        this.closeModals();

        const result = await pool.unstake(amount);

        if (result.status) {
          await this.updatePools();
        }
      } catch (error) {
        console.log(error);
      }
    },

    async harvestCurrentPool(pool) {
      try {
        this.closeModals();
        this.handleProcess(true, "harvest");

        await pool.harvest();
        await this.updatePools();

        this.handleProcess(false, "harvest");
      } catch (error) {
        console.log(error);
        this.handleProcess(false, "harvest");
      }
    },

    async handleHarvesting() {
      try {
        this.closeModals();
        this.harvestProcess = true;

        var ua = navigator.userAgent;

        if (
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
            ua
          )
        ) {
          for (let i = 0; i < this.pools.length; i++) {
            const isValid =
              parseFloat(this.pools[i].deposited) > 0 ? true : false;
            if (isValid) await this.pools[i].harvest();
          }
        } else {
          for (let i = 0; i < this.pools.length; i++) {
            const isValid =
              parseFloat(this.pools[i].deposited) > 0 ? true : false;
            if (isValid) await this.pools[i].harvest();
          }
        }

        this.harvestProcess = false;
      } catch (error) {
        console.log(error);
        this.harvestProcess = false;
      }
    },

    async handleHarvestEPS() {
      this.closeModals();
      await this.harvestCurrentPool(this.currentPool);
    },

    async handleHarvestICE() {
      try {
        this.handleProcess(true, "harvest");
        await this.currentPool.harvestICE();
        await this.updatePools();

        this.handleProcess(false, "harvest");
      } catch (error) {
        console.log(error);
        this.handleProcess(false, "harvest");
      }
    },

    async updateAll() {
      this.info = await this.$farm3.getInfo();

      const pools = await this.$farm3.getPools();

      await this.$store.commit("SET_POOLS", pools);

      return this.info;
    },

    async updateAllv2() {
      this.info = await this.$farm_v2.getInfo();
      return this.info;
    },

    getImgUrl(pic) {
      return require("../assets/images/" + pic);
    },

    showModal(modal, pool) {
      this.currentPool = pool;
      this.selectedBalance = parseFloat(pool.balance).toFixed(2);


      //disabled && block stake btns
      
      let acceptedIds = [10, 11, 12, 13, 14, 15];

      if(modal === "deposit" && (acceptedIds.indexOf(pool.id) === -1)) {
        return false;
      }

      if (pool.id === 0) {
        if (modal === "deposit") {
          $("#modalIceDeposit").modal("show");
        }
        if (modal === "withdraw") {
          $("#modalIceWithdraw").modal("show");
        }
      }

      if (pool.id === 100) {
        if (modal === "deposit") {
          $("#modalIceDepositStand").modal("show");
        }
        if (modal === "withdraw") {
          $("#modalIceWithdrawStand").modal("show");
        }
      }

      if (pool.id === 1) {
        if (modal === "deposit") {
          $("#modalFUSDTDeposit").modal("show");
        }
        if (modal === "withdraw") {
          $("#modalFUSDTWithdraw").modal("show");
        }
      }

      if (pool.id === 7 || pool.id === 9) {
        if (modal === "deposit") {
          $("#modalBNBDeposit").modal("show");
        }
        if (modal === "withdraw") {
          $("#modalBNBWithdraw").modal("show");
        }
      }

      if (acceptedIds.indexOf(pool.id) !== -1) {
        if (modal === "deposit") {
          $("#modalBNBDeposit").modal("show");
        }
        if (modal === "withdraw") {
          $("#modalBNBWithdraw").modal("show");
        }
      }

      if (pool.id === 2) {
        if (modal === "deposit") {
          $("#modalBNBDeposit").modal("show");
        }
        if (modal === "withdraw") {
          $("#modalBNBWithdraw").modal("show");
        }
      }

      if (pool.id === 3) {
        if (modal === "deposit") {
          $("#modalCurveDeposit").modal("show");
        }
        if (modal === "withdraw") {
          $("#modalCurveWithdraw").modal("show");
        }
      }

      if (pool.id === 4) {
        if (modal === "deposit") {
          $("#modalYUSDTDeposit").modal("show");
        }
        if (modal === "withdraw") {
          $("#modalYUSDTWithdraw").modal("show");
        }
      }

      if (pool.id === 5) {
        if (modal === "deposit") {
          $("#modalSTAKERDeposit").modal("show");
        }
        if (modal === "withdraw") {
          $("#modalSTAKERWithdraw").modal("show");
        }
        if (modal === "harvest") {
          $("#modalHarvestEPS").modal("show");
        }
      }
    },

    calculateRoi(roi1, roi2, devide = 1) {
      let r = parseFloat(roi1 ? roi1 : 0) + parseFloat(roi2 ? roi2 : 0);

      if (devide !== 7) {
        r = parseFloat(r / devide);
      }

      if (devide === 7) {
        r = parseFloat((r / 365) * 7);
      }

      return r.toString().slice(0, 5);
    },
    extractRoi(roi, devide = 1) {
      let r;

      if (devide !== 7) {
        r = parseFloat(roi / devide);
      }

      if (devide === 7) {
        r = parseFloat((roi / 365) * 7);
      }

      return r.toString().slice(0, 5);
    },
  },
  created() {
    const network = localStorage.getItem("network");
    this.activePoint = network === "bsc" ? 2 : 1;

    if (network === "eth") {
      this.activePoint = 1;
    } else if (network === "bsc") {
      this.activePoint = 2;
    } else {
      this.activePoint = 3;
    }

    // handler for change metamask chain
    window.ethereum?.on("chainChanged", (chainId) => {
      const chains = {
        "0x1": "eth",
        "0xfa": "fantom",
        "0x38": "bsc",
        "0x2a": "kovan",
        "0x61": "bsc",
        "0x4": "eth",
      };

      const chain = chains[chainId];
      localStorage.setItem("network", chain);

      window.location.reload();
    });

    window.ethereum?.on("accountsChanged", async (accounts) => {
      localStorage.setItem("address", accounts[0]);

      if (!accounts.length) {
        localStorage.setItem("address", "");
        window.location.href = "/";
      } else if (accounts.length && !localStorage.getItem("address")) {
        localStorage.setItem("address", accounts[0]);
        window.location.reload();
        //
      } else {
        localStorage.setItem("address", accounts[0]);
        this.$farm3.connectWallet();
      }
    });

    setTimeout(() => {
      const chainId = window.ethereum?.chainId;

      const chains = {
        "0x1": "eth",
        "0xfa": "fantom",
        "0x38": "bsc",
        "0x2a": "kovan",
        "0x61": "bsc",
        "0x4": "eth",
      };

      const chain = chains[chainId];
      localStorage.setItem("network", chain);

      const address = this.$farm3.walletAddress;
      localStorage.setItem("address", address);
    }, 1000);
  },
};
