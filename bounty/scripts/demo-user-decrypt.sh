#!/bin/bash
# User Decrypt Single 演示脚本
# 用途：展示单值存储与用户解密流程

set -e  # 遇到错误立即退出

echo "=========================================="
echo "  User Decrypt Single 演示"
echo "=========================================="
echo ""

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXAMPLE_DIR="$SCRIPT_DIR/../examples/user-decrypt-single"

cd "$EXAMPLE_DIR"

echo "📁 当前目录: $(pwd)"
echo ""

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
    echo ""
fi

echo "🚀 启动本地 FHEVM 节点（后台运行）..."
npx hardhat node > /tmp/hardhat-node.log 2>&1 &
HARDHAT_PID=$!
echo "  节点进程 ID: $HARDHAT_PID"
echo "  日志文件: /tmp/hardhat-node.log"
sleep 5  # 等待节点启动

# 清理函数
cleanup() {
    echo ""
    echo "🧹 清理资源..."
    kill $HARDHAT_PID 2>/dev/null || true
    wait $HARDHAT_PID 2>/dev/null || true
    echo "✅ 清理完成"
}

# 注册清理函数
trap cleanup EXIT

echo ""
echo "📝 部署合约..."
npx hardhat --network localhost deploy
echo ""

echo "🔍 查看初始值（应为 0）..."
npx hardhat --network localhost task:decrypt-value
echo ""

echo "💾 设置加密值 42..."
npx hardhat --network localhost task:set-value --value 42
echo ""

echo "🔍 解密查看值（应为 42）..."
npx hardhat --network localhost task:decrypt-value
echo ""

echo "💾 覆盖为新值 100..."
npx hardhat --network localhost task:set-value --value 100
echo ""

echo "🔍 解密查看新值（应为 100）..."
npx hardhat --network localhost task:decrypt-value
echo ""

echo "=========================================="
echo "✅ User Decrypt Single 演示完成！"
echo "=========================================="

