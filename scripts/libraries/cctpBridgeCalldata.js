const { ethers, utils } = require("ethers");

const iface = new utils.Interface([
  "function bridgeToCctp(tuple(address,uint256,uint64,address,bytes))",
]);

//function bridgeToXybridge(tuple(address,uint256,uint64,address,bytes),tuple(address,address,address))

async function cctpbridgeBytesCode(
  srcToken,
  amount,
  dstChainId,
  recipient,
  plexusData
) {
  try {
    return iface.encodeFunctionData("bridgeToCctp", [
      [srcToken, amount, dstChainId, recipient, plexusData],
    ]);
  } catch (error) {
    console.error(error);
    return null;
  }
}
// bridgeBytesCode(srcToken, amount, dstChainId, recipient, plexusData);

exports.cctpbridgeBytesCode = cctpbridgeBytesCode;
