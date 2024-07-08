const { fromWei, getBignum } = require("./utils");

const { fetchXyData } = require("./xy");
const { fetchSymbioData } = require("./symbio");
const { fetchHopData } = require("./hop");
const { fetchHyphenData } = require("./hyphen");
const { fetchAcrossData } = require("./across");
const { fetchCbridgeData } = require("./cbridge");
const { fetchDlnData } = require("./dln");
const { fetchConnextData } = require("./connext");
const { fetchSynapseData } = require("./synapse");

const { createMarkdownTable } = require("./createMarkdownTable");

const NATIVE = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const ETHER_USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const ETHER_USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const ARBI_USDCe = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const ARBI_USDT = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";

const OPTI_USDCe = "0x7f5c764cbc14f9669b88837ca1490cca17c31607";

const BSC_USDT = "0x55d398326f99059fF775485246999027B3197955";
const BSC_USDC = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";

const POLY_USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

const fromToken = {
  address: OPTI_USDCe,
  decimals: 6,
  symbol: "USDC",
  chainId: 10,
  chainName: "optimism",
};

const toToken = {
  address: ARBI_USDCe,
  decimals: 6,
  symbol: "USDC",
  chainId: 42161,
  chainName: "arbitrum",
};

const input1 = getBignum("100", fromToken.decimals);
const input2 = getBignum("500", fromToken.decimals);
const input3 = getBignum("1000", fromToken.decimals);
const input4 = getBignum("5000", fromToken.decimals);
const input5 = getBignum("10000", fromToken.decimals);
const input6 = getBignum("50000", fromToken.decimals);
const input7 = getBignum("100000", fromToken.decimals);
const input8 = getBignum("250000", fromToken.decimals);
const input9 = getBignum("500000", fromToken.decimals);
const input10 = getBignum("1000000", fromToken.decimals);

// TEST BRIDGE :, , , stargate,
// API CLEAR : Across, cBridge, Hyphen, Hop, Symbiosis, dln, xy, Connext,synapse
// stuck : allbridge(지원체인 소수)

console.log("=======");

// ======================

async function executeAndSort(fromToken, toToken, amount) {
  const results = await Promise.all([
    fetchAcrossData(fromToken, toToken, amount),
    fetchCbridgeData(fromToken, toToken, amount),
    fetchHyphenData(fromToken, toToken, amount),
    fetchHopData(fromToken, toToken, amount),
    fetchSymbioData(fromToken, toToken, amount),
    fetchDlnData(fromToken, toToken, amount),
    fetchXyData(fromToken, toToken, amount),
    fetchConnextData(fromToken, toToken, amount),
    fetchSynapseData(fromToken, toToken, amount),
  ]);

  const bridges = [
    "Across",
    "Cbridge",
    "Hyphen",
    "Hop",
    "Symbio",
    "Dln",
    "Xy",
    "Connext",
    "Synapse",
  ];

  let resultsWithNames = results.map((value, index) => ({
    name: bridges[index],
    amount: parseFloat(fromWei(value.amount.toString(), toToken.decimals)), //parseFloat(value.amount),
    fee: value.fee,
    slippage:
      parseFloat(fromWei(amount.toString(), fromToken.decimals)) -
      parseFloat(value.fee) -
      parseFloat(fromWei(value.amount.toString(), fromToken.decimals)),
    totalGap:
      parseFloat(fromWei(amount.toString(), fromToken.decimals)) -
      parseFloat(fromWei(value.amount.toString(), fromToken.decimals)),
  }));

  resultsWithNames = resultsWithNames.filter((result) => result.amount > 0);
  return resultsWithNames.sort((a, b) => b.amount - a.amount);
}

async function generateMarkdownTable1() {
  const sortedResults = await executeAndSort(fromToken, toToken, input1);
  const markdownTable = createMarkdownTable(input1, fromToken, sortedResults);
  console.log(markdownTable);
}

async function generateMarkdownTable2() {
  const sortedResults = await executeAndSort(fromToken, toToken, input2);
  const markdownTable = createMarkdownTable(input2, fromToken, sortedResults);
  console.log(markdownTable);
}

async function generateMarkdownTable3() {
  const sortedResults = await executeAndSort(fromToken, toToken, input3);
  const markdownTable = createMarkdownTable(input3, fromToken, sortedResults);
  console.log(markdownTable);
}

async function generateMarkdownTable4() {
  const sortedResults = await executeAndSort(fromToken, toToken, input4);
  const markdownTable = createMarkdownTable(input4, fromToken, sortedResults);
  console.log(markdownTable);
}

async function generateMarkdownTable5() {
  const sortedResults = await executeAndSort(fromToken, toToken, input5);
  const markdownTable = createMarkdownTable(input5, fromToken, sortedResults);
  console.log(markdownTable);
}

async function generateMarkdownTable6() {
  const sortedResults = await executeAndSort(fromToken, toToken, input6);
  const markdownTable = createMarkdownTable(input6, fromToken, sortedResults);
  console.log(markdownTable);
}

async function generateMarkdownTable7() {
  const sortedResults = await executeAndSort(fromToken, toToken, input7);
  const markdownTable = createMarkdownTable(input7, fromToken, sortedResults);
  console.log(markdownTable);
}
async function generateMarkdownTable8() {
  const sortedResults = await executeAndSort(fromToken, toToken, input8);
  const markdownTable = createMarkdownTable(input8, fromToken, sortedResults);
  console.log(markdownTable);
}
async function generateMarkdownTable9() {
  const sortedResults = await executeAndSort(fromToken, toToken, input9);
  const markdownTable = createMarkdownTable(input9, fromToken, sortedResults);
  console.log(markdownTable);
}

async function generateMarkdownTable10() {
  const sortedResults = await executeAndSort(fromToken, toToken, input10);
  const markdownTable = createMarkdownTable(input10, fromToken, sortedResults);
  console.log(markdownTable);
}
// generateMarkdownTable1();
generateMarkdownTable2();
// generateMarkdownTable3();
// generateMarkdownTable4();

// generateMarkdownTable5();
// generateMarkdownTable6();
// generateMarkdownTable7();
// generateMarkdownTable8();
// generateMarkdownTable9();

// generateMarkdownTable10();
