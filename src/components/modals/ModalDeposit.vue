<template>
  <Modal :id="id" :title="`${title} ${token}`">
    <div class="row form-section">
      <div class="col-8 col form-section-body">
        <form>
          <div class="row row-list mb-3">
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="label-title">Available</div>
                </div>
              </div>
              <div class="row">
                <div class="col d-flex align-items-center mb-3">
                  <div class="circle">
                    <img :src="getImgUrl(image)" class="small-image" />
                  </div>
                  <span class="ml-3 text-black">{{ token }}</span>
                </div>
                <div
                  class="col d-flex align-items-center justify-content-end mb-3"
                >
                  <span class="text-black"
                    >{{ selectedBalance }} {{ token }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="row mb-1">
            <div class="col d-flex justify-content-start p-0">
              <div class="label-title">Amount</div>
            </div>
          </div>
          <div class="row row-list-input mb-1">
            <div class="col">
              <input placeholder="Amount" v-model.trim="balanceAmount" />
              <div class="max" @click="balanceAmount = pool.maxDeposit">
                <span>max</span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col d-flex justify-content-start p-0">
              <div
                class="d-flex flex-column"
                style="text-align: left; font-size: 13px"
              >
                <small>Available max {{ selectedBalance }}</small>
                <small
                  >* Your pending token rewards will be withdrawn
                  automatically.</small
                >
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="row d-flex justify-content-center">
      <div class="col col-8 d-flex justify-content-end p-0">
        <button
          type="submit"
          class="btn-main btn-accent"
          @click="handleDeposit()"
        >
          <span class="text-white">Deposit</span>
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
export default {
  emits: ["deposit"],
  data: () => ({
    balanceAmount: "0",
  }),
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    pool: {
      type: Object,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    selectedBalance: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleDeposit() {
      this.$emit("deposit", { pool: this.pool, amount: this.balanceAmount });
    },
    getImgUrl(pic) {
      return require("../../assets/images/" + pic);
    },
  },
};
</script>

<style></style>
