export default {
    state: {
        tokensList: null,
        isTokensListLoading: true,
        tokenListPrices: null,
        coingeckoTokensList: null
    },
    mutations: {
        setTokensList(state, payload) {
            state.tokensList = payload
        },
        setIsTokensListLoading(state, payload) {
            state.isTokensListLoading = payload
        },
        setTokenListPrices(state, payload) {
            state.tokenListPrices = payload
        },
        setCoingeckoTokensList(state, payload) {
            state.coingeckoTokensList = payload
        },
    },
    getters: {
        getTokensList: (state) => state.tokensList,
        getTokenListPrices: (state) => state.tokenListPrices,
        getIsTokensListLoading: (state) => state.isTokensListLoading,
        getCoingeckoTokensList: (state) => state.coingeckoTokensList,
    },
}