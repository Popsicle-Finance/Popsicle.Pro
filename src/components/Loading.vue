<template>
  <div class="stage">
    <h2 class="fade-in" v-if="size === 'big'">{{ title }}</h2>
    <div class="dot-pulse" :class="size"></div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "Please wait",
    },
  },
};
</script>

<style lang="scss">
.stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
}

.dot-pulse {
  position: relative;
  left: -9999px;
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  background-color: #2bd2f7;
  color: #2bd2f7;
  box-shadow: 9999px 0 0 -2.5px #2bd2f7;
  animation: dotPulse 1.5s infinite linear;
  animation-delay: 0.25s;

  &.big {
    width: 10px;
    height: 10px;

    border-radius: 5px;

    &.dot-pulse::before,
    &.dot-pulse::after {
      width: 10px;
      height: 10px;

      border-radius: 5px;
    }
  }
}

.dot-pulse::before,
.dot-pulse::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  background-color: #2bd2f7;
  color: #2bd2f7;
}

.dot-pulse::before {
  box-shadow: 9984px 0 0 -2.5px #2bd2f7;
  animation: dotPulseBefore 1.5s infinite linear;
  animation-delay: 0s;
}

.dot-pulse::after {
  box-shadow: 10014px 0 0 -2.5px #2bd2f7;
  animation: dotPulseAfter 1.5s infinite linear;
  animation-delay: 0.5s;
}

@keyframes dotPulseBefore {
  0% {
    box-shadow: 9984px 0 0 -2.5px #2bd2f7;
  }
  30% {
    box-shadow: 9984px 0 0 2px #2bd2f7;
  }
  60%,
  100% {
    box-shadow: 9984px 0 0 -2.5px #2bd2f7;
  }
}

@keyframes dotPulse {
  0% {
    box-shadow: 9999px 0 0 -2.5px #2bd2f7;
  }
  30% {
    box-shadow: 9999px 0 0 2px #2bd2f7;
  }
  60%,
  100% {
    box-shadow: 9999px 0 0 -2.5px #2bd2f7;
  }
}

@keyframes dotPulseAfter {
  0% {
    box-shadow: 10014px 0 0 -5px #2bd2f7;
  }
  30% {
    box-shadow: 10014px 0 0 2px #2bd2f7;
  }
  60%,
  100% {
    box-shadow: 10014px 0 0 -5px #2bd2f7;
  }
}
</style>
