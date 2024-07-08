// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "../interfaces/IThetaV2.sol";
import "../interfaces/IBridgeStruct.sol";
import "../libraries/ThetaV2Util.sol";

contract DlnFixtool {
    function decodeBridgeData(bytes memory data) public pure returns (bytes4, BridgeData memory, DLNData memory) {
        bytes memory dataWithoutSelector = ThetaV2Util.slice(data, 4, data.length - 4);
        (BridgeData memory bridgeData, DLNData memory dlnData) = abi.decode(dataWithoutSelector, (BridgeData, DLNData));
        return (bytes4(data), bridgeData, dlnData);
    }

    function fixAmountBridgeData(bytes memory data, uint256 newAmount) public pure returns (bytes memory) {
        (bytes4 fs, BridgeData memory bridgeData, DLNData memory dlnData) = decodeBridgeData(data);
        bridgeData.amount = newAmount;
        return abi.encodeWithSelector(fs, bridgeData, dlnData);
    }
    function getBridgeTokenAndAmount(bytes memory data) public pure returns (address, uint256) {
        (, BridgeData memory bridgeData, ) = decodeBridgeData(data);
        return (bridgeData.srcToken, bridgeData.amount);
    }
}
