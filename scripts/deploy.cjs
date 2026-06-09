const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  if (!deployer) {
    throw new Error("No deployer account. Set DEPLOYER_PRIVATE_KEY in .env or .env.local");
  }

  console.log("Deploying with:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "MNT");

  const YieldDuelLog = await hre.ethers.getContractFactory("YieldDuelLog");
  const contract = await YieldDuelLog.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("\nYieldDuelLog deployed to:", address);
  console.log("\nAdd to .env.local:");
  console.log(`NEXT_PUBLIC_YIELD_DUEL_CONTRACT=${address}`);
  console.log("\nVerify with:");
  console.log(`npx hardhat verify --network mantleSepolia ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});