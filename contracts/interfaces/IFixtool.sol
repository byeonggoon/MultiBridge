// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IFixtool {
    function fixAmountBridgeData(bytes memory data, uint256 newAmount) external pure returns (bytes memory);
    function getBridgeTokenAndAmount(bytes memory data) external pure returns (address, uint256);
}
