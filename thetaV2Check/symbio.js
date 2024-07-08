const fetch = require("node-fetch");
const { fromWei } = require("./utils");
const { utils, BigNumber } = require("ethers");

async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  return response.json();
}

async function fetchSymbioData(fromToken, toToken, amount) {
  const query = {
    tokenAmountIn: {
      address: fromToken.address,
      amount: amount.toString(),
      chainId: fromToken.chainId,
      decimals: fromToken.decimals,
    },
    tokenOut: {
      chainId: toToken.chainId,
      address: toToken.address,
      symbol: toToken.symbol,
      decimals: toToken.decimals,
    },
    from: "0x18DE2363BB0FD4358AF5F528AD398D235F2D77A3", // user addr
    to: "0xf93d011544e89a28b5bdbdd833016cc5f26e82cd",
    slippage: 300,
  };

  const SymbioURL = `https://api-v2.symbiosis.finance/crosschain/v1/swapping/exact_in`;

  const data = await fetchData(SymbioURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query),
  });

  const amountResult = fromWei(
    data?.tokenAmountOut?.amount || "0",
    toToken.decimals
  );
  const feeResult = fromWei(data?.fee?.amount || "0", toToken.decimals);

  return {
    amount: BigNumber.from(utils.parseUnits(amountResult, toToken.decimals)),
    fee: feeResult,
  };
}

exports.fetchSymbioData = fetchSymbioData;
