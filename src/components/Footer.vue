<template>
  <footer>
    <div class="container">
      <div class="row justify-content-end align-items-center desc">
        <!-- heart -->
        <a class="heart" href="/CREAMsicle-airdrop.pdf" target="_blank">
          <!-- <img src="@/assets/images/heart.svg" title="ICE+CREAM Solidarity" /> -->
          <!-- <router-link to="/governance/proposal">Governance</router-link> -->
          <!-- <router-link to="/application">Application</router-link> -->
        </a>

        <!-- <router-link to="/cream" class="heart">
          <img src="@/assets/images/heart.svg" title="ICE+CREAM Solidarity" />
        </router-link> -->
        <div class="col-auto">
          <div class="social_box">
            <ul>
              <li>
                <a
                  href="https://popsicle-finance-wiki.gitbook.io/popsicle-finance/"
                  target="_blank"
                  class="wiki-link"
                  >Docs</a
                >
              </li>
              <li>Governance</li>
              <li>
                <a href="https://discord.gg/JkEwq5amqw" target="_blank">
                  <img src="@/assets/images/f-1.svg" alt="" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.reddit.com/r/Popsicle_Finance/"
                  target="_blank"
                >
                  <img src="@/assets/images/f-2.svg" alt="" />
                </a>
              </li>
              <!-- <li>
                <a href="#" target="_blank">
                  <img src="@/assets/images/f-3.svg" alt="" />
                </a>
              </li> -->
            </ul>
          </div>
        </div>
        <div class="col-auto">
          <div class="social_box">
            <ul>
              <li>Links</li>
              <li>
                <a href="https://popsiclefinance.medium.com/" target="_blank">
                  <img src="@/assets/images/f-4.svg" alt="" />
                </a>
              </li>
              <li>
                <a href="mailto:hello@popsicle.finance" target="_blank">
                  <img src="@/assets/images/f-5.svg" alt="" />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/popsiclefinance" target="_blank">
                  <img src="@/assets/images/f-6.svg" alt="" />
                </a>
              </li>
              <li>
                <a href="https://github.com/Popsicle-Finance" target="_blank">
                  <img src="@/assets/images/f-7.svg" alt="" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="row mob">
        <!-- <a class="heart" href="/CREAMsicle-airdrop.pdf" target="_blank">
          <img src="@/assets/images/heart.svg" alt="" />
        </a> -->
        <!-- <router-link to="/cream" class="heart">
          <img src="@/assets/images/heart.svg" title="ICE+CREAM Solidarity" />
        </router-link> -->
        <div class="col-auto">
          <div class="social_box">
            <p>Governance</p>
            <ul>
              <li>
                <a href="https://discord.gg/JkEwq5amqw" target="_blank">
                  <img src="@/assets/images/f-1.svg" alt="" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.reddit.com/r/Popsicle_Finance/"
                  target="_blank"
                >
                  <img src="@/assets/images/f-2.svg" alt="" />
                </a>
              </li>
              <!-- <li>
                <a href="#" target="_blank">
                  <img src="@/assets/images/f-3.svg" alt="" />
                </a>
              </li> -->
            </ul>
          </div>
        </div>
        <div class="col-auto">
          <div class="social_box">
            <p>Links</p>
            <ul>
              <li>
                <a href="https://popsiclefinance.medium.com/" target="_blank">
                  <img src="@/assets/images/f-4.svg" alt="" />
                </a>
              </li>
              <li>
                <a href="mailto:hello@popsicle.finance" target="_blank">
                  <img src="@/assets/images/f-5.svg" alt="" />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/popsiclefinance" target="_blank">
                  <img src="@/assets/images/f-6.svg" alt="" />
                </a>
              </li>
              <li>
                <a href="https://github.com/Popsicle-Finance" target="_blank">
                  <img src="@/assets/images/f-7.svg" alt="" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@media screen and(max-width: 600px) {
  footer {
    height: 100% !important;
    .container {
      .row {
        min-height: 110px;
      }
    }
  }
}
</style>
