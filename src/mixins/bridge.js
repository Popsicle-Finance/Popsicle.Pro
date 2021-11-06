import bridgeConfig from "@/utils/bridge/bridgeConfig";
import bridgeToken from "@/utils/bridge/bridgeToken";
import { mapGetters } from "vuex";

import moment from "moment";

export default {
  computed: {
    ...mapGetters({
      chainId: "getChain",
      signer: "getSigner",
      account: "getAddress",
    }),
  },
  methods: {
    async createBridgeConfig() {
      const tokenInfo = bridgeToken.find(
        (item) => item.chainId == this.chainId
      );

      if (!tokenInfo) {
        console.log("no tokenInfo");
        return false;
      }

      const bridgeInfo = bridgeConfig.find(
        (item) => item.chainId == this.chainId
      );

      if (!bridgeInfo) {
        console.log("no bridgeInfo");
        return false;
      }

      const contractInstance = new this.$ethers.Contract(
        bridgeInfo.contract.address,
        JSON.stringify(bridgeInfo.contract.abi),
        this.signer
      );

      const tokenContractInstance = new this.$ethers.Contract(
        tokenInfo.address,
        JSON.stringify(tokenInfo.abi),
        this.signer
      );

      const balance = await this.getUserBalance(tokenContractInstance);

      const fromChains = bridgeConfig.map((configItem) => {
        return {
          chainId: configItem.chainId,
          title: configItem.chainName,
          icon: configItem.chainIcon,
        };
      });

      const toChains = bridgeInfo.chainsInfo.map((chainItem) => {
        return {
          chainId: chainItem.chainId,
          title: chainItem.name,
          icon: chainItem.icon,
        };
      });

      const isTokenApprove = await this.isTokenApprowed(
        tokenContractInstance,
        this.account,
        bridgeInfo.contract.address
      );

      let lockedUntil = false;
      
      const bridgeObject = {
        contractInstance,
        methodName: bridgeInfo.methodName,
        balance,
        isTokenApprove,
        tokenContractInstance,
        chainsInfo: bridgeInfo.chainsInfo,
        fromChains,
        toChains,
        tokenInfo,
        lockedUntil
      };

      if(tokenInfo.name === 'nICE' && this.chainId === 1) {
        lockedUntil = await this.getUserLocked(tokenContractInstance);
      }

      bridgeObject.lockedUntil = lockedUntil

      this.$store.commit("setBridgeObject", bridgeObject);
    },

    async getUserBalance(tokenContract) {
      try {
        const userBalance = await tokenContract.balanceOf(this.account, {
          gasLimit: 600000,
        });

        return this.$ethers.utils.formatUnits(userBalance, 18);
      } catch (e) {
        console.log("userBalance Err:", e);
      }
    },

    async isTokenApprowed(tokenContract, userAddr, approveAddr) {
      try {
        const addressApprowed = await tokenContract.allowance(
          userAddr,
          approveAddr,
          {
            gasLimit: 1000000,
          }
        );

        return parseFloat(addressApprowed.toString()) > 0;
      } catch (e) {
        console.log("SPELL isApprowed err:", e);
        return false;
      }
    },
    async approveToken(tokenContract, spenderAddress) {
      console.log(tokenContract, spenderAddress);
      try {
        const estimateGas = await tokenContract.estimateGas.approve(
          spenderAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await tokenContract.approve(
          spenderAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          {
            gasLimit,
          }
        );
        const receipt = await tx.wait();

        console.log("APPROVE RESP:", receipt);

        return true;
      } catch (e) {
        console.log("approveToken err:", e);
        return false;
      }
    },
    async getUserLocked(contractInstance) {
      try {
        const infoResp = await contractInstance.users(
          this.account,
          {
            gasLimit: 1000000,
          }
        );

        const lockTimestamp = infoResp.lockedUntil.toString();

        const currentTimestamp = moment()
          .unix()
          .toString();

        if (lockTimestamp && lockTimestamp > currentTimestamp)
          return lockTimestamp;
        return false;
      } catch (e) {
        console.log("isApprowed err:", e);
      }
    },
  },
};
