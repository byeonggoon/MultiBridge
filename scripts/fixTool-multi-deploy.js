async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const contractNames = [
    "AcrossFixtool",
    "AllbridgeFixtool",
    "CbridgeFixtool",
    "ConnextFixtool",
    "DlnFixtool",
    "HopFixtool",
    "L2passFixtool",
    "RouterFixtool",
    "SimpleFixtool",
    "SquidFixtool",
    "StargateFixtool",
    "SynapseFixtool",
    "XybridgeFixtool",
    "SymbiosisFixtool",
  ];

  for (const name of contractNames) {
    const ContractFactory = await ethers.getContractFactory(name);
    const contract = await ContractFactory.deploy();
    await contract.deployed();
    console.log(`${name} deployed to:`, contract.address);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
