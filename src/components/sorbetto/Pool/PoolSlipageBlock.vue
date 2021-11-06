<template>
  <div class="slipage-block dark-theme">
    <p class="slipage-title">Choose Your Slippage</p>

    <div class="items-wrap">
      <div
        class="splipage-item"
        :class="{ active: slipage === item }"
        v-for="(item, idx) in slipageItems"
        :key="idx"
        @click="setSlipage(item)"
      >
        <p>{{ item }}%</p>
      </div>
      <label
        class="splipage-item custom-item"
        @click="setCustomState(true)"
        :class="{ active: +slipage === +customValue }"
      >
        <input
          v-if="isCustom"
          v-model.trim="customValue"
          type="number"
          placeholder="X%"
          @input="setCustomValue($event.target.value)"
        />
        <p v-else>custom</p>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    slipage: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      slipageItems: [0.1, 0.5, 1],
      customValue: null,
      isCustom: false,
    };
  },
  methods: {
    setSlipage(item) {
      this.$emit("update", item);
    },
    setCustomState(bool) {
      this.isCustom = bool;
    },
    setCustomValue(value) {
      console.log("HERE WE GO AGAIN", value);

      if (value < 0 || value > 100) {
        this.setSlipage(1);
        this.customValue = null;
        this.setCustomState(false);
        return false;
      }

      if (value && value > 0 && value <= 100) this.setSlipage(+value);
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.slipage-block {
  margin: 20px 0;
  background: transparent !important;

  &.dark-theme {
    .splipage-item {
      background: #252423;

      &.custom-item {
        &:hover,
        &.active {
          border: 1px solid #2bd2f7 !important;
          background: transparent;
          color: white;
        }
      }

      &:hover,
      &.active {
        border: 1px solid #2bd2f7 !important;
        background: #2bd2f7;
        color: white;
      }
    }
    input {
      color: #fff;
    }
  }

  .slipage-title {
    text-align: left;
    font-size: 16px;
    line-height: 1.3;
  }

  .items-wrap {
    display: flex;
    align-items: center;
    margin-top: 10px;
    justify-content: space-between;
  }

  .splipage-item {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border: 1px solid transparent;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 3px 7px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 24%;
    min-height: 36px;

    p {
      font-size: 16px;
    }

    &.custom-item {
      &:hover,
      &.active {
        border: 1px solid #2bd2f7;
        background: #ffffff;
        color: white;
      }
    }

    &:hover,
    &.active {
      border: 1px solid #2bd2f7;
      background: #2bd2f7;
      color: white;
    }
  }

  input {
    background-color: transparent;
    border: none;
    height: 100%;
    text-align: center;
    outline: none;
    width: 50px;
    padding-left: 5px;
    padding-right: 5px;
    font-size: 16px;
  }
}
</style>
