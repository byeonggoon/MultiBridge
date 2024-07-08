const ethers = require("ethers");

const thetaV2_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_plexus",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "MISSMATCH",
    type: "error",
  },
  {
    inputs: [],
    name: "MORE_VALUE",
    type: "error",
  },
  {
    inputs: [],
    name: "MUST_ALLOWED",
    type: "error",
  },
  {
    inputs: [],
    name: "NOT_CORRECT_RATE",
    type: "error",
  },
  {
    inputs: [],
    name: "NotSupported",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "SWAP_FAILED",
    type: "error",
  },
  {
    inputs: [],
    name: "THETA_V2_FAILED",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddr",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "srcToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fromAmount",
        type: "uint256",
      },
    ],
    name: "EachBridge",
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
        name: "user",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "dstToken",
            type: "address",
          },
        ],
        indexed: true,
        internalType: "struct OutputToken[]",
        name: "srcToken",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "fromAmount",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "string",
        name: "bridge",
        type: "string",
      },
    ],
    name: "WholeTheta",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "EmergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "PLEXUS",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_dex",
        type: "address[]",
      },
    ],
    name: "addDex",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_dex",
        type: "address",
      },
    ],
    name: "dexCheck",
    outputs: [
      {
        internalType: "bool",
        name: "result",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_dex",
        type: "address",
      },
    ],
    name: "getProxy",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_selector",
        type: "bytes4",
      },
    ],
    name: "getSelectorChecker",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_dex",
        type: "address[]",
      },
    ],
    name: "removeDex",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4[]",
        name: "_selector",
        type: "bytes4[]",
      },
      {
        internalType: "address[]",
        name: "_selectorAddr",
        type: "address[]",
      },
    ],
    name: "removeSelector",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "address",
        name: "_dex",
        type: "address",
      },
      {
        internalType: "address",
        name: "_proxy",
        type: "address",
      },
    ],
    name: "setProxy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4[]",
        name: "_selector",
        type: "bytes4[]",
      },
      {
        internalType: "address[]",
        name: "_selectorAddr",
        type: "address[]",
      },
    ],
    name: "setSelector",
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
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct ThetaValue[]",
        name: "thetas",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint256[][]",
            name: "splitRate",
            type: "uint256[][]",
          },
          {
            internalType: "bool",
            name: "multiStandard",
            type: "bool",
          },
        ],
        internalType: "struct SplitData",
        name: "splitData",
        type: "tuple",
      },
    ],
    name: "swapThetaV2Call",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct ThetaValue[]",
        name: "thetas",
        type: "tuple[]",
      },
    ],
    name: "thetaV2BridgeCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const thetaV2_Iface = new ethers.utils.Interface(thetaV2_ABI);

// Example encoded data (replace this with the actual data you want to decode)
const encodedData =
  "0x9549a4a30000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000164a8d735fa00000000000000000000000000000000000000000000000000000000000000200000000000000000000000007f5c764cbc14f9669b88837ca1490cca17c316070000000000000000000000000000000000000000000000000000000000e4e1c0000000000000000000000000000000000000000000000000000000000000003800000000000000000000000005b93f074549839c8079f37dc16d7d9a1c5e6aa500000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002437623131343463662d306631662d343065662d613939642d3439613239333166633931370000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000504b24b22a800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000180000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f40521500000000000000000000000000000000000000000000000000000000003d0900000000000000000000000000000000000000000000000000000000000000003800000000000000000000000005b93f074549839c8079f37dc16d7d9a1c5e6aa500000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002437623131343463662d306631662d343065662d613939642d3439613239333166633931370000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000b352a08441910000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000004000000000000000000000000005b93f074549839c8079f37dc16d7d9a1c5e6aa500000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000004268b8f0b87b6eae5d897996e6b845ddbd99adf300000000000000000000000000000000000000000000000000000000000000010000000000000000000000004268b8f0b87b6eae5d897996e6b845ddbd99adf3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044a9059cbb00000000000000000000000005b93f074549839c8079f37dc16d7d9a1c5e6aa500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000004268b8f0b87b6eae5d897996e6b845ddbd99adf3000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000";

// Decode the data
const decodedData = thetaV2_Iface.decodeFunctionData(
  "thetaV2BridgeCall",
  encodedData
);
// Print the decoded data
// console.log(decodedData);
function removeDuplicateObjects(data) {
  return Array.from(new Set(data.map(JSON.stringify))).map(JSON.parse);
}

console.log(removeDuplicateObjects(decodedData));
console.log("decodedData[1", decodedData[0][0].value);
console.log("decodedData[1", decodedData[0][1].value);

console.log("input", decodedData[0].input);
console.log("output", decodedData[0].output);
console.log("dup", decodedData[0].dup);

console.log("value", decodedData[1][0].value);
console.log("value", decodedData[1][1].value);

console.log(decodedData[2].splitRate);

/**
 * relaySwapRouter
 * receiveMessageAndRelayswap
 */
// const originRelayswapDecode1 = cctp_relaySwap_Iface.decodeFunctionData(
//   "receiveMessage",
//   decodedData.thetas[0].relayswapCalldata
// );
// const originRelayswapDecode2 = relaySwap_Iface.decodeFunctionData(
//   "relaySwapRouter",
//   decodedData.thetas[1].relayswapCalldata
// );

// console.log("originRelayswapDecode1", originRelayswapDecode1);
// console.log("originRelayswapDecode2", originRelayswapDecode2);
// console.log("input", originRelayswapDecode2[0][0].input);
// console.log("output", originRelayswapDecode2[0][0].output);
// console.log("dup", originRelayswapDecode2[0][0].dup);
