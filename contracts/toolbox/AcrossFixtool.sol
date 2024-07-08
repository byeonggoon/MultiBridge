// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "../interfaces/IThetaV2.sol";
import "../interfaces/IBridgeStruct.sol";
import "../libraries/ThetaV2Util.sol";

contract AcrossFixtool {
    function decodeBridgeData(bytes memory data) public pure returns (bytes4, BridgeData memory, AcrossData memory) {
        bytes memory dataWithoutSelector = ThetaV2Util.slice(data, 4, data.length - 4);
        (BridgeData memory bridgeData, AcrossData memory acrossData) = abi.decode(dataWithoutSelector, (BridgeData, AcrossData));
        return (bytes4(data), bridgeData, acrossData);
    }

    function fixAmountBridgeData(bytes memory data, uint256 newAmount) public pure returns (bytes memory) {
        (bytes4 fs, BridgeData memory bridgeData, AcrossData memory acrossData) = decodeBridgeData(data);
        bridgeData.amount = newAmount;
        return abi.encodeWithSelector(fs, bridgeData, acrossData);
    }

    function getBridgeTokenAndAmount(bytes memory data) public pure returns (address, uint256) {
        (, BridgeData memory bridgeData, ) = decodeBridgeData(data);
        return (bridgeData.srcToken, bridgeData.amount);
    }
}
