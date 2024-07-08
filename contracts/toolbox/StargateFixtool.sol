// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "../interfaces/IThetaV2.sol";
import "../interfaces/IBridgeStruct.sol";
import "../libraries/ThetaV2Util.sol";
// import "hardhat/console.sol";

contract StargateFixtool {
    function decodeBridgeData(bytes memory data) public pure returns (bytes4, StargateDescription memory) {
        bytes memory dataWithoutSelector = ThetaV2Util.slice(data, 4, data.length - 4);
        StargateDescription memory stargateDescription = abi.decode(dataWithoutSelector, (StargateDescription));
        return (bytes4(data), stargateDescription);
    }

    function fixAmountBridgeData(bytes memory data, uint256 newAmount) public pure returns (bytes memory) {
        (bytes4 fs, StargateDescription memory stargateDescription) = decodeBridgeData(data);
        stargateDescription.amount = newAmount;
        return abi.encodeWithSelector(fs, stargateDescription);
    }

    function getBridgeTokenAndAmount(bytes memory data) public pure returns (address, uint256) {
        (, StargateDescription memory stargateDescription) = decodeBridgeData(data);
        return (stargateDescription.srcToken, stargateDescription.amount);
    }
}
