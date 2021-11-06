// BSC chain
export const BSC_CHAIN = {
  chainId: "0x38",
  chainName: "Smart Chain",

  rpcUrls: [
    "https://bsc-dataseed1.defibit.io/",
    "https://bsc-dataseed1.ninicoin.io/",
    "https://bsc-dataseed.binance.org/",
  ],

  iconUrls: ["https://bscscan.com/images/svg/brands/bnb.svg?v=1.3"],

  blockExplorerUrls: ["https://bscscan.com/"],

  nativeCurrency: {
    name: "Binance Coin",
    symbol: "BNB",
    decimals: 18,
  },
};

export const BSC_TESTNET_CHAIN = {
  chainName: "Binance Smart Chain Testnet",
  chainId: "0x61",
  nativeCurrency: {
    name: "Binance Chain Native Token",
    symbol: "tBNB",
    decimals: 18,
  },
  rpcUrls: [
    "https://data-seed-prebsc-1-s1.binance.org:8545",
    "https://data-seed-prebsc-2-s1.binance.org:8545",
    "https://data-seed-prebsc-1-s2.binance.org:8545",
    "https://data-seed-prebsc-2-s2.binance.org:8545",
    "https://data-seed-prebsc-1-s3.binance.org:8545",
    "https://data-seed-prebsc-2-s3.binance.org:8545",
  ],
};

// Fantom chain
export const FTM_CHAIN = {
  chainId: "0xfa",
  chainName: "Fantom Opera Mainnet",

  rpcUrls: ["https://rpcapi.fantom.network/", "https://rpc.fantom.network/"],

  iconUrls: ["https://ftmscan.com/images/logo-ftmscan.svg?v=0.0.2"],

  blockExplorerUrls: ["https://ftmscan.com/"],

  nativeCurrency: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
  },
};

// Ethereum chain
export const ETH_CHAIN = {
  chainId: "0x1",
  chainName: "Ethereum Mainnet",

  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },

  rpcUrls: [
    "https://api.mycryptoapi.com/eth",
    "https://cloudflare-eth.com",
    "https://mainnet.infura.io/v3/64605acdc87b4dc996b12bc163271731",
    "https://rinkeby.infura.io/v3/64605acdc87b4dc996b12bc163271731",
  ],
};
