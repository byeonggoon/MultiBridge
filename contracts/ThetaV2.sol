// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./helpers/ReentrancyGuard.sol";
import "./interfaces/IThetaV2.sol";
import "./interfaces/IFixtool.sol";
import "./libraries/SafeERC20.sol";

contract ThetaV2 is Initializable, UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuard {
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
    error THETA_V2_FAILED();
    error MISSMATCH();

    event WholeTheta(address user, OutputToken[] indexed srcToken, uint256[] fromAmount, string bridge);

    function initialize(address _router) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        ROUTER = _router;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

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
    function thetaV2BridgeCall(ThetaValue[] memory thetas) public payable {
        for (uint256 i = 0; i < thetas.length; ) {
            SelectorCheck memory selectorCheck = functionSelectInfo[bytes4(thetas[i].callData)];
            if (selectorCheck.check == false) revert NotSupported();
            (address srcToken, uint256 amount) = IFixtool(selectorCheck.selectorAddr).getBridgeTokenAndAmount(thetas[i].callData);
            _approveRouter(srcToken, amount);
            unchecked {
                ++i;
            }
        }
        _thetaV2Call(thetas);
    }

    //swap + Bridge
    //eachBridgeTotalRate total sum is 100.

    function swapThetaV2Call(SwapData calldata _swap, ThetaValue[] memory thetas, SplitData memory splitData) public payable nonReentrant {
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
        emit WholeTheta(msg.sender, _swap.output, _bridgeAmount, "THETAV2");

        if (_outputLength == 1) {
            uint256 totalRate;
            //single Token Multi Bridge
            // 1. oneToken - multi bridge - NO MORE SPLIT
            for (uint256 i = 0; i < splitData.splitRate[0].length; ) {
                SelectorCheck memory selectorCheck = functionSelectInfo[bytes4(thetas[i].callData)];
                if (selectorCheck.check == false) revert NotSupported();

                bytes memory newData = IFixtool(selectorCheck.selectorAddr).fixAmountBridgeData(
                    thetas[i].callData,
                    (_bridgeAmount[0] * splitData.splitRate[0][i]) / 100
                );
                thetas[i].callData = newData;

                if (_swap.output[0].dstToken == NATIVE_ADDRESS) {
                    thetas[i].value = (_bridgeAmount[0] * splitData.splitRate[0][i]) / 100;
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
                for (uint256 i = 0; i < thetas.length; ) {
                    SelectorCheck memory selectorCheck = functionSelectInfo[bytes4(thetas[i].callData)];
                    if (selectorCheck.check == false) revert NotSupported();
                    bytes memory newData = IFixtool(selectorCheck.selectorAddr).fixAmountBridgeData(thetas[i].callData, _bridgeAmount[i]);
                    thetas[i].callData = newData;
                    if (_swap.output[i].dstToken == NATIVE_ADDRESS) {
                        thetas[i].value = _bridgeAmount[i];
                    }

                    unchecked {
                        ++i;
                    }
                }
            } else if (splitData.multiStandard == false) {
                //2. swap -  multi bridge -  SPLIT
                uint256 thetaIndex = 0;
                for (uint256 i = 0; i < splitData.splitRate.length; i++) {
                    uint256[] memory currentSplitRates = splitData.splitRate[i];
                    uint256 totalRate = 0;
                    for (uint256 j = 0; j < currentSplitRates.length; ) {
                        SelectorCheck memory selectorCheck = functionSelectInfo[bytes4(thetas[thetaIndex].callData)];
                        uint256 newAmount = (_bridgeAmount[i] * currentSplitRates[j]) / 100;
                        if (_swap.output[i].dstToken == NATIVE_ADDRESS) {
                            thetas[thetaIndex].value = newAmount;
                        }
                        bytes memory newData = IFixtool(selectorCheck.selectorAddr).fixAmountBridgeData(thetas[thetaIndex].callData, newAmount);
                        thetas[thetaIndex].callData = newData;
                        thetaIndex++;
                        totalRate += currentSplitRates[j];
                        unchecked {
                            ++j;
                        }
                    }
                    if (totalRate != 100) revert NOT_CORRECT_RATE();
                }
                if (thetaIndex != thetas.length) revert MISSMATCH();
            }
        }

        _thetaV2Call(thetas);
    }

    function _thetaV2Call(ThetaValue[] memory thetas) internal {
        for (uint256 i = 0; i < thetas.length; ) {
            (bool success, bytes memory result) = ROUTER.call{value: thetas[i].value}(thetas[i].callData);
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
