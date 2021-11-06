<template>
  <div class="governance-proposal py-5 fade-in">
    <div class="container">
      <section class="my-5 title text-center">
        <h1>Popsicle Governance Dashboard</h1>
        <h6 class="text-secondary">
          Here we the Isvikingers are able to make all sorts of proposals, that
          the community then votes on and if passed will be <br />implemented by
          the team. To learn more about the governance mechanism please visit
          the governance
          <a
            href="https://popsicle-finance-wiki.gitbook.io/popsicle-finance/governance/our-voting-platform"
            target="_blank"
            class="wiki-link"
            >wiki page here</a
          >.
        </h6>
      </section>

      <section class="governance-proposal-voting my-5">
        <Power :wallet="wallet" />
      </section>

      <section class="governance-proposal-item current mb-5 fade-in">
        <div class="governance-proposal-item-title">
          <h2>Proposals</h2>
          <!-- <span class="back">Back to all</span> -->
          <router-link
            class="back"
            :to="{ path: '/governance/proposal', query: { type: 1 } }"
            tag="span"
            >Back to all</router-link
          >
        </div>
        <div
          class="governance-proposal-item-current"
          v-if="
            proposal && proposal.endStatus !== 0 && proposal.endStatus !== 1
          "
        >
          <section class="governance-proposal-item-current-info">
            <div class="left">
              <div class="title">
                <h2>About this proposal</h2>
              </div>
              <div class="body">
                <div>
                  <span>Created</span>
                  <span>{{ fromNow(proposal.createdAt) }}</span>
                </div>
                <!-- <div>
                  <span>Vote start</span>
                  <span>{{ fromNow(proposal.started) }}</span>
                </div> -->
                <div>
                  <span>Vote ends</span>
                  <span>
                    {{ fromNow(proposal.endTime) }}
                  </span>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Created by</span>
                  <article
                    @click="copyTo('clip_address', 9999)"
                    class="d-flex"
                    :class="{ copied: copIndex === 9999 }"
                  >
                    <div class="circle mr-1">
                      <img src="@/assets/images/wallet.svg" alt="" />
                    </div>
                    <span>{{ formatedAddress(proposal.address) }}</span>
                    <input
                      type="text"
                      :value="proposal.address"
                      :id="`clip_address`"
                      style="position: fixed; z-index: -5; top: -1000000px;"
                    />
                  </article>
                </div>
              </div>
            </div>
            <div class="right">
              <div class="title">
                <h2>Results</h2>
              </div>
              <div class="body">
                <div
                  class="progress-voting"
                  :style="`--w: ${calculatePercent(proposal)}%`"
                ></div>
                <section class="d-flex flex-column">
                  <section>
                    <div class="d-flex align-items-center">
                      <img
                        src="@/assets/images/approve.svg"
                        alt=""
                        class="mr-1"
                      />
                      <span>APPROVED</span>
                    </div>
                    <span
                      >{{ parse(total.approve) }} ({{
                        calculatePercent(proposal)
                      }}%)</span
                    >
                  </section>
                  <section>
                    <div class="d-flex align-items-center">
                      <img
                        src="@/assets/images/reject.svg"
                        alt=""
                        class="mr-1"
                      />
                      <span>REJECTED</span>
                    </div>
                    <span
                      >{{ parse(total.reject) }} ({{
                        calculatePercent(proposal, "reject")
                      }}%)</span
                    >
                  </section>
                </section>
              </div>
            </div>
          </section>
          <section class="governance-proposal-item-current-data">
            <div class="title">
              <h2>{{ fromNow(proposal.createdAt) }}</h2>
            </div>
            <div
              class="body"
              v-for="(block, index) in proposal.blocks"
              :key="index"
            >
              <section>
                <h2>
                  {{ block.title }}
                </h2>
                <p>
                  {{ block.text }}
                </p>
              </section>
              <section
                class="d-flex flex-column align-items-center"
                v-if="block.photo.src.length"
              >
                <div
                  class="image"
                  :style="`background-image: url(${block.photo.src})`"
                  @click="fullImage = block.photo.src"
                ></div>
              </section>
            </div>
          </section>
          <section
            class="governance-proposal-item-current-support"
            v-if="
              currentUserWallet !== proposal.address &&
                !proposal.supports.includes(currentUserWallet) &&
                proposal.status === 0
            "
          >
            <div
              class="support-tab"
              v-if="maySupport"
              @click="handleSupport(proposal)"
            >
              <div class="circle mr-2">
                <img src="@/assets/images/high.svg" alt="" />
              </div>
              <span>Support</span>
            </div>
            <div class="support-tab disabled" v-if="!maySupport">
              <div class="circle mr-2">
                <img src="@/assets/images/high.svg" alt="" />
              </div>
              <span>Support</span>
            </div>
          </section>

          <section
            class="governance-proposal-item-current-team"
            v-if="proposal.fromTeam.message"
          >
            <div class="title">
              <div>
                <img src="@/assets/images/team.svg" alt="" />
                <span>From team</span>
              </div>
              <span>{{ fromNow(proposal.fromTeam.createdAt) }}</span>
            </div>
            <div class="body">
              {{ proposal.fromTeam.message }}
            </div>
          </section>

          <section
            class="governance-proposal-item-current-approve"
            v-if="!alreadyRejected && !alreadyApproved && !voteProccess"
          >
            <section :class="{ 'grid-1': !maySupport }">
              <div class="first" v-if="maySupport && !alreadyRejected">
                <button class="btn-reject" @click="handleReject(proposal)">
                  <img src="@/assets/images/reject.svg" alt="" />
                  <span>REJECT</span>
                </button>
              </div>
              <div v-if="maySupport && !alreadyApproved">
                <button class="btn-approve" @click="handleApprove(proposal)">
                  <img src="@/assets/images/approve.svg" alt="" />
                  <span>APPROVE</span>
                </button>
              </div>
              <section
                v-if="!maySupport"
                class="d-flex align-items-center justify-content-center"
              >
                <p>Not enough voting power</p>
              </section>
            </section>
          </section>

          <section
            class="governance-proposal-item-current-approve fade-in"
            v-if="alreadyRejected || alreadyApproved"
          >
            <section class="alredy">
              <p>You've voted already</p>
            </section>
          </section>

          <section class="governance-proposal-item-current-votes">
            <div class="title">
              <h2>Votes</h2>
              <div class="d-flex align-items-center">
                <span>{{ list.length }}</span>
              </div>
            </div>
            <div class="body">
              <div class="list" v-if="list.length">
                <div
                  class="list-item"
                  v-for="(support, index) in list"
                  :key="index"
                  :class="{ copied: copIndex === index }"
                  @click="copy(`clip_${index}`, index)"
                >
                  <div>
                    <div class="circle mr-2">
                      <img src="@/assets/images/wallet.svg" alt="" />
                    </div>
                    <span>{{ support.address }}</span>
                    <input
                      type="text"
                      :value="support.address"
                      :id="`clip_${index}`"
                      style="position: fixed; z-index: -4; top: -1000000px;"
                    />
                  </div>
                </div>
              </div>
              <div v-if="!list.length">
                <p>No votes</p>
              </div>
            </div>
          </section>
        </div>
        <div
          class="blurred-vote governance-proposal-item-current mb-5"
          v-if="
            proposal && (proposal.endStatus === 0 || proposal.endStatus === 1)
          "
        >
          <section class="governance-proposal-item-current-info">
            <div class="left">
              <div class="title">
                <h2>About this proposal</h2>
              </div>
              <div class="body">
                <div>
                  <span>Created</span>
                  <span>{{ fromNow(proposal.createdAt) }}</span>
                </div>
                <!-- <div>
                  <span>Vote start</span>
                  <span>{{ fromNow(proposal.started) }}</span>
                </div> -->
                <div>
                  <span>Vote ends</span>
                  <span>
                    {{ fromNow(proposal.endTime) }}
                  </span>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Created by</span>
                  <article
                    @click="copyTo('clip_address', 9999)"
                    class="d-flex"
                    :class="{ copied: copIndex === 9999 }"
                  >
                    <div class="circle mr-1">
                      <img src="@/assets/images/wallet.svg" alt="" />
                    </div>
                    <span>{{ formatedAddress(proposal.address) }}</span>
                    <input
                      type="text"
                      :value="proposal.address"
                      :id="`clip_address`"
                      style="position: fixed; z-index: -5; top: -1000000px;"
                    />
                  </article>
                </div>
              </div>
            </div>
            <div class="right">
              <div class="title">
                <h2>Results</h2>
              </div>
              <div class="body">
                <div
                  class="progress-voting"
                  :style="`--w: ${calculatePercent(proposal)}%`"
                ></div>
                <section class="d-flex flex-column">
                  <section>
                    <div class="d-flex align-items-center">
                      <img
                        src="@/assets/images/approve.svg"
                        alt=""
                        class="mr-1"
                      />
                      <span>APPROVED</span>
                    </div>
                    <span
                      >{{ parse(total.approve) }} ({{
                        calculatePercent(proposal)
                      }}%)</span
                    >
                  </section>
                  <section>
                    <div class="d-flex align-items-center">
                      <img
                        src="@/assets/images/reject.svg"
                        alt=""
                        class="mr-1"
                      />
                      <span>REJECTED</span>
                    </div>
                    <span
                      >{{ parse(total.reject) }} ({{
                        calculatePercent(proposal, "reject")
                      }}%)</span
                    >
                  </section>
                </section>
              </div>
            </div>
          </section>
          <section class="governance-proposal-item-current-data">
            <div class="title">
              <h2>{{ fromNow(proposal.createdAt) }}</h2>
            </div>
            <div
              class="body"
              v-for="(block, index) in proposal.blocks"
              :key="index"
            >
              <section>
                <h2>
                  {{ block.title }}
                </h2>
                <p>
                  {{ block.text }}
                </p>
              </section>
              <section
                class="d-flex flex-column align-items-center"
                v-if="block.photo.src.length"
              >
                <div
                  class="image"
                  :style="`background-image: url(${block.photo.src})`"
                  @click="fullImage = block.photo.src"
                ></div>
              </section>
            </div>
          </section>
          <div
            class="blurred-item"
            :class="`${proposal.endStatus === 0 ? 'approved' : 'rejected'}`"
          >
            <h1>{{ proposal.endStatus === 0 ? "Approved" : "Rejected" }}</h1>
            <p>Ended: {{ parseDate(proposal.endTime) }}</p>
          </div>
        </div>

        <!-- image on fullscreen -->
        <div class="full-image" v-if="fullImage">
          <div class="overlay" @click="fullImage = null"></div>
          <div class="image-container">
            <img :src="fullImage" alt="" />
            <div class="close" @click="fullImage = null">&times;</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {
  GetCurrentProposal,
  SupportProposal,
  ApproveVote,
  RejectVote,
  GetWallet,
} from "@/services/wallet";

