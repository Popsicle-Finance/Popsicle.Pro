export default {
  state: {
    nIceStakeObject: null,
  },
  mutations: {
    setNIceStakeObject(state, payload) {
      state.nIceStakeObject = payload;
    },
  },
  getters: {
    getNIceStakeObject: (state) => state.nIceStakeObject,
  },
};
