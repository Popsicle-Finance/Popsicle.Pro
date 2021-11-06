/* FARM v3 */

import Pool from "./pool";
import Project from "./project";
import Contract from "./contract";

import { InitWallet } from "../services/wallet";

import axios from "axios";

const urls = {
  0: "http://localhost:5001/v1",
  1: "http://ec2-18-197-77-215.eu-central-1.compute.amazonaws.com/api/v1",
  2: "https://back.popsicle.finance/v1",
};

const api = axios.create({
  baseURL: urls[2],
  headers: {
    "utopia-api-key":
      "3480393e548a49932b079197dbc1d2c95802d4e1aed89d20b6cfb8b725d77ea6bb2e60215884ff43091273a6e25973346748f3e23ed6aa867e9c72a583ec4dc9911f3904659c32d019ed8f15bc8be88e5f11a518aa595df364773ba1b64421e946b0dbea4d3e5f2bd39409fe1f1c73dc6c897e25e8f1366d7c9f48ef1f26a35363795c5825fbbe4a6bba278aa3482d5bd7591b2ed9680251315a8169fc3496c76f931d3c08e0c2d62b0481d27145fd7d17f6c0eae70701f9361e78b181cbb740d46f9a9e092bdef7aee8b7756001246322048d13c04f82ff4e2c5bfe8085316b2d021fa2a87d59c16d97dffd7fb51494018e02bd9a09a67fa6a9ca897b3d32c1",
  },
});

import store from "@/store/index"

import {
  SORBETTIER_CONTRACT_ADDR,
  ICE_CONTRACT_ADDR,
  ICE_ETH_CONTRACT_ADDR,
  STAKER_CONTRACT_ADDR,
} from "./globals";

import abiIce from "./abi/abiICE.json";
import abiSorbettiere from "./abi/abiSorbettiere.json";
import abiStaker from "./abi/abiStaker.json";

import networks from "./networks";
import { tokenPrices, fromWei } from "./helpers";
import { BSC_CHAIN, FTM_CHAIN } from "./chains";

export default class Farm {
  contracts = {};
  pools = [];
  prices = {};

  walletAddress = "";
  walletConnected = false;
  network = null;

  totalPending = 0;

  status = true;

  projects = [];

  constructor() {
    this.getTokenPrices(["ice"]);
  }

  async setup() {
    try {
      const status = await this.initializeSettings();

      if (status) {
        await this.initializeContracts();
        await this.initializePools();
      }

      await this.initializeStand();
      if (this.walletAddress) await this.getTotalPending();
    } catch (error) {
      console.log(error);
    }
  }

