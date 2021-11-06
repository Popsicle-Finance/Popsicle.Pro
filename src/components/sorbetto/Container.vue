<template>
  <div class="sorbetto-container">
    <template v-if="sorbettoPools && sorbettoPools.length">
      <div class="component-wrap">
        <SorbettoStand :theme="theme" :pools="sorbettoPools" />
      </div>
    </template>
    <div class="empty-block" v-else-if="sorbettoLoading">
      <Loading size="big" />
    </div>

    <div class="error-wrapper" v-else-if="sorbettoErrorMsg">
      <Error :errorText="sorbettoErrorMsg" />
    </div>
  </div>
</template>

<script>
const SorbettoStand = () => import("@/components/sorbetto/SorbettoStand");
const Error = () => import("@/components/ui/Error");
import sorbettoMixin from "@/mixins/sorbetto";

export default {
  mixins: [sorbettoMixin],
  props: {
    theme: {
      type: String,
      required: true,
    },
  },
  computed: {
    sorbettoLoading() {
      return this.$store.getters.getSorbettoPoolsLoading;
    },
    sorbettoErrorMsg() {
      return this.$store.getters.getSorbettoErrorMsg;
    },
    sorbettoPools() {
      return this.$store.getters.getSorbettoPools;
    },
  },
  beforeDestroy() {
    clearInterval(this.sorbettoUpdateInterval);
  },
  async created() {
    await this.createSorbetto();

    this.sorbettoUpdateInterval = setInterval(async () => {
      await this.createSorbetto();
    }, 15000);
  },
  components: {
    SorbettoStand,
    Error,
  },
};
</script>

<style lang="scss" scoped>
.error-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}

.sorbetto-container {
  .component-wrap {
    margin-bottom: 30px;
  }

  .empty-block {
    display: flex;
    justify-content: center;
    padding: 100px 20px;

    .warning-text {
      font-size: 18px;
      text-align: center;
      line-height: 1.5;
    }
  }
}
</style>
