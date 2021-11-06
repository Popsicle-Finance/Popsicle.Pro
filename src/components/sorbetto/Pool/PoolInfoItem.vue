<template>
  <div class="info-item">
    <p class="item-title">{{ infoItem.title }}</p>
    <p>{{ valueFormat }}</p>
  </div>
</template>

<script>
export default {
  props: {
    infoItem: {
      type: Object,
      required: true,
    },
  },
  computed: {
    valueFormat() {
      if (this.infoItem.type === 2)
        return `$${parseFloat(this.infoItem.value).toFixed(2)}`;
      if (this.infoItem.type === 3) return `${this.infoItem.value}%`;
      return this.infoItem.value;
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;

  p {
    font-size: 14px;
    color: #fff;

    &.item-title {
      color: #868686;
    }
  }
}
</style>