const ethUtil = require("ethereumjs-util");
const sigUtil = require("eth-sig-util");

export default {
  data: () => ({
    proposal: null,
    fullImage: "",
    currentUserWallet: "",
    wallet: null,
    copIndex: null,
    total: {
      approve: "",
      reject: "",
    },
    voteProccess: false,
  }),
  computed: {
    list() {
      return [...this.proposal.votes.approve, ...this.proposal.votes.reject];
    },
    maySupport() {
      return parseFloat(this.wallet.power) < 3.16 ? false : true;
    },
    alreadySupported() {
      const list = [
        ...this.proposal.votes.approve,
        ...this.proposal.votes.reject,
      ];

      return list.find((a) => a.address === this.currentUserWallet);
    },
    alreadyApproved() {
      return this.proposal.votes.approve.find(
        (a) => a.address === this.currentUserWallet
      );
    },
    alreadyRejected() {
      return this.proposal.votes.reject.find(
        (a) => a.address === this.currentUserWallet
      );
    },
  },
  async created() {
    try {
      const address =
        this.$store.getters.getAddress ||
        this.$farm3.walletAddress ||
        localStorage.getItem("address");

      const data = await GetCurrentProposal(this.$route.params.id);
      const dataWallet = await GetWallet(address);

      if (data.success) {
        this.proposal = data.proposal;
        this.currentUserWallet =
          this.$store.getters.getAddress ||
          this.$farm3.walletAddress ||
          localStorage.getItem("address");
        this.wallet = dataWallet.wallet;
        this.total.approve = data.totalApprove;
        this.total.reject = data.totalReject;
      }

      if (!data.success) {
        this.$router.push("/404");
      }
    } catch (error) {
      this.$router.push("/governance/proposal");
    }
  },
  methods: {
    parse(num) {
      return parseFloat(num).toFixed(2);
    },
    parseDate(date) {
      return moment(date).format("DD-MM-YYYY");
    },
    copy(name, index) {
      let copyText = document.getElementById(name);
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");

      this.copIndex = index;

      setTimeout(() => {
        this.copIndex = null;
      }, 1500);
    },
    copyTo(name, index) {
      let copyText = document.getElementById(name);
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");

      this.copIndex = index;

      setTimeout(() => {
        this.copIndex = null;
      }, 1500);
    },
    formatedAddress(str) {
      const str1 = String(str).slice(0, 6);
      const str2 = String(str).slice(str.length - 4, str.length);
      return `${str1}...${str2}`;
    },
    fromNow(date) {
      return moment(date).fromNow();
    },
    calculatePercent(proposal, type = "approve") {
      const all =
        parseFloat(this.total.approve) + parseFloat(this.total.reject);

      const a = parseFloat(this.total.approve);
      const b = parseFloat(this.total.reject);

      let percent = 0;

      if (type === "approve" && a > 0) {
        percent = parseFloat(parseFloat(a / all) * 100).toFixed(2);
      }

      if (type === "reject" && b > 0) {
        percent = parseFloat(parseFloat(b / all) * 100).toFixed(2);
      }

      return percent;
    },
    async handleSupport(proposal) {
      const data = await SupportProposal(proposal._id, this.currentUserWallet);

      if (data.success) {
        const proposalData = await GetCurrentProposal(this.$route.params.id);

        if (proposalData.success) {
          this.proposal = proposalData.proposal;
          this.currentUserWallet =
            this.$store.getters.getAddress ||
            this.$farm3.walletAddress ||
            localStorage.getItem("address");
        }
      }
    },
    async handleSign(proposal, wallet, type) {
      var text = `I do want to excercise my Popsicle voting power\n\nSalt: ${wallet.nonce}`;
      var msg = ethUtil.bufferToHex(new Buffer(text, "utf8"));

      var from =
        this.$store.getters.getAddress ||
        this.$farm3.walletAddress ||
        localStorage.getItem("address");
      if (!from) return connect();

      var params = [msg, from];
      var method = "personal_sign";

      const res = await web3.currentProvider.sendAsync(
        {
          method,
          params,
          from,
        },
        async (err, result) => {
          if (err) return console.error(err);
          if (result.error) return console.error(result.error);

          const msgParams = { data: msg };
          msgParams.sig = result.result;

          const recovered = sigUtil.recoverPersonalSignature(msgParams);

          if (recovered === from) {
            if (type === 1) {
              const data = await RejectVote(
                proposal._id,
                wallet.address,
                result.result,
                text
              );

              if (data.success) {
                this.voteProccess = true;
                const proposalData = await GetCurrentProposal(
                  this.$route.params.id
                );

                if (proposalData.success) {
                  this.proposal = proposalData.proposal;
                  this.currentUserWallet =
                    this.$store.getters.getAddress ||
                    this.$farm3.walletAddress ||
                    localStorage.getItem("address");
                  this.total.approve = proposalData.totalApprove;
                  this.total.reject = proposalData.totalReject;
                }
              }

              if (!data.success) {
                //console.log(data.msg);
              }
            }

            if (type === 0) {
              const data = await ApproveVote(
                proposal._id,
                wallet.address,
                result.result,
                text
              );

              if (data.success) {
                this.voteProccess = true;
                const proposalData = await GetCurrentProposal(
                  this.$route.params.id
                );

                if (proposalData.success) {
                  this.proposal = proposalData.proposal;
                  this.currentUserWallet =
                    this.$store.getters.getAddress ||
                    this.$farm3.walletAddress ||
                    localStorage.getItem("address");
                  this.total.approve = proposalData.totalApprove;
                  this.total.reject = proposalData.totalReject;
                }
              }
            }
          } else {
            console.dir(recovered);
            // console.log(
            //   "SigUtil Failed to verify signer when comparing " +
            //     recovered.result +
            //     " to " +
            //     from
            // );
            // console.log("Failed, comparing %s to %s", recovered, from);

            // alert("Ты не самый умный, а я не Тина Канделаки");
          }
        }
      );

      return res;
    },
    async handleReject(proposal) {
      await this.handleSign(proposal, this.wallet, 1);
    },
    async handleApprove(proposal) {
      await this.handleSign(proposal, this.wallet, 0);
    },
  },
};
</script>

<style></style>
