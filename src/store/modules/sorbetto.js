import axios from "axios";

export default {
    state: {
        sorbettoPools: [],
        showSorbettoPopup: false,
        sorbettoPopupType: null,
        sorbettoPopupPoolId: null,
        sorbettoPoolsLoading: true,
        sorbettoErrorMsg: null
    },
    mutations: {
        setSorbettoPoolsLoading(state, payload) {
            state.sorbettoPoolsLoading = payload
        },
        setSorbettoError(state, payload) {
            state.sorbettoErrorMsg = payload
        },
        setSorbettoPools(state, payload) {
            state.sorbettoPools = payload
        },
        setSorbettoPopupState(state, { showPopup, type, activePool }) {
            state.showSorbettoPopup = showPopup;
            state.sorbettoPopupType = type;
            state.sorbettoPopupPoolId = activePool
        },
        hideSorbettoPopups(state) {
            state.showSorbettoPopup = false;
            state.sorbettoPopupType = null;
            state.sorbettoPopupPoolId = null
        },
    },
    actions: {
        async fetchUserPendingRewards(_, payload) {
            try {
                const response = await axios.get('', { params: payload });

                return response.data;
            } catch (e) {
                console.log("fetchUserPendingRewards error:", e)
            }
        },
        async fetchTickData(_, payload) {
            try {
                const response = await axios.get('', { params: payload });

                return response.data;
            } catch (e) {
                console.log("fetchTickData error:", e)
            }
        },
        async fetchAmountsForDesired(_, payload) {
            try {
                const response = await axios(
                    {
                        method: "get",
                        url: "",
                        params: payload
                    })

                return response.data;
            } catch (e) {
                console.log("fetchAmountsForDesired error:", e)
            }
        },
        async fetchConvertToProportion(_, payload) {
            try {
                const response = await axios(
                    {
                        method: "get",
                        url: "",
                        params: payload
                    })

                return response.data;
            } catch (e) {
                console.log("fetchConvertToProportion error:", e)
            }
        },
        async fetchTokenValue(_, payload) {
            try {
                const response = await axios(
                    {
                        method: "get",
                        url: "",
                        params: payload
                    })

                return response.data;
            } catch (e) {
                console.log("fetchTokenValue error:", e)
            }
        },
        async fetchTokenPrice(_, token) {
            try {
                const response = await axios.get(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`
                );

                return response.data;
            } catch (e) {
                console.log("fetchTokenPrice error:", e)
            }
        },
        async fetchFragolaApy(_) {
            try {
                const response = await axios(
                    {
                        method: "get",
                        url: ""
                    })

                return response.data;
            } catch (e) {
                console.log("fetchFragolaApy error:", e)
            }
        },
        async fetchFragolaTokenRate(_, payload) {
            try {
                const response = await axios(
                    {
                        method: "get",
                        url: "",
                        params: payload
                    })

                return response.data;
            } catch (e) {
                console.log("fetchFragolaTokenRate error:", e)
            }
        },
    },
    getters: {
        getSorbettoErrorMsg: state => state.sorbettoErrorMsg,
        getSorbettoPools: state => state.sorbettoPools,
        getSorbettoPoolsLoading: state => state.sorbettoPoolsLoading,
        getSorbettoPoolById: (state) => (id) => {
            return state.sorbettoPools.find((pool) => pool.id == id);
        },
        getShowSorbettoPopup: state => state.showSorbettoPopup,
        getSorbettoPopupType: state => state.sorbettoPopupType,
        getSorbettoPopupPoolId: state => state.sorbettoPopupPoolId
    }
}