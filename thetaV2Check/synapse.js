const fetch = require("node-fetch");
const { fromWei } = require("./utils");
const { stringify } = require("querystring");
const { utils, BigNumber } = require("ethers");

async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  return response.json();
}

// const TOKEN_SYMBOL_EXCEPTION = {
//   42161: { "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8": "USDCe" },
//   43114: {
//     "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664": "USDCe",
//     "0xc7198437980c041c805A1EDcbA50c1Ce5db95118": "USDT",
//   },
// };

// const OPTI_USDCe = "0x7f5c764cbc14f9669b88837ca1490cca17c31607";
// const ARBI_USDCe = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
// const OPTI_USDCe_SYMBOL = "USDC";
// const fromToken = OPTI_USDCe;
// const toToken = OPTI_USDCe;
// const srcChainId = 10;
// const dstChainId = 42161;
// const input1 = 500000000000;

async function fetchSynapseData(fromToken, toToken, amount) {
  const query = {
    fromChain: fromToken.chainId,
    toChain: toToken.chainId,
    fromToken: fromToken.symbol,
    toToken: toToken.symbol,
    amount: fromWei(amount, fromToken.decimals),
  };

  const SynapseAPI = `https://synapse-rest-api-v2.herokuapp.com/bridge?${stringify(
    query
  )}`;
  const data = await fetchData(SynapseAPI);

  return {
    amount: BigNumber.from(
      utils.parseUnits(data?.maxAmountOutStr || "0", toToken.decimals)
    ),
    fee: fromWei(amount, toToken.decimals) - data?.maxAmountOutStr,
  };
}

exports.fetchSynapseData = fetchSynapseData;
