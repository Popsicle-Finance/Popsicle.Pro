<template>
  <div
    class="modal fade"
    :id="id"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <span aria-hidden="true" class="close" data-dismiss="modal"
          >&times;</span
        >
        <p class="h4 modal_title mb-4">{{ title }}</p>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Modal title",
    },
  },
};
</script>

<style></style>
