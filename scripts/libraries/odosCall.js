const quoteUrl = "https://api.odos.xyz/sor/quote/v2";
const assembleUrl = "https://api.odos.xyz/sor/assemble";

const NATIVE = "0x0000000000000000000000000000000000000000";
const POLY_WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
const POLY_USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const POLY_USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
const POLY_WBTC = "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6";

const ARBI_USDC = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
const ARBI_USDT = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
const ARBI_WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";

const inputTokens = [
  {
    tokenAddress: ARBI_USDT, // odos api native
    amount: "20000000", // input amount as a string in fixed integer precision
  },
];

const outputTokens = [
  {
    tokenAddress: NATIVE, // checksummed output token address
    proportion: 1,
  },
];

async function odosCall(contractAddr, fromChainId, inputTokens, outputTokens) {
  const response1 = await fetch(quoteUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chainId: fromChainId, // Replace with desired chainId
      inputTokens: inputTokens,
      outputTokens: outputTokens,
      userAddr: contractAddr, // checksummed user address
      slippageLimitPercent: 0.3, // set your slippage limit percentage (1 = 1%),
      referralCode: 0, // referral code (recommended)
      disableRFQs: true,
    }),
  });

  console.log(contractAddr, fromChainId, inputTokens, outputTokens);
  if (response1.status === 200) {
    const quote = await response1.json();
    pathId = quote.pathId;

    const assembleRequestBody = {
      userAddr: contractAddr, // the checksummed address used to generate the quote
      pathId: pathId, // Replace with the pathId from quote response in step 1
      simulate: false, // this can be set to true if the user isn't doing their own estimate gas call for the transaction
    };

    console.log("@@@@@@@@");
    const response2 = await fetch(assembleUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assembleRequestBody),
    });
    // console.log("response2.json();", await response2.json());
    // console.log("response2.ok", response2.ok);
    if (response2.ok) {
      return await response2.json();
    } else {
      console.error("Error in Assemble:", await response2.text());
      throw new Error("Assemble request failed");
    }
  } else {
    console.error("Error in Quote:", response1);
    // handle quote failure cases
  }
}

// odosCall(
//   "0x4d2F718B4AFfC509D4CF2843c1Cd85b3C446A157",
//   42161,
//   inputTokens,
//   outputTokens
// );

exports.odosCall = odosCall;
