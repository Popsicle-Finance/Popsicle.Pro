<template>
  <div class="not-found">
    <img class="not-found__img" src="@/assets/images/error/error.png" alt="" />
    <p class="not-found__text">
      {{ errorText }}
    </p>

    <button v-if="showConnectBtn" class="action-btn" @click="$connectWallet">
      Connect
    </button>
  </div>
</template>

<script>
export default {
  props: {
    errorText: {
      type: String,
      default: "",
    },
  },
  computed: {
    showConnectBtn() {
      return !this.$store.getters.getAddress;
    },
  },
};
</script>

<style lang="scss" scoped>
.not-found {
  max-width: 450px;
  width: 100%;
  text-align: center;
  position: relative;
  &__img {
    width: 100%;
  }
  &__text {
    max-width: 350px;
    width: 100%;
    margin: 0 auto;
    font-weight: 600;
    font-size: 20px;
    line-height: 30px;
    margin-top: -40px;
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
  margin-right: auto;
  margin-top: 15px;

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
</style>
