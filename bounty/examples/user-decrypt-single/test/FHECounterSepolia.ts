import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm, deployments } from "hardhat";
import { UserDecryptSingle } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  alice: HardhatEthersSigner;
};

describe("UserDecryptSingleSepolia", function () {
  let signers: Signers;
  let userDecryptContract: UserDecryptSingle;
  let userDecryptContractAddress: string;
  let step: number;
  let steps: number;

  function progress(message: string) {
    console.log(`${++step}/${steps} ${message}`);
  }

  before(async function () {
    if (fhevm.isMock) {
      console.warn(`This hardhat test suite can only run on Sepolia Testnet`);
      this.skip();
    }

    try {
      const deployment = await deployments.get("UserDecryptSingle");
      userDecryptContractAddress = deployment.address;
      userDecryptContract = await ethers.getContractAt("UserDecryptSingle", deployment.address);
    } catch (e) {
      (e as Error).message += ". Call 'npx hardhat deploy --network sepolia'";
      throw e;
    }

    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { alice: ethSigners[0] };
  });

  beforeEach(async () => {
    step = 0;
    steps = 0;
  });

  it("set value then decrypt", async function () {
    steps = 6;

    this.timeout(4 * 40000);

    progress(`Encrypting '21'...`);
    const encryptedValue = await fhevm
      .createEncryptedInput(userDecryptContractAddress, signers.alice.address)
      .add32(21)
      .encrypt();

    progress(
      `Call setValue(21) contract=${userDecryptContractAddress} handle=${ethers.hexlify(encryptedValue.handles[0])} signer=${signers.alice.address}...`,
    );
    const tx = await userDecryptContract
      .connect(signers.alice)
      .setValue(encryptedValue.handles[0], encryptedValue.inputProof);
    await tx.wait();

    progress(`Call getValue()...`);
    const encryptedStored = await userDecryptContract.getValue();
    expect(encryptedStored).to.not.eq(ethers.ZeroHash);

    progress(`Decrypting getValue()=${encryptedStored}...`);
    const clearStored = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedStored,
      userDecryptContractAddress,
      signers.alice,
    );
    progress(`Clear value=${clearStored}`);

    expect(clearStored).to.eq(21);
  });
});
