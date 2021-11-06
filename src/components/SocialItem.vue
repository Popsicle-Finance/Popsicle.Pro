<template>
  <div class="social-wrapper">
    <div class="toggle-btn" @click="toggleMenu">
      <img src="@/assets/images/menu-icon.svg" alt="" />
    </div>

    <transition name="fade">
      <div class="social-block" v-if="showMenu">
        <div class="social-items-wrap">
          <a
            class="social-item"
            v-for="(social, idx) in socialItems"
            :key="idx"
            :href="social.link"
            target="_blank"
          >
            <img :src="social.icon" alt="" />
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
const discordIcon = require("@/assets/images/social/discord.svg");
const mailIcon = require("@/assets/images/social/Email.svg");
const mediumIcon = require("@/assets/images/social/Medium.svg");
const redditIcon = require("@/assets/images/social/Reddit.svg");
const twitterIcon = require("@/assets/images/social/Twitter.svg");
const gitBookIcon = require("@/assets/images/social/GitBook.svg");

export default {
  data() {
    return {
      socialItems: [
        {
          icon: discordIcon,
          link: "http://discord.gg/popsicle",
        },
        {
          icon: redditIcon,
          link: "https://www.reddit.com/r/Popsicle_Finance/",
        },
        {
          icon: gitBookIcon,
          link: "https://popsicle-finance-wiki.gitbook.io/popsicle-finance/",
        },
        {
          icon: mediumIcon,
          link: "https://popsiclefinance.medium.com/",
        },
        {
          icon: mailIcon,
          link: "mailto:hello@popsicle.finance",
        },
        {
          icon: twitterIcon,
          link: "https://twitter.com/popsiclefinance",
        },
      ],
      showMenu: false,
    };
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
  },
};
</script>

<style lang="scss" scoped>
.social-wrapper {
  margin-left: 10px;
  position: relative;

  .social-block {
    position: absolute;
    top: calc(100% + 30px);
    right: 0;
    width: 170px;
    height: auto;
    background: #2c2c2c;
    box-shadow: 0px 0px 20px #252423;
    border-radius: 12px;
    z-index: 300;
  }

  .social-items-wrap {
    padding-top: 25px;
    padding-bottom: 25px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .social-item {
    width: 40px;
    height: 40px;
    margin: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #2bd2f7;
    }

    img {
      max-width: 100%;
      height: auto;
    }
  }

  .toggle-btn {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.04);
    border: 0.5px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border: 0.5px solid #2bd2f7 !important;
    }

    img {
      width: 16px;
      height: auto;
      object-fit: contain;
    }
  }
}
</style>
