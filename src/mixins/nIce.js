import stakeInfo from "@/utils/nIce/nIceConfig";
import { tokenPrices } from "@/farm/helpers";
import networks from "@/farm/networks";
import { numberWithCommas } from "@/farm/helpers";

export default {
    computed: {
      chainId() {
          return this.$store.getters.getChain;
      },
      userAccount() {
          return this.$store.getters.getAddress;
      }
  },
    methods: {
        async createNIceStakePool() {
          if (!stakeInfo) {
            return false;
          }

          const userAccount = this.userAccount

          if(!userAccount) {
              this.nIceError = 'Please Connect Wallet';
              return false
          }

          if(this.chainId !== 1) {
              this.nIceError = 'nICE is not available on this chain. Please switch to Ethereum Mainnet.';
              return false;
          }

          const userSigner = this.$store.getters.getSigner;
    
          const { mainToken, stakeToken } = stakeInfo;
    
          const mainTokenInstance = new this.$ethers.Contract(
            mainToken.address,
            JSON.stringify(mainToken.abi),
            userSigner
          );
    
          const stakeTokenInstance = new this.$ethers.Contract(
            stakeToken.address,
            JSON.stringify(stakeToken.abi),
            userSigner
          );
          
          let userMainBalance = await mainTokenInstance.balanceOf(
            userAccount
          );

          userMainBalance = this.$ethers.utils.formatEther(userMainBalance.toString());

          let userStakeBalance = await stakeTokenInstance.balanceOf(
            userAccount
          );

          userStakeBalance = this.$ethers.utils.formatEther(userStakeBalance.toString());

          const tokensRate = await this.getTokensRate(mainTokenInstance, stakeTokenInstance);

          const isTokenApprowed = await this.isTokenApprowed(stakeTokenInstance, userAccount, mainToken.address);

          const { apr, tvl, iceAmount } =  await this.getNiceApr(mainTokenInstance, stakeTokenInstance);
    
          const stakeObject = {
            tokensRate,
            apr,
            tvl: numberWithCommas(tvl),
            iceAmount: numberWithCommas(iceAmount),
            mainToken: {
              ...mainToken,
              contractInstance: mainTokenInstance,
              userBalance: userMainBalance,
            },
            stakeToken: {
              ...stakeToken,
              contractInstance: stakeTokenInstance,
              userBalance: userStakeBalance,
              isTokenApprowed
            },
          };
    
          console.log("STAKE TOKEN:", stakeObject);
          this.$store.commit("setNIceStakeObject", stakeObject);
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
        async getTokensRate(mainTokenContract, stakeTokenContract) {
          try {
            const mainBalance = await stakeTokenContract.balanceOf(
              mainTokenContract.address
            );
            const totalSupply = await mainTokenContract.totalSupply();
    
            const parsedBalance = this.$ethers.utils.formatEther(
              mainBalance.toString()
            );

            const parsedTotalSupply = this.$ethers.utils.formatEther(totalSupply);
    
            const tokenRate = parsedTotalSupply / parsedBalance;
    
            return tokenRate;
          } catch (e) {
            console.log("getUserBalance err:", e);
          }
        },
        async getNiceApr(mainTokenContract, stakeTokenContract) {
          try {
            const strangeNumber = this.$ethers.BigNumber.from("593482642777155655095184")
            const iceTokenAmount = this.$ethers.BigNumber.from("17076257322489032349389").add(this.$ethers.BigNumber.from("2266302074819398101962"));

            let icePrice = await tokenPrices(['ice']);
            icePrice = icePrice.ice;

            let icePer1000Bucks = this.$ethers.utils.parseUnits(parseFloat(1000/icePrice).toFixed(18), 18);

            let totalTokens = await stakeTokenContract.balanceOf(mainTokenContract.address);

            const nIceTLV = this.$ethers.utils.formatUnits(totalTokens, 18);
            const iceAmount = this.$ethers.utils.formatUnits(iceTokenAmount, 18)  * icePrice;

            let totalSupply = await mainTokenContract.totalSupply();

            let shares = totalSupply.eq(0) ? icePer1000Bucks : icePer1000Bucks.mul(totalSupply).div(totalTokens);

            totalTokens = totalTokens.add(icePer1000Bucks).add(strangeNumber)
            totalSupply = totalSupply.add(shares)

            let amount = shares.mul(totalTokens).div(totalSupply);

            let withdrawInUsd = this.$ethers.utils.formatUnits(amount, 18)  * icePrice;

            const apr = (withdrawInUsd * 100) / 1000;

            return {
              apr: parseFloat(apr - 100).toFixed(2),
              tvl: parseFloat(nIceTLV).toFixed(2),
              iceAmount: parseFloat(iceAmount).toFixed(2),
            }
          } catch(e) {
            console.log("getNiceApr err:", e)
          }
        }
      },
}