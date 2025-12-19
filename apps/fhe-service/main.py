"""
FHE Service - FastAPI Application
Provides FHE encryption/decryption endpoints for PayAgent Gateway
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Optional
import uvicorn
from loguru import logger
import base64
import os
from utils import encode_ciphertext, decode_ciphertext, validate_amount, format_error_message

# Import FHE circuit (will fail gracefully if Concrete Python not installed)
try:
    from circuit import initialize_circuit, FHECircuit
    FHE_AVAILABLE = True
except ImportError:
    FHE_AVAILABLE = False
    logger.warning("Concrete Python not installed. FHE features will be disabled.")

# Configure logging
logger.add("fhe-service.log", rotation="10 MB", level="INFO")

# Initialize FHE circuit (if available)
fhe_circuit = None
if FHE_AVAILABLE:
    try:
        keys_dir = os.getenv("FHE_KEYS_DIR", "./keys")
        fhe_circuit = initialize_circuit(keys_dir=keys_dir, force_recompile=False)
        logger.info("FHE circuit initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize FHE circuit: {e}")
        logger.warning("Falling back to placeholder mode")
        FHE_AVAILABLE = False

app = FastAPI(
    title="FHE Service",
    description="Fully Homomorphic Encryption service for PayAgent Gateway",
    version="0.1.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Configure proper origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class EncryptRequest(BaseModel):
    """Request model for encryption"""
    amount: float = Field(
        ..., 
        gt=0, 
        le=999999.99,
        description="Payment amount to encrypt (0.01 to 999,999.99)"
    )
    
    @validator('amount')
    def validate_amount(cls, v):
        """Validate amount has at most 2 decimal places"""
        if round(v, 2) != v:
            raise ValueError("Amount must have at most 2 decimal places")
        return v


class EncryptResponse(BaseModel):
    """Response model for encryption"""
    ciphertext: str = Field(..., description="Base64 encoded ciphertext")
    public_key: Optional[str] = Field(None, description="Public key for encryption")


class DecryptRequest(BaseModel):
    """Request model for decryption"""
    ciphertext: str = Field(..., min_length=1, description="Base64 encoded ciphertext")
    
    @validator('ciphertext')
    def validate_ciphertext(cls, v):
        """Validate ciphertext is valid base64"""
        try:
            import base64
            base64.b64decode(v.encode('utf-8'))
            return v
        except Exception:
            raise ValueError("Invalid base64 ciphertext format")


class DecryptResponse(BaseModel):
    """Response model for decryption"""
    amount: float = Field(..., description="Decrypted payment amount")


# Health Check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "fhe-service"}


# Encryption Endpoint
@app.post("/api/fhe/encrypt", response_model=EncryptResponse)
async def encrypt_amount(request: EncryptRequest):
    """
    Encrypt a payment amount using FHE
    
    Args:
        request: EncryptRequest containing the amount to encrypt
        
    Returns:
        EncryptResponse with encrypted ciphertext
    """
    try:
        # Validate amount
        validate_amount(request.amount)
        
        logger.info(f"Encryption request received: amount={request.amount}")
        
        if FHE_AVAILABLE and fhe_circuit is not None:
            # Real FHE encryption
            try:
                ciphertext_bytes = fhe_circuit.encrypt(request.amount)
                ciphertext = encode_ciphertext(ciphertext_bytes)
                logger.info(f"FHE encryption successful: amount={request.amount}")
            except Exception as e:
                logger.error(f"FHE encryption failed: {e}")
                raise HTTPException(
                    status_code=500, 
                    detail=f"FHE encryption failed: {format_error_message(e)}"
                )
        else:
            # Placeholder implementation (for testing without Concrete Python)
            ciphertext = encode_ciphertext(f"encrypted_{request.amount}".encode())
            logger.warning("Using placeholder encryption (Concrete Python not available)")
        
        return EncryptResponse(
            ciphertext=ciphertext,
            public_key=None
        )
    except HTTPException:
        raise
    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=format_error_message(e))
    except Exception as e:
        logger.error(f"Encryption error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Encryption failed: {format_error_message(e)}")


# Decryption Endpoint
@app.post("/api/fhe/decrypt", response_model=DecryptResponse)
async def decrypt_amount(request: DecryptRequest):
    """
    Decrypt a ciphertext to get the payment amount
    
    Args:
        request: DecryptRequest containing the ciphertext to decrypt
        
    Returns:
        DecryptResponse with decrypted amount
    """
    try:
        logger.info(f"Decryption request received")
        
        # Decode ciphertext
        try:
            ciphertext_bytes = decode_ciphertext(request.ciphertext)
        except ValueError as e:
            logger.warning(f"Invalid ciphertext format: {e}")
            raise HTTPException(status_code=400, detail=format_error_message(e))
        
        if FHE_AVAILABLE and fhe_circuit is not None:
            # Real FHE decryption
            try:
                amount = fhe_circuit.decrypt(ciphertext_bytes)
                logger.info(f"FHE decryption successful: amount={amount}")
            except Exception as e:
                logger.error(f"FHE decryption failed: {e}")
                raise HTTPException(
                    status_code=500,
                    detail=f"FHE decryption failed: {format_error_message(e)}"
                )
        else:
            # Placeholder implementation (for testing without Concrete Python)
            try:
                decoded = ciphertext_bytes.decode('utf-8')
                if decoded.startswith("encrypted_"):
                    amount = float(decoded.replace("encrypted_", ""))
                else:
                    raise ValueError("Invalid ciphertext format")
                logger.warning("Using placeholder decryption (Concrete Python not available)")
            except Exception as e:
                logger.error(f"Placeholder decryption failed: {e}")
                raise HTTPException(status_code=400, detail=format_error_message(e))
        
        # Validate decrypted amount
        validate_amount(amount)
        
        return DecryptResponse(amount=amount)
    except HTTPException:
        raise
    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=format_error_message(e))
    except Exception as e:
        logger.error(f"Decryption error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Decryption failed: {format_error_message(e)}")


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )

