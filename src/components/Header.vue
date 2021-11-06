<template>
  <header :class="{ active: showMenu }" class="bg-header">
    <div class="container">
      <router-link tag="div" :to="{ name: 'Dashboard' }" class="logo">
        <img
          src="@/assets/images/main-logo-white.svg"
          alt=""
          class="logo-img"
        />
      </router-link>

      <div class="link-wrap gr-5 light-btn">
        <a href="https://popsicle.finance/" class="nav-link light-link">
          <p>TO LIGHT MODE</p>
        </a>
      </div>

      <div class="menu">
        <nav>
          <div class="link-wrap gr-1">
            <router-link class="nav-link" :to="{ name: 'Governance.Proposal' }">
              Governance
            </router-link>
          </div>

          <div class="link-wrap gr-2">
            <router-link class="nav-link" :to="{ name: 'nIce' }">
              Stake
            </router-link>
          </div>

          <div class="link-wrap gr-4">
            <router-link class="nav-link" :to="{ name: 'Bridge' }">
              Bridge
            </router-link>
          </div>
        </nav>
        <div class="d-flex align-items-center ml-3">
          <div class="link-wrap gr-3" v-if="!isConnect">
            <a href="#" class="nav-link" @click="$connectWallet">Connect</a>
          </div>

          <div
            class="link-wrap gr-3"
            v-if="isConnect"
            @mouseenter="toggleDashboardBtn(0)"
            @mouseleave="toggleDashboardBtn(1)"
          >
            <router-link :to="{ name: 'Dashboard' }" class="nav-link">
              <p>{{ dashboardText }}</p>
            </router-link>
          </div>

          <NetwortBtn />

          <template v-if="isAuthorized">
            <AddTokenComponent tokenName="ice" />
            <AddTokenComponent tokenName="nIce" v-if="activeSelected === 1" />
          </template>
        </div>
      </div>

      <transition name="fade">
        <div class="mobile-menu" v-if="showMenu" @click="handleToggleMenu">
          <NetwortBtn />

          <div class="link-wrap gr-3" v-if="!isConnect">
            <a href="#" class="nav-link" @click="$connectWallet">Connect</a>
          </div>

          <div class="link-wrap gr-3">
            <router-link class="nav-link" :to="{ name: 'Dashboard' }">
              Dashboard
            </router-link>
          </div>

          <div class="link-wrap gr-4">
            <router-link class="nav-link" :to="{ name: 'Bridge' }">
              Bridge
            </router-link>
          </div>

          <div class="link-wrap gr-1">
            <router-link class="nav-link" :to="{ name: 'Governance.Proposal' }">
              Governance
            </router-link>
          </div>

          <div class="link-wrap gr-2">
            <router-link class="nav-link" :to="{ name: 'nIce' }">
              Stake
            </router-link>
          </div>

          <div class="link-wrap gr-5 light-btn">
            <a href="https://popsicle.finance/" class="nav-link light-link">
              <p>TO LIGHT MODE</p>
            </a>
          </div>
        </div>
      </transition>

      <div class="menu_btn" @click="handleToggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <SocialItem />
    </div>
  </header>
</template>

<script>
const AddTokenComponent = () => import("@/components/AddToken");
const NetwortBtn = () => import("@/components/NetworkBtn");
const SocialItem = () => import("@/components/SocialItem");

