# FHEPaymentGateway Tests

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run coverage

# Run specific test file
npx hardhat test test/FHEPaymentGateway.test.ts
```

## Test Coverage

The test suite covers:

1. **Deployment**
   - Contract deployment verification

2. **addPayment**
   - Adding encrypted payments to user balances
   - Multiple payments to same user
   - Payments to different users

3. **applyRate**
   - Applying rates to encrypted amounts
   - Different rate scenarios

4. **getEncryptedBalance**
   - Retrieving encrypted balances
   - Empty balance handling

5. **Events**
   - PaymentAdded event emission
   - BalanceUpdated event emission

## Note

These tests use placeholder encrypted values. In production, you would:
1. Use Relayer SDK to encrypt actual values
2. Test with real FHEVM operations
3. Verify homomorphic operations work correctly



