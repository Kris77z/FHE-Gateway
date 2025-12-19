// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Single encrypted value storage
/// @notice Stores one encrypted uint32; caller can set and later decrypt via client/relayer.
contract UserDecryptSingle is ZamaEthereumConfig {
    euint32 private _value;

    /// @notice Returns the encrypted stored value.
    function getValue() external view returns (euint32) {
        return _value;
    }

    /// @notice Sets the encrypted value.
    /// @param newValue encrypted uint32 input
    /// @param proof input proof
    function setValue(externalEuint32 newValue, bytes calldata proof) external {
        euint32 encrypted = FHE.fromExternal(newValue, proof);
        _value = encrypted;

        FHE.allowThis(_value);
        FHE.allow(_value, msg.sender);
    }
}
