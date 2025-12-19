# User Decrypt Single (user-decrypt-single)

- category: decrypt
- description: 单值存储+用户解密示例

## 运行步骤
```bash
npm install
npx hardhat node
npx hardhat deploy --network localhost
npx hardhat --network localhost task:set-value --value 42
npx hardhat --network localhost task:decrypt-value
```

## 说明
- 功能：`setValue` 存一条加密 euint32；`getValue` 返回加密值，由客户端/任务用 `userDecryptEuint` 解密验证。
- 仅针对本地 FHEVM Hardhat 节点（无公共测试网）。
- 使用默认助记词生成的本地账户完成部署与调用。
