<template>
  <div class="bg dashboard-container dark-theme">
    <Header
      :stakingLink="stakingLink"
      :activeSelected="activePoint"
      :isAuthorized="isAuth"
      @showModal="showModal"
    />

    <router-view></router-view>

    <NotificationContainer :theme="'dark'" />
  </div>
</template>

<script>
const NotificationContainer = () =>
  import("@/components/sorbetto/Notifications/NotificationContainer");
import global from "@/mixins/global";

export default {
  mixins: [global],
  data() {
    return {};
  },
  components: {
    NotificationContainer,
  },
};
</script>
