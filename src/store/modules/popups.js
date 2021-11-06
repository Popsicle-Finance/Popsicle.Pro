export default {
    state: {
        showConnectPopup: false,
        showNetworkPopup: false,
        showDepositDisableBanner: true,
    },
    mutations: {
        setShowConnectPopup(state, payload) {
            state.showConnectPopup = payload
        },
        setShowNetworkPopup(state, payload) {
            state.showNetworkPopup = payload
        },
        setShowDepositDisableBanner(state, payload) {
            state.showDepositDisableBanner = payload
        }
    },
    getters: {
        getShowConnectPopup: (state) => state.showConnectPopup,
        getShowNetworkPopup: (state) => state.showNetworkPopup,
        getShowDepositDisableBanner: (state) => state.showDepositDisableBanner,
    },
}