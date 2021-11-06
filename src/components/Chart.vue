<template>
  <div class="pie">
    <div
      class="pie__segment"
      style="--offset: 0; --value: 40; --bg: linear-gradient(50deg, #482BF7 0%, #98ECFA 100%)"
    ></div>
    <div
      class="pie__segment"
      style="--offset: 40; --value: 30; --bg: linear-gradient(90deg, #2B7DF7 0%, #98ECFA 100%)"
    ></div>
    <div
      class="pie__segment"
      style="--offset: 70; --value: 30; --bg: linear-gradient(10deg, #2BD2F7 0%, #98ECFA 100%)"
    ></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.dark-theme {
  .pie {
    &::after {
      background: #2c2c2c;
    }
  }
}
.pie {
  border-radius: 100%;
  height: calc(var(--size, 200) * 1px);
  overflow: hidden;
  position: relative;
  width: calc(var(--size, 200) * 1px);

  display: flex;
  align-items: center;
  justify-content: center;

  &__segment {
    --a: calc(var(--over50, 0) * -100%);
    --b: calc((1 + var(--over50, 0)) * 100%);
    --degrees: calc((var(--offset, 0) / 100) * 360);
    -webkit-clip-path: polygon(
      var(--a) var(--a),
      var(--b) var(--a),
      var(--b) var(--b),
      var(--a) var(--b)
    );
    clip-path: polygon(
      var(--a) var(--a),
      var(--b) var(--a),
      var(--b) var(--b),
      var(--a) var(--b)
    );
    height: 100%;
    position: absolute;
    transform: translate(0, -50%) rotate(90deg)
      rotate(calc(var(--degrees) * 1deg));
    transform-origin: 50% 100%;
    width: 100%;
    z-index: calc(1 + var(--over50));

    &::after,
    &::before {
      background: var(--bg, #fff);
      content: "";
      height: 100%;
      position: absolute;
      width: 100%;
      border-top: 1px solid #fff;
    }

    &::before {
      --degrees: calc((var(--value, 45) / 100) * 360);
      transform: translate(0, 100%) rotate(calc(var(--degrees) * 1deg));
      transform-origin: 50% 0%;
    }

    &::after {
      opacity: var(--over50, 0);
    }
  }

  &::after {
    content: "";
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 100%;
    background: #fff;
  }
}
</style>
