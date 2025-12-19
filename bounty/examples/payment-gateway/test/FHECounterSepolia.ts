import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm, deployments } from "hardhat";
import { FHEPaymentGateway } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  alice: HardhatEthersSigner;
};

describe("FHEPaymentGatewaySepolia", function () {
  let signers: Signers;
  let paymentContract: FHEPaymentGateway;
  let paymentContractAddress: string;
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
      const deployment = await deployments.get("FHEPaymentGateway");
      paymentContractAddress = deployment.address;
      paymentContract = await ethers.getContractAt("FHEPaymentGateway", deployment.address);
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

  it("add payment then apply rate", async function () {
    steps = 8;

    this.timeout(4 * 40000);

    progress(`Encrypting payment '10'...`);
    const encryptedPayment = await fhevm
      .createEncryptedInput(paymentContractAddress, signers.alice.address)
      .add32(10)
      .encrypt();

    progress(
      `Call addPayment(10) contract=${paymentContractAddress} handle=${ethers.hexlify(encryptedPayment.handles[0])} signer=${signers.alice.address}...`,
    );
    let tx = await paymentContract
      .connect(signers.alice)
      .addPayment(encryptedPayment.handles[0], encryptedPayment.inputProof);
    await tx.wait();

    progress(`Call getEncryptedBalance()...`);
    const encryptedBalance = await paymentContract.getEncryptedBalance(signers.alice.address);
    expect(encryptedBalance).to.not.eq(ethers.ZeroHash);

    progress(`Decrypting balance ${encryptedBalance}...`);
    const clearBalance = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedBalance,
      paymentContractAddress,
      signers.alice,
    );
    progress(`Clear balance=${clearBalance}`);

    progress(`Encrypting rate '2'...`);
    const encryptedRate = await fhevm
      .createEncryptedInput(paymentContractAddress, signers.alice.address)
      .add32(2)
      .encrypt();

    progress(`Call applyRate(2)...`);
    tx = await paymentContract.connect(signers.alice).applyRate(encryptedRate.handles[0], encryptedRate.inputProof);
    await tx.wait();

    progress(`Decrypting updated balance...`);
    const encryptedBalanceAfter = await paymentContract.getEncryptedBalance(signers.alice.address);
    const clearBalanceAfter = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedBalanceAfter,
      paymentContractAddress,
      signers.alice,
    );
    progress(`Clear balance after=${clearBalanceAfter}`);

    expect(clearBalanceAfter).to.eq(20);
  });
});
