<template>
  <div class="counter ml-1" :class="{ small: small, ends }">
    <div v-if="!message && !small">
      {{ days ? days : "0" }} <small>Days</small> {{ hours ? hours : "0" }}
      <small>Hours</small> {{ mins ? mins : "0" }} <small>Minutes</small>
    </div>
    <div v-if="!message && small">{{ allHours ? allHours : "0" }} Hours</div>
    <div v-else>{{ message }}</div>
  </div>
</template>

<script>
import moment from "moment";

Date.prototype.addHours = function(h) {
  this.setHours(this.getHours() + h);
  return this;
};
Date.prototype.removeHours = function(h) {
  this.setHours(this.getHours() - h);
  return this;
};

export default {
  props: {
    small: {
      type: Boolean,
      default: false,
    },
    ends: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    end: new Date()
      .removeHours(19)
      .addHours(47)
      .getTime(),

    days: "",
    hours: "",
    mins: "",

    message: "",

    allHours: "",
  }),
  methods: {
    updateCount() {
      let now = new Date();

      const a = moment(new Date(Date.UTC(2021, 3, 28, 15, 0, 0, 0)));
      const b = moment(
        new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds(),
            now.getUTCMilliseconds()
          )
        )
      );

      let x = moment.duration(a.diff(b));
      let q = x.asHours();

      this.allHours = parseInt(q);
    },
  },
  created() {
    this.updateCount();

    setInterval(() => {
      this.updateCount();
    }, 20000);
  },
};
</script>

<style lang="scss" scoped>
.counter {
  font-size: 20px !important;
  font-weight: bold;

  small {
    font-size: 11px;
  }

  &.small {
    font-size: 11px !important;
  }
}
</style>
