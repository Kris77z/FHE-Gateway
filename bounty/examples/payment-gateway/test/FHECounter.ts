import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { FHEPaymentGateway, FHEPaymentGateway__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("FHEPaymentGateway")) as FHEPaymentGateway__factory;
  const paymentContract = (await factory.deploy()) as FHEPaymentGateway;
  const paymentContractAddress = await paymentContract.getAddress();

  return { paymentContract, paymentContractAddress };
}

describe("FHEPaymentGateway", function () {
  let signers: Signers;
  let paymentContract: FHEPaymentGateway;
  let paymentContractAddress: string;

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

    ({ paymentContract, paymentContractAddress } = await deployFixture());
  });

  it("balance should be uninitialized after deployment", async function () {
    const encryptedBalance = await paymentContract.getEncryptedBalance(signers.alice.address);
    expect(encryptedBalance).to.eq(ethers.ZeroHash);
  });

  it("adds encrypted payment", async function () {
    const encryptedBalanceBefore = await paymentContract.getEncryptedBalance(signers.alice.address);
    expect(encryptedBalanceBefore).to.eq(ethers.ZeroHash);
    const clearBefore = 0;

    const clearAmount = 10;
    const encryptedAmount = await fhevm
      .createEncryptedInput(paymentContractAddress, signers.alice.address)
      .add32(clearAmount)
      .encrypt();

    const tx = await paymentContract
      .connect(signers.alice)
      .addPayment(encryptedAmount.handles[0], encryptedAmount.inputProof);
    await tx.wait();

    const encryptedBalanceAfter = await paymentContract.getEncryptedBalance(signers.alice.address);
    const clearAfter = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedBalanceAfter,
      paymentContractAddress,
      signers.alice,
    );

    expect(clearAfter).to.eq(clearBefore + clearAmount);
  });

  it("applies encrypted rate to balance", async function () {
    const clearAmount = 10;
    const encryptedAmount = await fhevm
      .createEncryptedInput(paymentContractAddress, signers.alice.address)
      .add32(clearAmount)
      .encrypt();

    let tx = await paymentContract
      .connect(signers.alice)
      .addPayment(encryptedAmount.handles[0], encryptedAmount.inputProof);
    await tx.wait();

    const clearRate = 2;
    const encryptedRate = await fhevm
      .createEncryptedInput(paymentContractAddress, signers.alice.address)
      .add32(clearRate)
      .encrypt();

    tx = await paymentContract.connect(signers.alice).applyRate(encryptedRate.handles[0], encryptedRate.inputProof);
    await tx.wait();

    const encryptedBalanceAfter = await paymentContract.getEncryptedBalance(signers.alice.address);
    const clearAfter = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedBalanceAfter,
      paymentContractAddress,
      signers.alice,
    );

    expect(clearAfter).to.eq(clearAmount * clearRate);
  });
});
