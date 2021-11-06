export default {
    state: {
      /**
       * @type String
       * @name address
       *
       * @type Object
       * @name provider
       *
       * @type Object
       * @name signer
       */
      wallet: {
        address: undefined,
        provider: undefined,
        signer: undefined,
      },
      walletCheckInProcess: true,
      chain: 1,
    },
    mutations: {
      SET_WALLET(state, payload) {
        state.wallet = payload;
      },
      SET_CHAIN: (state, payload) => {
        state.chain = payload;
      },
      SET_WALLET_CHECK_IN_PROCCESS(state, payload) {
        state.walletCheckInProcess = payload;
      },
    },
    getters: {
      getWallet: (state) => state.wallet,
      getAddress: (state) => state.wallet.address,
      getSigner: (state) => state.wallet.signer,
      getProvider: (state) => state.wallet.provider,
      getChain: (state) => state.chain,
      getWalletCheckInProccess: (state) => state.walletCheckInProcess,
    },
  };
  