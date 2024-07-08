const axios = require("axios");
require("dotenv").config();

chainId = "137";
srcToken = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
dstToken = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
amount = "4000000";
fromAddr = "0xb5A70f51d7cC30e8d528287f42a283052Bb86c80";

async function oneInchCall(chainId, srcToken, dstToken, amount, fromAddr) {
  const url = `https://api.1inch.dev/swap/v6.0/${chainId}/swap`;

  const config = {
    headers: {
      Authorization: `Bearer ${process.env.ONE_INCH_API_KEY}`,
    },
    params: {
      src: srcToken,
      dst: dstToken,
      amount: amount,
      from: fromAddr,
      slippage: "50",
      disableEstimate: "true",
    },
  };

  try {
    const response = await axios.get(url, config);
    // console.log("response", response);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

oneInchCall(chainId, srcToken, dstToken, amount, fromAddr);
exports.oneInchCall = oneInchCall;
