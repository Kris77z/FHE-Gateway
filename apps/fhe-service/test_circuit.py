"""
Unit tests for FHE Circuit
"""

import pytest
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from circuit import FHECircuit, initialize_circuit
import tempfile
import shutil


class TestFHECircuit:
    """Test cases for FHECircuit"""
    
    @pytest.fixture
    def temp_keys_dir(self):
        """Create temporary directory for keys"""
        temp_dir = tempfile.mkdtemp()
        yield temp_dir
        shutil.rmtree(temp_dir)
    
    @pytest.fixture
    def circuit(self, temp_keys_dir):
        """Create and initialize circuit"""
        circuit = FHECircuit(keys_dir=temp_keys_dir)
        # Use smaller inputset for faster testing
        circuit.compile_circuit(inputset=list(range(0, 1000)))
        circuit.generate_keys()
        return circuit
    
    def test_circuit_initialization(self, temp_keys_dir):
        """Test circuit initialization"""
        circuit = FHECircuit(keys_dir=temp_keys_dir)
        assert circuit.keys_dir == Path(temp_keys_dir)
        assert circuit.circuit is None
    
    def test_circuit_compilation(self, temp_keys_dir):
        """Test circuit compilation"""
        circuit = FHECircuit(keys_dir=temp_keys_dir)
        circuit.compile_circuit(inputset=list(range(0, 100)))
        assert circuit.circuit is not None
        assert circuit.add_circuit is not None
        assert circuit.multiply_circuit is not None
    
    def test_key_generation(self, circuit):
        """Test key generation"""
        # Keys are generated in fixture
        assert circuit.circuit is not None
    
    def test_encrypt_decrypt(self, circuit):
        """Test encryption and decryption"""
        # Test with different amounts
        test_amounts = [0.0, 1.0, 100.0, 100.50, 999.99]
        
        for amount in test_amounts:
            # Encrypt
            ciphertext = circuit.encrypt(amount)
            assert ciphertext is not None
            assert isinstance(ciphertext, bytes)
            
            # Decrypt
            decrypted = circuit.decrypt(ciphertext)
            
            # Check if decrypted amount matches (within rounding tolerance)
            assert abs(decrypted - amount) < 0.01, f"Amount mismatch: {amount} != {decrypted}"
    
    def test_save_load_keys(self, circuit, temp_keys_dir):
        """Test saving and loading keys"""
        # Save keys
        circuit.save_keys("test_keys.pkl")
        keys_file = Path(temp_keys_dir) / "test_keys.pkl"
        assert keys_file.exists()
        
        # Create new circuit and load keys
        new_circuit = FHECircuit(keys_dir=temp_keys_dir)
        new_circuit.load_keys("test_keys.pkl")
        
        # Test encryption/decryption with loaded keys
        amount = 100.0
        ciphertext = new_circuit.encrypt(amount)
        decrypted = new_circuit.decrypt(ciphertext)
        assert abs(decrypted - amount) < 0.01
    
    def test_homomorphic_addition(self, circuit):
        """Test homomorphic addition"""
        amount1 = 50.0
        amount2 = 30.0
        
        # Encrypt both amounts
        ciphertext1 = circuit.encrypt(amount1)
        ciphertext2 = circuit.encrypt(amount2)
        
        # Perform homomorphic addition
        result_ciphertext = circuit.add_homomorphic(ciphertext1, ciphertext2)
        
        # Decrypt result
        result = circuit.decrypt(result_ciphertext)
        
        # Check result
        expected = amount1 + amount2
        assert abs(result - expected) < 0.01, f"Addition mismatch: {expected} != {result}"
    
    def test_initialize_circuit_new(self, temp_keys_dir):
        """Test initialize_circuit with new keys"""
        circuit = initialize_circuit(keys_dir=temp_keys_dir, force_recompile=True)
        assert circuit.circuit is not None
        
        # Test encryption/decryption
        amount = 100.0
        ciphertext = circuit.encrypt(amount)
        decrypted = circuit.decrypt(ciphertext)
        assert abs(decrypted - amount) < 0.01
    
    def test_initialize_circuit_load_existing(self, temp_keys_dir):
        """Test initialize_circuit loading existing keys"""
        # Create circuit and save keys
        circuit1 = initialize_circuit(keys_dir=temp_keys_dir, force_recompile=True)
        amount = 100.0
        ciphertext1 = circuit1.encrypt(amount)
        
        # Load existing keys
        circuit2 = initialize_circuit(keys_dir=temp_keys_dir, force_recompile=False)
        
        # Decrypt with loaded circuit
        decrypted = circuit2.decrypt(ciphertext1)
        assert abs(decrypted - amount) < 0.01


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

