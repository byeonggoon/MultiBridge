const fetch = require("node-fetch");
const { stringify } = require("querystring");
const { utils, BigNumber } = require("ethers");
const { fromWei } = require("./utils");

async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  return response.json();
}

async function fetchXyData(fromToken, toToken, amount) {
  const query = {
    srcChainId: fromToken.chainId,
    fromTokenAddress: fromToken.address,
    amount: amount.toString(),
    destChainId: toToken.chainId,
    toTokenAddress: toToken.address,
    affiliate: "",
  };

  const XyURL = `https://open-api.xy.finance/v1/quote?${stringify(query)}`;
  const data = await fetchData(XyURL);
  const amountResult = utils.parseUnits(
    data?.quote?.toTokenAmount.toString() || "0",
    toToken.decimals
  );

  const feeResult = data?.xyFee?.amount.toString();

  return { amount: amountResult, fee: feeResult };
}

exports.fetchXyData = fetchXyData;
