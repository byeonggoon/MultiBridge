const fetch = require("node-fetch");
const { fromWei } = require("./utils");
const { utils, BigNumber } = require("ethers");
async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  return response.json();
}

const WRAPPED_NATIVE_ADDRESS_BY_CHAIN = {
  1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  10: "0x4200000000000000000000000000000000000006",
  56: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  100: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
  137: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  250: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
  324: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91",
  1101: "0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9",
  2222: "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b",
  5000: "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8",
  8453: "0x4200000000000000000000000000000000000006",
  8217: "0xcd6f29dc9ca217d0973d3d21bf58edd3ca871a86",
  42161: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  43114: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  59144: "0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f",
  1313161554: "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
};

async function fetchAcrossData(fromToken, toToken, amount) {
  const fromTokenCopy = { ...fromToken };

  // 복사본의 address를 변경합니다.
  if (fromTokenCopy.address == "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE")
    fromTokenCopy.address =
      WRAPPED_NATIVE_ADDRESS_BY_CHAIN[fromTokenCopy.chainId];

  const AcrossAPI = `https://across.to/api/suggested-fees?token=${
    fromTokenCopy.address
  }&originChainId=${fromToken.chainId}&destinationChainId=${
    toToken.chainId
  }&amount=${amount.toString()}`;
  const data = await fetchData(AcrossAPI);

  const amountBN = BigNumber.from(amount.toString());
  const relayFeeTotalBN = BigNumber.from(data?.relayFeeTotal.toString());

  // BigNumber 타입을 사용하여 연산을 수행합니다.
  const resultBN = amountBN.sub(relayFeeTotalBN);
  return {
    amount: resultBN,
    fee: fromWei(data?.relayFeeTotal || "0", toToken.decimals),
  };
}

exports.fetchAcrossData = fetchAcrossData;
