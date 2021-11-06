<template>
  <div class="stand-container">
    <template v-if="loaded && pools.length && !standErrorMsg">
      <div class="fade-in">
        <!-- Popsicle Stand -->
        <section class="dashboard-box fade-in mb-5" v-if="!allNetworks">
          <div class="row mt-5">
            <div class="col">
              <div class="dashboard-box-item">
                <header>
                  <div class="dashboard-box-item-title">
                    <img
                      src="@/assets/images/icecream.svg"
                      alt="ice"
                      title="Ice cream"
                    />
                    <h1>Popsicle Stand</h1>
                  </div>
                </header>
                <div class="dashboard-box-item-container">
                  <div class="row justify-content-between">
                    <div class="col-auto">
                      <div class="dashboard-box-item-container-item">
                        <h2>ICE Earned</h2>
                        <div>
                          <div class="circle-icon">
                            <div class="token" style="width: 30px;">
                              <img
                                src="@/assets/images/tokens/ice.svg"
                                alt="ice"
                              />
                            </div>

                            <div class="mini-circle">
                              <img
                                src="@/assets/images/networks/eth.svg"
                                alt=""
                                v-if="currentNetwork === 1"
                              />
                              <img
                                src="@/assets/images/networks/bsc.svg"
                                alt=""
                                v-if="currentNetwork === 2"
                              />
                              <img
                                src="@/assets/images/networks/fantom.svg"
                                alt=""
                                v-if="currentNetwork === 3"
                              />
                            </div>
                          </div>
                          <div class="d-flex flex-column align-items-start">
                            <span class="fade-in" v-if="info">
                              {{ info.totalPending }}</span
                            >
                            <small class="price-pending pt-1"
                              >${{
                                parseFloat(
                                  info.totalPending * info.price
                                ).toFixed(4)
                              }}</small
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-auto">
                      <div class="dashboard-box-item-container-item center">
                        <h2 v-if="currentNetwork === 1">Ethereum</h2>
                        <h2 v-if="currentNetwork === 2">BSC</h2>
                        <h2 v-if="currentNetwork === 3">Fantom</h2>
                        <button
                          class="btn"
                          @click="handleHarvesting"
                          v-if="!harvestProcess"
                        >
                          <span>Harvest</span>
                          <span class="ml-1" v-if="getHarvestCount() > 0"
                            >({{ getHarvestCount() }})</span
                          >
                        </button>
                        <button class="btn" v-if="harvestProcess" disabled>
                          <Loading />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row mt-5">
                  <div class="col">
                    <div class="dashboard-deposited fade-in" v-if="pools">
                      <div class="dashboard-deposited-title">
                        <h1>Deposited</h1>
                        <div
                          class="toggle"
                          :class="{ active: showDeposited }"
                          @click="showDeposited = !showDeposited"
                        >
                          <img src="@/assets/images/arrow_down.svg" alt="" />
                        </div>
                      </div>

                      <div
                        class="dashboard-deposited-list fade-in"
                        v-if="showDeposited"
                      >
                        <div
                          class="dashboard-deposited-list-item"
                          v-for="pool in openPools"
                          :key="pool.id"
                        >
                          <img
                            class="bg-image"
                            src="@/assets/images/stand-bgs/bg-1.svg"
                            alt=""
                          />
                          <div class="dashboard-deposited-list-item-title">
                            <h2 v-if="pool.id === 0">ICE deposited</h2>
                            <h2 v-if="pool.id === 1">LP deposited</h2>
                            <h2 v-if="pool.id === 2">LP deposited</h2>
                            <h2 v-if="pool.id === 3">LP deposited</h2>
                            <h2 v-if="pool.id === 4">yUSDT deposited</h2>
                            <h2 v-if="pool.id === 5">LP deposited</h2>
                            <h2 v-if="pool.id === 7">LP deposited</h2>
                            <h2 v-if="pool.id === 9">LP deposited</h2>
                            <h2 v-if="pool.id === 10">LP deposited</h2>
                            <h2 v-if="pool.id === 11">LP deposited</h2>
                            <h2 v-if="pool.id === 12">LP deposited</h2>
                            <h2 v-if="pool.id === 14">LP deposited</h2>
                            <h2 v-if="pool.id === 13">LP deposited</h2>
                            <h2 v-if="pool.id === 15">LP deposited</h2>
                          </div>
                          <div class="dashboard-deposited-list-item-body">
                            <div class="row">
                              <div class="col d-flex align-items-center">
                                <div class="circle-icon">
                                  <div class="token">
                                    <img
                                      :src="getImgUrl(pool.images[info.chain])"
                                      alt="ice"
                                    />
                                  </div>

                                  <div class="mini-circle">
                                    <img
                                      src="@/assets/images/pools/eth-1.png"
                                      alt=""
                                      v-if="
                                        currentNetwork === 1 && pool.id === 11
                                      "
                                    />

                                    <img
                                      src="@/assets/images/providers/sushiswap.svg"
                                      alt=""
                                      v-else-if="
                                        currentNetwork === 1 && pool.id === 13
                                      "
                                    />
                                    <img
                                      src="@/assets/images/networks/eth.svg"
                                      alt=""
                                      v-else-if="currentNetwork === 1"
                                    />

                                    <img
                                      src="@/assets/images/providers/sushiswap.svg"
                                      alt=""
                                      v-if="
                                        currentNetwork === 2 && pool.id === 7
                                      "
                                    />
                                    <img
                                      src="@/assets/images/providers/sushiswap.svg"
                                      alt=""
                                      v-if="
                                        currentNetwork === 2 && pool.id === 10
                                      "
                                    />
                                    <img
                                      src="@/assets/images/providers/pancake.svg"
                                      alt=""
                                      v-if="
                                        currentNetwork === 2 && pool.id === 12
                                      "
                                    />
                                    <img
                                      src="@/assets/images/providers/pancake.svg"
                                      alt=""
                                      v-if="
                                        currentNetwork === 2 && pool.id === 13
                                      "
                                    />
                                    <img
                                      src="@/assets/images/providers/sushiswap.svg"
                                      alt=""
                                      v-if="
                                        currentNetwork === 2 && pool.id === 14
                                      "
                                    />
                                    <img
                                      src="@/assets/images/providers/pancake.svg"
                                      alt=""
                                      v-if="
                                        currentNetwork === 2 && pool.id === 9
                                      "
                                    />
                                    <img
                                      src="@/assets/images/providers/pancake.svg"
                                      alt=""
                                      v-if="
                                        currentNetwork === 2 && pool.id === 11
                                      "
                                    />
                                    <img
                                      src="@/assets/images/providers/pancake.svg"
                                      alt=""
                                      v-if="
                                        currentNetwork === 2 && pool.id === 13
                                      "
                                    />
                                    <img
                                      src="@/assets/images/providers/pancake.svg"
                                      alt=""
                                      v-if="
                                        currentNetwork === 2 && pool.id === 15
                                      "
                                    />
                                    <img
                                      src="@/assets/images/networks/bsc.svg"
                                      alt=""
                                      v-if="
                                        currentNetwork === 2 &&
                                          pool.id !== 9 &&
                                          pool.id !== 7 &&
                                          pool.id !== 10 &&
                                          pool.id !== 11 &&
                                          pool.id !== 12 &&
                                          pool.id !== 13 &&
                                          pool.id !== 14 &&
                                          pool.id !== 15
                                      "
                                    />
                                    <img
                                      src="@/assets/images/pools/ftm-1.jpg"
                                      alt=""
                                      v-if="
                                        currentNetwork === 3 && pool.id === 13
                                      "
                                    />
                                    <img
                                      src="@/assets/images/providers/sushiswap.svg"
                                      alt=""
                                      v-else-if="
                                        currentNetwork === 3 && pool.id === 11
                                      "
                                    />
                                    <img
                                      src="@/assets/images/networks/fantom.svg"
                                      alt=""
                                      v-else-if="currentNetwork === 3"
                                    />
                                  </div>
                                </div>
                                <div
                                  class="ml-4 d-flex flex-column justify-content-center"
                                >
                                  <span> {{ pool.deposited }}</span>
                                  <p>{{ pool.token[info.chain] }} stand</p>
                                  <small>${{ getBalanceInDollar(pool) }}</small>
                                </div>
                              </div>
                              <div
                                class="col-auto d-flex flex-column justify-content-center"
                                style="position: relative;"
                              >
                                <button
                                  href="#"
                                  class="btn"
                                  v-if="pool.processingWithdraw"
                                  disabled
                                >
                                  <Loading />
                                </button>

                                <a
                                  href="#"
                                  class="btn"
                                  @click="showModal('withdraw', pool)"
                                  v-if="!pool.processingWithdraw"
                                >
                                  <span>Withdraw</span>
                                </a>

                                <div v-if="pool.id !== 5">
                                  <button
                                    href="#"
                                    class="btn"
                                    v-if="pool.processHarvesting"
                                    disabled
                                  >
                                    <Loading />
                                  </button>

                                  <a
                                    href="#"
                                    class="btn"
                                    @click="harvestCurrentPool(pool)"
                                    v-if="!pool.processHarvesting"
                                  >
                                    <span>Harvest</span>
                                  </a>
                                </div>
                                <div v-if="pool.id === 5">
                                  <button
                                    href="#"
                                    class="btn"
                                    v-if="pool.processHarvesting"
                                    disabled
                                  >
                                    <Loading />
                                  </button>

                                  <a
                                    href="#"
                                    class="btn"
                                    @click="showModal('harvest', pool)"
                                    v-if="!pool.processHarvesting"
                                  >
                                    <span>Harvest</span>
                                  </a>
                                </div>
                                <div
                                  class="pin red"
                                  v-if="
                                    pool.id !== 11 &&
                                      pool.id !== 10 &&
                                      pool.id !== 12 &&
                                      pool.id !== 13 &&
                                      pool.id !== 14 &&
                                      pool.id !== 15
                                  "
                                >
                                  Discontinued
                                </div>
                                <!-- <div
                                    v-else
                                    class="mb-3"
                                    style="height: 22px;"
                                  ></div> -->
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Tabs -->
        <section
          class="governance-proposal-tabs my-5 pb-3"
          style="border-bottom: 1px solid rgba(0,0,0,0.1);"
          v-if="false"
        >
          <div class="governance-proposal-tabs-item">
            <span
              :class="{ active: standFilter === 0 }"
              @click="standFilter = 0"
              >Sweetests</span
            >
            <span
              :class="{ active: standFilter === 1 }"
              @click="standFilter = 1"
              >Stand</span
            >
          </div>
        </section>

        <!-- Sweetests pools. blurred class for hide -->
        <section
          class="dashboard-pools"
          :style="`${!showActivePools ? 'grid-gap: 0' : ''}`"
          v-if="!allNetworks && standFilter === 0 && activePools.length"
        >
          <h3 class="pool-stand-title">Active pools</h3>

          <div class="dashboard-pools-head fade-in">
            <span>pool</span>
            <span>~ yield per $1000</span>
            <span>~ roi</span>
            <span>~ tvl</span>
          </div>
          <div class="dashboard-pools-list fade-in">
            <transition-group appear @enter="enter" @before-enter="beforeEnter">
              <div
                class="dashboard-pools-list-item"
                v-for="(item, index) in activePools"
                :key="item.id"
                :data-delay="index * 0.1"
              >
                <div class="dashboard-pools-list-item-1">
                  <div class="mini-image">
                    <img
                      :src="getImgUrl(item.images[info.chain])"
                      alt="image"
                      :title="item.token[info.chain]"
                    />
                  </div>
                  <div class="d-flex flex-column">
                    <span>{{ item.token[info.chain] }}</span>
                    <small v-if="info.chain === 'ETH' && item.id === 11"
                      >Uniswap V2</small
                    >
                    <small v-else-if="info.chain === 'ETH' && item.id === 13"
                      >Sushiswap</small
                    >
                    <small v-else-if="info.chain === 'BSC' && item.id === 10"
                      >Sushiswap</small
                    >
                    <small v-else-if="info.chain === 'BSC' && item.id === 12"
                      >Pancakeswap V2</small
                    >
                    <small v-else-if="info.chain === 'FTM' && item.id === 11"
                      >Sushiswap</small
                    >
                    <small v-else-if="info.chain === 'FTM' && item.id === 13"
                      >Spookyswap</small
                    >
                    <small v-else-if="info.chain === 'ETH'">Ethereum</small>
                    <small
                      v-else-if="
                        info.chain === 'BSC' && item.id !== 7 && item.id !== 9
                      "
                      >BSC</small
                    >
                    <small
                      v-else-if="
                        info.chain === 'BSC' && item.id === 7 && item.id !== 9
                      "
                      >Sushiswap (BSC)</small
                    >
                    <small
                      v-else-if="
                        info.chain === 'BSC' && item.id !== 7 && item.id === 9
                      "
                      >Pancake V1 (BSC)</small
                    >
                    <small v-else-if="info.chain === 'FTM'">Fantom</small>

                    <!-- <div
                        class="pin red"
                        v-if="
                          (item.id === 1 || item.id === 9) &&
                            info.chain === 'BSC'
                        "
                      >
                        Discontinued
                      </div> -->
                    <div
                      class="dashboard-pools-list-item-desc fade-in"
                      v-if="item.id === 1 || item.id === 9"
                    >
                      {{ item.descMultiplier }}
                    </div>
                  </div>
                </div>

                <div class="dashboard-pools-list-item-1">
                  <div class="d-flex flex-column" v-if="item.id !== 5">
                    <span v-if="item.id === 1 && info.chain === 'BSC'"
                      >0.00</span
                    >
                    <span v-else>{{ item.yieldPerDollar }}</span>
                    <small>Ice/day</small>
                    <!-- <div class="pin">{{ item.alloc }}x Multiplier</div>
                    <div class="dashboard-pools-list-item-desc fade-in">
                      {{ item.info.descMultiplier }}
                    </div> -->
                  </div>
                  <div class="d-flex" v-if="item.id === 5">
                    <div class="d-flex flex-column mr-3">
                      <span>{{ item.yieldPerDollar }}</span>
                      <small>Ice/day</small>
                    </div>
                    <div class="d-flex flex-column">
                      <span>{{ item.yieldPerDollarEPS }}</span>
                      <small>EPS/day</small>
                    </div>
                  </div>
                </div>

                <div class="dashboard-pools-list-item-3" v-if="item.id !== 5">
                  <span
                    v-if="
                      item.id === 1 &&
                        (info.chain === 'FTM' || info.chain === 'BSC')
                    "
                    >0.00% Annually</span
                  >
                  <span v-if="item.id === 1 && info.chain === 'ETH'"
                    >{{ extractRoi(item.roi, 365) }}% <small>Daily</small></span
                  >
                  <span v-if="item.id === 1 && info.chain === 'ETH'"
                    >{{ extractRoi(item.roi, 7) }}% <small>Weekly</small></span
                  >
                  <span v-if="item.id === 1 && info.chain === 'ETH'"
                    >{{ extractRoi(item.roi) }}% <small>Annually</small></span
                  >

                  <span
                    v-if="
                      item.id !== 1 &&
                        (info.chain !== 'FTM' || info.chain !== 'BSC')
                    "
                    >{{ extractRoi(item.roi, 365) }}% <small>Daily</small></span
                  >
                  <span
                    v-if="
                      item.id !== 1 &&
                        (info.chain !== 'FTM' || info.chain !== 'BSC')
                    "
                    >{{ extractRoi(item.roi, 7) }}% <small>Weekly</small></span
                  >
                  <span
                    v-if="
                      item.id !== 1 &&
                        (info.chain !== 'FTM' || info.chain !== 'BSC')
                    "
                    >{{ extractRoi(item.roi) }}% <small>Annually</small></span
                  >
                </div>

                <div class="dashboard-pools-list-item-3" v-if="item.id === 5">
                  <span
                    >{{ calculateRoi(item.roi, item.roiICE, 365) }}%
                    <small>Daily</small></span
                  >
                  <span
                    >{{ calculateRoi(item.roi, item.roiICE, 7) }}%
                    <small>Weekly</small></span
                  >
                  <span
                    >{{ calculateRoi(item.roi, item.roiICE) }}%
                    <small>Annually</small></span
                  >
                </div>

                <div class="dashboard-pools-list-item-2">
                  <div class="mini-image">
                    <img
                      :src="getImgUrl(item.images[info.chain])"
                      alt="image"
                      :title="item.token[info.chain]"
                    />
                  </div>
                  <span v-if="item.id === 1 && info.chain === 'ETH'"
                    >${{ item.ttl }}</span
                  >
                  <span v-else>${{ item.tvl ? item.tvl : 0 }}</span>
                </div>

                <div
                  class="dashboard-pools-list-item-3 end"
                  v-if="item.allowance"
                >
                  <button
                    class="btn-pool"
                    @click="showModal('deposit', item)"
                    :disabled="
                      item.processingDeposit ||
                        ((item.id === 1 || item.id === 9) &&
                          info.chain === 'BSC')
                    "
                  >
                    <Loading v-if="item.processingDeposit" />
                    <span v-else>Stake</span>
                  </button>
                  <button
                    class="btn-pool"
                    @click="showModal('withdraw', item)"
                    :disabled="item.processingWithdraw"
                  >
                    <Loading v-if="item.processingWithdraw" />
                    <span v-else>Unstake</span>
                  </button>
                </div>

                <div
                  class="dashboard-pools-list-item-3 end"
                  v-if="!item.allowance"
                >
                  <button
                    class="btn-pool"
                    @click="handleJoinToPool(item)"
                    v-if="info.walletConnected"
                  >
                    <span>Join to party</span>
                  </button>
                  <button
                    class="btn-pool"
                    @click="connectWallet()"
                    v-if="!info.walletConnected"
                  >
                    <span>Join to party</span>
                  </button>
                </div>

                <div class="exp" v-if="item.id !== 1">
                  <div class="exp-circle" @mouseenter="showExp = item.id">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div
                    class="exp-desc d-flex flex-column"
                    v-if="showExp === item.id"
                    @mouseleave="showExp = false"
                  >
                    <a
                      :href="item.links[info.chain]"
                      target="_blank"
                      v-if="item.links[info.chain]"
                      >Contract</a
                    >
                    <a
                      class="my-1"
                      :href="item.lpsLink[info.chain]"
                      target="_blank"
                      v-if="item.lpsLink[info.chain] && item.id !== 9"
                      >Get LP's</a
                    >

                    <a
                      class="my-1"
                      :href="item.lpsLink[info.chain]"
                      target="_blank"
                      v-if="
                        item.lpsLink[info.chain] &&
                          info.chain === 'BSC' &&
                          item.id === 9
                      "
                      >Migrate</a
                    >
                  </div>
                </div>
              </div>
            </transition-group>
          </div>
        </section>

        <section
          class="dashboard-pools"
          :style="`${!showActivePools ? 'grid-gap: 0' : ''}`"
          v-if="!allNetworks && standFilter === 0 && disconnectedPools.length"
        >
          <div class="dashboard-deposited-title">
            <h1>Discontinued pools</h1>
            <div
              class="toggle"
              :class="{ active: showDiscontinued }"
              @click="showDiscontinued = !showDiscontinued"
            >
              <img src="@/assets/images/arrow_down.svg" alt="" />
            </div>
          </div>

          <template v-if="showDiscontinued">
            <div class="dashboard-pools-head fade-in">
              <span>pool</span>
              <span>~ yield per $1000</span>
              <span>~ roi</span>
              <span>~ tvl</span>
            </div>
            <div class="dashboard-pools-list fade-in">
              <transition-group
                appear
                @enter="enter"
                @before-enter="beforeEnter"
              >
                <div
                  class="dashboard-pools-list-item"
                  v-for="(item, index) in disconnectedPools"
                  :key="item.id"
                  :data-delay="index * 0.1"
                >
                  <div class="dashboard-pools-list-item-1">
                    <div class="mini-image">
                      <img
                        :src="getImgUrl(item.images[info.chain])"
                        alt="image"
                        :title="item.token[info.chain]"
                      />
                    </div>
                    <div class="d-flex flex-column">
                      <span>{{ item.token[info.chain] }}</span>
                      <small v-if="info.chain === 'ETH'">Ethereum</small>
                      <small
                        v-if="
                          info.chain === 'BSC' && item.id !== 7 && item.id !== 9
                        "
                        >BSC</small
                      >
                      <small
                        v-if="
                          info.chain === 'BSC' && item.id === 7 && item.id !== 9
                        "
                        >Sushiswap (BSC)</small
                      >
                      <small
                        v-if="
                          info.chain === 'BSC' && item.id !== 7 && item.id === 9
                        "
                        >Pancake V1 (BSC)</small
                      >
                      <small v-if="info.chain === 'FTM'">Fantom</small>

                      <!-- <div
                        class="pin red"
                        v-if="
                          (item.id === 1 || item.id === 9) &&
                            info.chain === 'BSC'
                        "
                      >
                        Discontinued
                      </div> -->
                      <div
                        class="dashboard-pools-list-item-desc fade-in"
                        v-if="item.id === 1 || item.id === 9"
                      >
                        {{ item.descMultiplier }}
                      </div>
                    </div>
                  </div>

                  <div class="dashboard-pools-list-item-1">
                    <div class="d-flex flex-column" v-if="item.id !== 5">
                      <span v-if="item.id === 1 && info.chain === 'BSC'"
                        >0.00</span
                      >
                      <span v-else>{{ item.yieldPerDollar }}</span>
                      <small>Ice/day</small>
                      <!-- <div class="pin">{{ item.alloc }}x Multiplier</div>
                    <div class="dashboard-pools-list-item-desc fade-in">
                      {{ item.info.descMultiplier }}
                    </div> -->
                    </div>
                    <div class="d-flex" v-if="item.id === 5">
                      <div class="d-flex flex-column mr-3">
                        <span>{{ item.yieldPerDollar }}</span>
                        <small>Ice/day</small>
                      </div>
                      <div class="d-flex flex-column">
                        <span>{{ item.yieldPerDollarEPS }}</span>
                        <small>EPS/day</small>
                      </div>
                    </div>
                  </div>

                  <div class="dashboard-pools-list-item-3" v-if="item.id !== 5">
                    <span
                      v-if="
                        item.id === 1 &&
                          (info.chain === 'FTM' || info.chain === 'BSC')
                      "
                      >0.00% Annually</span
                    >
                    <span v-if="item.id === 1 && info.chain === 'ETH'"
                      >{{ extractRoi(item.roi, 365) }}%
                      <small>Daily</small></span
                    >
                    <span v-if="item.id === 1 && info.chain === 'ETH'"
                      >{{ extractRoi(item.roi, 7) }}%
                      <small>Weekly</small></span
                    >
                    <span v-if="item.id === 1 && info.chain === 'ETH'"
                      >{{ extractRoi(item.roi) }}% <small>Annually</small></span
                    >

                    <span
                      v-if="
                        item.id !== 1 &&
                          (info.chain !== 'FTM' || info.chain !== 'BSC')
                      "
                      >{{ extractRoi(item.roi, 365) }}%
                      <small>Daily</small></span
                    >
                    <span
                      v-if="
                        item.id !== 1 &&
                          (info.chain !== 'FTM' || info.chain !== 'BSC')
                      "
                      >{{ extractRoi(item.roi, 7) }}%
                      <small>Weekly</small></span
                    >
                    <span
                      v-if="
                        item.id !== 1 &&
                          (info.chain !== 'FTM' || info.chain !== 'BSC')
                      "
                      >{{ extractRoi(item.roi) }}% <small>Annually</small></span
                    >
                  </div>

                  <div class="dashboard-pools-list-item-3" v-if="item.id === 5">
                    <span
                      >{{ calculateRoi(item.roi, item.roiICE, 365) }}%
                      <small>Daily</small></span
                    >
                    <span
                      >{{ calculateRoi(item.roi, item.roiICE, 7) }}%
                      <small>Weekly</small></span
                    >
                    <span
                      >{{ calculateRoi(item.roi, item.roiICE) }}%
                      <small>Annually</small></span
                    >
                  </div>

                  <div class="dashboard-pools-list-item-2">
                    <div class="mini-image">
                      <img
                        :src="getImgUrl(item.images[info.chain])"
                        alt="image"
                        :title="item.token[info.chain]"
                      />
                    </div>
                    <span v-if="item.id === 1 && info.chain === 'ETH'"
                      >${{ item.ttl }}</span
                    >
                    <span v-else>${{ item.tvl ? item.tvl : 0 }}</span>
                  </div>

                  <div
                    class="dashboard-pools-list-item-3 end"
                    v-if="item.allowance"
                  >
                    <!-- <button
                      class="btn-pool"
                      @click="showModal('deposit', item)"
                      :disabled="
                        (item.processingDeposit ||
                          ((item.id === 1 || item.id === 9) &&
                            info.chain === 'BSC')) && hideStakeButtons
                      "
                    >
                      <Loading v-if="item.processingDeposit" />
                      <span v-else>Stake</span>
                    </button> -->
                    <button
                      class="btn-pool"
                      @click="showModal('deposit', item)"
                      :disabled="hideStakeButtons"
                    >
                      <Loading v-if="item.processingDeposit" />
                      <span v-else>Stake</span>
                    </button>
                    <button
                      class="btn-pool"
                      @click="showModal('withdraw', item)"
                      :disabled="item.processingWithdraw"
                    >
                      <Loading v-if="item.processingWithdraw" />
                      <span v-else>Unstake</span>
                    </button>
                  </div>

                  <div
                    class="dashboard-pools-list-item-3 end"
                    v-if="!item.allowance"
                  >
                    <button
                      class="btn-pool"
                      @click="handleJoinToPool(item)"
                      v-if="info.walletConnected"
                    >
                      <span>Join to party</span>
                    </button>
                    <button
                      class="btn-pool"
                      @click="connectWallet()"
                      v-if="!info.walletConnected"
                    >
                      <span>Join to party</span>
                    </button>
                  </div>

                  <div class="exp" v-if="item.id !== 1">
                    <div class="exp-circle" @mouseenter="showExp = item.id">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div
                      class="exp-desc d-flex flex-column"
                      v-if="showExp === item.id"
                      @mouseleave="showExp = false"
                    >
                      <a
                        :href="item.links[info.chain]"
                        target="_blank"
                        v-if="item.links[info.chain]"
                        >Contract</a
                      >
                      <a
                        class="my-1"
                        :href="item.lpsLink[info.chain]"
                        target="_blank"
                        v-if="item.lpsLink[info.chain] && item.id !== 9"
                        >Get LP's</a
                      >

                      <a
                        class="my-1"
                        :href="item.lpsLink[info.chain]"
                        target="_blank"
                        v-if="
                          item.lpsLink[info.chain] &&
                            info.chain === 'BSC' &&
                            item.id === 9
                        "
                        >Migrate</a
                      >
                    </div>
                  </div>
                </div>
              </transition-group>
            </div>
          </template>
        </section>

        <div
          class="spinner-container"
          v-if="!allNetworks && standFilter === 0 && !pools.length"
        >
          <Loading size="big" />
        </div>

        <!-- Popsicle stand projects -->
        <section
          class="dashboard-pools mt-5"
          :style="`${!showActivePools ? 'grid-gap: 0' : ''}`"
          v-if="!allNetworks && standFilter === 1 && projects.length && false"
        >
          <div
            class="dashboard-pools-head fade-in"
            v-if="projects && projects.length"
          >
            <span>pool</span>
            <span>~ yield per $1000</span>
            <span>~ roi</span>
            <span>~ tvl</span>
          </div>
          <div
            class="dashboard-pools-list fade-in"
            v-if="projects && projects.length"
          >
            <transition-group appear @enter="enter" @before-enter="beforeEnter">
              <div
                class="dashboard-pools-list-item"
                v-for="(item, index) in projects"
                :key="item.id"
                :data-delay="index * 0.1"
              >
                <div class="dashboard-pools-list-item-1">
                  <div class="mini-image" v-if="item.images">
                    <img :src="item.images[1]" />
                  </div>
                  <div class="d-flex flex-column">
                    <span>{{ item.name }}</span>
                    <small v-if="info.chain === 'ETH'">Ethereum</small>
                    <small
                      v-if="
                        info.chain === 'BSC' && item.id !== 7 && item.id !== 9
                      "
                      >BSC</small
                    >
                    <small
                      v-if="
                        info.chain === 'BSC' && item.id === 7 && item.id !== 9
                      "
                      >Sushiswap (BSC)</small
                    >
                    <small
                      v-if="
                        info.chain === 'BSC' && item.id !== 7 && item.id === 9
                      "
                      >Pancake V1 (BSC)</small
                    >
                    <small v-if="info.chain === 'FTM'">Fantom</small>
                    <small v-if="info.chain === 'KOVAN'">Kovan</small>
                  </div>
                </div>

                <div class="dashboard-pools-list-item-1">
                  <div class="d-flex flex-column">
                    <span>{{ item.poolYieldICE }}</span>
                    <small>Ice/day</small>
                  </div>
                  <div class="d-flex ml-3">
                    <div class="d-flex flex-column">
                      <span>{{ item.poolYieldLP }}</span>
                      <small>Lp/day</small>
                    </div>
                  </div>
                </div>

                <div class="dashboard-pools-list-item-3">
                  <span>{{ item.table.roi1 }}% <small>Daily</small></span>
                  <span>{{ item.table.roi2 }}% <small>Weekly</small></span>
                  <span>{{ item.table.roi3 }}% <small>Yearly</small></span>
                </div>

                <div class="dashboard-pools-list-item-2">
                  <div class="mini-image" v-if="item.images">
                    <img :src="item.images[2]" />
                  </div>
                  <span>${{ item.table.tvl }}</span>
                </div>

                <div
                  class="dashboard-pools-list-item-3 end"
                  v-if="item.allowance"
                >
                  <button
                    class="btn-pool"
                    @click="showModal('deposit', item)"
                    :disabled="hideStakeButtons"
                  >
                    <Loading v-if="item.processingDeposit" />
                    <span v-else>Stake</span>
                  </button>
                  <button
                    class="btn-pool"
                    @click="showModal('withdraw', item)"
                    :disabled="item.processingWithdraw"
                  >
                    <Loading v-if="item.processingWithdraw" />
                    <span v-else>Unstake</span>
                  </button>
                </div>

                <div
                  class="dashboard-pools-list-item-3 end"
                  v-if="!item.allowance"
                >
                  <button
                    class="btn-pool"
                    @click="handleJoinToProject(item)"
                    v-if="info.walletConnected"
                  >
                    <span>Join to party</span>
                  </button>
                  <button
                    class="btn-pool"
                    @click="connectWallet()"
                    v-if="!info.walletConnected"
                  >
                    <span>Join to party</span>
                  </button>
                </div>
              </div>
            </transition-group>
          </div>

          <!-- no projects -->
          <div
            class="no-projects d-flex align-items-center justify-content-center"
            v-if="!projects.length"
          >
            No projects in Popsicle Stand
          </div>
        </section>

        <div
          class="spinner-container"
          v-if="!allNetworks && standFilter === 1 && !projects.length"
        >
          <Loading size="big" />
        </div>

        <div
          class="dashboard-pools-mob fade-in"
          v-if="!allNetworks && activePools.length"
        >
          <h3 class="pool-stand-title">Active pools</h3>

          <div class="dashboard-pools-mob-head" v-if="showActivePools">
            <span>pool</span>
            <span>~ yield per $1000</span>
            <span>~ roi</span>
            <span>~ tvl</span>
          </div>
          <div class="dashboard-pools-mob-list fade-in" v-if="showActivePools">
            <div
              class="dashboard-pools-mob-list-item"
              v-for="(item, index) in activePools"
              :key="index"
            >
              <div class="items">
                <div class="dashboard-pools-mob-list-item-1 items-item ">
                  <div class="mini-image">
                    <img
                      :src="getImgUrl(item.images[info.chain])"
                      alt="image"
                      title="USDT/BUSD"
                    />
                  </div>
                  <div class="d-flex flex-column align-items-center mt-1">
                    <span>{{ item.token[info.chain] }}</span>
                  </div>
                </div>

                <div class="dashboard-pools-mob-list-item-1 items-item">
                  <div class="d-flex flex-column">
                    <span
                      v-if="
                        item.id === 1 &&
                          (info.chain === 'FTM' || info.chain === 'BSC')
                      "
                      >0.00</span
                    >
                    <span v-else
                      >{{ item.yieldPerDollar }}
                      {{ item.yieldPerDollarEPS }}</span
                    >
                    <small>Ice/day</small>

                    <div
                      class="pin red"
                      v-if="
                        item.id === 1 &&
                          (info.chain === 'FTM' || info.chain === 'BSC')
                      "
                    >
                      Discontinued
                    </div>
                    <div
                      class="dashboard-pools-list-item-desc fade-in"
                      v-if="item.id === 1"
                    >
                      {{ item.descMultiplier }}
                    </div>
                  </div>
                </div>

                <div class="dashboard-pools-mob-list-item-3 items-item">
                  <span
                    v-if="
                      item.id === 1 &&
                        (info.chain === 'FTM' || info.chain === 'BSC')
                    "
                    >0.00% Annually</span
                  >
                  <span v-else>{{ item.roi }}% Annually</span>
                </div>

                <div class="dashboard-pools-mob-list-item-2 items-item">
                  <div class="mini-image">
                    <img
                      :src="getImgUrl(item.images[info.chain])"
                      alt="image"
                      title="USDT/BUSD"
                    />
                  </div>
                  <span class="mt-1">${{ item.tvl }}</span>
                </div>
              </div>

              <div class="buttons">
                <div
                  class="dashboard-pools-mob-list-item-4 end"
                  v-if="item.allowance"
                >
                  <button
                    class="btn-pool"
                    @click="showModal('deposit', item)"
                    :disabled="
                      item.processingDeposit ||
                        (item.id === 1 && info.chain === 'FTM')
                    "
                  >
                    <Loading v-if="item.processingDeposit" />
                    <span v-else>Stake</span>
                  </button>
                  <button
                    class="btn-pool"
                    @click="showModal('withdraw', item)"
                    :disabled="item.processingWithdraw"
                  >
                    <Loading v-if="item.processingWithdraw" />
                    <span v-else>Unstake</span>
                  </button>
                </div>
                <div
                  class="dashboard-pools-list-item-4 end"
                  v-if="!item.allowance"
                >
                  <button class="btn-pool" @click="handleJoinToPool(item)">
                    <span>Join to party</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sweetests pools mobile. blurred class for hide -->
        <div class="dashboard-pools-mob fade-in" v-if="!allNetworks">
          <div class="dashboard-deposited-title">
            <h1>Discontinued pools</h1>
            <div
              class="toggle"
              :class="{ active: showDiscontinued }"
              @click="showDiscontinued = !showDiscontinued"
            >
              <img src="@/assets/images/arrow_down.svg" alt="" />
            </div>
          </div>

          <template v-if="showDiscontinued">
            <div class="dashboard-pools-mob-head" v-if="showActivePools">
              <span>pool</span>
              <span>~ yield per $1000</span>
              <span>~ roi</span>
              <span>~ tvl</span>
            </div>
            <div
              class="dashboard-pools-mob-list fade-in"
              v-if="showActivePools"
            >
              <div
                class="dashboard-pools-mob-list-item"
                v-for="(item, index) in disconnectedPools"
                :key="index"
              >
                <div class="items">
                  <div class="dashboard-pools-mob-list-item-1 items-item ">
                    <div class="mini-image">
                      <img
                        :src="getImgUrl(item.images[info.chain])"
                        alt="image"
                        title="USDT/BUSD"
                      />
                    </div>
                    <div class="d-flex flex-column align-items-center mt-1">
                      <span>{{ item.token[info.chain] }}</span>
                    </div>
                  </div>

                  <div class="dashboard-pools-mob-list-item-1 items-item">
                    <div class="d-flex flex-column">
                      <span
                        v-if="
                          item.id === 1 &&
                            (info.chain === 'FTM' || info.chain === 'BSC')
                        "
                        >0.00</span
                      >
                      <span v-else
                        >{{ item.yieldPerDollar }}
                        {{ item.yieldPerDollarEPS }}</span
                      >
                      <small>Ice/day</small>

                      <div
                        class="pin red"
                        v-if="
                          item.id === 1 &&
                            (info.chain === 'FTM' || info.chain === 'BSC')
                        "
                      >
                        Discontinued
                      </div>
                      <div
                        class="dashboard-pools-list-item-desc fade-in"
                        v-if="item.id === 1"
                      >
                        {{ item.descMultiplier }}
                      </div>
                    </div>
                  </div>

                  <div class="dashboard-pools-mob-list-item-3 items-item">
                    <span
                      v-if="
                        item.id === 1 &&
                          (info.chain === 'FTM' || info.chain === 'BSC')
                      "
                      >0.00% Annually</span
                    >
                    <span v-else>{{ item.roi }}% Annually</span>
                  </div>

                  <div class="dashboard-pools-mob-list-item-2 items-item">
                    <div class="mini-image">
                      <img
                        :src="getImgUrl(item.images[info.chain])"
                        alt="image"
                        title="USDT/BUSD"
                      />
                    </div>
                    <span class="mt-1">${{ item.tvl }}</span>
                  </div>
                </div>

                <div class="buttons">
                  <div
                    class="dashboard-pools-mob-list-item-4 end"
                    v-if="item.allowance"
                  >
                    <!-- <button
                      class="btn-pool"
                      @click="showModal('deposit', item)"
                      :disabled="
                        (item.processingDeposit ||
                          (item.id === 1 && info.chain === 'FTM')) && hideStakeButtons
                      "
                    >
                      <Loading v-if="item.processingDeposit" />
                      <span v-else>Stake</span>
                    </button> -->

                    <button
                      class="btn-pool"
                      @click="showModal('deposit', item)"
                      :disabled="hideStakeButtons"
                    >
                      <Loading v-if="item.processingDeposit" />
                      <span v-else>Stake</span>
                    </button>
                    <button
                      class="btn-pool"
                      @click="showModal('withdraw', item)"
                      :disabled="item.processingWithdraw"
                    >
                      <Loading v-if="item.processingWithdraw" />
                      <span v-else>Unstake</span>
                    </button>
                  </div>
                  <div
                    class="dashboard-pools-list-item-4 end"
                    v-if="!item.allowance"
                  >
                    <button class="btn-pool" @click="handleJoinToPool(item)">
                      <span>Join to party</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Overview. All networks -->
        <section
          class="dashboard-overview blurred fade-in"
          v-if="allNetworks && showOverview"
        >
          <div class="dashboard-overview-head">
            <div class="title">
              <h1>Account overview</h1>
              <h2 @click="(showOverview = false), (showTransactions = true)">
                Transactions
              </h2>
            </div>
            <main>
              <transition
                appear
                @enter="enterDash"
                @beforeEnter="beforeEnterDash"
              >
                <div class="box">
                  <div class="circle">
                    <img src="@/assets/images/dashboard/wallet.svg" alt="" />
                  </div>
                  <h1>$0.00</h1>
                  <small>Wallet balance</small>
                </div>
              </transition>

              <transition
                appear
                @enter="enterDash"
                @beforeEnter="beforeEnterDash"
              >
                <div class="box" data-position="top">
                  <div class="circle">
                    <img src="@/assets/images/dashboard/liquidity.svg" alt="" />
                  </div>
                  <h1>$0.00</h1>
                  <small>Liquidity Pools</small>
                </div>
              </transition>

              <transition
                appear
                @enter="enterDash"
                @beforeEnter="beforeEnterDash"
              >
                <div class="box" data-position="right">
                  <div class="circle">
                    <img src="@/assets/images/dashboard/staked.svg" alt="" />
                  </div>
                  <h1>${{ getAllPoolsBalanceInDollar() }}</h1>
                  <small>Staked</small>
                </div>
              </transition>
            </main>
          </div>
          <div class="dashboard-overview-platforms">
            <div class="networks">
              <div class="title">
                <h1>Networks</h1>
              </div>
              <div class="list">
                <div class="list-item">
                  <div class="circle">
                    <img src="@/assets/images/networks/eth.svg" alt="" />
                  </div>
                  <div class="data">
                    <h1>Ethereum</h1>
                    <span>9.098</span>
                  </div>
                </div>
                <div class="list-item">
                  <div class="circle">
                    <img src="@/assets/images/networks/bsc.svg" alt="" />
                  </div>
                  <div class="data">
                    <h1>Binance Smart Chain</h1>
                    <span>9.098</span>
                  </div>
                </div>
                <div class="list-item">
                  <div class="circle">
                    <img src="@/assets/images/networks/fantom.svg" alt="" />
                  </div>
                  <div class="data">
                    <h1>Fantom Opera</h1>
                    <span>9.098</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="platforms">
              <div class="title">
                <h1>Platforms</h1>
              </div>
              <div class="list">
                <div class="list-item">
                  <img src="@/assets/images/tokens/ice.svg" alt="" />
                  <h1>Popsicle</h1>
                </div>
              </div>
            </div>
          </div>
          <div class="dashboard-overview-allocation">
            <div class="title">
              <h1>Asset allocation</h1>
            </div>
            <main>
              <div class="chart">
                <Chart />
              </div>
              <div class="list">
                <div class="list-item">
                  <div class="left">
                    <div class="circle">
                      <img src="@/assets/images/dashboard/wallet.svg" alt="" />
                    </div>
                    <span>staked</span>
                  </div>
                  <div class="right">
                    <span>40%</span>
                    <img src="@/assets/images/dashboard/circle.svg" alt="" />
                  </div>
                </div>
                <div class="list-item">
                  <div class="left">
                    <div class="circle">
                      <img src="@/assets/images/dashboard/wallet.svg" alt="" />
                    </div>
                    <span>staked</span>
                  </div>
                  <div class="right">
                    <span>40%</span>
                    <img src="@/assets/images/dashboard/circle.svg" alt="" />
                  </div>
                </div>
                <div class="list-item">
                  <div class="left">
                    <div class="circle">
                      <img src="@/assets/images/dashboard/wallet.svg" alt="" />
                    </div>
                    <span>staked</span>
                  </div>
                  <div class="right">
                    <span>40%</span>
                    <img src="@/assets/images/dashboard/circle.svg" alt="" />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </section>

        <!-- Transactions -->
        <section
          class="dashboard-transactions fade-in"
          v-if="allNetworks && showTransactions"
        >
          <div class="dashboard-transactions-title">
            <h1>Transactions</h1>
            <div
              class="overview"
              @click="(showTransactions = false), (showOverview = true)"
            >
              <h1>Overview</h1>
            </div>
          </div>
          <div class="dashboard-transactions-head fade-in">
            <span>pool</span>
            <span>action</span>
            <span>amount</span>
            <span>from/to</span>
          </div>
          <div class="dashboard-transactions-list fade-in">
            <div
              class="dashboard-transactions-list-item"
              v-for="item in 4"
              :key="item"
            >
              <div class="dashboard-transactions-list-item-1">
                <img
                  src="@/assets/images/pairs/USDT_BUSD.svg"
                  alt="image"
                  title="USDT/BUSD"
                />
                <span>Tether</span>
                <small>Binance</small>
              </div>
              <div class="dashboard-transactions-list-item-1">
                <img src="@/assets/images/recive.svg" alt="ice" />
                <div class="d-flex flex-column">
                  <span>Recive</span>
                  <small>Mar 12, 10:00 pm </small>
                </div>
              </div>
              <div class="dashboard-transactions-list-item-2">
                <img src="@/assets/images/plus.svg" alt="svg" />
                <span>+10.654 USDT</span>
              </div>
              <div class="dashboard-transactions-list-item-3">
                <span>From</span>
                <small>0xe0f1...caw9</small>
              </div>
              <div class="dashboard-transactions-list-item-3 end">
                <button class="btn-explorer">
                  <span>Explorer</span>
                  <img src="@/assets/images/arrow_up.svg" alt="" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Modals -->
      <ModalLayout
        :pool="currentPool"
        :selectedBalance="selectedBalance"
        :activePoint="activePoint"
        :selectedText="selectedText"
        :epsRewards="currentPool.epsRewards"
        @deposit="handleDeposit"
        @depositStand="handleDepositStand"
        @withdraw="handleWithdraw"
        @withdrawStand="handleWithdrawStand"
        @toggleNetwork="handleToggleNetwork"
        @harvestEPS="handleHarvestEPS"
        @harvestICE="handleHarvestICE"
      />
    </template>
    <div class="empty-block" v-if="!loaded">
      <Loading size="big" />
    </div>
    <div class="error-wrapper" v-else-if="standErrorMsg">
      <Error :errorText="standErrorMsg" />
    </div>
  </div>
