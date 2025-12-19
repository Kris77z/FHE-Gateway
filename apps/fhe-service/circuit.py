"""
FHE Circuit Implementation using Concrete Python
Compiles circuits for homomorphic encryption operations
"""

from concrete import fhe
import numpy as np
from pathlib import Path
import pickle
import os
from loguru import logger


class FHECircuit:
    """FHE Circuit for payment amount encryption/decryption"""
    
    def __init__(self, keys_dir: str = "./keys"):
        """
        Initialize FHE Circuit
        
        Args:
            keys_dir: Directory to store keys
        """
        self.keys_dir = Path(keys_dir)
        self.keys_dir.mkdir(exist_ok=True)
        
        self.circuit = None
        self.configuration = None
        
    def compile_circuit(self, inputset: list = None):
        """
        Compile the FHE circuit for addition operations
        
        Args:
            inputset: List of sample inputs for compilation
                     Default: [0, 1, 2, ..., 999999] (0 to 999,999)
        """
        if inputset is None:
            # Default inputset: 0 to 999,999 (supports amounts up to 999,999.99)
            # We use integers to represent amounts (multiply by 100 for cents)
            inputset = list(range(0, 1000000))
        
        logger.info(f"Compiling FHE circuit with inputset size: {len(inputset)}")
        
        @fhe.compiler({"amount": "encrypted"})
        def add_amount(amount: int) -> int:
            """Add encrypted amount (placeholder for future homomorphic operations)"""
            return amount
        
        @fhe.compiler({"amount1": "encrypted", "amount2": "encrypted"})
        def add_two_amounts(amount1: int, amount2: int) -> int:
            """Add two encrypted amounts homomorphically"""
            return amount1 + amount2
        
        @fhe.compiler({"amount": "encrypted", "rate": "encrypted"})
        def multiply_amount(amount: int, rate: int) -> int:
            """Multiply encrypted amount by rate (for exchange rate conversion)"""
            # Note: Concrete Python supports multiplication, but with limitations
            # For now, we'll use a simplified approach
            return amount * rate // 10000  # Rate is stored as integer (e.g., 10000 = 1.0)
        
        # Compile the main circuit (add_amount)
        logger.info("Compiling add_amount circuit...")
        self.circuit = add_amount.compile(inputset)
        
        # Compile add_two_amounts circuit
        logger.info("Compiling add_two_amounts circuit...")
        self.add_circuit = add_two_amounts.compile(inputset)
        
        # Compile multiply_amount circuit
        logger.info("Compiling multiply_amount circuit...")
        self.multiply_circuit = multiply_amount.compile(inputset)
        
        logger.info("Circuit compilation completed successfully")
        
    def generate_keys(self):
        """Generate encryption keys for the circuit"""
        if self.circuit is None:
            raise RuntimeError("Circuit must be compiled before generating keys")
        
        logger.info("Generating encryption keys...")
        self.circuit.keygen()
        logger.info("Keys generated successfully")
        
    def save_keys(self, filename: str = "fhe_keys.pkl"):
        """Save circuit and keys to file"""
        if self.circuit is None:
            raise RuntimeError("Circuit must be compiled and keys generated before saving")
        
        keys_path = self.keys_dir / filename
        logger.info(f"Saving keys to {keys_path}")
        
        # Save the circuit (which contains the keys)
        with open(keys_path, "wb") as f:
            pickle.dump({
                "circuit": self.circuit,
                "add_circuit": self.add_circuit,
                "multiply_circuit": self.multiply_circuit
            }, f)
        
        logger.info(f"Keys saved successfully to {keys_path}")
        
    def load_keys(self, filename: str = "fhe_keys.pkl"):
        """Load circuit and keys from file"""
        keys_path = self.keys_dir / filename
        
        if not keys_path.exists():
            raise FileNotFoundError(f"Keys file not found: {keys_path}")
        
        logger.info(f"Loading keys from {keys_path}")
        
        with open(keys_path, "rb") as f:
            data = pickle.load(f)
            self.circuit = data["circuit"]
            self.add_circuit = data.get("add_circuit")
            self.multiply_circuit = data.get("multiply_circuit")
        
        logger.info("Keys loaded successfully")
        
    def encrypt(self, amount: float) -> bytes:
        """
        Encrypt a payment amount
        
        Args:
            amount: Payment amount (e.g., 100.50)
            
        Returns:
            Encrypted ciphertext as bytes
        """
        if self.circuit is None:
            raise RuntimeError("Circuit must be compiled and keys loaded before encryption")
        
        # Convert amount to integer (multiply by 100 to preserve cents)
        amount_int = int(amount * 100)
        
        # Encrypt using the circuit
        encrypted = self.circuit.encrypt(amount_int)
        
        return encrypted
        
    def decrypt(self, ciphertext: bytes) -> float:
        """
        Decrypt a ciphertext to get the payment amount
        
        Args:
            ciphertext: Encrypted ciphertext as bytes
            
        Returns:
            Decrypted amount as float
        """
        if self.circuit is None:
            raise RuntimeError("Circuit must be compiled and keys loaded before decryption")
        
        # Decrypt using the circuit
        decrypted_int = self.circuit.decrypt(ciphertext)
        
        # Convert back to float (divide by 100)
        amount = decrypted_int / 100.0
        
        return amount
        
    def add_homomorphic(self, ciphertext1: bytes, ciphertext2: bytes) -> bytes:
        """
        Add two encrypted amounts homomorphically
        
        Args:
            ciphertext1: First encrypted amount
            ciphertext2: Second encrypted amount
            
        Returns:
            Encrypted result of addition
        """
        if self.add_circuit is None:
            raise RuntimeError("Add circuit must be compiled before homomorphic addition")
        
        # Perform homomorphic addition
        result = self.add_circuit.encrypt_and_run(ciphertext1, ciphertext2)
        
        return result
        
    def multiply_homomorphic(self, ciphertext: bytes, rate: float) -> bytes:
        """
        Multiply encrypted amount by rate homomorphically
        
        Args:
            ciphertext: Encrypted amount
            rate: Exchange rate (e.g., 1.5 for 150%)
            
        Returns:
            Encrypted result of multiplication
        """
        if self.multiply_circuit is None:
            raise RuntimeError("Multiply circuit must be compiled before homomorphic multiplication")
        
        # Convert rate to integer (multiply by 10000)
        rate_int = int(rate * 10000)
        
        # Perform homomorphic multiplication
        result = self.multiply_circuit.encrypt_and_run(ciphertext, rate_int)
        
        return result


def initialize_circuit(keys_dir: str = "./keys", force_recompile: bool = False) -> FHECircuit:
    """
    Initialize FHE circuit, compile if needed, and load/generate keys
    
    Args:
        keys_dir: Directory to store keys
        force_recompile: Force recompilation even if keys exist
        
    Returns:
        Initialized FHECircuit instance
    """
    circuit = FHECircuit(keys_dir=keys_dir)
    keys_file = Path(keys_dir) / "fhe_keys.pkl"
    
    if keys_file.exists() and not force_recompile:
        logger.info("Loading existing keys...")
        circuit.load_keys()
    else:
        logger.info("Compiling new circuit...")
        circuit.compile_circuit()
        circuit.generate_keys()
        circuit.save_keys()
    
    return circuit

