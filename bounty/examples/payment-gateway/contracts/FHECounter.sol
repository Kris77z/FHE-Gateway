// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Encrypted payment gateway example
/// @notice Stores user balances as encrypted values and supports applying an encrypted rate multiplier.
contract FHEPaymentGateway is ZamaEthereumConfig {
    mapping(address => euint32) private _balances;

    /// @notice Returns the encrypted balance of a user.
    /// @param user address whose balance is requested.
    /// @return Encrypted balance.
    function getEncryptedBalance(address user) external view returns (euint32) {
        return _balances[user];
    }

    /// @notice Adds an encrypted payment amount to the sender balance.
    /// @param amount encrypted payment amount
    /// @param proof input proof
    function addPayment(externalEuint32 amount, bytes calldata proof) external {
        euint32 encryptedAmount = FHE.fromExternal(amount, proof);
        _balances[msg.sender] = FHE.add(_balances[msg.sender], encryptedAmount);

        FHE.allowThis(_balances[msg.sender]);
        FHE.allow(_balances[msg.sender], msg.sender);
    }

    /// @notice Applies an encrypted rate multiplier to the sender balance.
    /// @param rate encrypted multiplier (e.g., 2 means x2)
    /// @param proof input proof
    function applyRate(externalEuint32 rate, bytes calldata proof) external {
        euint32 encryptedRate = FHE.fromExternal(rate, proof);
        _balances[msg.sender] = FHE.mul(_balances[msg.sender], encryptedRate);

        FHE.allowThis(_balances[msg.sender]);
        FHE.allow(_balances[msg.sender], msg.sender);
    }
}