</template>

<script>
import global from "@/mixins/global";
import gsap from "gsap";
const Error = () => import("@/components/ui/Error");

// prod
export default {
  name: "Deposit",
  mixins: [global],
  data: () => ({
    showMenu: false,
    showSelect: false,
    loaded: false,

    standErrorMsg: "",

    wallet: null,

    showActivePools: true,
    showDeposited: true,
    showDiscontinued: false,

    hideStakeButtons: true,

    allNetworks: false,
    currentNetwork:
      localStorage.getItem("network") === "bsc"
        ? 2
        : localStorage.getItem("network") === "eth"
        ? 1
        : 3,

    showOverview: true,
    showTransactions: false,

    projects: [],

    standFilter: 0,
  }),
  computed: {
    chainId() {
      return this.$store.getters.getChain;
    },
    userAccount() {
      return this.$store.getters.getAddress;
    },
    openPools() {
      return this.pools.filter((pool) => +pool.deposited > 0);
    },
    activePools() {
      let acceptedIds = [10, 11, 12, 13, 14, 15];

      return this.pools.filter((item) => acceptedIds.indexOf(item.id) !== -1);
    },
    disconnectedPools() {
      let acceptedIds = [10, 11, 12, 13, 14, 15];

      return this.pools.filter((item) => acceptedIds.indexOf(item.id) === -1);
    },
  },
  async created() {
    this.loaded = false;
    if (!this.userAccount) {
      this.standErrorMsg = "Please connect to use Stand";
      this.loaded = true;
    }

    const acceptedChains = [56, 1, 250];

    const isChainAccept = acceptedChains.indexOf(this.chainId) !== -1;

    console.log("isChainAccept", isChainAccept);

    if (!isChainAccept) {
      this.standErrorMsg = "The stand is not active on this network";
      this.loaded = true;
    }

    if (!this.$farm3.isSetup) {
      await this.$farm3.setup();
    }

    await this.updateAll();
    this.loaded = true;

    this.updateInterval = setInterval(async () => {
      const info = await this.updateAll();

      this.projects = this.$farm_v2.projects;

      if (!info) {
        $("#modal_erc").modal("show");
        this.loaded = false;
        clearInterval(this.updateInterval);
      }
    }, 15000);
  },
  beforeRouteLeave(to, from, next) {
    this.updateInterval = null;
    next();
  },
  methods: {
    handleToggleMenu() {
      this.showMenu = !this.showMenu;
    },

    handleToggleSelect() {
      this.showSelect = !this.showSelect;
    },
    // Animations
    enterDash(el) {
      const position = el.dataset.position ? el.dataset.position : "left";

      el.style.opacity = 0;

      switch (position) {
        case "left":
          el.style.transform = "translateX(-40px)";
          break;
        case "right":
          el.style.transform = "translateX(40px)";
          break;
        case "top":
          el.style.transform = "translateY(-40px)";
          break;
        case "bottom":
          el.style.transform = "translateY(40px)";
          break;
        default:
          break;
      }
    },

    beforeEnterDash(el, done) {
      gsap.to(el, {
        x: 0,
        y: 0,
        opacity: 1,
        delay: el.dataset.delay,
        duration: 0.5,
        onComplete: done,
      });
    },

    async handleRefreshData(point) {
      const networks = {
        1: "Ethereum Mainnet",
        2: "Smart Chain",
        3: "Fantom Opera Mainnet",
        4: "Kovan",
      };

      const status = await this.handleToggleNetwork({
        name: networks[point],
        point,
      });

      if (status) {
        this.currentNetwork = point;
        this.allNetworks = false;
      }

      if (point === 1) {
        $("#modal_erc").modal("show");
      }
    },

    getBalanceInDollar(pool) {
      let balance = parseFloat(pool.deposited);
      let price, result;

      if (pool.id === 0) price = parseFloat(pool.icePrice);
      if (pool.id === 1) price = 1;
      if (pool.id === 2) price = parseFloat(pool.lpPrice);
      if (pool.id === 3) {
        price = parseFloat("1.01");
      }
      if (pool.id === 4) {
        price = parseFloat(pool.yusdtPrice);
      }
      if (pool.id === 5) {
        price = parseFloat(0.96).toFixed(2);
      }
      if (pool.id === 7 || pool.id === 10 || pool.id === 12 || pool.id === 14) {
        price = parseFloat(pool.lpPrice).toFixed(2);
      }
      if (pool.id === 9 || pool.id === 11 || pool.id === 13 || pool.id === 15) {
        price = parseFloat(pool.lpPrice).toFixed(2);
      }

      result = parseFloat(balance * price).toFixed(2);

      return result;
    },

    getAllPoolsBalanceInDollar() {
      let all = 0;

      for (let i = 0; i < this.pools.length; i++) {
        const pool = this.pools[i];

        let balance = parseFloat(pool.deposited);
        let price, result;

        if (pool.id === 0) price = parseFloat(pool.icePrice);
        if (pool.id === 1) price = 1;
        if (pool.id === 2) price = parseFloat(pool.lpPrice);
        if (pool.id === 3) {
          price = parseFloat("1.01");
        }
        if (pool.id === 4) {
          price = parseFloat(pool.yusdtPrice);
        }
        if (pool.id === 5) {
          price = parseFloat(0.96).toFixed(2);
        }
        if (pool.id === 7) {
          price = parseFloat(pool.lpPrice).toFixed(2);
        }
        if (pool.id === 9) {
          price = parseFloat(pool.lpPrice).toFixed(2);
        }

        result = parseFloat(balance * price).toFixed(2);

        all += balance * price;
      }

      return parseFloat(all).toFixed(2);
    },

    getHarvestCount() {
      const pools = this.pools;
      let count = 0;

      for (let i = 0; i < pools.length; i++) {
        if (parseFloat(pools[i].deposited) > 0) count++;
      }

      return count;
    },
    async handleJoinToProject(project) {
      await project.approve();
    },
  },
  components: {
    Error,
  },
};
</script>

<style lang="scss" scoped src="@/assets/scss/views/stand.scss"></style>
