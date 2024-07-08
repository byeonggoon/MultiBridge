const fetch = require("node-fetch");
const { stringify } = require("querystring");
const { utils, BigNumber } = require("ethers");
const { fromWei } = require("./utils");

async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  return response.json();
}

const DEFAULT_GAS = 400000;

async function fetchConnextData(fromToken, toToken, amount) {
  const query = {
    paymentToken: toToken.address,
    gasLimit: fromToken.chainId === 42161 ? 2000000 : DEFAULT_GAS,
    gasLimitL1: toToken.chainId === 10 ? 20000 : 2000,
    isHighPriority: true,
  };

  const ConnextAPI = `https://api.gelato.digital/oracles/${
    toToken.chainId
  }/estimate?${stringify(query)}`;
  const data = await fetchData(ConnextAPI);
  bumpPercent = 1.2;
  const relayFee = BigNumber.from(data.estimatedFee)
    .mul(bumpPercent * 10)
    .div(10)
    .toString();

  const routerFee = BigNumber.from(amount).mul(5).div(10000);
  const input = BigNumber.from(amount).sub(routerFee);

  return {
    amount: input - relayFee,
    fee: fromWei(relayFee || "0", toToken.decimals),
  };
}

exports.fetchConnextData = fetchConnextData;
