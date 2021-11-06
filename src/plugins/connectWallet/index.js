import { ethers } from "ethers";
import Web3 from "web3";
import Web3Modal from "web3modal";

import WalletConnectProvider from "@walletconnect/web3-provider";

import store from "../../store";

// WALLETCONNECT
const walletconnect = {
  package: WalletConnectProvider,
  options: {
    rpc: {    
      1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",    
      56: "https://bsc-dataseed.binance.org/",   
      250: "https://rpc.ftm.tools/",
      42161: "https://arb1.arbitrum.io/rpc",
      43114: "https://api.avax.network/ext/bc/C/rpc"
    }
  },
};

const providerOptions = {
  walletconnect,
};

const web3Modal = new Web3Modal({
  providerOptions,
  cacheProvider: true,
  disableInjectedProvider: false,
  network: "mainnet",
});

/**
 * Check chached provider and try to connect.
 * If provider exist => store into vuex
 */
setTimeout(async () => {
  const { cachedProvider } = web3Modal.providerController;

  if (cachedProvider) {
    try {
      const connectedProvider = await web3Modal.connectTo(cachedProvider);

      if (!connectedProvider) {
        store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);
        return;
      }

      if (connectedProvider) {
        let address = "";

        if (connectedProvider.isMetaMask) {
          address = connectedProvider.selectedAddress;
        }

        if (connectedProvider.accounts) {
          address = connectedProvider.accounts[0];
        }

        const provider = new ethers.providers.Web3Provider(connectedProvider);
        const signer = provider.getSigner(address);
        const web3Instance = new Web3(connectedProvider);

        connectedProvider.on("chainChanged", () => {
          window.location.reload();
        });

        connectedProvider.on("accountsChanged", () => {
          window.location.reload();
        });

        connectedProvider.on("disconnect", () => {
          localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
          window.location.reload();
        });

        const { chainId } = await provider.getNetwork();
        console.log("chainId", chainId)
        store.commit("setWeb3Instance", web3Instance);
        store.commit("SET_CHAIN", chainId);
        store.commit("SET_WALLET", { address, provider, signer });
        store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);
      }
    } catch (e) {
      localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
      web3Modal.providerController.cachedProvider = null;
      store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);
      return;
    }
  } else if(window.ethereum?.isMetaMask) {
    console.log("metamask")
    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();
    console.log("chainId", chainId)
    store.commit("SET_CHAIN", chainId);
    store.commit("SET_WALLET", { address: null, provider, signer: null });

    if (accounts.length !== 0) {
      const signer = provider.getSigner(accounts[0]);

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("disconnect", () => {
        localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
        window.location.reload();
      });

      store.commit("SET_WALLET", { address: accounts[0], provider, signer });
      store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);
    }
  } else {
    const web3Instance = new Web3("https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    store.commit("setWeb3Instance", web3Instance);
  }

  store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);
});

export default {
  async install(Vue, options) {
    Vue.prototype.$connectWallet = async () => {
      try {
        let address = "";
        const provider = await web3Modal.connect();

        if (!provider) {
          return;
        }

        provider.enable();

        if (provider.isMetaMask) {
          address = provider.selectedAddress;
        }

        if (provider.accounts) {
          address = provider.accounts[0];
        }

        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner(address);
        const web3Instance = new Web3(provider);

        provider.on("chainChanged", () => {
          window.location.reload();
        });

        provider.on("accountsChanged", () => {
          window.location.reload();
        });

        provider.on("disconnect", () => {
          localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
          window.location.reload();
        });

        const { chainId } = await ethersProvider.getNetwork();
        store.commit("setWeb3Instance", web3Instance);
        store.commit("SET_CHAIN", chainId);
        store.commit("SET_WALLET", {
          address,
          provider: ethersProvider,
          signer,
        });
      } catch (error) {
        console.log("Error in connect modal");
        console.log(error);
      }
    };
  },
};
