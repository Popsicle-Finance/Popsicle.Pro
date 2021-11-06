<template>
  <div
    class="bg home"
    :class="{ 'dark-theme': theme === 'dark' }"
    v-if="loading"
  >
    <Header
      :isAuthorized="isAuth"
      :stakingLink="stakingLink"
      :activeSelected="activePoint"
      @showModal="showModal"
    />

    <!-- Main Section #1 -->
    <section
      class="main_section bg-white d-flex algin-items-center justify-content-center"
      style="height: calc(100vh - 200px)"
    >
      <div
        class="not-found d-flex flex-column align-items-center justify-content-center"
      >
        <img src="@/assets/images/404.svg" alt="" />
        <p class="mt-3">ooops, something went wrong</p>
      </div>
    </section>

    <Footer />

    <!-- Modals -->
    <ModalLayout
      :pool="currentPool"
      :selectedBalance="selectedBalance"
      :activePoint="activePoint"
      :selectedText="selectedText"
      :epsRewards="currentPool.epsRewards"
      @deposit="handleDeposit"
      @withdraw="handleWithdraw"
      @toggleNetwork="handleToggleNetwork"
      @harvestEPS="handleHarvestEPS"
      @harvestICE="handleHarvestICE"
    />
  </div>
  <div v-else>Loading</div>
</template>

<script>
import global from "@/mixins/global";
export default {
  name: "Home",
  mixins: [global],
  data: () => ({
    showMenu: false,
    showSelect: false,
    loading: true,
  }),
  methods: {
    handleToggleMenu() {
      this.showMenu = !this.showMenu;
    },
    handleToggleSelect() {
      this.showSelect = !this.showSelect;
    },
    setGuide(num) {
      this.guide = num;
    },
    showModal(name) {
      //console.log(name);
    },
  },
};
// dev
</script>

<style lang="scss" scoped src="@/assets/scss/views/home.scss"></style>
