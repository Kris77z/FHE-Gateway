import { expect } from "chai";
import { ethers } from "hardhat";

/**
 * FHE Counter Test Suite
 * Based on Zama's official example: https://docs.zama.org/protocol/examples/#counter.sol
 * 
 * Note: These tests use placeholder encrypted values.
 * In production, use Relayer SDK to encrypt actual values.
 */
describe("FHECounter", function () {
  let counter: any;
  let owner: any;
  let alice: any;

  beforeEach(async function () {
    [owner, alice] = await ethers.getSigners();

    // Deploy contract
    const FHECounterFactory = await ethers.getContractFactory("FHECounter");
    counter = await FHECounterFactory.deploy();
    await counter.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await counter.getAddress()).to.be.properAddress;
    });

    it("encrypted count should be uninitialized after deployment", async function () {
      const encryptedCount = await counter.getCount();
      // Expect initial count to be bytes32(0) after deployment
      // (meaning the encrypted count value is uninitialized)
      expect(encryptedCount).to.eq(ethers.ZeroHash);
    });
  });

  describe("increment", function () {
    it("Should increment the counter by encrypted value", async function () {
      // Create placeholder encrypted value (1)
      // In production, this would be encrypted using Relayer SDK
      const encryptedOne = ethers.zeroPadValue("0x00000001", 32);

      // Increment by 1
      await counter.increment(encryptedOne);

      // Verify count was updated
      const encryptedCount = await counter.getCount();
      expect(encryptedCount).to.not.eq(ethers.ZeroHash);

      // Get sealed output for decryption
      const sealedCount = await counter.getSealedCount();
      expect(sealedCount).to.not.be.empty;
    });

    it("Should allow multiple increments", async function () {
      const encryptedOne = ethers.zeroPadValue("0x00000001", 32);
      const encryptedTwo = ethers.zeroPadValue("0x00000002", 32);

      // Increment by 1
      await counter.increment(encryptedOne);

      // Increment by 2
      await counter.increment(encryptedTwo);

      // Verify count was updated
      const encryptedCount = await counter.getCount();
      expect(encryptedCount).to.not.eq(ethers.ZeroHash);
    });
  });

  describe("decrement", function () {
    it("Should decrement the counter by encrypted value", async function () {
      const encryptedOne = ethers.zeroPadValue("0x00000001", 32);
      const encryptedTwo = ethers.zeroPadValue("0x00000002", 32);

      // First increment by 2
      await counter.increment(encryptedTwo);

      // Then decrement by 1
      await counter.decrement(encryptedOne);

      // Verify count was updated
      const encryptedCount = await counter.getCount();
      expect(encryptedCount).to.not.eq(ethers.ZeroHash);
    });
  });

  describe("getSealedCount", function () {
    it("Should return sealed output for decryption", async function () {
      const encryptedOne = ethers.zeroPadValue("0x00000001", 32);

      await counter.increment(encryptedOne);

      const sealedCount = await counter.getSealedCount();
      expect(sealedCount).to.not.be.empty;
      expect(sealedCount.length).to.be.greaterThan(0);
    });
  });
});



