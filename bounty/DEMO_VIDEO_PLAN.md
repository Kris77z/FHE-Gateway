# Bounty 演示视频录制方案

## 📋 目录

1. [概述](#概述)
2. [演示内容规划](#演示内容规划)
3. [录制方案A：命令行演示（推荐）](#录制方案a命令行演示推荐)
4. [录制方案B：前端界面演示（可选）](#录制方案b前端界面演示可选)
5. [技术准备](#技术准备)
6. [提交材料清单](#提交材料清单)

---

## 概述

### 目标
展示 FHEVM 示例的完整工作流程：**加密输入 → 链上计算 → 用户解密**，证明真实 FHEVM 网络集成。

### 核心演示点
1. ✅ **真实加密**：使用 FHEVM 插件在本地节点生成密文
2. ✅ **链上计算**：合约在加密状态下执行运算（加法、乘法）
3. ✅ **用户解密**：只有用户私钥能解密最终结果
4. ✅ **隐私保护**：链上数据全程加密，无法被第三方查看

### 演示时长
- 单个示例：5-8 分钟
- 完整演示（3个示例）：15-20 分钟

---

## 演示内容规划

### 示例1：FHE Counter（基础示例）
**演示目标**：展示 FHEVM 基本加密运算

**关键步骤**：
1. 启动本地 FHEVM 节点
2. 部署 FHECounter 合约
3. 加密输入值 `1`，调用 `increment`
4. 解密查看计数器值（应为 `1`）
5. 再次加密输入值 `2`，调用 `increment`
6. 解密查看计数器值（应为 `3`）
7. 调用 `decrement` 减 `1`
8. 最终解密结果（应为 `2`）

**演示重点**：
- 加密输入过程（明文 → 密文）
- 链上加密运算（FHE.add / FHE.sub）
- 用户解密验证（密文 → 明文）

---

### 示例2：FHE Payment Gateway（支付网关）
**演示目标**：展示加密余额存储与费率计算

**关键步骤**：
1. 启动本地 FHEVM 节点
2. 部署 FHEPaymentGateway 合约
3. 查看初始余额（应为 `0`）
4. 添加加密支付 `10` → `addPayment(10)`
5. 解密查看余额（应为 `10`）
6. 应用加密费率 `2` → `applyRate(2)`（乘法运算）
7. 解密查看最终余额（应为 `20`）

**演示重点**：
- 加密余额存储（mapping(address => euint32)）
- 加密乘法运算（FHE.mul）
- 用户私钥解密余额

---

### 示例3：User Decrypt Single（用户解密）
**演示目标**：展示单值存储与用户解密流程

**关键步骤**：
1. 启动本地 FHEVM 节点
2. 部署 UserDecryptSingle 合约
3. 设置加密值 `42` → `setValue(42)`
4. 解密查看值（应为 `42`）
5. 覆盖为新值 `100` → `setValue(100)`
6. 解密查看新值（应为 `100`）

**演示重点**：
- 单值加密存储
- 用户端解密流程
- 值覆盖与更新

---

## 录制方案A：命令行演示（推荐）

### 工具准备

#### 1. 终端录屏工具（三选一）
- **asciinema**（推荐）：轻量级，生成可交互的终端录制
  ```bash
  npm install -g asciinema
  asciinema rec demo.cast
  ```
- **terminalizer**：生成 GIF/MP4
  ```bash
  npm install -g terminalizer
  terminalizer record demo
  ```
- **OBS Studio**：专业录屏，支持多窗口

#### 2. 终端美化（可选）
- 使用 `oh-my-zsh` 或 `starship` 美化终端
- 使用 `bat` 替代 `cat` 显示代码高亮
- 使用 `exa` 替代 `ls` 显示文件列表

### 录制脚本模板

#### 脚本1：FHE Counter 演示

```bash
#!/bin/bash
# FHE Counter 演示脚本

echo "=== FHE Counter 演示 ==="
echo ""

# 1. 展示项目结构
echo "📁 项目结构："
cd bounty/examples/fhe-counter
ls -la

echo ""
echo "📦 安装依赖（如需要）："
npm install

echo ""
echo "🚀 启动本地 FHEVM 节点（终端1，后台运行）："
npx hardhat node &
HARDHAT_PID=$!
sleep 5

echo ""
echo "📝 部署合约："
npx hardhat --network localhost deploy

echo ""
echo "🔍 查看初始计数器值："
npx hardhat --network localhost task:decrypt-count

echo ""
echo "➕ 加密输入值 1，调用 increment："
npx hardhat --network localhost task:increment --value 1

echo ""
echo "🔍 解密查看计数器值（应为 1）："
npx hardhat --network localhost task:decrypt-count

echo ""
echo "➕ 加密输入值 2，再次调用 increment："
npx hardhat --network localhost task:increment --value 2

echo ""
echo "🔍 解密查看计数器值（应为 3）："
npx hardhat --network localhost task:decrypt-count

echo ""
echo "➖ 加密输入值 1，调用 decrement："
npx hardhat --network localhost task:decrement --value 1

echo ""
echo "🔍 最终解密结果（应为 2）："
npx hardhat --network localhost task:decrypt-count

echo ""
echo "✅ 演示完成！"
kill $HARDHAT_PID
```

#### 脚本2：Payment Gateway 演示

```bash
#!/bin/bash
# FHE Payment Gateway 演示脚本

echo "=== FHE Payment Gateway 演示 ==="
echo ""

cd bounty/examples/payment-gateway

echo "🚀 启动本地 FHEVM 节点（终端1，后台运行）："
npx hardhat node &
HARDHAT_PID=$!
sleep 5

echo ""
echo "📝 部署合约："
npx hardhat --network localhost deploy

echo ""
echo "💰 查看初始余额（应为 0）："
npx hardhat --network localhost task:decrypt-balance

echo ""
echo "💳 添加加密支付 10："
npx hardhat --network localhost task:add-payment --value 10

echo ""
echo "💰 解密查看余额（应为 10）："
npx hardhat --network localhost task:decrypt-balance

echo ""
echo "📊 应用加密费率 2（乘法运算）："
npx hardhat --network localhost task:apply-rate --value 2

echo ""
echo "💰 最终解密余额（应为 20）："
npx hardhat --network localhost task:decrypt-balance

echo ""
echo "✅ 演示完成！"
kill $HARDHAT_PID
```

#### 脚本3：User Decrypt Single 演示

```bash
#!/bin/bash
# User Decrypt Single 演示脚本

echo "=== User Decrypt Single 演示 ==="
echo ""

cd bounty/examples/user-decrypt-single

echo "🚀 启动本地 FHEVM 节点（终端1，后台运行）："
npx hardhat node &
HARDHAT_PID=$!
sleep 5

echo ""
echo "📝 部署合约："
npx hardhat --network localhost deploy

echo ""
echo "🔍 查看初始值（应为 0）："
npx hardhat --network localhost task:decrypt-value

echo ""
echo "💾 设置加密值 42："
npx hardhat --network localhost task:set-value --value 42

echo ""
echo "🔍 解密查看值（应为 42）："
npx hardhat --network localhost task:decrypt-value

echo ""
echo "💾 覆盖为新值 100："
npx hardhat --network localhost task:set-value --value 100

echo ""
echo "🔍 解密查看新值（应为 100）："
npx hardhat --network localhost task:decrypt-value

echo ""
echo "✅ 演示完成！"
kill $HARDHAT_PID
```

### 录制技巧

#### 1. 分屏布局
- **左侧窗口**：Hardhat 节点运行日志（显示加密计算过程）
- **右侧窗口**：执行命令和查看结果

#### 2. 关键步骤标注
在每个关键步骤暂停，添加文字说明：
- 🔐 **加密阶段**：展示明文 → 密文转换
- ⛓️ **链上计算**：展示加密状态下的运算
- 🔓 **解密阶段**：展示密文 → 明文转换

#### 3. 输出高亮
使用工具高亮关键输出：
- 交易哈希（绿色）
- 加密值（黄色）
- 解密结果（蓝色）

#### 4. 节奏控制
- 每个命令执行后暂停 2-3 秒
- 关键步骤暂停 5 秒并添加说明
- 总时长控制在 5-8 分钟/示例

---

## 录制方案B：前端界面演示（可选）

### 方案概述
创建一个简单的 React 前端页面，通过 Web3 连接本地 FHEVM 节点，可视化展示加密/解密流程。

### 技术栈
- **前端框架**：Next.js + React
- **Web3 库**：ethers.js v6
- **FHE 加密**：`@zama-fhe/relayer-sdk`（浏览器端）
- **UI 组件**：shadcn/ui + Tailwind CSS

### 功能设计

#### 页面1：FHE Counter
```
┌─────────────────────────────────────┐
│  FHE Counter Demo                  │
├─────────────────────────────────────┤
│  Contract Address: 0x1234...       │
│                                     │
│  Current Count (Encrypted):        │
│  0xabcd1234...                      │
│                                     │
│  Current Count (Decrypted): 5      │
│                                     │
│  ┌─────────────┐  ┌─────────────┐ │
│  │ Increment   │  │ Decrement   │ │
│  └─────────────┘  └─────────────┘ │
│                                     │
│  Input Value: [____]                │
│                                     │
│  [Execute Transaction]              │
└─────────────────────────────────────┘
```

#### 页面2：Payment Gateway
```
┌─────────────────────────────────────┐
│  FHE Payment Gateway Demo          │
├─────────────────────────────────────┤
│  Contract Address: 0x5678...       │
│                                     │
│  Your Balance (Encrypted):         │
│  0xefgh5678...                      │
│                                     │
│  Your Balance (Decrypted): 20      │
│                                     │
│  ┌─────────────┐  ┌─────────────┐ │
│  │ Add Payment │  │ Apply Rate  │ │
│  └─────────────┘  └─────────────┘ │
│                                     │
│  Amount/Rate: [____]                │
│                                     │
│  [Execute Transaction]              │
│                                     │
│  Transaction History:               │
│  • 0xabc... Add Payment(10)         │
│  • 0xdef... Apply Rate(2)           │
└─────────────────────────────────────┘
```

#### 页面3：User Decrypt Single
```
┌─────────────────────────────────────┐
│  User Decrypt Single Demo           │
├─────────────────────────────────────┤
│  Contract Address: 0x9abc...       │
│                                     │
│  Stored Value (Encrypted):          │
│  0x1234abcd...                      │
│                                     │
│  Stored Value (Decrypted): 42      │
│                                     │
│  Set New Value: [____]              │
│                                     │
│  [Set Value]  [Decrypt Value]      │
└─────────────────────────────────────┘
```

### 实现步骤

1. **创建前端项目**
   ```bash
   cd bounty
   npx create-next-app@latest demo-frontend --typescript --tailwind --app
   cd demo-frontend
   npm install ethers@^6 @zama-fhe/relayer-sdk
   ```

2. **连接本地节点**
   ```typescript
   // lib/web3.ts
   import { ethers } from 'ethers';
   
   export const getProvider = () => {
     return new ethers.JsonRpcProvider('http://localhost:8545');
   };
   ```

3. **FHE 加密集成**
   ```typescript
   // lib/fhe.ts
   import { createInstance } from '@zama-fhe/relayer-sdk';
   
   export const encryptValue = async (value: number, contractAddress: string, userAddress: string) => {
     const instance = await createInstance({ chainId: 31337 }); // localhost
     const encrypted = await instance.encrypt32(value, contractAddress, userAddress);
     return encrypted;
   };
   ```

4. **合约交互**
   ```typescript
   // lib/contracts.ts
   import { ethers } from 'ethers';
   import FHEPaymentGatewayABI from './abis/FHEPaymentGateway.json';
   
   export const getContract = (address: string) => {
     const provider = getProvider();
     const signer = provider.getSigner();
     return new ethers.Contract(address, FHEPaymentGatewayABI, signer);
   };
   ```

### 优缺点对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| **命令行演示** | ✅ 简单直接<br>✅ 符合开发者习惯<br>✅ 展示完整流程 | ❌ 视觉效果一般 |
| **前端演示** | ✅ 视觉效果好<br>✅ 用户友好<br>✅ 展示交互流程 | ❌ 开发成本高<br>❌ 需要额外时间 |

**建议**：优先使用命令行演示，如需增强视觉效果再考虑前端。

---

## 技术准备

### 环境要求
- Node.js >= 20（推荐 >= 22）
- npm >= 7.0.0
- Git（用于版本控制）

### 依赖检查
```bash
# 检查 Node 版本
node --version  # 应 >= 20

# 检查 npm 版本
npm --version   # 应 >= 7.0.0

# 检查 Hardhat
npx hardhat --version
```

### 测试流程
在录制前，确保每个示例都能正常运行：

```bash
# 测试 Counter
cd bounty/examples/fhe-counter
npm install
npm test  # 应全部通过

# 测试 Payment Gateway
cd ../payment-gateway
npm install
npm test  # 应全部通过

# 测试 User Decrypt
cd ../user-decrypt-single
npm install
npm test  # 应全部通过
```

---

## 提交材料清单

### 必需材料
- [x] **代码仓库**：包含 `bounty/` 目录的完整代码
- [x] **base-template**：FHEVM Hardhat 模板
- [x] **3个示例**：fhe-counter, payment-gateway, user-decrypt-single
- [x] **自动化脚本**：create-fhevm-example.ts, generate-docs.ts
- [x] **文档**：README.md, EXAMPLES.md

### 演示材料
- [ ] **演示视频**：15-20 分钟，展示 3 个示例
- [ ] **视频脚本**：详细的命令序列和说明
- [ ] **截图**：关键步骤的截图（可选）

### 文档材料
- [x] **README.md**：项目说明和使用指南
- [x] **EXAMPLES.md**：示例索引
- [ ] **DEMO_VIDEO_PLAN.md**：本方案文档

### 提交格式
- **GitHub 仓库**：公开仓库，包含完整代码
- **视频平台**：YouTube / Bilibili / 其他
- **文档平台**：GitBook / GitHub Pages（可选）

---

## 时间规划

### 阶段1：准备（1-2 天）
- [x] 完成代码实现
- [x] 测试所有示例
- [ ] 准备演示脚本
- [ ] 测试录制工具

### 阶段2：录制（1 天）
- [ ] 录制 Counter 演示（5-8 分钟）
- [ ] 录制 Payment Gateway 演示（5-8 分钟）
- [ ] 录制 User Decrypt 演示（5-8 分钟）
- [ ] 剪辑和添加字幕

### 阶段3：提交（0.5 天）
- [ ] 整理提交材料
- [ ] 上传视频
- [ ] 更新文档链接
- [ ] 提交 Bounty

---

## 注意事项

1. **网络环境**：确保本地 FHEVM 节点稳定运行
2. **命令执行**：每个命令执行后等待足够时间
3. **错误处理**：准备备用方案，如命令失败如何处理
4. **隐私保护**：不要在视频中暴露私钥或敏感信息
5. **清晰度**：确保终端字体大小适中，便于观看

---

## 参考资源

- [FHEVM 官方文档](https://docs.zama.ai/fhevm)
- [Hardhat 文档](https://hardhat.org/docs)
- [asciinema 使用指南](https://asciinema.org/docs/usage)
- [Zama Bounty 要求](https://www.zama.org/post/bounty-track-december-2025-build-the-fhevm-example-hub)

---

**最后更新**：2025-01-XX
**维护者**：Bounty 团队

