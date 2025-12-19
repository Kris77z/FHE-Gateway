"""
API Integration Tests for FHE Service
"""

import pytest
import requests
import json
from pathlib import Path
import sys

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

BASE_URL = "http://localhost:8001"


class TestFHEAPI:
    """Integration tests for FHE API endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup for each test"""
        # Check if service is running
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=2)
            assert response.status_code == 200
        except requests.exceptions.ConnectionError:
            pytest.skip("FHE service is not running. Start it with: python main.py")
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = requests.get(f"{BASE_URL}/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "fhe-service"
    
    def test_encrypt_valid_amount(self):
        """Test encryption with valid amount"""
        payload = {"amount": 100.0}
        response = requests.post(
            f"{BASE_URL}/api/fhe/encrypt",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "ciphertext" in data
        assert isinstance(data["ciphertext"], str)
        assert len(data["ciphertext"]) > 0
    
    def test_encrypt_invalid_amount_negative(self):
        """Test encryption with negative amount"""
        payload = {"amount": -10.0}
        response = requests.post(
            f"{BASE_URL}/api/fhe/encrypt",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422  # Validation error
    
    def test_encrypt_invalid_amount_zero(self):
        """Test encryption with zero amount"""
        payload = {"amount": 0.0}
        response = requests.post(
            f"{BASE_URL}/api/fhe/encrypt",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422  # Validation error
    
    def test_encrypt_invalid_amount_too_large(self):
        """Test encryption with amount exceeding limit"""
        payload = {"amount": 1000000.0}
        response = requests.post(
            f"{BASE_URL}/api/fhe/encrypt",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422  # Validation error
    
    def test_encrypt_invalid_decimal_places(self):
        """Test encryption with too many decimal places"""
        payload = {"amount": 100.123}
        response = requests.post(
            f"{BASE_URL}/api/fhe/encrypt",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422  # Validation error
    
    def test_decrypt_valid_ciphertext(self):
        """Test decryption with valid ciphertext"""
        # First encrypt
        encrypt_payload = {"amount": 100.50}
        encrypt_response = requests.post(
            f"{BASE_URL}/api/fhe/encrypt",
            json=encrypt_payload,
            headers={"Content-Type": "application/json"}
        )
        assert encrypt_response.status_code == 200
        ciphertext = encrypt_response.json()["ciphertext"]
        
        # Then decrypt
        decrypt_payload = {"ciphertext": ciphertext}
        decrypt_response = requests.post(
            f"{BASE_URL}/api/fhe/decrypt",
            json=decrypt_payload,
            headers={"Content-Type": "application/json"}
        )
        assert decrypt_response.status_code == 200
        data = decrypt_response.json()
        assert "amount" in data
        assert abs(data["amount"] - 100.50) < 0.01
    
    def test_decrypt_invalid_ciphertext(self):
        """Test decryption with invalid ciphertext"""
        payload = {"ciphertext": "invalid_base64!!!"}
        response = requests.post(
            f"{BASE_URL}/api/fhe/decrypt",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 400  # Bad request
    
    def test_encrypt_decrypt_roundtrip(self):
        """Test complete encrypt-decrypt roundtrip"""
        test_amounts = [1.0, 10.0, 100.0, 100.50, 999.99]
        
        for amount in test_amounts:
            # Encrypt
            encrypt_response = requests.post(
                f"{BASE_URL}/api/fhe/encrypt",
                json={"amount": amount},
                headers={"Content-Type": "application/json"}
            )
            assert encrypt_response.status_code == 200
            ciphertext = encrypt_response.json()["ciphertext"]
            
            # Decrypt
            decrypt_response = requests.post(
                f"{BASE_URL}/api/fhe/decrypt",
                json={"ciphertext": ciphertext},
                headers={"Content-Type": "application/json"}
            )
            assert decrypt_response.status_code == 200
            decrypted_amount = decrypt_response.json()["amount"]
            
            # Verify
            assert abs(decrypted_amount - amount) < 0.01, \
                f"Roundtrip failed: {amount} != {decrypted_amount}"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

