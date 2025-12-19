#!/bin/bash
set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXAMPLES_DIR="$SCRIPT_DIR/../examples"
PAYMENT_GATEWAY_DIR="$EXAMPLES_DIR/payment-gateway"
FRONTEND_DIR="$EXAMPLES_DIR/frontend-demo"

echo "🚀 Starting Backend for Demo..."

cd "$PAYMENT_GATEWAY_DIR"

# 1. Start Node
echo "⚡ Starting Hardhat Node..."
npx hardhat node > /tmp/hardhat-node.log 2>&1 &
HARDHAT_PID=$!
echo "   Node running (PID: $HARDHAT_PID)"

# Cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping Node..."
    kill $HARDHAT_PID 2>/dev/null || true
    echo "Done."
}
trap cleanup EXIT

echo "⏳ Waiting for node to initialize..."
sleep 5

# 2. Deploy Contracts
echo "📝 Deploying Contracts..."
# We capture the output to find the address
DEPLOY_OUTPUT=$(npx hardhat --network localhost deploy)
echo "$DEPLOY_OUTPUT"

# Try to extract address from output or hardhat-deploy json
# But hardhat-deploy doesn't always output address clearly in stdout depending on config.
# Let's rely on tasks/deployment if possible, or parsing.
# The `deploy` script usually logs "FHEPaymentGateway deployed to: ..."

# A more robust way: use a task to get the address
# But we might not have a task for "get-address".
# Let's grep the output.
ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oE "0x[a-fA-F0-9]{40}" | tail -n 1)

if [ -z "$ADDRESS" ]; then
    echo "⚠️  Could not auto-detect address. Please check logs."
    echo "   Using default/common deterministic address: 0x5FbDB2315678afecb367f032d93F642f64180aa3"
    ADDRESS="0x5FbDB2315678afecb367f032d93F642f64180aa3"
else
    echo "✅ Detected Contract Address: $ADDRESS"
fi

# 3. Update Frontend
if [ -f "$FRONTEND_DIR/app/page.tsx" ]; then
    echo "🔄 Updating Frontend Configuration..."
    # Replace the constant in the file
    # We look for "const CONTRACT_ADDRESS = '...';"
    # Use sed compatible with mac
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/const CONTRACT_ADDRESS = '0x[a-fA-F0-9]*';/const CONTRACT_ADDRESS = '$ADDRESS';/" "$FRONTEND_DIR/app/page.tsx"
    else
        sed -i "s/const CONTRACT_ADDRESS = '0x[a-fA-F0-9]*';/const CONTRACT_ADDRESS = '$ADDRESS';/" "$FRONTEND_DIR/app/page.tsx"
    fi
     echo "   Updated app/page.tsx"
fi

echo ""
echo "================================================="
echo "🎉 Backend Ready!"
echo "   - Hardhat Node: http://127.0.0.1:8545"
echo "   - Contract: $ADDRESS"
echo ""
echo "👉 Now run the frontend in a separate terminal:"
echo "   cd bounty/examples/frontend-demo"
echo "   npm run dev"
echo ""
echo "Press Ctrl+C to stop the backend."
echo "================================================="

# Keep running
wait $HARDHAT_PID
