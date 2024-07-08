const fetch = require("node-fetch");
const { stringify } = require("querystring");
const { fromWei } = require("./utils");
const { utils, BigNumber } = require("ethers");

async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  return response.json();
}

async function fetchCbridgeData(fromToken, toToken, amount) {
  const query = {
    src_chain_id: fromToken.chainId,
    dst_chain_id: toToken.chainId,
    token_symbol: fromToken.symbol === "ETH" ? "WETH" : fromToken.symbol,
    amt: amount.toString(),
    // slippage_tolerance: slippage * 10000,
  };

  const CbridgeAPI = `https://cbridge-prod2.celer.app/v2/estimateAmt?${stringify(
    query
  )}`;
  const data = await fetchData(CbridgeAPI);

  const estimatedReceiveAmt = data.estimated_receive_amt
    ? fromWei(data.estimated_receive_amt, toToken.decimals)
    : "0";
  const totalFee =
    parseFloat(data.perc_fee || "0") + parseFloat(data.base_fee || "0");
  const formattedFee = fromWei(totalFee.toString(), toToken.decimals);

  return {
    amount: BigNumber.from(
      utils.parseUnits(estimatedReceiveAmt, toToken.decimals)
    ),
    fee: formattedFee,
  };
}

exports.fetchCbridgeData = fetchCbridgeData;
