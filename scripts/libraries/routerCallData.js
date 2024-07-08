const { ethers, utils } = require("ethers");
const axios = require("axios");
require("dotenv").config();

const iface = new utils.Interface([
  "function bridgeToRouter(tuple(address,uint256,uint64,address,bytes),tuple(address,uint256))",
]);

const NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

const srcToken = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const dstToken = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const amount = 1000000;
const srcChainId = 42161;
const dstChainId = 137;
const recipient = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const plexusData = "0x";

async function routerBytesCode(
  srcToken,
  dstToken,
  amount,
  srcChainId,
  dstChainId,
  recipient,
  plexusData
) {
  try {
    const url = `https://api-beta.pathfinder.routerprotocol.com/api/v2/quote`;

    const config = {
      params: {
        fromTokenAddress:
          srcToken == NATIVE_ADDRESS ? NATIVE_ADDRESS : srcToken,
        toTokenAddress: dstToken == NATIVE_ADDRESS ? NATIVE_ADDRESS : dstToken,
        amount,
        fromTokenChainId: srcChainId,
        toTokenChainId: dstChainId,
        partnerId: 0,
      },
    };

    const {
      data: { bridgeFee, destination, estimatedTime },
    } = await axios.get(url, config);
    // console.log("response", bridgeFee, destination.tokenAmount, estimatedTime);

    // Explicitly create BigNumber instances

    return iface.encodeFunctionData("bridgeToRouter", [
      [srcToken, amount, dstChainId, recipient, plexusData],
      [dstToken, destination.tokenAmount],
    ]);
  } catch (error) {
    console.error(error);
    return null;
  }
}

// routerBytesCode(
//   srcToken,
//   dstToken,
//   amount,
//   srcChainId,
//   dstChainId,
//   recipient,
//   plexusData
// );

exports.routerBytesCode = routerBytesCode;
