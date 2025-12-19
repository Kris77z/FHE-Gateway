# FHEVM Contracts

This directory contains FHEVM-compatible smart contracts for confidential payments.

## Contracts

### FHEPaymentGateway.sol

Main contract for confidential payment processing using FHEVM.

**Features:**
- Encrypted balance storage per user
- Homomorphic addition for accumulating payments
- Homomorphic multiplication for applying rates
- Sealed output for off-chain decryption

**Functions:**
- `addPayment(address user, euint32 encryptedAmount)`: Add encrypted payment to user balance
- `applyRate(euint32 encryptedAmount, uint32 rate)`: Apply rate to encrypted amount
- `getEncryptedBalance(address user)`: Get encrypted balance (sealed output)

### FHECounter.sol

A simple FHE counter example based on [Zama's official example](https://docs.zama.org/protocol/examples/#counter.sol).

**Features:**
- Encrypted counter storage
- Homomorphic increment operation
- Homomorphic decrement operation
- Sealed output for decryption

**Functions:**
- `getCount()`: Get encrypted count
- `increment(euint32 encryptedValue)`: Increment by encrypted value
- `decrement(euint32 encryptedValue)`: Decrement by encrypted value
- `getSealedCount()`: Get sealed output for decryption

### FHE.sol

Placeholder FHE library for compilation. This should be replaced with actual FHEVM contracts when installed.

**Note:** In production, replace this with:
```solidity
import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
```

## Usage

### Compile

```bash
npm run compile
```

### Test

```bash
npm test
```

### Deploy

```bash
npm run deploy:base-sepolia
```

## References

- [Zama FHEVM Documentation](https://docs.zama.org/protocol)
- [FHE Counter Example](https://docs.zama.org/protocol/examples/#counter.sol)
- [FHEVM GitHub](https://github.com/zama-ai/fhevm)



