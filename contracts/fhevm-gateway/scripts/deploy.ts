import { ethers } from "hardhat";

async function main() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║      FHEPaymentGateway Contract Deployment                ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  console.log("🚀 Deploying FHEPaymentGateway contract...");
  const FHEPaymentGateway = await ethers.getContractFactory("FHEPaymentGateway");
  const gateway = await FHEPaymentGateway.deploy();

  console.log("⏳ Waiting for deployment confirmation...");
  await gateway.waitForDeployment();

  const address = await gateway.getAddress();
  const network = await ethers.provider.getNetwork();
  
  console.log("\n✅ FHEPaymentGateway deployed successfully!");
  console.log("\n📋 Contract Details:");
  console.log(`   Address: ${address}`);
  console.log(`   Network: ${network.name} (Chain ID: ${network.chainId})`);
  console.log(`   Deployer: ${deployer.address}`);
  
  if (network.chainId === BigInt(84532)) {
    console.log(`   Explorer: https://sepolia.basescan.org/address/${address}`);
  } else if (network.chainId === BigInt(8453)) {
    console.log(`   Explorer: https://basescan.org/address/${address}`);
  }
  
  console.log("\n💡 Next Steps:");
  console.log("   1. Save the contract address for frontend integration");
  console.log("   2. Verify the contract on Basescan (optional)");
  console.log("   3. Test contract functions\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

