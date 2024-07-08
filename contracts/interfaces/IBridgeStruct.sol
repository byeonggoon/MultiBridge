// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

struct AcrossData {
    int64 relayerFeePct;
    uint32 quoteTimestamp;
    bytes message;
    uint256 maxCount;
    address wrappedNative;
}
struct AllBridgeData {
    uint nonce;
    address receiveToken;
    uint feeTokenAmount;
}
struct CBridgeData {
    uint64 nonce;
    uint32 maxSlippage;
}
struct ConnextData {
    uint256 slippage;
    uint256 relayerFee;
    address delegate;
}
struct DLNData {
    address takeTokenAddress;
    uint256 takeAmount;
    uint256 actualInputAmount;
    uint256 nativeFee;
}
struct HopData {
    uint256 bonderFee;
    uint256 slippage;
    uint256 deadline;
    uint256 dstAmountOutMin;
    uint256 dstDeadline;
}
struct SynapseData {
    SwapQuery originQuery;
    SwapQuery destQuery;
}

struct XyBridgeData {
    address toChainToken; // => toChain token address
    address aggregatorAdaptor; // 0x0000000000000000000000000000000000000000
    address referrer;
}

struct SwapQuery {
    address swapAdapter;
    address tokenOut;
    uint256 minAmountOut;
    uint256 deadline;
    bytes rawParams;
}

struct RouterData {
    address destToken;
    uint256 destAmount;
}

struct SquidData {
    bytes payload;
    uint256 feeCosts;
}

struct StargateDescription {
    address srcToken;
    uint256 dstPoolId;
    uint256 dstChainId;
    address receiver;
    uint256 amount;
    uint256 minAmount;
    uint256 fee;
    bytes payload;
    bytes plexusData;
}
