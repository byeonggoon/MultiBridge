const { execSync } = require("child_process");

const networks = ["ARBI", "OP", "POLY", "BNB"]; // 여기에 추가할 네트워크 명시

networks.forEach((network) => {
  try {
    console.log(`Deploying to ${network}...`);
    execSync(`yarn hardhat run scripts/deploy.js --network ${network}`, {
      stdio: "inherit",
    });
    console.log(`Successfully deployed to ${network}`);
  } catch (error) {
    console.error(`Failed to deploy to ${network}:`, error);
  }
});
