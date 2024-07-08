const ethers = require("ethers");

const bridgeToL2pass_ABI = [
  {
    inputs: [],
    name: "ReentrancyError",
    type: "error",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "srcToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint64",
            name: "dstChainId",
            type: "uint64",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "plexusData",
            type: "bytes",
          },
        ],
        internalType: "struct IBridge.BridgeData",
        name: "_bridgeData",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "_nativeForDst",
        type: "uint256",
      },
    ],
    name: "bridgeToL2pass",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_nativeForDst",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "estimateGasRefuelFee",
    outputs: [
      {
        internalType: "uint256",
        name: "nativeFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "zroFee",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
    ],
    name: "getChainId",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
    ],
    name: "getNativeCap",
    outputs: [
      {
        internalType: "uint128",
        name: "",
        type: "uint128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256",
          },
          {
            internalType: "uint16",
            name: "layerZeroChainId",
            type: "uint16",
          },
        ],
        internalType: "struct L2passFacet.ChainId[]",
        name: "_chains",
        type: "tuple[]",
      },
    ],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_l2pass",
        type: "address",
      },
      {
        internalType: "address",
        name: "_executor",
        type: "address",
      },
    ],
    name: "initExecutor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "router",
            type: "address",
          },
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            components: [
              {
                internalType: "address",
                name: "srcToken",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            internalType: "struct InputToken[]",
            name: "input",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "address",
                name: "dstToken",
                type: "address",
              },
            ],
            internalType: "struct OutputToken[]",
            name: "output",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            internalType: "struct DupToken[]",
            name: "dup",
            type: "tuple[]",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "feeToken",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "plexusData",
            type: "bytes",
          },
        ],
        internalType: "struct SwapData",
        name: "_swap",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "srcToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint64",
            name: "dstChainId",
            type: "uint64",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "plexusData",
            type: "bytes",
          },
        ],
        internalType: "struct IBridge.BridgeData",
        name: "_bridgeData",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "_nativeForDst",
        type: "uint256",
      },
    ],
    name: "swapAndBridgeToL2pass",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
const bridge_Iface = new ethers.utils.Interface(bridgeToL2pass_ABI);

// Example encoded data (replace this with the actual data you want to decode)
const encodedData =
  "0xe6dea50200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000009f38e68c39fed330000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000009693c9422db4100000000000000000000000000000000000000000000000000000000000000890000000000000000000000009522261525df0ef42ad8297a152091b480af34da00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000x9549a4a30000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000002445b4979c300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000180000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000890000000000000000000000009522261525df0ef42ad8297a152091b480af34da00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002438643066656234352d656434322d343030302d616165622d316334313363396138663734000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001690ddaa6bbf800000000000000000000000000000000000000000000000000000000665ec94f00000000000000000000000000000000000000000000000000000000000000a0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001c45f796fde00000000000000000000000000000000000000000000000000000000000000809194494db732f9106e1001e20ee200744782f9b237f29e6932de5ff6c3948ac10000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa84174000000000000000000000000000000000000000000000000000000000001f5e6000000000000000000000000fd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9000000000000000000000000000000000000000000000000000000000098968000000000000000000000000000000000000000000000000000000000000000890000000000000000000000009522261525df0ef42ad8297a152091b480af34da00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002438643066656234352d656434322d343030302d616165622d3163343133633961386637340000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002430626461663130352d613565372d343339612d383330312d66666130613433643731646500000000000000000000000000000000000000000000000000000000";

// Decode the data
const decodedData = bridge_Iface.decodeFunctionData(
  "bridgeToL2pass",
  encodedData
);
// Print the decoded data
console.log("decodedData", decodedData);
// console.log(decodedData.thetas[1]);

/**
 * msg.value 2646255764846254
 * bridgeData.amount 2648983694662465
 *
 *
 *
 */
