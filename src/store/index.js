import Vue from "vue";
import Vuex from "vuex";

import sorbetto from "@/store/modules/sorbetto";
import nIce from "@/store/modules/nIce";
import notification from "@/store/modules/notification"
import popups from "@/store/modules/popups";
import tokensList from "@/store/modules/tokensList";
import wallet from "@/store/modules/wallet";
import bridge from "@/store/modules/bridge";

const Web3 = require("web3");
const web3InstanceDefault = new Web3();

if(window.ethereum) {
  web3InstanceDefault.currentProvider = window.ethereum;
}

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //theme: localStorage.getItem("theme") || "light",
    theme: "dark",
    poolsList: [],
    pools: [],
    isAuth: localStorage.getItem("address") ? true : false,
    web3Instance: null
  },
  mutations: {
    setWeb3Instance(state, payload) {
      state.web3Instance = payload
    },
    setIsAuth(state, payload){
      state.isAuth = payload
    },
    SET_THEME: (state, payload) => {
      localStorage.setItem("theme", payload);
      state.theme = payload;
    },
    SET_POOLS: (state, payload) => {
      state.pools = [];
      state.pools = payload;
    },
    SET_POOLS_LIST: (state, payload) => {
      state.poolsList = payload;
    },
    UPDATE_PROCESS: (state, payload) => {
      const pool = state.pools.find((pool) => pool.id === payload.id);

      if (payload.processType === "deposit") {
        pool.processingDeposit = payload.payload;
      }

      if (payload.processType === "withdraw") {
        pool.processingWithdraw = payload.payload;
      }

      if (payload.processType === "harvest") {
        pool.processHarvesting = payload.payload;
      }
    },
  },
  actions: {
    handleUpdatePoolProcess: ({ commit }, payload) => {
      commit("UPDATE_PROCESS", {
        id: payload.id,
        payload: payload.payload,
        processType: payload.processType,
      });
    },
  },
  getters: {
    getTheme: (state) => state.theme,
    getPools: (state) => state.pools,
    getPoolsArr: (state) => state.poolsList,
    getIsAuth: (state) => state.isAuth,
    getWeb3Instance: (state) => state.web3Instance || web3InstanceDefault,
  },
  modules: {
    sorbetto,
    notification,
    nIce,
    popups,
    tokensList,
    wallet,
    bridge
  }
});
