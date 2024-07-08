const fetch = require("node-fetch");
const { stringify } = require("querystring");
const { fromWei } = require("./utils");
const { utils, BigNumber } = require("ethers");

async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  return response.json();
}

async function fetchHopData(fromToken, toToken, amount) {
  const query = {
    amount: amount.toString(),
    token: fromToken.symbol,
    fromChain: fromToken.chainName,
    toChain: toToken.chainName,
    slippage: 100,
  };
  const HopAPI = `https://api.hop.exchange/v1/quote?${stringify(query)}`;
  const data = await fetchData(HopAPI);

  return {
    amount: BigNumber.from(
      utils.parseUnits(
        fromWei(data?.estimatedRecieved || "0", toToken.decimals),
        toToken.decimals
      )
    ),
    fee: fromWei(data?.bonderFee || "0", toToken.decimals),
  };
}

exports.fetchHopData = fetchHopData;
