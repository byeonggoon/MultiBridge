const { ethers, utils } = require("ethers");

const iface = new utils.Interface([
  "function bridgeToXybridge(tuple(address,uint256,uint64,address,bytes),tuple(address,address,address))",
]);

async function xybridgeBytesCode(
  srcToken,
  amount,
  dstChainId,
  recipient,
  plexusData,
  toChainToken
) {
  try {
    return iface.encodeFunctionData("bridgeToXybridge", [
      [srcToken, amount, dstChainId, recipient, plexusData],
      [
        toChainToken,
        "0x0000000000000000000000000000000000000000",
        "0x0Bb989a2593E7513B44ae408F1e3191E0183b20a",
      ],
    ]);
  } catch (error) {
    console.error(error);
    return null;
  }
}
exports.xybridgeBytesCode = xybridgeBytesCode;
