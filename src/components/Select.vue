<template>
  <div class="select">
    <div class="selected" @click="showOptions = !showOptions">
      <span>{{ selected.toString().toUpperCase() }}</span>
      <span class="arrow">
        <svg
          width="16"
          height="9"
          viewBox="0 0 16 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.1421 1.07107L8.07104 8.14214L0.999977 1.07107"
            stroke="#fff"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>
    <div class="options" v-if="showOptions" @mouseleave="showOptions = false">
      <div
        class="option"
        v-for="(option, index) in options"
        :key="index"
        @click="handleSelect(option), (showOptions = false)"
      >
        {{ option.toString().toUpperCase() }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selected: {
      type: String,
      default: "Selected",
    },
    options: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    showOptions: false,
  }),
  methods: {
    handleSelect(category) {
      this.$emit("select", category);
    },
  },
};
</script>

<style lang="scss">
.select {
  background: #f6f9fa;
  height: 50px;
  margin-top: 10px;
  border-radius: 8px;

  cursor: pointer;
  position: relative;

  .selected {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;

    span {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
    }
  }

  .options {
    width: 100%;
    position: absolute;
    margin-top: 10px;
    background: #f6f9fa;
    border-radius: 8px;
    border: 1px solid;

    .option {
      padding: 0 10px;

      &:not(:last-child) {
        border-bottom: 1px solid;
      }

      font-size: 14px;
      height: 50px;

      display: flex;
      align-items: center;

      &:hover {
        background: #f6f6f6;
      }
    }
  }
}
</style>
