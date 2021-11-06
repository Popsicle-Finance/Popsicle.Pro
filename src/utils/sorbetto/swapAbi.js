export default [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "string",
          name: "reason",
          type: "string",
        },
      ],
      name: "Error",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "contract IERC20",
          name: "srcToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "contract IERC20",
          name: "dstToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "dstReceiver",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "spentAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "returnAmount",
          type: "uint256",
        },
      ],
      name: "Swapped",
      type: "event",
    },
    {
      inputs: [],
      name: "destroy",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "contract IAggregationExecutor",
          name: "caller",
          type: "address",
        },
        {
          components: [
            {
              internalType: "contract IERC20",
              name: "srcToken",
              type: "address",
            },
            {
              internalType: "contract IERC20",
              name: "dstToken",
              type: "address",
            },
            {
              internalType: "address",
              name: "srcReceiver",
              type: "address",
            },
            {
              internalType: "address",
              name: "dstReceiver",
              type: "address",
            },
            { internalType: "uint256", name: "amount", type: "uint256" },
            {
              internalType: "uint256",
              name: "minReturnAmount",
              type: "uint256",
            },
            { internalType: "uint256", name: "flags", type: "uint256" },
            { internalType: "bytes", name: "permit", type: "bytes" },
          ],
          internalType: "struct AggregationRouterV3.SwapDescription",
          name: "desc",
          type: "tuple",
        },
        { internalType: "bytes", name: "data", type: "bytes" },
      ],
      name: "discountedSwap",
      outputs: [
        {
          internalType: "uint256",
          name: "returnAmount",
          type: "uint256",
        },
        { internalType: "uint256", name: "gasLeft", type: "uint256" },
        { internalType: "uint256", name: "chiSpent", type: "uint256" },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "contract IERC20",
          name: "token",
          type: "address",
        },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "rescueFunds",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "contract IAggregationExecutor",
          name: "caller",
          type: "address",
        },
        {
          components: [
            {
              internalType: "contract IERC20",
              name: "srcToken",
              type: "address",
            },
            {
              internalType: "contract IERC20",
              name: "dstToken",
              type: "address",
            },
            {
              internalType: "address",
              name: "srcReceiver",
              type: "address",
            },
            {
              internalType: "address",
              name: "dstReceiver",
              type: "address",
            },
            { internalType: "uint256", name: "amount", type: "uint256" },
            {
              internalType: "uint256",
              name: "minReturnAmount",
              type: "uint256",
            },
            { internalType: "uint256", name: "flags", type: "uint256" },
            { internalType: "bytes", name: "permit", type: "bytes" },
          ],
          internalType: "struct AggregationRouterV3.SwapDescription",
          name: "desc",
          type: "tuple",
        },
        { internalType: "bytes", name: "data", type: "bytes" },
      ],
      name: "swap",
      outputs: [
        {
          internalType: "uint256",
          name: "returnAmount",
          type: "uint256",
        },
        { internalType: "uint256", name: "gasLeft", type: "uint256" },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "newOwner", type: "address" },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "contract IERC20",
          name: "srcToken",
          type: "address",
        },
        { internalType: "uint256", name: "amount", type: "uint256" },
        { internalType: "uint256", name: "minReturn", type: "uint256" },
        { internalType: "bytes32[]", name: "", type: "bytes32[]" },
      ],
      name: "unoswap",
      outputs: [
        {
          internalType: "uint256",
          name: "returnAmount",
          type: "uint256",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "contract IERC20",
          name: "srcToken",
          type: "address",
        },
        { internalType: "uint256", name: "amount", type: "uint256" },
        { internalType: "uint256", name: "minReturn", type: "uint256" },
        { internalType: "bytes32[]", name: "pools", type: "bytes32[]" },
        { internalType: "bytes", name: "permit", type: "bytes" },
      ],
      name: "unoswapWithPermit",
      outputs: [
        {
          internalType: "uint256",
          name: "returnAmount",
          type: "uint256",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    { stateMutability: "payable", type: "receive" },
  ]