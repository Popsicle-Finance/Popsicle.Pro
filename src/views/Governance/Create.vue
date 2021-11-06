<template>
  <div class="governance-rules" :class="{ 'dark-theme': theme === 'dark' }">
    <main class="governance-rules-container py-5">
      <!--  -->
      <section>
        <div class="container">
          <div class="row">
            <div class="col d-flex flex-column align-items-center">
              <h1 class="text-center">Popsicle Governance Dashboard</h1>
              <h6 class="text-secondary text-center">
                Here we the Isvikingers are able to make all sorts of proposals,
                that the community then votes on and if passed will be
                <br />implemented by the team. To learn more about the
                governance mechanism please visit the governance
                <a
                  href="https://popsicle-finance-wiki.gitbook.io/popsicle-finance/governance/our-voting-platform"
                  target="_blank"
                  class="wiki-link"
                  >wiki page here</a
                >.
              </h6>
            </div>
          </div>
        </div>
      </section>

      <!--  -->
      <section class="my-5">
        <div class="container">
          <div class="row">
            <div class="col-auto" v-if="wallet && wallet.power">
              <Power :wallet="wallet" />
              <!-- <div class="governance-rules-power-left"></div> -->
            </div>
          </div>
        </div>
      </section>

      <!--  -->
      <section class="governance-create mb-5 fade-in">
        <div class="container">
          <div class="governance-create-container">
            <div class="title">
              <h2>
                Before creating a proposal please make sure to read our
                governance rules on our
                <a
                  href="https://popsicle-finance-wiki.gitbook.io/popsicle-finance/governance/our-voting-platform"
                  target="_blank"
                  class="wiki-link"
                  >wiki page here</a
                >.
              </h2>
              <!-- <span>Back to all</span> -->
              <router-link class="back" to="/governance/proposal" tag="span"
                >Back to all</router-link
              >
            </div>

            <!-- boxes -->
            <div class="box mb-5">
              <div class="box-title">
                <h1>Your proposal</h1>
              </div>

              <div
                class="form fade-in"
                v-for="proposal in proposals"
                :key="proposal.id"
              >
                <div class="form-i" v-if="proposals[0].id === proposal.id">
                  <label for="category">Choose category</label>
                  <Select
                    :options="categories"
                    :selected="proposal.category"
                    @select="handleSelect"
                  />
                </div>
                <div class="form-i">
                  <label for="title" v-if="proposals[0].id === proposal.id"
                    >Title (required)</label
                  >
                  <label for="title" v-else>Subtitle (required)</label>
                  <input
                    type="text"
                    placeholder="Title"
                    v-model.trim="proposal.title"
                    :class="{ error: proposal.countTitleHasError }"
                    @input="handleUpdateProposalTitleCount($event, proposal.id)"
                  />
                  <div class="symbols">
                    <small>{{ proposal.countTitle }}/300</small>
                  </div>
                </div>
                <div class="form-i">
                  <label for="text">Text (required)</label>
                  <textarea
                    id="text"
                    placeholder="Text"
                    v-model.trim="proposal.text"
                    :class="{ error: proposal.countTextHasError }"
                    @input="handleUpdateProposalTextCount($event, proposal.id)"
                  ></textarea>
                  <div class="symbols d-flex justify-content-between">
                    <small>Min 300</small>
                    <small>{{ proposal.countText }}/10000</small>
                  </div>
                </div>
                <div class="form-i">
                  <!-- hidden input file -->
                  <input
                    type="file"
                    style="display: none"
                    :ref="`photo-${proposal.id}`"
                    @change="handleSetPhoto($event, proposal.id)"
                  />
                  <button
                    class="add-btn"
                    @click="handleSetPhotoAction(proposal.id)"
                  >
                    <span>Add photo</span>
                    <span class="ml-2">(Max size 2mb)</span>
                  </button>
                  <div class="photo" v-if="proposal.photo.src">
                    <span>{{ proposal.photo.name }}</span>
                    <span class="delete" @click="deletePhoto(proposal.id)"
                      >&times;</span
                    >
                  </div>
                </div>

                <div class="form-m">
                  <span>One more text block</span>
                  <div>
                    <span
                      class="accent"
                      @click="add"
                      v-if="
                        proposal.id === proposals[proposals.length - 1].id &&
                          proposals.length <= 10
                      "
                      >add</span
                    >
                    <span
                      class="accent mx-1"
                      v-if="
                        proposal.id === proposals[proposals.length - 1].id &&
                          proposals.length > 1 &&
                          proposals.length <= 10
                      "
                      >/</span
                    >
                    <span
                      class="accent"
                      v-if="proposals.length > 1"
                      @click="remove(proposal.id)"
                      >remove</span
                    >
                  </div>
                  <!-- <span
                    class="accent"
                    @click="add"
                    v-if="proposal.id === proposals[proposals.length - 1].id"
                    >add</span
                  >
                  <span class="accent" v-else @click="remove(proposal.id)"
                    >remove</span
                  > -->
                </div>
              </div>

              <!-- buttons -->
              <div class="form-b">
                <button class="delete-btn mr-3">
                  <span>Delete</span>
                </button>
                <button
                  class="submit-btn"
                  type="submit"
                  @click="submit"
                  :disabled="maySubmit || createProcess"
                >
                  <span v-if="!createProcess">Submit</span>
                  <span
                    v-if="createProcess"
                    class="d-flex justify-content-center"
                  >
                    <Loading />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Modals -->
    <ModalLayout
      :pool="currentPool"
      :selectedBalance="selectedBalance"
      :activePoint="activePoint"
      :selectedText="selectedText"
      :epsRewards="currentPool.epsRewards"
      @deposit="handleDeposit"
      @withdraw="handleWithdraw"
      @toggleNetwork="handleToggleNetwork"
      @harvestEPS="handleHarvestEPS"
      @harvestICE="handleHarvestICE"
    />
  </div>
