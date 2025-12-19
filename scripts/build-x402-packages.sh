#!/bin/bash

# Build x402 packages from reference directory
# This script builds the x402-express and x402 packages needed by the server

set -e

echo "🔨 Building x402 packages..."

# Navigate to x402 monorepo
cd "$(dirname "$0")/../reference/Base-x402/typescript"

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm is required but not installed."
  echo "   Installing pnpm..."
  npm install -g pnpm
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies with pnpm..."
  pnpm install
fi

# Build packages
echo "🏗️  Building packages with pnpm..."
pnpm run build

echo "✅ x402 packages built successfully!"
echo ""
echo "You can now install dependencies in apps/x402-server-evm:"
echo "  cd apps/x402-server-evm"
echo "  npm install"

