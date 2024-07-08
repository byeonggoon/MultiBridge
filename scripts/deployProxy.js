const { ethers, upgrades } = require("hardhat");

async function main() {
  const V1contract = await ethers.getContractFactory("ThetaV2");
  console.log("Deploying V1contract...");
  const v1contract = await upgrades.deployProxy(
    V1contract,
    ["0x52cdB00b69f11C4cA932fA9108C6BFdD65F20d62"],
    {
      initializer: "initialize",
      kind: "uups",
    }
  );
  await v1contract.deployed();
  console.log("V1 Contract deployed to:", v1contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
