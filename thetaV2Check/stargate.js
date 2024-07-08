const { utils, BigNumber } = require("ethers");
const { STARGATE_FACET_ABI } = require("./abi");
require("dotenv").config();

const stargateInterface = new utils.Interface(STARGATE_FACET_ABI);

fromChainRouter: new ethers.Contract(
  "0x94246aC21feacFD33D043C46014f373F174Edc17",
  STARGATE_FACET_ABI,
  process.env.MAIN_OP_URL
);

toChainRouter: new ethers.Contract(
  "0x52cdB00b69f11C4cA932fA9108C6BFdD65F20d62",
  STARGATE_FACET_ABI,
  process.env.MAIN_ARBI_URL
);
async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  return response.json();
}

async function fetchStargateData(srcChainId, dstChainId, fromToken, amount) {
  const query = {
    fromChainId: srcChainId,
    toChainId: dstChainId,
    tokenAddress: fromToken,
    amount: amount,
  };
  const HyphenAPI = `https://hyphen-v2-api.biconomy.io/api/v1/data/transferFee?${stringify(
    query
  )}`;

  const data = await fetchData(HyphenAPI);
  return { amount: data?.amountToGet || "0", fee: data?.netTransferFee || "0" };
}

exports.fetchStargateData = fetchStargateData;
