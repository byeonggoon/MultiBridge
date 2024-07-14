// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "../interfaces/IMultiBridgeV2.sol";
import "../interfaces/IBridgeStruct.sol";
import "../libraries/MultiBridgeV2Util.sol";

contract ConnextFixtool {
    function decodeBridgeData(bytes memory data) public pure returns (bytes4, BridgeData memory, ConnextData memory) {
        bytes memory dataWithoutSelector = MultiBridgeV2Util.slice(data, 4, data.length - 4);
        (BridgeData memory bridgeData, ConnextData memory connextData) = abi.decode(dataWithoutSelector, (BridgeData, ConnextData));
        return (bytes4(data), bridgeData, connextData);
    }

    function fixAmountBridgeData(bytes memory data, uint256 newAmount) public pure returns (bytes memory) {
        (bytes4 fs, BridgeData memory bridgeData, ConnextData memory connextData) = decodeBridgeData(data);
        bridgeData.amount = newAmount;
        return abi.encodeWithSelector(fs, bridgeData, connextData);
    }
    function getBridgeTokenAndAmount(bytes memory data) public pure returns (address, uint256) {
        (, BridgeData memory bridgeData, ) = decodeBridgeData(data);
        return (bridgeData.srcToken, bridgeData.amount);
    }
}
