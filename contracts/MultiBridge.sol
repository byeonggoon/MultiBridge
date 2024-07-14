// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./helpers/ReentrancyGuard.sol";
import "./interfaces/IMultiBridgeV2.sol";
import "./interfaces/IFixtool.sol";
import "./libraries/SafeERC20.sol";

contract MultiBridge is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    address private constant NATIVE_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address public ROUTER;

    mapping(bytes4 => SelectorCheck) functionSelectInfo;
    mapping(address => bool) allowedDex;

    struct SelectorCheck {
        bool check;
        address selectorAddr;
    }

    error NotSupported();
    error ZeroAddr();
    error SWAP_FAILED();
    error MUST_ALLOWED();
    error MORE_VALUE();
    error NOT_CORRECT_RATE();
    error MultiBridge_V2_FAILED();
    error MISSMATCH();

    event WholeMultiBridge(address user, OutputToken[] indexed srcToken, uint256[] fromAmount, string bridge);

    constructor()Ownable(msg.sender){}

    //setter
    function setSelector(bytes4[] calldata _selector, address[] calldata _selectorAddr) external onlyOwner {
        require(_selector.length == _selectorAddr.length);
        for (uint i; i < _selector.length; ) {
            functionSelectInfo[_selector[i]].check = true;
            functionSelectInfo[_selector[i]].selectorAddr = _selectorAddr[i];
            unchecked {
                ++i;
            }
        }
    }
    function removeSelector(bytes4[] calldata _selector, address[] calldata _selectorAddr) external onlyOwner {
        require(_selector.length == _selectorAddr.length);
        for (uint i; i < _selector.length; ) {
            functionSelectInfo[_selector[i]].check = false;
            functionSelectInfo[_selector[i]].selectorAddr = address(0);
            unchecked {
                ++i;
            }
        }
    }
    function addDex(address[] calldata _dex) external onlyOwner {
        uint256 len = _dex.length;

        for (uint256 i; i < len; ) {
            if (_dex[i] == address(0)) {
                revert ZeroAddr();
            }
            allowedDex[_dex[i]] = true;
            unchecked {
                ++i;
            }
        }
    }
    function removeDex(address[] calldata _dex) external onlyOwner {
        uint256 len = _dex.length;

        for (uint256 i; i < len; ) {
            if (_dex[i] == address(0)) {
                revert ZeroAddr();
            }
            allowedDex[_dex[i]] = false;
            unchecked {
                ++i;
            }
        }
    }

    //getter
    function getSelectorChecker(bytes4 _selector) external view returns (bool, address) {
        return (functionSelectInfo[_selector].check, functionSelectInfo[_selector].selectorAddr);
    }
    function dexCheck(address _dex) external view returns (bool result) {
        return allowedDex[_dex];
    }

    // Bridge
    function multibridgeV2BridgeCall(MultibridgeValue[] memory multibridges) public payable {
        for (uint256 i = 0; i < multibridges.length; ) {
            SelectorCheck memory selectorCheck = functionSelectInfo[bytes4(multibridges[i].callData)];
            if (selectorCheck.check == false) revert NotSupported();
            (address srcToken, uint256 amount) = IFixtool(selectorCheck.selectorAddr).getBridgeTokenAndAmount(multibridges[i].callData);
            _approveRouter(srcToken, amount);
            unchecked {
                ++i;
            }
        }
        _multibridgeV2Call(multibridges);
    }

    //swap + Bridge
    //eachBridgeTotalRate total sum is 100.

    function swapMultibridgeV2Call(SwapData calldata _swap, MultibridgeValue[] memory multibridges, SplitData memory splitData) public payable nonReentrant {
        _isSwapTokenDeposit(_swap.input);

        uint256[] memory _bridgeAmount = _bridgeSwapStart(_swap);
        uint256 _outputLength = _swap.output.length;
        for (uint256 i = 0; i < _outputLength; ) {
            for (uint256 j = 0; j < _swap.dup.length; ) {
                if (_swap.dup[j].token == _swap.output[i].dstToken) {
                    _isTokenDeposit(_swap.dup[j].token, _swap.dup[j].amount);
                    unchecked {
                        _bridgeAmount[i] += _swap.dup[j].amount;
                    }
                }
                unchecked {
                    ++j;
                }
            }

            if (_swap.output[i].dstToken != NATIVE_ADDRESS) {
                uint256 currentAllowance = IERC20(_swap.output[i].dstToken).allowance(address(this), ROUTER);
                if (currentAllowance != 0) {
                    IERC20(_swap.output[i].dstToken).safeApprove(ROUTER, 0);
                }
                IERC20(_swap.output[i].dstToken).safeApprove(ROUTER, _bridgeAmount[i]);
            }

            unchecked {
                ++i;
            }
        }
        emit WholeMultiBridge(msg.sender, _swap.output, _bridgeAmount, "MULTIV2");

        if (_outputLength == 1) {
            uint256 totalRate;
            //single Token Multi Bridge
            // 1. oneToken - multi bridge - NO MORE SPLIT
            for (uint256 i = 0; i < splitData.splitRate[0].length; ) {
                SelectorCheck memory selectorCheck = functionSelectInfo[bytes4(multibridges[i].callData)];
                if (selectorCheck.check == false) revert NotSupported();

                bytes memory newData = IFixtool(selectorCheck.selectorAddr).fixAmountBridgeData(
                    multibridges[i].callData,
                    (_bridgeAmount[0] * splitData.splitRate[0][i]) / 100
                );
                multibridges[i].callData = newData;

                if (_swap.output[0].dstToken == NATIVE_ADDRESS) {
                    multibridges[i].value = (_bridgeAmount[0] * splitData.splitRate[0][i]) / 100;
                }

                unchecked {
                    totalRate += splitData.splitRate[0][i];
                    ++i;
                }
            }
            if (totalRate != 100) revert NOT_CORRECT_RATE();
        } else {
            //multi Token Multi Bridge
            //1.swap - multi Token -  multi bridge - NO MORE SPLIT
            if (splitData.multiStandard == true) {
                for (uint256 i = 0; i < multibridges.length; ) {
                    SelectorCheck memory selectorCheck = functionSelectInfo[bytes4(multibridges[i].callData)];
                    if (selectorCheck.check == false) revert NotSupported();
                    bytes memory newData = IFixtool(selectorCheck.selectorAddr).fixAmountBridgeData(multibridges[i].callData, _bridgeAmount[i]);
                    multibridges[i].callData = newData;
                    if (_swap.output[i].dstToken == NATIVE_ADDRESS) {
                        multibridges[i].value = _bridgeAmount[i];
                    }

                    unchecked {
                        ++i;
                    }
                }
            } else if (splitData.multiStandard == false) {
                //2. swap -  multi bridge -  SPLIT
                uint256 multibridgeIndex = 0;
                for (uint256 i = 0; i < splitData.splitRate.length; i++) {
                    uint256[] memory currentSplitRates = splitData.splitRate[i];
                    uint256 totalRate = 0;
                    for (uint256 j = 0; j < currentSplitRates.length; ) {
                        SelectorCheck memory selectorCheck = functionSelectInfo[bytes4(multibridges[multibridgeIndex].callData)];
                        uint256 newAmount = (_bridgeAmount[i] * currentSplitRates[j]) / 100;
                        if (_swap.output[i].dstToken == NATIVE_ADDRESS) {
                            multibridges[multibridgeIndex].value = newAmount;
                        }
                        bytes memory newData = IFixtool(selectorCheck.selectorAddr).fixAmountBridgeData(multibridges[multibridgeIndex].callData, newAmount);
                        multibridges[multibridgeIndex].callData = newData;
                        multibridgeIndex++;
                        totalRate += currentSplitRates[j];
                        unchecked {
                            ++j;
                        }
                    }
                    if (totalRate != 100) revert NOT_CORRECT_RATE();
                }
                if (multibridgeIndex != multibridges.length) revert MISSMATCH();
            }
        }

        _multibridgeV2Call(multibridges);
    }

    function _multibridgeV2Call(MultibridgeValue[] memory multibridges) internal {
        for (uint256 i = 0; i < multibridges.length; ) {
            (bool success, bytes memory result) = ROUTER.call{value: multibridges[i].value}(multibridges[i].callData);
            if (!success) {
                _revertWithError(result);
            }
            unchecked {
                ++i;
            }
        }
    }

    function _revertWithError(bytes memory result) internal pure {
        if (result.length > 0) {
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(result)
                revert(add(32, result), returndata_size)
            }
        } else {
            revert("without error message");
        }
    }

    function _getBalance(address token) internal view returns (uint256) {
        return token == NATIVE_ADDRESS ? address(this).balance : IERC20(token).balanceOf(address(this));
    }

    function _isNative(address _token) internal pure returns (bool) {
        return (IERC20(_token) == IERC20(NATIVE_ADDRESS));
    }

    function _approveRouter(address srcToken, uint256 amount) internal {
        _isTokenDeposit(srcToken, amount);
        if (srcToken != NATIVE_ADDRESS) {
            IERC20(srcToken).safeIncreaseAllowance(ROUTER, amount);
        }
    }

    function _isTokenDeposit(address _token, uint256 _amount) internal returns (bool isNotNative) {
        isNotNative = !_isNative(_token);

        if (isNotNative) {
            IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        } else {
            if (msg.value < _amount) revert MORE_VALUE();
        }
    }

    function _isSwapTokenDeposit(InputToken[] calldata input) internal {
        uint256 nativeAmount = 0;
        if (input.length > 3) revert NotSupported(); //input token maximum 3
        for (uint i; i < input.length; ) {
            if (!_isNative(input[i].srcToken)) {
                IERC20(input[i].srcToken).safeTransferFrom(msg.sender, address(this), input[i].amount);
            } else {
                nativeAmount = nativeAmount + input[i].amount;
            }
            unchecked {
                ++i;
            }
        }
        if (msg.value < nativeAmount) revert MORE_VALUE();
    }

    function _isTokenApprove(SwapData calldata swap) internal returns (uint256) {
        if (!allowedDex[swap.router]) revert MUST_ALLOWED();
        InputToken[] calldata input = swap.input;
        uint256 nativeAmount = 0;

        for (uint i; i < input.length; ) {
            if (!_isNative(input[i].srcToken)) {
                IERC20(input[i].srcToken).safeApprove(swap.router, 0);
                IERC20(input[i].srcToken).safeApprove(swap.router, input[i].amount);
            } else {
                nativeAmount = input[i].amount;
            }
            unchecked {
                ++i;
            }
        }
        if (msg.value < nativeAmount) revert MORE_VALUE();

        return nativeAmount;
    }

    function _bridgeSwapStart(SwapData calldata swap) internal returns (uint256[] memory) {
        uint256 nativeAmount = _isTokenApprove(swap);

        uint256 length = swap.output.length;
        uint256[] memory initDstTokenBalance = new uint256[](length);
        uint256[] memory dstTokenBalance = new uint256[](length);

        for (uint i; i < length; ) {
            initDstTokenBalance[i] = _getBalance(swap.output[i].dstToken);
            unchecked {
                ++i;
            }
        }
        (bool succ, ) = swap.router.call{value: nativeAmount}(swap.callData);
        if (succ) {
            for (uint i; i < length; ) {
                uint256 currentBalance = _getBalance(swap.output[i].dstToken);
                dstTokenBalance[i] = currentBalance >= initDstTokenBalance[i] ? currentBalance - initDstTokenBalance[i] : currentBalance;
                unchecked {
                    ++i;
                }
            }
            return dstTokenBalance;
        } else {
            revert SWAP_FAILED();
        }
    }
    function _safeNativeTransfer(address to_, uint256 amount_) internal {
        (bool sent, ) = to_.call{value: amount_}("");
        require(sent, "Safe safeTransfer fail");
    }
    function EmergencyWithdraw(address _tokenAddress, uint256 amount) public onlyOwner {
        bool isNotNative = !_isNative(_tokenAddress);
        if (isNotNative) {
            IERC20(_tokenAddress).safeTransfer(owner(), amount);
        } else {
            _safeNativeTransfer(owner(), amount);
        }
    }
    receive() external payable {}
}
