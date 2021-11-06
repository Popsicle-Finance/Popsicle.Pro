export default {
    data() {
      return {
        networksData: [
          {
            chainId: "0x38",
            decimalsId: "56",
            chainName: "Binance Smart Chain",
            nativeCurrency: {
              name: "BNB",
              symbol: "BNB",
              decimals: 18,
            },
            rpcUrls: [
              "https://bsc-dataseed.binance.org/",
              "https://bsc-dataseed1.defibit.io/",
              "https://bsc-dataseed1.ninicoin.io/",
            ],
            blockExplorerUrls: ["https://bscscan.com"],
            iconUrls: [
              "https://s2.coinmarketcap.com/static/img/coins/200x200/1839.png",
            ],
          },
          {
            chainId: "0xfa",
            decimalsId: "250",
            chainName: "Fantom Opera Mainnet",
  
            rpcUrls: [
              "https://rpcapi.fantom.network/",
              "https://rpc.fantom.network/",
            ],
  
            iconUrls: ["https://ftmscan.com/images/logo-ftmscan.svg?v=0.0.2"],
  
            blockExplorerUrls: ["https://ftmscan.com/"],
  
            nativeCurrency: {
              name: "Fantom",
              symbol: "FTM",
              decimals: 18,
            },
          },
          {
            chainId: "0x89",
            decimalsId: "137",
            chainName: "Polygon Mainnet",
  
            rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
  
            iconUrls: ["https://polygonscan.com/images/svg/brands/polygon.svg"],
  
            blockExplorerUrls: ["https://polygonscan.com/"],
  
            nativeCurrency: {
              name: "Polygon",
              symbol: "MATIC",
              decimals: 18,
            },
          },
          {
            chainId: "0xa86a",
            decimalsId: "43114",
            chainName: "Avalanche Mainnet",
  
            rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
  
            blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
          },
          {
            chainId: "0xa4b1",
            decimalsId: "42161",
            chainName: "Arbitrum One",
  
            rpcUrls: ["https://arb1.arbitrum.io/rpc"],
  
            blockExplorerUrls: ["https://arbiscan.io"],
          },
        ],
      };
    },
    methods: {
      async switchNetwork(decimalsId) {
        if (decimalsId == "1") {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [
                {
                  chainId: "0x1",
                },
              ],
            });
  
            return false;
          } catch (e) {
            console.log("To switch to Ethereum Mainnet, use metamask");
            return false;
          }
        }
  
        const data = this.networksData.find(
          (item) => item.decimalsId == decimalsId
        );
        
        const finalData = {...data}
        delete finalData.decimalsId;
  
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [finalData],
          });
  
          return false;
        } catch (e) {
          console.log("To switch to Ethereum Mainnet, use metamask");
          return false;
        }
      },
    },
  };
  