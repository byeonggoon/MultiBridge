const { ethers, utils } = require("ethers");
const axios = require("axios");
require("dotenv").config();

const iface = new utils.Interface([
  "function bridgeToStargate(tuple(address,uint256,uint256,address,uint256,uint256,uint256,bytes,bytes))",
]);

const NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

const srcToken = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const dstToken = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const amount = 1000000;
const srcChainId = 42161;
const dstChainId = 137;
const recipient = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const plexusData = "0x";

const fromPlexus = "0x52cdB00b69f11C4cA932fA9108C6BFdD65F20d62";
const toPlexus = "0x94246aC21feacFD33D043C46014f373F174Edc17";
const contractAbi = [
  {
    inputs: [
      {
        internalType: "contract IStargate",
        name: "_stargate",
        type: "address",
      },
      {
        internalType: "contract IStargate",
        name: "_stargateETH",
        type: "address",
      },
      {
        internalType: "contract IStargateFeeLibrary",
        name: "_feeLibrary",
        type: "address",
      },
      {
        internalType: "contract IStargateWidget",
        name: "_widget",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "LengthNotMatch",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyError",
    type: "error",
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
            name: "dstPoolId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dstChainId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fee",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "payload",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "plexusData",
            type: "bytes",
          },
        ],
        internalType: "struct StargateDescription",
        name: "sDesc",
        type: "tuple",
      },
    ],
    name: "bridgeToStargate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractOwnerAddress",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_srcToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_dstPoolId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_dstChainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountSD",
        type: "uint256",
      },
    ],
    name: "getFee",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "eqfee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "eqReward",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lpFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "protocolFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lkbRemove",
            type: "uint256",
          },
        ],
        internalType: "struct SwapObj",
        name: "s",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_dstChainId",
        type: "uint16",
      },
      {
        internalType: "bytes",
        name: "_toAddress",
        type: "bytes",
      },
    ],
    name: "getLayerZeroFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
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
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint16",
            name: "poolId",
            type: "uint16",
          },
        ],
        internalType: "struct Pool[]",
        name: "_poolId",
        type: "tuple[]",
      },
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
        internalType: "struct ChainId[]",
        name: "_chainId",
        type: "tuple[]",
      },
    ],
    name: "initStargate",
    outputs: [],
    stateMutability: "nonpayable",
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
        components: [
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "gasFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "transferFee",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "userAddress",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "txHash",
            type: "bytes32",
          },
        ],
        internalType: "struct VerifySigEIP712.Input",
        name: "inputData",
        type: "tuple",
      },
      {
        internalType: "bytes[]",
        name: "signature",
        type: "bytes[]",
      },
    ],
    name: "relaySig",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "sig",
        type: "bytes",
      },
    ],
    name: "splitSignature",
    outputs: [
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "ssHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_chainId",
        type: "uint256",
      },
    ],
    name: "stargateLayerZeroId",
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
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "stargatePoolId",
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
            name: "dstPoolId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dstChainId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fee",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "payload",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "plexusData",
            type: "bytes",
          },
        ],
        internalType: "struct StargateDescription",
        name: "sDesc",
        type: "tuple",
      },
    ],
    name: "swapAndBridgeToStargate",
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
    inputs: [
      {
        internalType: "bytes",
        name: "_msg",
        type: "bytes",
      },
      {
        internalType: "bytes[]",
        name: "_sigs",
        type: "bytes[]",
      },
      {
        internalType: "address[]",
        name: "_signers",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_powers",
        type: "uint256[]",
      },
    ],
    name: "verifySigs",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
];

// 컨트랙트 인스턴스 생성

async function StargateBytesCode(
  srcToken,
  amount,
  fromChainId,
  toChainId,
  toPoolId,
  cutSixdecimalFromAmount,
  recipient,
  plexusData
) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.MAIN_ARBI_URL
    );

    const contract = new ethers.Contract(fromPlexus, contractAbi, provider);

    const layerZeroFee = await contract.functions.getLayerZeroFee(
      fromChainId,
      NATIVE_ADDRESS
    );
    console.log("layerZeroFee", layerZeroFee[0]);

    const stargateFees = await contract.functions.getFee(
      NATIVE_ADDRESS,
      toPoolId,
      toChainId,
      recipient,
      cutSixdecimalFromAmount
    );
    console.log(" amount", stargateFees[0].amount);
    console.log(" eqReward", stargateFees[0].eqReward);
    console.log(" protocolFee", stargateFees[0].protocolFee);
    console.log(" lpFee", stargateFees[0].lpFee);
    console.log("cutSixdecimalFromAmount", cutSixdecimalFromAmount);

    return iface.encodeFunctionData("bridgeToStargate", [
      [
        srcToken,
        toPoolId,
        toChainId,
        recipient,
        amount,
        cutSixdecimalFromAmount,
        layerZeroFee[0],
        "0x",
        plexusData,
      ],
    ]);
  } catch (error) {
    console.error(error);
    return null;
  }
}
// StargateBytesCode();
exports.StargateBytesCode = StargateBytesCode;
