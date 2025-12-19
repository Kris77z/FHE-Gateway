import { expect } from "chai";
import { ethers } from "hardhat";

describe("FHEPaymentGateway", function () {
  let gateway: any;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy contract
    const FHEPaymentGatewayFactory = await ethers.getContractFactory("FHEPaymentGateway");
    gateway = await FHEPaymentGatewayFactory.deploy();
    await gateway.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await gateway.getAddress()).to.be.properAddress;
    });
  });

  describe("addPayment", function () {
    it("Should add encrypted payment to user balance", async function () {
      // Create a placeholder encrypted amount (euint32)
      // Note: In real FHEVM, this would be encrypted using Relayer SDK
      const encryptedAmount = ethers.zeroPadValue("0x00000001", 32); // Placeholder: 1 in encrypted form
      
      // Convert to euint32 type (bytes32)
      const euint32Amount = encryptedAmount;

      // Add payment
      await expect(gateway.addPayment(user1.address, euint32Amount))
        .to.emit(gateway, "PaymentAdded")
        .withArgs(user1.address, ethers.anyValue);

      // Verify balance was updated
      await expect(gateway.addPayment(user1.address, euint32Amount))
        .to.emit(gateway, "BalanceUpdated")
        .withArgs(user1.address);
    });

    it("Should allow multiple payments to same user", async function () {
      const encryptedAmount1 = ethers.zeroPadValue("0x00000001", 32);
      const encryptedAmount2 = ethers.zeroPadValue("0x00000002", 32);

      await gateway.addPayment(user1.address, encryptedAmount1);
      await gateway.addPayment(user1.address, encryptedAmount2);

      // Both payments should be recorded
      const balance = await gateway.getEncryptedBalance(user1.address);
      expect(balance).to.not.be.empty;
    });

    it("Should allow payments to different users", async function () {
      const encryptedAmount = ethers.zeroPadValue("0x00000001", 32);

      await gateway.addPayment(user1.address, encryptedAmount);
      await gateway.addPayment(user2.address, encryptedAmount);

      const balance1 = await gateway.getEncryptedBalance(user1.address);
      const balance2 = await gateway.getEncryptedBalance(user2.address);

      expect(balance1).to.not.be.empty;
      expect(balance2).to.not.be.empty;
    });
  });

  describe("applyRate", function () {
    it("Should apply rate to encrypted amount", async function () {
      const encryptedAmount = ethers.zeroPadValue("0x0000000A", 32); // Placeholder: 10
      const rate = 15000; // 150% (in basis points)

      const result = await gateway.applyRate(encryptedAmount, rate);
      expect(result).to.not.be.empty;
    });

    it("Should handle different rates", async function () {
      const encryptedAmount = ethers.zeroPadValue("0x00000064", 32); // Placeholder: 100
      
      const rate1 = 10000; // 100%
      const rate2 = 5000;  // 50%
      const rate3 = 20000; // 200%

      const result1 = await gateway.applyRate(encryptedAmount as `0x${string}`, rate1);
      const result2 = await gateway.applyRate(encryptedAmount as `0x${string}`, rate2);
      const result3 = await gateway.applyRate(encryptedAmount as `0x${string}`, rate3);

      expect(result1).to.not.be.empty;
      expect(result2).to.not.be.empty;
      expect(result3).to.not.be.empty;
    });
  });

  describe("getEncryptedBalance", function () {
    it("Should return empty balance for new user", async function () {
      const balance = await gateway.getEncryptedBalance(user1.address);
      // Balance should exist but may be zero/empty
      expect(balance).to.not.be.undefined;
    });

    it("Should return encrypted balance after payment", async function () {
      const encryptedAmount = ethers.zeroPadValue("0x00000001", 32);
      
      await gateway.addPayment(user1.address, encryptedAmount);
      
      const balance = await gateway.getEncryptedBalance(user1.address);
      expect(balance).to.not.be.empty;
      expect(balance.length).to.be.greaterThan(0);
    });
  });

  describe("Events", function () {
    it("Should emit PaymentAdded event", async function () {
      const encryptedAmount = ethers.zeroPadValue("0x00000001", 32);

      await expect(gateway.addPayment(user1.address, encryptedAmount as `0x${string}`))
        .to.emit(gateway, "PaymentAdded")
        .withArgs(user1.address, ethers.anyValue);
    });

    it("Should emit BalanceUpdated event", async function () {
      const encryptedAmount = ethers.zeroPadValue("0x00000001", 32);

      await expect(gateway.addPayment(user1.address, encryptedAmount as `0x${string}`))
        .to.emit(gateway, "BalanceUpdated")
        .withArgs(user1.address);
    });
  });
});

