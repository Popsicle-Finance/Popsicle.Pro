<template>
  <div class="table">
    <div class="row">
      <div class="col">
        <div
          class="row head-table table-box"
          data-position="top"
          data-delay="0.3"
        >
          <div class="col">
            <h6>{{ fields[0] }}</h6>
          </div>
          <div class="col">
            <h6>{{ fields[1] }}</h6>
          </div>
          <div class="col-2">
            <h6>{{ fields[2] }}</h6>
          </div>
          <div class="col">
            <h6>{{ fields[3] }}</h6>
          </div>
          <div class="col"></div>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    fields: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" src="@/assets/scss/components/table.scss"></style>
