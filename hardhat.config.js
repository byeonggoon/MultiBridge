require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-foundry");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();

const networkName = "ARBI";
// yarn deploy
module.exports = {
  defaultNetwork: networkName,
  networks: {
    hardhat: {
      // allowUnlimitedContractSize: true,
      gas: "auto", // 원하는 가스 리밋 값으로 조절
      gasPrice: "auto", //400000000000, // // 100000000 => 0.1gwei 50000000000 => 50gwei
      // blockGasLimit: 15_000_000,
      forking: {
        url: process.env.MAIN_ARBI_URL,
      },
      accounts: {
        privateKey: process.env.MAIN_ADDR,
        accountsBalance: "10000000000000000000000", // 10000 ETH (기본 단위는 wei)
      },
    },
    ARBI: {
      url: process.env.MAIN_ARBI_URL,
      accounts: [process.env.MAIN_PKEY],
    },
    OP: {
      url: process.env.MAIN_OP_URL,
      accounts: [process.env.MAIN_PKEY],
    },
    POLY: {
      allowUnlimitedContractSize: true,
      url: process.env.MAIN_POLY_URL,
      accounts: [process.env.MAIN_PKEY],
      gasPrice: 300000000000,
    },
    BNB: {
      url: process.env.MAIN_BNB_URL,
      accounts: [process.env.MAIN_PKEY],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },

  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 1,
    token: "ETH",
    coinmarketcap: process.env.COIN_MARKET_CAP_API,
  },
  etherscan: {
    apiKey: process.env[networkName + "_APIKEY"],
  },
  mocha: {
    timeout: 100000,
  },
};
