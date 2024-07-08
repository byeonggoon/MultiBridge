const { ethers, utils } = require("ethers");
const axios = require("axios");
require("dotenv").config();

const iface = new utils.Interface([
  "function bridgeToHop(tuple(address,uint256,uint64,address,bytes),tuple(uint256,uint256,uint256,uint256,uint256))",
]);

const srcToken = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const amount = 1000000;
const dstChainId = 42161;
const recipient = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const plexusData = "0x";
const srcTokenSymbol = "USDC";
const srcChainString = "arbitrum";
const dstChainString = "polygon";

async function hopbridgeBytesCode(
  srcToken,
  amount,
  dstChainId,
  srcTokenSymbol,
  srcChainString,
  dstChainString,
  recipient,
  plexusData
) {
  try {
    const url = `https://api.hop.exchange/v1/quote?`;

    const config = {
      params: {
        amount: amount.toString(), // Ensure 'amount' is a string
        token: srcTokenSymbol,
        fromChain: srcChainString,
        toChain: dstChainString,
        slippage: 0.5,
      },
    };

    const response = await axios.get(url, config);
    // console.log("response", response.data);

    // Explicitly create BigNumber instances
    const bonderFee = ethers.utils.parseUnits(response.data.bonderFee, 0); // Assuming 'bonderFee' doesn't need decimal conversion
    const slippageTimesTen = ethers.utils.parseUnits(
      (response.data.slippage * 10).toString(),
      0
    );
    const deadline = ethers.BigNumber.from(response.data.deadline);
    const dstAmountOutMin = ethers.BigNumber.from(
      response.data.destinationAmountOutMin
    );
    const dstDeadline = ethers.BigNumber.from(
      response.data.destinationDeadline
    );

    return iface.encodeFunctionData("bridgeToHop", [
      [srcToken, amount, dstChainId, recipient, plexusData],
      [bonderFee, slippageTimesTen, deadline, dstAmountOutMin, dstDeadline],
    ]);
  } catch (error) {
    console.error(error);
    return null;
  }
}

hopbridgeBytesCode(
  srcToken,
  amount,
  dstChainId,
  srcTokenSymbol,
  srcChainString,
  dstChainString,
  recipient,
  plexusData
);

exports.hopbridgeBytesCode = hopbridgeBytesCode;
