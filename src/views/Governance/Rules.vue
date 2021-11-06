<template>
  <div class="governance-rules">
    <main class="governance-rules-container py-5">
      <div class="container">
        <div class="row">
          <div class="col d-flex flex-column align-items-center">
            <h1>Governance rules</h1>
            <h6 class="text-secondary text-center my-3">
              Here we the Isvikingers are able to make all sorts of proposals,
              that the community then votes on and if passed will be
              <br />implemented by the team. To learn more about the governance
              mechanism please visit the governance
              <a
                href="https://popsicle-finance-wiki.gitbook.io/popsicle-finance/governance/our-voting-platform"
                target="_blank"
                class="wiki-link"
                >wiki page here</a
              >.
            </h6>
          </div>
        </div>
        <div class="row">
          <div class="col-12 d-flex justify-content-center">
            <div class="d-flex my-5">
              <Power :wallet="wallet" />
            </div>
          </div>
          <div class="col-12">
            <div class="row mb-4 ">
              <div class="col">
                <div class="governance-rules-box">
                  <div class="num">1</div>
                  <div class="row">
                    <div class="col">
                      <h1>Proposal creation rules</h1>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <p>
                        Proposals can be made by anyone, they however will only
                        be looked at and actually actively discussed if 1% of
                        the total Addresses holding $ICE signs a proposal. Think
                        of this as people that have a strong opinion, they rally
                        the troops together and vote.
                      </p>
                      <p class="text-secondary">
                        Yes this could mean that a large holder could vote
                        through their own proposals, however this step only
                        approves that the proposal will be discussed and
                        actively approached.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-4">
              <div class="col">
                <div class="governance-rules-box">
                  <div class="num">2</div>
                  <div class="row">
                    <div class="col">
                      <h1>Proposal voting round</h1>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <ul>
                        <li class="mb-3">
                          1. Proposals then go through a 4 week discussion, that
                          happens below the posts as well as on voice chats etc.
                        </li>
                        <li class="mb-3">
                          2. After these 4 weeks, the team makes a statement on
                          their opinion on the proposal, 1 Mod takes the role of
                          consolidating all viewpoints of the people objecting
                          the proposal in paragraph form, 1Mod takes the role of
                          consolidating all viewpoints of the people for the
                          proposal in the paragraph.
                        </li>
                        <li>
                          3. There after there is a 1 week voting period on the
                          popsicle.finance dashboard that allows you to vote
                          from any of the chains.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-5">
              <div class="col">
                <div class="governance-rules-box">
                  <div class="num">3</div>
                  <div class="row">
                    <div class="col">
                      <h1>Win or lose Mechanism</h1>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <p>
                        Majority vote is counted, where 1Address=1Vote*- the
                        aspect of gaming the addresses is of course possible,
                        but we do have a way of checking how long those $ICE
                        have been in the wallet.
                      </p>
                      <p class="text-secondary">
                        *The Addresses gain one extra vote, every 3 months their
                        tokens have not moved. Meaning the older of a holder you
                        are, the more votes you have. This is because you have
                        supported the product along the way, and most likely are
                        here for the longer term
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="foo">
              <a href="#" class="btn-gover">
                Governance
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import global from "@/mixins/global";

import { GetWallet } from "@/services/wallet";

export default {
  mixins: [global],
  data: () => ({
    wallet: null,
  }),
  async created() {
    try {
      const address =
        this.$store.getters.getAddress ||
        this.$farm3.walletAddress ||
        localStorage.getItem("address");

      const data = await GetWallet(address);

      if (data.success) {
        this.wallet = data.wallet;
      }
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="scss"></style>
