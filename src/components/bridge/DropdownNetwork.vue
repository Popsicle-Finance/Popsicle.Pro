<template>
  <div class="dropdown">
    <div
      class="dropdown-wrapper"
      :class="{ 'show-dropdown': showDropdown }"
      :style="{ height: calculateHeightWrapper }"
      @click="toggleDropdown"
      v-click-outside="closeDropdown"
    >
      <div class="dropdown-inner" :style="{ height: calculateHeightInner }">
        <div class="dropdown-title">
          <img
            class="dropdown-img"
            :src="selectedChain.icon"
            :alt="selectedChain.title"
          />
          {{ selectedChain.title }}
          <img
            class="dropdown-icon"
            :class="{ 'dropdown-icon_open': showDropdown }"
            src="@/assets/images/arrow-down.svg"
            alt="Arrow down"
          />
        </div>
        <div v-if="showDropdown">
          <div
            class="dropdown-item"
            v-for="chain in filteredList"
            :key="chain.chainId"
            @click="handlerChain(chain)"
          >
            <img class="dropdown-img" :src="chain.icon" :alt="chain.title" />
            {{ chain.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    networks: {
      type: Array,
      require: true,
    },
    defaultChain: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      showDropdown: false,
      dropdownHeight: 44,
      selectedChain: "",
    };
  },

  computed: {
    ...mapGetters({ activeChain: "getChain" }),

    calculateHeightWrapper() {
      if (this.showDropdown) {
        return `${this.dropdownHeight * this.filteredList.length +
          this.dropdownHeight}px`;
      }
      return `${this.dropdownHeight}px`;
    },

    calculateHeightInner() {
      if (this.showDropdown) {
        return `${this.dropdownHeight * this.filteredList.length +
          this.dropdownHeight -
          2}px`;
      }
      return `${this.dropdownHeight - 2}px`;
    },

    filteredList() {
      return this.networks.filter(
        (chain) => chain.chainId !== this.selectedChain.chainId
      );
    },
  },

  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    closeDropdown() {
      this.showDropdown = false;
    },

    handlerChain(chain) {
      this.selectedChain = chain;
      this.$emit("changeChain", chain.chainId);
    },

    chainActive() {
      if (this.defaultChain) {
        this.selectedChain = this.networks.find(
          (chain) => +chain.chainId === this.activeChain
        );
      } else {
        this.selectedChain = this.networks[0];
      }
      this.$emit("changeChain", this.selectedChain.chainId);
    },
  },

  async created() {
    await this.chainActive();
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  max-width: 210px;
  width: 100%;
  position: relative;
  height: 44px;
}

.dropdown-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  max-width: 210px;
  width: 100%;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: linear-gradient(to right, #5ac9e5, #194eca);
  }
  &.show-dropdown {
    height: 162px;
    background: linear-gradient(to right, #5ac9e5, #194eca);

    .dropdown-inner {
      height: 160px;
    }
  }
}

.dropdown-inner {
  max-width: 208px;
  width: 100%;
  height: 39px;
  border-radius: 12px;
  background: #2c2c2c;
  position: absolute;
  left: 1px;
}

.dropdown-title {
  height: 41px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-img {
  max-width: 20px;
  width: 100%;
  max-height: 20px;
  margin-right: 5px;
}

.dropdown-icon {
  display: inline-block;
  margin-left: 5px;
  transition: all 200ms ease-in-out;
  &_open {
    transform: rotate(180deg);
  }
}

.dropdown-item {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: normal;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &:last-child {
    border-radius: 0 0 12px 12px;
  }
}

@media screen and (max-width: 600px) {
  .dropdown,
  .dropdown-wrapper {
    max-width: 100%;
  }
  .dropdown-inner {
    max-width: 99%;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 3;
  }
  .show-dropdown {
    z-index: 3;
  }
}
</style>