</template>

<script>
import { toBase64 } from "@/utils";
import global from "@/mixins/global";
import { v4 as uuid_v4 } from "uuid";

import { CreateProposal, GetWallet } from "@/services/wallet";
import Loading from "../../components/Loading.vue";

export default {
  components: { Loading },
  mixins: [global],
  data: () => ({
    wallet: null,
    categories: ["tech", "product", "marketing", "tokenomics"],
    proposal: {
      id: "",
      title: "",
      text: "",
      photo: {
        src: "",
        name: "",
      },
      countTitle: 0,
      countText: 0,
      countTitleHasError: false,
      countTextHasError: false,
      category: "tech",
    },
    proposals: [
      {
        id: uuid_v4(),
        title: "",
        text: "",
        photo: {
          src: "",
          name: "",
        },
        countTitle: 0,
        countText: 0,
        countTitleHasError: false,
        countTextHasError: false,
        category: "tech",
      },
    ],
    createProcess: false,
  }),
  computed: {
    maySubmit() {
      const s = this.proposals.some(
        (p) =>
          p.title?.length < 10 ||
          p.text?.length < 10 ||
          p.countTitleHasError ||
          p.countTextHasError
      );
      return s;
    },
  },
  methods: {
    handleUpdateProposalTitleCount(e, proposalId) {
      const proposal = this.proposals.find((p) => p.id === proposalId);

      if (proposal) {
        const count = e.target.value.length;
        if (parseInt(count) > 300) {
          proposal.countTitleHasError = true;
        }
        if (parseInt(count) <= 300) {
          proposal.countTitleHasError = false;
        }
        proposal.countTitle = count;
      }
    },
    handleUpdateProposalTextCount(e, proposalId) {
      const proposal = this.proposals.find((p) => p.id === proposalId);

      if (proposal) {
        const count = e.target.value.length;

        if (count > 10000) {
          proposal.countTextHasError = true;
        }
        if (count < 300) {
          proposal.countTextHasError = true;
        }

        if (count > 300 && count < 10000) {
          proposal.countTextHasError = false;
        }
        proposal.countText = count;
      }
    },
    handleSetPhotoAction(id) {
      const name = `photo-${id}`;
      this.$refs[name][0].click();
    },
    async handleSetPhoto(e, proposalId) {
      const file = e.target.files[0];

      if (!/image/i.test(file.type)) {
        alert("Please select image");
      } else {
        if (file.size < 2000000) {
          const photo64 = await toBase64(file);
          const proposal = this.proposals.find((p) => p.id === proposalId);

          if (proposal) {
            proposal.photo.src = photo64;
            proposal.photo.name = file.name;
          } else {
            proposal.photo.src = "";
            proposal.photo.name = "";
          }
        } else {
          alert("Max image size 2Mb");
        }
      }
    },
    add() {
      const length = this.proposals.length;
      //console.log("LENGHT: ", length);

      if (length <= 10) {
        this.proposals.push({
          title: this.proposal.title,
          text: this.proposal.text,
          photo: {
            src: this.proposal.photo?.src,
            name: this.proposal.photo?.name,
          },
          id: uuid_v4(),
          countTitle: 0,
          countText: 0,
          countTitleHasError: false,
          countTextHasError: false,
          category: this.proposals[0].category,
        });
        this.proposal = {};
      }
    },
    remove(proposalId) {
      this.proposals = this.proposals.filter(
        (proposal) => proposal.id !== proposalId
      );
    },
    deletePhoto(proposalId) {
      const proposal = this.proposals.find((p) => p.id === proposalId);

      if (proposal) {
        proposal.photo.name = "";
        proposal.photo.src = "";
      }
    },
    handleSelect(category) {
      this.proposals[0].category = category;
    },
    async submit() {
      this.createProcess = true;

      try {
        const address =
          (await this.$farm3.walletAddress) || localStorage.getItem("address");

        if (address) {
          const response = await CreateProposal(address, {
            blocks: this.proposals,
            category: this.proposals[0].category,
          });

          if (response.success) {
            this.createProcess = false;
            this.$router.push("/governance/proposal");
          } else {
            //console.log(response);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    setTimeout(async () => {
      const address =
        this.$store.getters.getAddress ||
        this.$farm3.walletAddress ||
        localStorage.getItem("address");

      const data = await GetWallet(address);

      if (data.wallet) {
        this.wallet = data.wallet;

        const num = parseFloat(data.wallet.power);

        if (num < 3.16) {
          this.$router.push("/governance/proposal");
        }
      }
    });
  },
};
</script>
