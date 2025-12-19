import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

// Local-only workflow (no public devnet)
// 1) npx hardhat node
// 2) npx hardhat --network localhost deploy
// 3) Interact via tasks below

task("task:address", "Prints the UserDecryptSingle address").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { deployments } = hre;
  const contract = await deployments.get("UserDecryptSingle");
  console.log("UserDecryptSingle address is " + contract.address);
});

task("task:decrypt-value", "Decrypts the stored value")
  .addOptionalParam("user", "User address (default: first signer)")
  .addOptionalParam("address", "Optionally specify the contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;
    await fhevm.initializeCLIApi();

    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("UserDecryptSingle");
    const signer = taskArguments.user ? await ethers.getSigner(taskArguments.user) : (await ethers.getSigners())[0];
    const contract = await ethers.getContractAt("UserDecryptSingle", deployment.address);

    const encryptedValue = await contract.getValue();
    if (encryptedValue === ethers.ZeroHash) {
      console.log(`encrypted value: ${encryptedValue}`);
      console.log("clear value    : 0");
      return;
    }

    const clearValue = await fhevm.userDecryptEuint(FhevmType.euint32, encryptedValue, deployment.address, signer);
    console.log(`Encrypted value: ${encryptedValue}`);
    console.log(`Clear value    : ${clearValue}`);
  });

task("task:set-value", "Sets an encrypted uint32 value")
  .addOptionalParam("address", "Optionally specify the contract address")
  .addParam("value", "The uint32 value to store")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;
    const value = parseInt(taskArguments.value);
    if (!Number.isInteger(value)) {
      throw new Error(`Argument --value is not an integer`);
    }

    await fhevm.initializeCLIApi();
    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("UserDecryptSingle");
    const signer = (await ethers.getSigners())[0];
    const contract = await ethers.getContractAt("UserDecryptSingle", deployment.address);

    const encryptedValue = await fhevm
      .createEncryptedInput(deployment.address, signer.address)
      .add32(value)
      .encrypt();

    const tx = await contract.connect(signer).setValue(encryptedValue.handles[0], encryptedValue.inputProof);
    console.log(`Wait for tx:${tx.hash}...`);
    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);
  });
