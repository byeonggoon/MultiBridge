const { ethers, utils } = require("ethers");
const axios = require("axios");
require("dotenv").config();

const iface = new utils.Interface([
  "function bridgeToXybridge(tuple(address,uint256,uint64,address,bytes),tuple(address,address,address))",
]);

const NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

const srcToken = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const dstToken = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const amount = 1000000;
const srcChainId = 42161;
const dstChainId = 137;
const recipient = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const plexusData = "0x";

async function xyBytesCode(
  srcToken,
  dstToken,
  amount,
  dstChainId,
  recipient,
  plexusData
) {
  try {
    return iface.encodeFunctionData("bridgeToXybridge", [
      [srcToken, amount, dstChainId, recipient, plexusData],
      [
        dstToken,
        "0x0000000000000000000000000000000000000000",
        "0xc301050b2035e618b05959fbf8755f48edfe0b55",
      ],
    ]);
  } catch (error) {
    console.error(error);
    return null;
  }
}

// xyBytesCode(srcToken, dstToken, amount, dstChainId, recipient, plexusData);

exports.xyBytesCode = xyBytesCode;
