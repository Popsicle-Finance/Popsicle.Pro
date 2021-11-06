<template>
  <div class="banner">
    <div class="inner-content">
      <h1>
        {{ title }}
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default:
        "This product has been audited, please use at your own risk. This is innovative DeFi after all.",
    },
  },
};
</script>

<style lang="scss" scoped>
.banner {
  height: 50px;
  width: 100%;
  color: #fff;
  background: linear-gradient(to right, #5ac9e5, #7c5bff);

  z-index: 20;

  .inner-content {
    padding: 10px 20px;
    background-image: url("../assets/images/banner.png");
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h1 {
    font-size: 14px;
    margin: 0;
    padding: 0;
    line-height: 20px;
    text-transform: uppercase;
    color: #ffffff;
    text-shadow: 0 0 1px #2bd2f7;
    display: flex;
    align-items: center;
    text-align: center;
  }

  .arrow-link {
    width: 10px;
    height: auto;
  }
}

@media screen and(max-width: 560px) {
  .banner {
    h1 {
      font-size: 13px;
    }
  }
}
</style>
