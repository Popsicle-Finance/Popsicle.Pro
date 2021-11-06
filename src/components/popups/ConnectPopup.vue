<template>
  <div class="connect-popup">
    <div class="popup-content">
      <img
        src="@/assets/images/sorbetto/close-btn-white.svg"
        alt=""
        class="close-btn"
        @click="toSite"
      />
      <img src="@/assets/images/connect-popup-bg.svg" alt="" class="bg-img" />

      <p class="title">Connect wallet</p>
      <p class="subtitle">
        You should connect your wallet to use Popsicle Finance!
      </p>

      <div class="inner-block">
        <img
          src="@/assets/images/metamask-connect.png"
          alt=""
          class="metamask-img"
        />
        <p class="inner-title">MetaMask</p>
        <button class="connect-btn" @click="$farm3.connectWallet">
          Connect
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toSite() {
      window.location.href = "https://popsicle.finance/";
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.connect-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 500;
  display: grid;
  place-items: center;
  overflow-y: auto;
  padding: 70px 10px;
  background: rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  z-index: 1000;

  .inner-block {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    padding: 30px;
    width: 90%;
    max-width: 250px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;

    .inner-title {
      color: #fff;
      font-weight: 600;
      font-size: 20px;
    }

    .metamask-img {
      width: 90px;
      height: 90px;
      object-fit: contain;
      margin-bottom: 10px;
    }

    .connect-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 115px;
      height: 40px;
      background: transparent;
      border: 1px solid #2bd2f7;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      line-height: 19px;
      text-align: center;
      color: #2bd2f7;
      outline: none;
      margin-top: 20px;
      transition: all 0.3s ease;

      &:hover {
        background: #2bd2f7;
        color: #fff;
      }
    }
  }

  .popup-content {
    max-width: 446px;
    width: 95%;
    position: relative;
    padding: 30px 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    overflow: hidden;
    background: #252423;
    border-radius: 12px;
    color: #fff;

    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 18px;
      height: 18px;
      object-fit: contain;
      z-index: 2;

      &:hover {
        transform: scale(1.1);
      }
    }

    .title {
      font-size: 28px;
      line-height: 38px;
      margin-bottom: 10px;
      z-index: 2;
      font-weight: bold;
    }

    .subtitle {
      font-size: 18px;
      line-height: 25px;
      z-index: 2;
    }

    .bg-img {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
      z-index: 1;
    }
  }
}
</style>
