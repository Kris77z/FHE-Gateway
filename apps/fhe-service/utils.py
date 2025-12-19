"""
Utility functions for FHE Service
"""

import base64
from typing import Optional
from loguru import logger


def encode_ciphertext(ciphertext_bytes: bytes) -> str:
    """
    Encode ciphertext bytes to base64 string for JSON transmission
    
    Args:
        ciphertext_bytes: Encrypted ciphertext as bytes
        
    Returns:
        Base64 encoded string
    """
    try:
        return base64.b64encode(ciphertext_bytes).decode('utf-8')
    except Exception as e:
        logger.error(f"Failed to encode ciphertext: {e}")
        raise ValueError(f"Ciphertext encoding failed: {e}")


def decode_ciphertext(ciphertext_str: str) -> bytes:
    """
    Decode base64 string to ciphertext bytes
    
    Args:
        ciphertext_str: Base64 encoded ciphertext string
        
    Returns:
        Decrypted ciphertext as bytes
    """
    try:
        return base64.b64decode(ciphertext_str.encode('utf-8'))
    except Exception as e:
        logger.error(f"Failed to decode ciphertext: {e}")
        raise ValueError(f"Invalid ciphertext format: {e}")


def validate_amount(amount: float) -> bool:
    """
    Validate payment amount
    
    Args:
        amount: Payment amount to validate
        
    Returns:
        True if valid, raises ValueError if invalid
    """
    if amount <= 0:
        raise ValueError("Amount must be greater than 0")
    if amount > 999999.99:
        raise ValueError("Amount must be less than or equal to 999,999.99")
    
    # Check decimal places (max 2)
    if round(amount, 2) != amount:
        raise ValueError("Amount must have at most 2 decimal places")
    
    return True


def format_error_message(error: Exception) -> str:
    """
    Format error message for API response
    
    Args:
        error: Exception object
        
    Returns:
        Formatted error message
    """
    error_type = type(error).__name__
    error_msg = str(error)
    
    # User-friendly error messages
    if "ValueError" in error_type:
        return f"Validation error: {error_msg}"
    elif "RuntimeError" in error_type:
        return f"Runtime error: {error_msg}"
    elif "FileNotFoundError" in error_type:
        return f"Configuration error: Keys not found. Please initialize the circuit first."
    else:
        return f"Error: {error_msg}"

