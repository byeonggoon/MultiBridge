// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library MultiBridgeV2Util {
    function slice(bytes memory data, uint256 start, uint256 length) internal pure returns (bytes memory) {
        bytes memory result = new bytes(length);
        for (uint256 i = 0; i < length; i++) {
            result[i] = data[i + start];
        }
        return result;
    }
}