export default {
  props: {
    isAuthorized: {
      type: Boolean,
    },
    stakingLink: {
      type: String,
    },
    activeSelected: {
      type: Number,
      default: 1,
    },
  },
  data: () => ({
    showMenu: false,
    showSelect: false,
    dashboardText: "Dashboard",
  }),
  computed: {
    isConnect() {
      return !!this.$store.getters.getAddress;
    },
  },
  methods: {
    handleToggleMenu() {
      this.showMenu = !this.showMenu;
    },
    handleToggleSelect() {
      this.showSelect = !this.showSelect;
    },
    showModal(name) {
      this.$emit("showModal", name);
    },
    handleChageText(text) {
      this.dashboardText = text;
    },
    formatedAddress() {
      const address = this.$store.getters.getAddress;
      const str1 = address.toString().slice(0, 6);
      const str2 = address.toString().slice(address.length - 4, address.length);

      return `${str1}...${str2}`;
    },
    toggleDashboardBtn(num) {
      if (num === 0) {
        this.dashboardText = this.formatedAddress();
      }

      if (num === 1) {
        this.dashboardText = "Dashboard";
      }
    },
  },
  components: {
    AddTokenComponent,
    SocialItem,
    NetwortBtn,
  },
};
</script>

<style lang="scss">
p {
  margin-bottom: 0;
}

.light-btn {
  margin-left: 40px;
}

.dark-theme .menu {
  background-color: #252423 !important;
}

header.bg-header {
  padding: 0 !important;
  display: flex;
  z-index: 20px;
  position: relative;
  border-bottom: 1px solid #2c2c2c;
  background-color: #252423 !important;

  &.active {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 600;
    width: 100%;
  }

  .d-flex.align-items-center.ml-3 {
    margin-left: 0 !important;
  }

  .logo {
    width: 112px;
    height: auto;
    cursor: pointer;

    .logo-img {
      max-width: 100%;
      height: auto;
    }
  }

  .link-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    padding: 1px;
    margin-right: 10px;

    background-color: rgba(255, 255, 255, 0.2);

    &:hover {
      &.gr-1 {
        background-image: linear-gradient(45deg, #5ac9e5, #7c5bff);
      }

      &.gr-2 {
        background-image: linear-gradient(45deg, #a4f3b6, #bc55fc);
      }

      &.gr-4 {
        background-image: linear-gradient(45deg, #1bffcf, #7c5bff);
      }

      &.gr-3 {
        background-image: linear-gradient(45deg, #1bffcf, #55c0fc);
      }
    }

    &.gr-5 {
      background-image: linear-gradient(to right, #5ac9e5, #7c5bff);
    }

    &.gr-3 {
      .nav-link {
        min-width: 164px;
      }
    }
  }

  .nav-link {
    height: 40px;
    background: #2e2d2c;
    color: white;
    transition: all 0.3s ease;
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 90px;
    cursor: pointer;
    padding: 5px 25px;
    box-sizing: border-box;
    border-radius: 12px;
    margin: 0;

    &.light-link {
      p {
        background: linear-gradient(to right, #5ac9e5, #7c5bff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    p {
      margin: 0;
    }
  }

  .btn1,
  .btn-grey {
    height: 40px !important;
    background: rgba(255, 255, 255, 0.04);
    border: 0.5px solid rgba(255, 255, 255, 0.2) !important;
    color: white;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.04) !important;
      border: 0.5px solid #2bd2f7 !important;
    }
  }

  .menu {
    margin-left: auto;
    overflow: visible !important;
  }

  .mobile-menu {
    position: fixed;
    top: 80px;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    background-color: #2c2c2c;
    padding: 30px 0;
    z-index: 600;
    overflow-y: scroll;

    .link-wrap {
      margin-bottom: 0;
      margin-top: 20px;

      .nav-link {
        width: 100%;
      }
    }
  }
}

@media screen and(max-width: 991px) {
  .menu_btn {
    margin-left: auto;
  }

  header .container {
    justify-content: flex-end;
  }
  .menu {
    display: none;
  }
  header .menu nav {
    margin-left: 0;
    flex-direction: column;
    align-items: flex-start;
  }

  header.bg-header .link-wrap.light-btn {
    display: none;
  }

  header.bg-header .mobile-menu .link-wrap.light-btn {
    display: block;
  }

  header.bg-header .mobile-menu .link-wrap,
  header.bg-header .btn-grey {
    margin-left: auto;
    margin-right: auto;
    width: 90%;
  }

  header.bg-header .link-wrap {
    margin-bottom: 10px;
  }
}
</style>
