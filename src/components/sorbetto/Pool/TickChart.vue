<template>
  <div class="tick-chart">
    <canvas :id="name"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  props: {
    labels: {
      type: Array,
      required: true,
    },
    tickUpper: {
      type: Array,
      required: true,
    },
    tickLower: {
      type: Array,
      required: true,
    },
    currentTick: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    name: "tick-chart",
    config: {
      type: "line",
    },
    chart: null,
  }),
  watch: {
    labels() {
      const data = this.createDataObject();
      this.chart.data = data;
      this.chart.update();
    },
  },
  methods: {
    updateChart() {},
    createOptionsObject() {
      return {
        responsive: true,
        // borderColor: "#2BD2F7",
        plugins: {
          tooltip: {
            mode: "index",
            intersect: false,
          },
          legend: {
            display: false,
          },
          title: {
            color: "#fff",
          },
        },
        scales: {
          y: {
            ticks: {
              color: "#868686",
              font: {
                size: 9,
                weight: "light",
              },
            },
          },
          x: {
            ticks: {
              color: "#868686",
              font: {
                size: 9,
                weight: "light",
              },
            },
          },
        },
      };
    },
    createDataObject() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: "Tick Upper",
            data: this.tickUpper,
            borderColor: "#CA76FF",
            pointBackgroundColor: "#CA76FF",
            pointBorderColor: "#CA76FF",
            pointRadius: 0,
            borderWidth: 0.5,
          },
          {
            label: "Current Tick",
            data: this.currentTick,
            borderColor: "rgb(75, 192, 192)",
            pointBackgroundColor: "#2BD2F7",
            pointBorderColor: "#2BD2F7",
            pointRadius: 0,
            borderWidth: 0.5,
          },
          {
            label: "Tick Lower",
            data: this.tickLower,
            borderColor: "#FF969C",
            pointBackgroundColor: "#FF969C",
            pointBorderColor: "#FF969C",
            pointRadius: 0,
            borderWidth: 0.5,
          },
        ],
      };
    },
  },
  mounted() {
    const data = this.createDataObject();
    const options = this.createOptionsObject();

    this.config.data = data;
    this.config.options = options;

    const ctx = document.getElementById(this.name);
    this.chart = new Chart(ctx, this.config);
  },
};
</script>

<style lang="scss" scoped>
.tick-chart {
  color: #fff;
}
</style>
