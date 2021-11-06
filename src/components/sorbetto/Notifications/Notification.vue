<template>
  <div class="notification-item">
    <!-- <img v-if="theme === 'dark'" src="@/assets/images/sorbetto/close-btn-white.svg" alt="" class="hide-notify" @click="closeNotification"> -->
    <img
      src="@/assets/images/sorbetto/close-btn.svg"
      alt=""
      class="hide-notify"
      @click="closeNotification"
    />

    <img
      src="@/assets/images/sorbetto/notification-main.png"
      alt=""
      class="main-img"
    />

    <div class="content-wrap">
      <p class="main-text">{{ notification.msg }}</p>

      <div class="timestamp" v-if="!this.notification.isError">
        <img
          src="@/assets/images/sorbetto/clock.svg"
          alt=""
          class="clock-icon"
        />
        <p>{{ parsedTime }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      timerInterval: null,
      timeValue: 0,
    };
  },
  computed: {
    parsedTime() {
      if (this.timeValue >= 60) {
        let minutes = Math.floor(this.timeValue / 60);
        let seconds = this.timeValue % 60;

        return `${minutes} min ${seconds} sec`;
      }

      return `${this.timeValue} sec`;
    },
  },
  methods: {
    closeNotification() {
      this.$store.commit("deleteNotification", this.notification.id);
    },
  },
  beforeDestroy() {
    clearInterval(this.timerInterval);
  },
  mounted() {
    if (this.notification.isError) return false;
    this.timerInterval = setInterval(() => {
      this.timeValue++;
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  color: #fff;
}

.notification-item {
  width: 100%;
  padding: 20px;
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  background: #343434;
  box-shadow: 0px 0px 20px #252423;
  border-radius: 12px;

  .hide-notify {
    width: 20px;
    height: 20px;
    object-fit: contain;
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .content-wrap {
    padding-left: 15px;
    text-align: left;

    .main-text {
      margin-bottom: 10px;
    }

    .timestamp {
      display: flex;
      align-items: center;

      .clock-icon {
        width: 24px;
        height: 24px;
        object-fit: contain;
        margin-right: 10px;
      }
    }
  }

  .main-img {
    width: 66px;
    height: auto;
    object-fit: cover;
  }
}

@media screen and(max-width: 600px) {
  .notification-item .main-img {
    width: 50px;
  }

  p {
    font-size: 14px;
  }
}
</style>
