# Bounty 交付物（本地 FHEVM）

本目录封装 Bounty 相关产物，不影响现有项目。使用方式：

- `base-template/`：从 `reference/fhevm-hardhat-template` 复制，内置 FHEVM Hardhat 插件，默认仅支持本地 FHEVM 节点（`npx hardhat node`）。
- `tools/`：TypeScript CLI，用于生成示例仓库与文档。
- `examples/`：由 CLI 生成的独立 Hardhat 示例仓库（每例一仓）。

## 准备

```bash
cd bounty
npm install
```

要求 Node.js >= 18。

## 生成示例（每例一仓）

```bash
# 例：生成 counter 示例
npm run create-example -- --name fhe-counter --title "FHE Counter" --category basic --description "加/减/封装输出"
```

- 脚本会从 `base-template/` 复制到 `examples/<name>/`，并更新包名/README 元数据。
- 生成后进入 `examples/<name>/` 安装依赖、启动本地 FHEVM 节点并部署：

```bash
cd bounty/examples/fhe-counter
npm install
npx hardhat node               # 本地 FHEVM 节点
npx hardhat deploy --network localhost
```

## 本地“真密文”演示脚本思路

1) 启动本地 FHEVM Hardhat 节点：`npx hardhat node`（使用默认助记词账户）。  
2) 部署：`npx hardhat deploy --network localhost`。  
3) 通过 Hardhat 任务/脚本调用 relayer/FHEVM 插件的加密接口生成密文，发送交易。  
4) 调用合约读取 sealed output，使用同一工具本地解密，记录交易哈希与解密结果用于录屏。  

> “用户解密”示例使用最小逻辑：存单个 euint32，调用获取 sealed 输出并解密验证。

## 文档生成

```bash
npm run generate-docs
```

从示例合约/测试注释提取概要，生成 GitBook 兼容的 README 草稿。

## 演示脚本

快速运行演示脚本（自动启动节点、部署、交互）：

```bash
# Counter 示例
./scripts/demo-counter.sh

# Payment Gateway 示例
./scripts/demo-payment-gateway.sh

# User Decrypt 示例
./scripts/demo-user-decrypt.sh
```

详细演示方案请参考：[DEMO_VIDEO_PLAN.md](./DEMO_VIDEO_PLAN.md)

## 目录约束

- Solidity 文件尽量 < 250 行；TS/脚本 < 1000 行。
- 每层目录文件数尽量 ≤ 8，超出则分子目录。



