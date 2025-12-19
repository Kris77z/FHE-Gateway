import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { UserDecryptSingle, UserDecryptSingle__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("UserDecryptSingle")) as UserDecryptSingle__factory;
  const userDecryptContract = (await factory.deploy()) as UserDecryptSingle;
  const userDecryptContractAddress = await userDecryptContract.getAddress();

  return { userDecryptContract, userDecryptContractAddress };
}

describe("UserDecryptSingle", function () {
  let signers: Signers;
  let userDecryptContract: UserDecryptSingle;
  let userDecryptContractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ userDecryptContract, userDecryptContractAddress } = await deployFixture());
  });

  it("value should be uninitialized after deployment", async function () {
    const encryptedValue = await userDecryptContract.getValue();
    expect(encryptedValue).to.eq(ethers.ZeroHash);
  });

  it("set and decrypt a single value", async function () {
    const encryptedBefore = await userDecryptContract.getValue();
    expect(encryptedBefore).to.eq(ethers.ZeroHash);
    const clearBefore = 0;

    const clearValue = 42;
    const encryptedValue = await fhevm
      .createEncryptedInput(userDecryptContractAddress, signers.alice.address)
      .add32(clearValue)
      .encrypt();

    const tx = await userDecryptContract
      .connect(signers.alice)
      .setValue(encryptedValue.handles[0], encryptedValue.inputProof);
    await tx.wait();

    const encryptedAfter = await userDecryptContract.getValue();
    const clearAfter = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedAfter,
      userDecryptContractAddress,
      signers.alice,
    );

    expect(clearAfter).to.eq(clearBefore + clearValue);
  });

  it("overwrite with a new encrypted value", async function () {
    const firstValue = 5;
    const encryptedFirst = await fhevm
      .createEncryptedInput(userDecryptContractAddress, signers.alice.address)
      .add32(firstValue)
      .encrypt();

    let tx = await userDecryptContract.connect(signers.alice).setValue(encryptedFirst.handles[0], encryptedFirst.inputProof);
    await tx.wait();

    const secondValue = 7;
    const encryptedSecond = await fhevm
      .createEncryptedInput(userDecryptContractAddress, signers.alice.address)
      .add32(secondValue)
      .encrypt();

    tx = await userDecryptContract.connect(signers.alice).setValue(encryptedSecond.handles[0], encryptedSecond.inputProof);
    await tx.wait();

    const encryptedAfter = await userDecryptContract.getValue();
    const clearAfter = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedAfter,
      userDecryptContractAddress,
      signers.alice,
    );

    expect(clearAfter).to.eq(secondValue);
  });
});
