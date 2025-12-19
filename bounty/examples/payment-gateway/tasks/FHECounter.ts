import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

// Local-only workflow (no public devnet)
// 1) npx hardhat node
// 2) npx hardhat --network localhost deploy
// 3) Interact via tasks below

task("task:address", "Prints the FHEPaymentGateway address").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { deployments } = hre;
  const gateway = await deployments.get("FHEPaymentGateway");
  console.log("FHEPaymentGateway address is " + gateway.address);
});

task("task:decrypt-balance", "Decrypts balance for a user")
  .addOptionalParam("user", "User address (default: first signer)")
  .addOptionalParam("address", "Optionally specify the contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;
    await fhevm.initializeCLIApi();

    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("FHEPaymentGateway");

    const signer = taskArguments.user ? await ethers.getSigner(taskArguments.user) : (await ethers.getSigners())[0];
    const contract = await ethers.getContractAt("FHEPaymentGateway", deployment.address);

    const encryptedBalance = await contract.getEncryptedBalance(signer.address);
    if (encryptedBalance === ethers.ZeroHash) {
      console.log(`encrypted balance: ${encryptedBalance}`);
      console.log("clear balance   : 0");
      return;
    }

    const clearBalance = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedBalance,
      deployment.address,
      signer,
    );
    console.log(`Encrypted balance: ${encryptedBalance}`);
    console.log(`Clear balance    : ${clearBalance}`);
  });

task("task:add-payment", "Adds an encrypted payment to your balance")
  .addOptionalParam("address", "Optionally specify the contract address")
  .addParam("value", "Payment amount (uint32)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;
    const value = parseInt(taskArguments.value);
    if (!Number.isInteger(value)) {
      throw new Error(`Argument --value is not an integer`);
    }

    await fhevm.initializeCLIApi();
    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("FHEPaymentGateway");
    const signer = (await ethers.getSigners())[0];
    const contract = await ethers.getContractAt("FHEPaymentGateway", deployment.address);

    const encryptedValue = await fhevm
      .createEncryptedInput(deployment.address, signer.address)
      .add32(value)
      .encrypt();

    const tx = await contract.connect(signer).addPayment(encryptedValue.handles[0], encryptedValue.inputProof);
    console.log(`Wait for tx:${tx.hash}...`);
    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);
  });

task("task:apply-rate", "Applies an encrypted rate multiplier to your balance")
  .addOptionalParam("address", "Optionally specify the contract address")
  .addParam("value", "Rate multiplier (uint32)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;
    const value = parseInt(taskArguments.value);
    if (!Number.isInteger(value)) {
      throw new Error(`Argument --value is not an integer`);
    }

    await fhevm.initializeCLIApi();
    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("FHEPaymentGateway");
    const signer = (await ethers.getSigners())[0];
    const contract = await ethers.getContractAt("FHEPaymentGateway", deployment.address);

    const encryptedValue = await fhevm
      .createEncryptedInput(deployment.address, signer.address)
      .add32(value)
      .encrypt();

    const tx = await contract.connect(signer).applyRate(encryptedValue.handles[0], encryptedValue.inputProof);
    console.log(`Wait for tx:${tx.hash}...`);
    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);
  });
