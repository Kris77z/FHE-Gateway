# 快速演示指南

## 🚀 一键运行演示

### 方式1：使用演示脚本（推荐）

```bash
cd bounty

# Counter 示例
./scripts/demo-counter.sh

# Payment Gateway 示例
./scripts/demo-payment-gateway.sh

# User Decrypt 示例
./scripts/demo-user-decrypt.sh
```

### 方式2：手动执行（用于录制视频）

#### Counter 示例
```bash
cd bounty/examples/fhe-counter

# 终端1：启动节点
npx hardhat node

# 终端2：部署和交互
npx hardhat --network localhost deploy
npx hardhat --network localhost task:decrypt-count
npx hardhat --network localhost task:increment --value 1
npx hardhat --network localhost task:decrypt-count
npx hardhat --network localhost task:increment --value 2
npx hardhat --network localhost task:decrypt-count
npx hardhat --network localhost task:decrement --value 1
npx hardhat --network localhost task:decrypt-count
```

#### Payment Gateway 示例
```bash
cd bounty/examples/payment-gateway

# 终端1：启动节点
npx hardhat node

# 终端2：部署和交互
npx hardhat --network localhost deploy
npx hardhat --network localhost task:decrypt-balance
npx hardhat --network localhost task:add-payment --value 10
npx hardhat --network localhost task:decrypt-balance
npx hardhat --network localhost task:apply-rate --value 2
npx hardhat --network localhost task:decrypt-balance
```

#### User Decrypt 示例
```bash
cd bounty/examples/user-decrypt-single

# 终端1：启动节点
npx hardhat node

# 终端2：部署和交互
npx hardhat --network localhost deploy
npx hardhat --network localhost task:decrypt-value
npx hardhat --network localhost task:set-value --value 42
npx hardhat --network localhost task:decrypt-value
npx hardhat --network localhost task:set-value --value 100
npx hardhat --network localhost task:decrypt-value
```

## 📹 录制视频步骤

### 1. 准备工具
- **终端录屏**：asciinema / terminalizer / OBS Studio
- **终端美化**：oh-my-zsh / starship（可选）

### 2. 录制流程
1. 打开两个终端窗口
2. 终端1：运行 `npx hardhat node`（保持运行）
3. 终端2：执行上述命令序列
4. 关键步骤暂停，添加说明文字

### 3. 关键演示点
- ✅ **加密输入**：展示明文 → 密文
- ✅ **链上计算**：展示加密状态下的运算
- ✅ **用户解密**：展示密文 → 明文

## 📋 演示检查清单

- [ ] 环境准备（Node >= 20）
- [ ] 依赖安装完成
- [ ] 节点启动成功
- [ ] 合约部署成功
- [ ] 加密操作正常
- [ ] 解密结果正确
- [ ] 视频录制清晰

## 🔗 相关文档

- [完整演示方案](./DEMO_VIDEO_PLAN.md)
- [示例索引](./EXAMPLES.md)
- [主 README](./README.md)

