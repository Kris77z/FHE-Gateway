#!/bin/bash

# Fix workspace:^ dependencies in x402 packages for npm compatibility

set -e

X402_DIR="reference/Base-x402/typescript/packages"

echo "🔧 Fixing workspace dependencies in x402 packages..."

# List of packages to fix
PACKAGES=("x402-express" "x402-fetch" "x402-axios" "x402-next" "x402-hono")

for pkg in "${PACKAGES[@]}"; do
  PKG_FILE="$X402_DIR/$pkg/package.json"
  
  if [ -f "$PKG_FILE" ]; then
    # Backup if not already backed up
    if [ ! -f "$PKG_FILE.bak" ]; then
      cp "$PKG_FILE" "$PKG_FILE.bak"
    fi
    
    # Replace workspace:^ with file: path
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      sed -i '' 's|"x402": "workspace:\^"|"x402": "file:../x402"|g' "$PKG_FILE"
    else
      # Linux
      sed -i 's|"x402": "workspace:\^"|"x402": "file:../x402"|g' "$PKG_FILE"
    fi
    
    echo "✅ Fixed $pkg/package.json"
  else
    echo "⚠️  $pkg/package.json not found, skipping"
  fi
done

echo "✅ Done! All x402 packages fixed for npm compatibility"

