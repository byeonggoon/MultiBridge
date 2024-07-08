const fetch = require("node-fetch");
const { stringify } = require("querystring");
const { utils, BigNumber } = require("ethers");

async function fetchData(url, options = {}) {
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out"));
    }, 3000);
  });

  const fetchPromise = fetch(url, options).then((response) => response.json());

  try {
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
    console.error("Failed to fetch data within 3 seconds", error);
    return 0;
  }
}

async function fetchHyphenData(fromToken, toToken, amount) {
  const query = {
    fromChainId: fromToken.chainId,
    toChainId: toToken.chainId,
    tokenAddress: fromToken.address,
    amount: amount.toString(),
  };
  const HyphenAPI = `https://hyphen-v2-api.biconomy.io/api/v1/data/transferFee?${stringify(
    query
  )}`;

  const data = await fetchData(HyphenAPI);

  if (data === 0) {
    console.log("Failed to fetch data within 3 seconds");
    return { amount: 0, fee: 0 };
  }

  return {
    amount: BigNumber.from(
      utils.parseUnits(data?.amountToGet || "0", toToken.decimals)
    ),
    fee: data?.netTransferFee || "0",
  };
}

exports.fetchHyphenData = fetchHyphenData;
