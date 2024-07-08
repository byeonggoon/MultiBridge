const fetch = require("node-fetch");
const { stringify } = require("querystring");
const { fromWei } = require("./utils");
const { utils, BigNumber, constants } = require("ethers");

async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  return response.json();
}
async function fetchDlnData(fromToken, toToken, amount) {
  const fromTokenCopy = { ...fromToken };
  const toTokenCopy = { ...toToken };

  if (fromTokenCopy.address == "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE")
    fromTokenCopy.address = constants.AddressZero;
  if (toTokenCopy.address == "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE")
    toTokenCopy.address = constants.AddressZero;

  const query = {
    srcChainId: fromToken.chainId,
    srcChainTokenIn: fromTokenCopy.address,
    srcChainTokenInAmount: amount.toString(),
    dstChainId: toToken.chainId,
    dstChainTokenOut: toTokenCopy.address,
    prependOperatingExpenses: true,
    affiliateFeePercent: 0,
  };

  const DlnURL = `https://api.dln.trade/v1.0/dln/order/quote?${stringify(
    query
  )}`;
  const data = await fetchData(DlnURL);
  return {
    amount: BigNumber.from(
      utils.parseUnits(
        fromWei(
          data?.estimation.dstChainTokenOut.recommendedAmount || "0",
          toToken.decimals
        ),
        toToken.decimals
      )
    ),
    fee: fromWei(
      data?.prependedOperatingExpenseCost || "0",
      fromToken.decimals
    ),
  };
}

exports.fetchDlnData = fetchDlnData;
