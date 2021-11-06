<template>
  <div class="governance-proposal py-5 fade-in">
    <div class="container">
      <section class="my-5 title text-center">
        <transition appear @enter="enter" @beforeEnter="beforeEnter">
          <h1 class="text-center">Popsicle governance</h1>
        </transition>

        <transition appear @enter="enter" @beforeEnter="beforeEnter">
          <h6 class="text-secondary">
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
        </transition>
      </section>

      <section class="governance-proposal-voting my-5">
        <transition appear @enter="enter" @beforeEnter="beforeEnter">
          <Power :wallet="wallet" />
        </transition>
      </section>

      <section
        class="governance-proposal-item current mb-5 fade-in"
        v-if="proposal"
      >
        <div class="governance-proposal-item-title">
          <h2>Proposals</h2>
          <!-- <span class="back">Back to all</span> -->
          <router-link
            class="back"
            :to="{ path: '/governance/proposal', query: { type: 0 } }"
            tag="span"
            >Back to all</router-link
          >
        </div>
        <div class="governance-proposal-item-current">
          <section class="governance-proposal-item-current-info">
            <div class="left">
              <div class="title">
                <h2>Info</h2>
              </div>
              <div class="body">
                <div>
                  <span>Created</span>
                  <span>{{ fromNow(proposal.createdAt) }}</span>
                </div>
                <div v-if="proposal.status === 1">
                  <span>Vote started</span>
                  <span v-if="proposal.started">{{
                    fromNow(proposal.started)
                  }}</span>
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
                  class="progress-proposal"
                  :style="`--w: ${proposal.total}%`"
                ></div>
                <section>
                  <div class="d-flex align-items-center">
                    <img src="@/assets/images/high.svg" alt="" class="mr-1" />
                    <span>UNTIL APPROVED</span>
                  </div>
                  <span>{{ parse(100 - proposal.total) }}%</span>
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
                v-if="block.photo.src"
              >
                <div
                  class="image"
                  :style="`background-image: url(${block.photo.src})`"
                  @click="fullImage = block.photo.src"
                ></div>
                <!-- <span class="my-3">Image caption</span> -->
              </section>
            </div>
          </section>
          <section
            class="governance-proposal-item-current-support"
            v-if="!alreadySupported"
          >
            <div
              class="support-tab"
              v-if="maySupport"
              @click="handleSupport(proposal)"
              :class="{ progress: supportProcess }"
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
            class="governance-proposal-item-current-support alredy fade-in"
            v-if="alreadySupported"
          >
            <p>You've supported already</p>
          </section>
          <section class="governance-proposal-item-current-votes">
            <div class="title">
              <h2>Votes</h2>
              <div class="d-flex align-items-center">
                <span>{{ proposal.supports.length }}</span>
                <!-- <span class="accent ml-2">All list</span> -->
              </div>
            </div>
            <div class="body">
              <div class="list" v-if="proposal.supports.length">
                <div
                  class="list-item"
                  v-for="(support, index) in proposal.supports"
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
              <div v-if="!proposal.supports.length">
                <p>No votes</p>
              </div>
            </div>
          </section>
          <section class="governance-proposal-item-current-comments">
            <div class="title">
              <h2>Comments</h2>
              <div class="d-flex align-items-center">
                <span>{{ proposal.comments.length }}</span>
                <!-- <span class="accent ml-2">All comments</span> -->
              </div>
            </div>
            <div class="list">
              <div class="list-comments" v-if="comments.length">
                <div
                  class="list-comments-item"
                  v-for="(comment, index) in comments"
                  :key="index"
                >
                  <div class="title-comment">
                    <div class="d-flex">
                      <img
                        src="@/assets/images/wallet.svg"
                        alt=""
                        class="mr-2"
                      />
                      <span>{{ formatedAddress(comment.address) }}</span>
                    </div>
                    <small>{{ fromNow(comment.createdAt) }}</small>
                  </div>
                  <div class="body">
                    {{ comment.message }}
                  </div>
                </div>
              </div>
              <div class="list-comments" v-if="!comments.length">
                <p>No comments</p>
              </div>
              <div class="list-control">
                <textarea
                  placeholder="Enter message here.."
                  v-model="message"
                  @input="handleSetComment"
                ></textarea>
                <div class="count-text">{{ message.length }}/500</div>
                <button
                  class="btn-send"
                  @click="handleSendMessage"
                  v-if="!invalidComment && message.length > 9"
                >
                  <img src="@/assets/images/send-comment.svg" alt="" />
                </button>
              </div>
            </div>
          </section>
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
      <section
        v-if="!proposal"
        class="d-flex align-items-center justify-content-center my-5"
      >
        <Loading size="big" title="" />
      </section>
    </div>
  </div>