  initializeStand = async () => {
    try {
      const { data } = await api.get("/projects");

      if (data.success) {
        const { projects } = data;

        for (let i = 0; i < projects.length; i++) {
          const main = projects[i]["main"];
          const ice = projects[i]["ice"];
          const lp = projects[i]["lp"];
          const test = projects[i]["test"];

          const images = projects[i].images;
          const publish = projects[i].public;

          if (publish === 1) {
            await this.createProject(
              100 + i,
              projects[i].name,
              main,
              ice,
              lp,
              test,
              this.prices["ice"],
              images,
              publish
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  createProject = async (
    id,
    name,
    main,
    ice,
    lp,
    test,
    icePrice,
    images,
    publish
  ) => {
    const mainContract = new Contract(
      "main",
      main.address,
      JSON.parse(main.abi)
    );
    const iceContract = new Contract("ice", ice.address, JSON.parse(ice.abi));
    const lpContract = new Contract("lp", lp.address, JSON.parse(lp.abi));
    const testContract = new Contract(
      "test",
      test.address,
      JSON.parse(test.abi)
    );

    const project = new Project(
      id,
      name,
      mainContract,
      iceContract,
      lpContract,
      testContract,
      this.walletAddress,
      icePrice,
      images,
      publish
    );

    await project.setup();

    this.projects.push(project);
  };

  initializeSettings = async () => {
    try {
      let status = true;

      const { ethereum } = window;
      const { selectedAddress, chainId } = await ethereum;

      const testnetMode = chainId === "0x2a" ? true : false;

      if (!testnetMode) {
        if (networks[chainId]) this.network = await networks[chainId];

        if (!networks[chainId]) {
          status = false;
          this.status = false;
        }

        if (!selectedAddress) {
          this.walletConnected = false;
        }

        if (selectedAddress) {
          localStorage.setItem("address", selectedAddress);
          this.walletAddress = selectedAddress;
          this.walletConnected = true;

          const response = await InitWallet(selectedAddress);

          //console.log("updated v1");

          if (response.success) {
            if (response.type === 1) window.location.reload();
          }
        }
      }

      if (testnetMode) {
        if (networks[chainId]) this.network = await networks[chainId];

        if (!networks[chainId]) {
          status = false;
          this.status = false;
        }

        if (!selectedAddress) {
          this.walletConnected = false;
        }

        if (selectedAddress) {
          localStorage.setItem("address", selectedAddress);
          this.walletAddress = selectedAddress;
          this.walletConnected = true;

          const response = await InitWallet(selectedAddress);

          //console.log("updated v2");

          if (response.success) {
            if (response.type === 1) window.location.reload();
          }
        }
      }

      return status;
    } catch (error) {
      console.log(error);
    }
  };

  initializeContracts = async () => {
    try {
      const ice = new Contract("ice", ICE_CONTRACT_ADDR, abiIce);
      const ice_mainnnet = new Contract("ice", ICE_ETH_CONTRACT_ADDR, abiIce);

      if (this.network?.name === "BSC") {
        this.contracts["staker"] = new Contract(
          "staker",
          STAKER_CONTRACT_ADDR,
          abiStaker
        );
      }

      const sorbettiere = new Contract(
        "sorbettiere",
        SORBETTIER_CONTRACT_ADDR,
        abiSorbettiere
      );

      if (this.network?.name === "ETH") {
        this.contracts["ice"] = ice_mainnnet;
      }

      if (this.network?.name !== "ETH") {
        this.contracts["ice"] = ice;
      }

      this.contracts["sorbettiere"] = sorbettiere;
    } catch (error) {
      console.log(error);
    }
  };

  initializePool = async (contractName, poolName, poolID, weiFormat) => {
    try {
      const contract = this.contracts[contractName];

      const poolInfo = await contract.instance.methods.poolInfo(poolID).call();

      const pool = new Pool(
        contract,
        poolName,
        poolID,
        weiFormat,
        this.walletAddress,
        poolInfo,
        this.prices.ice
      );

      this.pools.push(pool);
    } catch (error) {
      console.log(error);
    }
  };

  initializeStakerPool = async (contractName, poolName, poolID, weiFormat) => {
    try {
      const contract = this.contracts[contractName];

      const poolInfo = await contract.instance.methods.poolInfo(poolID).call();

      const obj = {
        stakingToken: poolInfo.lpToken,
        accIcePerShare: poolInfo.accRewardPerShare,
        stakingTokenTotalAmount: poolInfo.allocPoint,
      };

      const pool = new Pool(
        contract,
        poolName,
        poolID,
        weiFormat,
        this.walletAddress,
        { ...obj },
        this.prices.ice
      );

      this.pools.push(pool);
    } catch (error) {
      console.log(error);
    }
  };

  initializePools = async () => {
    try {
      await this.initializePool("ice", "ice-pool", 0, null);

      if (this.network.name === "FTM")
        await this.initializePool("ice", "curve-pool", 2, null);

      if (this.network.name === "BSC") {
        await this.initializePool("ice", "sushi-pool", 2, null);
        await this.initializeStakerPool("staker", "staker-pool", 2, null);
      }

      // if (this.network.name === "ETH")
      //   await this.initializePool("ice", "yusdt-pool", 3, "mwei");

      await this.initializePool("ice", "lp-pool", 1, null);
      if (this.network.name === "ETH") {
        await this.initializePool("sorbettiere", "fusdt-pool", 1, "mwei");
      }
    } catch (error) {
      console.log(error);
    }
  };

  getTokenPrices = async (tokens = []) => {
    try {
      for (let i = 0; i < tokens.length; i++) {
        const price = await tokenPrices(tokens[i]);
        this.prices[tokens[i]] = price.ice;
      }
    } catch (error) {
      console.log(error);
    }
  };

  getTotalPending = async () => {
    try {
      let pending = BigInt(0);

      for (let i = 0; i < this.pools.length; i++) {
        const pool = this.pools[i];
        const contract = pool.contract;

        if (pool.name !== "STAKER-POOL") {
          pending += BigInt(
            await contract.instance.methods
              .pendingIce(pool.poolID, this.walletAddress)
              .call()
          );
        }
      }

      const result = parseFloat(fromWei(pending.toString())).toFixed(4);
      this.totalPending = result;
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  getPools = async () => {
    const pools = [];

    for (let i = 0; i < this.pools.length; i++) {
      pools.push(await this.pools[i].getPoolInfo());
    }

    return pools;
  };

  getInfo = async () => {
    try {
      if (this.status) {
        await this.getTotalPending();
        await this.getTokenPrices(["ice"]);

        return {
          chain: this.network?.name,
          totalPending: this.totalPending,
          walletConnected: this.walletConnected,
          walletAddress: this.walletAddress,
          price: this.prices["ice"],
        };
      }

      if (!this.status) {
        return {
          walletConnected: this.walletConnected,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };

  switchChain = async (activePoint) => {
    try {
      let response = false;

      if (activePoint === 2) {
        response = await this.setChain(BSC_CHAIN);
      }

      if (activePoint === 3) {
        response = await this.setChain(FTM_CHAIN);
      }

      return response;
    } catch (error) {
      return false;
    }
  };

  setChain = async (chain) => {
    try {
      const res = await window.ethereum
        .request({
          method: "wallet_addEthereumChain",
          params: [chain],
        })
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });

      return res;
    } catch (error) {
      return false;
    }
  };

  connectWallet = async () => {
    if (window.ethereum) {
      //console.log("here");
      await store.getters.getWeb3Instance.currentProvider.enable();

      const address = await window.eth?.selectedAddress;
      localStorage.setItem("address", address);

      window.location.reload();
      return true;
    } else {
      $("#modal2").modal("show");
      return false;
    }
  };
}
