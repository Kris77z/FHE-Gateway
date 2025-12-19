# FHE Service

> Python-based FHE (Fully Homomorphic Encryption) service using Concrete Python

## Overview

This service provides FHE encryption/decryption capabilities for the PayAgent Gateway, enabling confidential payment processing.

## Setup

### 1. Create Virtual Environment

```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Service

```bash
uvicorn main:app --reload --port 8001
```

## API Endpoints

- `POST /api/fhe/encrypt` - Encrypt payment amount
- `POST /api/fhe/decrypt` - Decrypt ciphertext
- `GET /health` - Health check

## Project Structure

```
fhe-service/
├── main.py              # FastAPI application
├── circuit.py           # FHE circuit compilation
├── keys/                # Key storage directory
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Environment Variables

Create a `.env` file:

```env
# FHE Service Configuration
FHE_SERVICE_PORT=8001
FHE_KEYS_DIR=./keys
```

## Development

See `docs/fhe/progress/x402-fhe-daily-plan.md` for detailed development plan.

