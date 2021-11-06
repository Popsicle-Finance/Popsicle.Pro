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
      <!--  -->

      <section class="governance-proposal-tabs my-5">
        <div class="governance-proposal-tabs-item">
          <span
            :class="{ active: globalFilter === 0 }"
            @click="globalFilter = 0"
            >Proposal</span
          >
          <span
            :class="{ active: globalFilter === 1 }"
            @click="globalFilter = 1"
            >Voting</span
          >
        </div>
      </section>

      <section class="governance-proposal-voting my-5">
        <Power :wallet="wallet" />
      </section>

      <section class="governance-proposal-item mb-5" v-if="loaded">
        <div class="governance-proposal-item-title">
          <div class="d-flex">
            <h2 class="mr-3">Proposals</h2>
            <div class="d-flex align-items-center tags">
              <div
                class="tag-item"
                @click="filter = ''"
                :class="{ active: filter === '' }"
              >
                ALL
              </div>
              <div
                class="tag-item"
                @click="filter = 'tech'"
                :class="{ active: filter === 'tech' }"
              >
                TECH
              </div>
              <div
                class="tag-item"
                @click="filter = 'product'"
                :class="{ active: filter === 'product' }"
              >
                PRODUCT
              </div>
              <div
                class="tag-item"
                @click="filter = 'marketing'"
                :class="{ active: filter === 'marketing' }"
              >
                MARKETING
              </div>
              <div
                class="tag-item"
                @click="filter = 'tokenomics'"
                :class="{ active: filter === 'tokenomics' }"
              >
                TOKENOMICS
              </div>
            </div>
          </div>
          <!-- <span class="create">Create</span> -->
          <router-link
            to="/governance/create"
            class="create"
            tag="span"
            v-if="globalFilter === 0 && maySupport"
          >
            Create
          </router-link>
          <router-link
            to="/governance/proposal"
            class="create disabled"
            tag="span"
            v-if="globalFilter === 0 && !maySupport"
          >
            Create
          </router-link>
        </div>
        <div
          class="governance-proposal-item-body fade-in"
          v-if="proposals.length"
        >
          <router-link
            class="box"
            tag="section"
            :to="
              `/governance/${proposal.status === 0 ? 'proposal' : 'voting'}/${
                proposal._id
              }`
            "
            v-for="proposal in filteredProposals"
            :key="proposal._id"
          >
            <div class="box-title" v-if="proposal.status === 0">
              <div class="percent">
                <div class="circle mr-2">
                  <img src="@/assets/images/wallet.svg" alt="" />
                </div>
                <span>{{ proposal.total }} % supported</span>
              </div>
              <span>{{ fromNow(proposal.createdAt) }}</span>
            </div>
            <div class="box-title" v-if="proposal.status === 1">
              <div class="percent">
                <div class="circle mr-2">
                  <img src="@/assets/images/approve.svg" alt="" />
                </div>
                <span
                  >{{ proposal.votes.totalApprove }} ({{
                    calculatePercent(proposal)
                  }}%)</span
                >
              </div>
              <div class="percent">
                <div class="circle mr-2">
                  <img src="@/assets/images/reject.svg" alt="" />
                </div>
                <span
                  >{{ proposal.votes.totalReject }} ({{
                    calculatePercent(proposal, "reject")
                  }}%)</span
                >
              </div>
              <span>{{ fromNow(proposal.createdAt) }}</span>
            </div>
            <div class="box-body">
              <h2>
                {{ proposal.blocks[0].title }}
              </h2>
              <p>
                {{ String(proposal.blocks[0].text).slice(0, 200) }}
              </p>
              <div class="tag">
                <span>{{ proposal.category }}</span>
              </div>
            </div>
          </router-link>
        </div>
        <div
          v-if="!proposals.length && !msg"
          class="proposal-loader d-flex justify-content-center my-5"
        >
          <Loading size="big" />
        </div>
        <div
          v-if="msg"
          class="proposal-loader d-flex flex-column align-items-center justify-content-center my-5 text-center"
        >
          <img src="@/assets/images/no-proposal.svg" alt="" />
          <h4>No {{ globalFilter === 0 ? "proposals" : "votings" }}</h4>
          <p v-if="globalFilter === 0">
            There are no proposals in this category, make one yourself!
          </p>
        </div>
        <div
          v-if="!filteredProposals.length && proposals.length"
          class="proposal-loader d-flex flex-column align-items-center justify-content-center my-5 text-center"
        >
          <img src="@/assets/images/no-proposal.svg" alt="" />
          <h4>No {{ globalFilter === 0 ? "proposals" : "votings" }}</h4>
          <p v-if="globalFilter === 0">
            There are no proposals in this category, make one yourself!
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { GetProposal } from "@/services/wallet";
import moment from "moment";

export default {
  data: () => ({
    wallet: null,
    proposals: [],
    msg: "",
    filter: "",
    globalFilter: 0,
    loaded: false,
  }),
  computed: {
    filteredProposals() {
      if (this.filter)
        return this.proposals.filter(
          (p) => p.category === this.filter && p.status === this.globalFilter
        );
      else return this.proposals.filter((p) => p.status === this.globalFilter);
    },
    maySupport() {
      return this.wallet
        ? parseFloat(this.wallet?.power) < 3.16
          ? false
          : true
        : false;
    },
  },
  created() {
    setTimeout(async () => {
      const address =
        this.$store.getters.getAddress ||
        this.$farm3.walletAddress ||
        localStorage.getItem("address");

      const data = await GetProposal(address);

      if (data.proposals) {
        this.proposals = data.proposals;
      }

      if (data.wallet) {
        this.wallet = data.wallet;
      }

      if (!data.proposals) {
        this.msg = data.msg;
      }

      this.loaded = true;
    }, 1000);

    const type = this.$route.query.type;

    if (type === "0") {
      this.globalFilter = 0;
    }

    if (type === "1") {
      this.globalFilter = 1;
    }
  },
  methods: {
    fromNow(date) {
      return moment(date).fromNow();
    },
    calculatePercent(proposal, type = "approve") {
      const all =
        parseFloat(proposal.votes.totalApprove) +
        parseFloat(proposal.votes.totalReject);

      const a = parseFloat(proposal.votes.totalApprove);
      const b = parseFloat(proposal.votes.totalReject);

      let percent = 0;

      if (type === "approve" && a > 0) {
        percent = parseFloat(parseFloat(a / all) * 100).toFixed(2);
      }

      if (type === "reject" && b > 0) {
        percent = parseFloat(parseFloat(b / all) * 100).toFixed(2);
      }

      return percent;
    },
  },
};
</script>
