const { ethers, utils } = require("ethers");

const iface = new utils.Interface([
  "function bridgeToHyphen(tuple(address,uint256,uint64,address,bytes))",
]);

//function bridgeToXybridge(tuple(address,uint256,uint64,address,bytes),tuple(address,address,address))

async function hyphenbridgeBytesCode(
  srcToken,
  amount,
  dstChainId,
  recipient,
  plexusData
) {
  try {
    return iface.encodeFunctionData("bridgeToHyphen", [
      [srcToken, amount, dstChainId, recipient, plexusData],
    ]);
  } catch (error) {
    console.error(error);
    return null;
  }
}
// bridgeBytesCode(srcToken, amount, dstChainId, recipient, plexusData);

exports.hyphenbridgeBytesCode = hyphenbridgeBytesCode;
