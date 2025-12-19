// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE} from "./FHE.sol";
import {euint32} from "./FHE.sol";

/**
 * @title FHEPaymentGateway
 * @notice Gateway contract for confidential payments using FHEVM
 * @dev This contract stores encrypted payment amounts and performs homomorphic operations
 */
contract FHEPaymentGateway {
    // Mapping from user address to encrypted balance
    mapping(address => euint32) private encryptedBalances;

    // Events
    event PaymentAdded(address indexed user, bytes encryptedAmount);
    event BalanceUpdated(address indexed user);

    /**
     * @notice Add an encrypted payment amount to a user's balance
     * @param user The address of the user
     * @param encryptedAmount The encrypted amount to add (euint32)
     */
    function addPayment(address user, euint32 encryptedAmount) public {
        // Perform homomorphic addition
        encryptedBalances[user] = FHE.add(encryptedBalances[user], encryptedAmount);
        
        emit PaymentAdded(user, FHE.sealoutput(encryptedAmount));
        emit BalanceUpdated(user);
    }

    /**
     * @notice Apply a rate to an encrypted amount (homomorphic multiplication)
     * @param encryptedAmount The encrypted amount
     * @param rate The rate to apply (in basis points, e.g., 10000 = 100%)
     * @return The result of the multiplication
     */
    function applyRate(euint32 encryptedAmount, uint32 rate) public pure returns (euint32) {
        // Convert rate to euint32 for homomorphic multiplication
        euint32 encryptedRate = FHE.asEuint32(rate);
        return FHE.mul(encryptedAmount, encryptedRate);
    }

    /**
     * @notice Get the encrypted balance for a user
     * @param user The address of the user
     * @return The encrypted balance (sealed output for decryption)
     */
    function getEncryptedBalance(address user) public view returns (bytes memory) {
        return FHE.sealoutput(encryptedBalances[user]);
    }
}

