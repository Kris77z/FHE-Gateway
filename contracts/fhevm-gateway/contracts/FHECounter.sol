// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

// Note: This is based on Zama's official FHE Counter example
// Reference: https://docs.zama.org/protocol/examples/#counter.sol
// 
// Currently using placeholder FHE library. When FHEVM is installed:
// import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
// import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

import {FHE} from "./FHE.sol";
import {euint32} from "./FHE.sol";

/// @title A simple FHE counter contract
/// @notice This demonstrates homomorphic encryption operations
/// @dev Based on Zama's official example: https://docs.zama.org/protocol/examples/#counter.sol
contract FHECounter {
  euint32 private _count;

  /// @notice Returns the current encrypted count
  /// @return The encrypted count value
  function getCount() external view returns (euint32) {
    return _count;
  }

  /// @notice Increments the counter by a specified encrypted value.
  /// @param encryptedValue The encrypted value to add
  /// @dev This example omits overflow/underflow checks for simplicity.
  /// In a production contract, proper range checks should be implemented.
  function increment(euint32 encryptedValue) external {
    _count = FHE.add(_count, encryptedValue);
  }

  /// @notice Decrements the counter by a specified encrypted value.
  /// @param encryptedValue The encrypted value to subtract
  /// @dev This example omits overflow/underflow checks for simplicity.
  /// In a production contract, proper range checks should be implemented.
  function decrement(euint32 encryptedValue) external {
    _count = FHE.sub(_count, encryptedValue);
  }

  /// @notice Get the sealed output for decryption
  /// @return The sealed encrypted count (for decryption off-chain)
  function getSealedCount() external view returns (bytes memory) {
    return FHE.sealoutput(_count);
  }
}



