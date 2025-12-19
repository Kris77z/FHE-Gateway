# FHE Payment Gateway (payment-gateway)

- category: payments
- description: 加密余额存储+费率乘法

## 运行步骤
```bash
npm install
npx hardhat node
npx hardhat deploy --network localhost
npx hardhat --network localhost task:add-payment --value 10
npx hardhat --network localhost task:apply-rate --value 2
npx hardhat --network localhost task:decrypt-balance
```

## 说明
- 功能：`addPayment` 将加密金额累加到调用者余额；`applyRate` 将余额乘以加密费率；`getEncryptedBalance` 返回加密余额，需用 `fhevm.userDecryptEuint` 或任务脚本解密。
- 仅针对本地 FHEVM Hardhat 节点（无公共测试网）。
- 使用默认助记词生成的本地账户完成部署与调用。
