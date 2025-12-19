#!/bin/bash
# Test script for FHE Service

echo "🚀 Starting FHE Service tests..."

# Activate virtual environment
source .venv/bin/activate

# Start service in background
echo "📡 Starting FastAPI service on port 8001..."
python main.py &
SERVICE_PID=$!

# Wait for service to start
sleep 3

# Test health check
echo ""
echo "✅ Testing health check endpoint..."
curl -s http://localhost:8001/health | python -m json.tool

# Test encryption endpoint
echo ""
echo "✅ Testing encryption endpoint..."
curl -s -X POST http://localhost:8001/api/fhe/encrypt \
  -H "Content-Type: application/json" \
  -d '{"amount": 100.0}' | python -m json.tool

# Test decryption endpoint
echo ""
echo "✅ Testing decryption endpoint..."
curl -s -X POST http://localhost:8001/api/fhe/decrypt \
  -H "Content-Type: application/json" \
  -d '{"ciphertext": "encrypted_100.0"}' | python -m json.tool

# Stop service
echo ""
echo "🛑 Stopping service..."
kill $SERVICE_PID 2>/dev/null

echo ""
echo "✨ Tests completed!"

