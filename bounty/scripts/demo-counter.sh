#!/bin/bash
# FHE Counter 演示脚本
# 用途：展示 FHE Counter 的完整工作流程

set -e  # 遇到错误立即退出

echo "=========================================="
echo "  FHE Counter 演示"
echo "=========================================="
echo ""

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXAMPLE_DIR="$SCRIPT_DIR/../examples/fhe-counter"

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

echo "🔍 查看初始计数器值..."
npx hardhat --network localhost task:decrypt-count
echo ""

echo "➕ 加密输入值 1，调用 increment..."
npx hardhat --network localhost task:increment --value 1
echo ""

echo "🔍 解密查看计数器值（应为 1）..."
npx hardhat --network localhost task:decrypt-count
echo ""

echo "➕ 加密输入值 2，再次调用 increment..."
npx hardhat --network localhost task:increment --value 2
echo ""

echo "🔍 解密查看计数器值（应为 3）..."
npx hardhat --network localhost task:decrypt-count
echo ""

echo "➖ 加密输入值 1，调用 decrement..."
npx hardhat --network localhost task:decrement --value 1
echo ""

echo "🔍 最终解密结果（应为 2）..."
npx hardhat --network localhost task:decrypt-count
echo ""

echo "=========================================="
echo "✅ FHE Counter 演示完成！"
echo "=========================================="

