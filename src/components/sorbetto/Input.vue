<template>
  <div class="input-wrap" :class="{ 'light-theme': theme === 'light' }">
    <div class="input-info">
      <p v-if="!alternative">Amount</p>
      <p v-else>Claimable amount: ${{ reward }}</p>
      <p>{{ name }}</p>
    </div>

    <label>
      <img :src="tokenImage" alt="" class="token-img" />
      <input
        :value="value"
        type="number"
        placeholder="0"
        @input="updateValue"
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
    reward: {
      default: 0,
    },
    value: {},
    error: {},
    name: {},
    max: {},
    image: {},
    itsUrl: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      required: true,
    },
  },
  computed: {
    tokenImage() {
      try {
        if (this.itsUrl) return this.image;
        if (this.image)
          return require(`@/assets/images/sorbetto/${this.image}`);
        return require(`@/assets/images/sorbetto/Token_${this.name}.svg`);
      } catch (e) {
        return require(`@/assets/images/sorbetto/Token_ETH.svg`);
      }
    },
  },
  methods: {
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

.input-wrap {
  position: relative;
  z-index: 2;

  &.light-theme {
    label {
      background: #ffffff;
      border: 1px solid #e4ecee;

      input {
        color: #252423;
      }
    }

    .max-btn {
      background: #f6f9fa;
      color: #2bd2f7;

      &:hover {
        background: #2bd2f7;
        color: #f6f9fa;
      }
    }
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
    border: 1px solid rgba(134, 134, 134, 0.2);
    border-radius: 8px;
    padding: 10px;

    .token-img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      object-fit: contain;
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
