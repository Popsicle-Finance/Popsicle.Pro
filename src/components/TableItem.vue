<template>
  <div class="table-item">
    <div class="row main-box table-item-box">
      <div class="col d-flex align-items-start">
        <div class="mini-image">
          <img :src="getImgUrl(item.image)" alt="" />
        </div>
        <div class="main-box-text ml-3 d-flex align-items-center">
          <p class="pt-2">{{ item.token }}</p>
        </div>
      </div>
      <div class="col d-flex align-items-start">
        <div class="main-box-text ml-3">
          <p class="mb-2 fade-in">{{ yields[item.id] }}</p>
          <p class="text-secondary mb-3">Ice/day</p>
          <div class="pin">{{ mulipliers[item.id] }}x Multiplier</div>
        </div>
      </div>
      <div class="col-2 d-flex align-items-center">
        <p class="mb-2 fade-in">{{ rois[item.id] }}% weekly</p>
      </div>
      <div class="col">
        <div class="d-flex align-items-center">
          <div class="mini-image">
            <img :src="getImgUrl(item.image)" alt="" />
          </div>
          <div class="ml-1">
            <!-- <p>{{ total }} ICE</p> -->
            <p>{{ tvls[item.id] || "xxx" }}</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <div
            class="col d-flex align-items-center"
            v-if="!allowances[item.id] || !isAuthorized"
          >
            <button class="btn-main btn1" @click="joinToParty">
              <span>Join popsicle</span>
            </button>
          </div>
          <div class="col" v-if="allowances[item.id] && isAuthorized">
            <button class="btn-main mr-3" @click="showModalDeposit(item.id)">
              <span>Stake</span>
            </button>
            <button class="btn-main mt-3" @click="showModalUnstake(item.id)">
              <span>Unstake</span>
            </button>
          </div>
        </div>
      </div>

      <!-- description -->
      <!-- <div class="desc">{{ item.desc }}</div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    allowance: {
      type: [String, Number],
    },
    openWithdraw: {
      type: [Boolean],
    },
    openToDeposit: {
      type: [Boolean],
    },
    tvls: {
      type: Object,
    },
    rois: {
      type: Object,
    },
    yields: {
      type: Object,
    },
    mulipliers: {
      type: Object,
    },
    allowances: {
      type: Object,
    },
    isAuthorized: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getImgUrl(pic) {
      return require("../assets/images/" + pic);
    },
    joinToParty() {
      this.$emit("join");
    },
    showModalDeposit(id) {
      this.$emit("modalDeposit", id);
    },
    showModalUnstake(id) {
      this.$emit("modalUnstake", id);
    },
  },
};
</script>

<style lang="scss" src="@/assets/scss/components/tableItem.scss"></style>