</template>

<script>
import animations from "@/mixins/animations.js";

import moment from "moment";
import {
  GetCurrentProposal,
  SupportProposal,
  SendComment,
  GetWallet,
} from "@/services/wallet";

const ethUtil = require("ethereumjs-util");
const sigUtil = require("eth-sig-util");

export default {
  mixins: [animations],
  data: () => ({
    proposal: null,
    fullImage: "",
    currentUserWallet: "",
    message: "",
    wallet: null,
    comments: [],
    invalidComment: false,
    copIndex: null,
    total: {
      approve: "",
      reject: "",
    },
    supportProcess: false,
  }),
  async created() {
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
      this.comments = this.proposal.comments.reverse();
      this.total.approve = data.totalApprove;
      this.total.reject = data.totalReject;

      if (data.proposal.status === 1) {
        this.$router.push(`/governance/voting/${data.proposal._id}`);
      }

      setTimeout(() => {
        const list = document.querySelector(".list-comments");
        list.scrollTop = list.scrollHeight + 100;
      }, 1000);
    }

    if (!data.success) {
      this.$router.push("/404");
    }
  },
  computed: {
    maySupport() {
      return parseFloat(this.wallet.power) < 3.16 ? false : true;
    },
    alreadySupported() {
      return this.proposal.supports.find(
        (s) => s.address === this.currentUserWallet
      );
    },
  },
  methods: {
    parse(num) {
      return parseFloat(num).toFixed(2);
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
    async handleSign(proposal, wallet) {
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
            const data = await SupportProposal(
              proposal._id,
              wallet.address,
              result.result,
              text
            );

            if (data.success) {
              const proposalData = await GetCurrentProposal(
                this.$route.params.id
              );

              if (proposalData.success) {
                this.proposal = proposalData.proposal;
                this.currentUserWallet = this.$farm3.walletAddress;

                if (proposalData.proposal.status === 1) {
                  this.$router.push(
                    `/governance/voting/${proposalData.proposal._id}`
                  );
                }
              }
            }

            if (!data.success) {
              //console.log(data.msg);
            }
          } else {
            // console.dir(recovered);
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

      //console.log(res);
      return res;
    },
    async handleSupport(proposal) {
      this.supportProcess = true;
      await this.handleSign(proposal, this.wallet);
    },
    calculatePercent(proposal, type = "reject") {
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
    handleSetComment(e) {
      const length = e.target.value.length;

      if (length > 500) {
        this.invalidComment = true;
      }

      if (length <= 500) {
        this.invalidComment = false;
      }
    },
    async handleSendMessage() {
      const data = await SendComment(
        this.proposal._id,
        this.currentUserWallet,
        this.message
      );

      if (data.success) {
        this.message = "";

        const proposalData = await GetCurrentProposal(this.$route.params.id);

        if (proposalData && proposalData.success) {
          this.proposal = proposalData.proposal;
          this.currentUserWallet =
            this.$store.getters.getAddress ||
            this.$farm3.walletAddress ||
            localStorage.getItem("address");
          this.comments = proposalData.proposal.comments;

          setTimeout(() => {
            const list = document.querySelector(".list-comments");
            list.scrollTop = list.scrollHeight + 100;
          }, 1000);
        }
      }
    },
  },
};
</script>

<style></style>
