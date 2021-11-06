<template>
  <div class="input-wrap">
    <div class="input-info">
      <p>Amount</p>
      <p class="balance-text" v-if="!disabled">
        {{ parseFloat(max).toFixed(6) }} {{ name }}
      </p>
      <p class="balance-text" v-else>
        {{ name }}
      </p>
    </div>

    <label>
      <img
        :src="tokenImage"
        alt=""
        class="token-img"
        :class="{ clickable: isTokenSelect, noborder: imageUrl }"
        @click="selectClick"
      />

      <img
        v-if="isTokenSelect"
        class="select-icon"
        src="@/assets/images/arrow-down-select.svg"
        alt=""
        @click="selectClick"
      />

      <input
        min="0"
        :value="value"
        type="number"
        placeholder="0"
        @input="updateValue"
        :disabled="disabled"
      />
      <button v-if="max && max > 0" class="max-btn" @click="setMax">max</button>
    </label>

    <div class="error-box">
      <p class="error-text" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    alternative: {
      type: Boolean,
      default: false,
    },
    value: {},
    error: {},
    name: {},
    max: {},
    image: {},
    imageUrl: {},
    disabled: {
      type: Boolean,
      default: false,
    },
    isTokenSelect: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tokenImage() {
      try {
        // console.log("this.name", this.name);

        if (this.imageUrl) return this.imageUrl;

        if (this.name === "nICE")
          return require(`@/assets/images/Token_nICE.svg`);

        if (this.name === "ICE")
          return require(`@/assets/images/Token_ICE.svg`);

        if (this.image)
          return require(`@/assets/images/sorbetto/${this.image}`);
        return require(`@/assets/images/sorbetto/Token_${this.name}.png`);
      } catch (e) {
        return require(`@/assets/images/sorbetto/Token_ETH.svg`);
      }
    },
  },
  methods: {
    selectClick() {
      if (this.isTokenSelect) this.$emit("selectClick");
    },
    updateValue(e) {
      this.$emit("update", e.target.value);
    },
    setMax() {
      this.$emit("update", this.max);
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.select-icon {
  width: 10px;
  height: 10px;
  object-fit: contain;
  margin-left: 10px;
  cursor: pointer;
}

.input-wrap {
  p {
    color: #868686;
  }

  .input-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: -0.5px;
    margin-bottom: 10px;
  }

  label {
    display: flex;
    align-items: center;
    background: #252423;
    border-radius: 8px;
    padding: 10px;

    .token-img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      object-fit: contain;

      &.clickable {
        cursor: pointer;
      }

      &.noborder {
        border-radius: initial;
      }
    }

    input {
      background: transparent;
      border: none;
      outline: none;
      height: 100%;
      flex: 1;
      font-size: 16px;
      line-height: 22px;
      color: #fff;
      padding: 0 10px;

      &::placeholder {
        color: #868686;
      }

      &:disabled {
        color: #868686;
      }
    }
  }

  .max-btn {
    width: 50px;
    height: 30px;
    background: #2c2c2c;
    border-radius: 8px;
    outline: none;
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #2bd2f7;
    transition: all 0.3s ease;

    &:hover {
      background: #2bd2f7;
      color: #f6f9fa;
    }
  }

  .error-box {
    display: flex;
    align-items: center;
    min-height: 20px;

    .error-text {
      font-size: 12px;
      line-height: 1;
      font-weight: normal;
      color: #fc6972;
    }
  }
}

@media screen and (max-width: 460px) {
  .input-wrap label input {
    width: calc(100% - 80px);
  }
}
</style>
