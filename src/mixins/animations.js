import gsap from "gsap";

export default {
  methods: {
    enter(el) {
      const position = el.dataset.position ? el.dataset.position : "left";

      el.style.opacity = 0;

      switch (position) {
        case "left":
          el.style.transform = "translateX(-100px)";
          break;
        case "right":
          el.style.transform = "translateX(100px)";
          break;
        case "top":
          el.style.transform = "translateY(-100px)";
          break;
        case "bottom":
          el.style.transform = "translateY(100px)";
          break;
        default:
          break;
      }
    },

    beforeEnter(el, done) {
      gsap.to(el, {
        x: 0,
        y: 0,
        opacity: 1,
        delay: el.dataset.delay,
        duration: 0.5,
        onComplete: done,
      });
    },
  },
};
