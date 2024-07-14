// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

struct OutputToken {
    address dstToken;
}

struct InputToken {
    address srcToken;
    uint256 amount;
}

struct DupToken {
    address token;
    uint256 amount;
}
struct SwapData {
    address router;
    address user;
    InputToken[] input;
    OutputToken[] output;
    DupToken[] dup;
    bytes callData;
    address feeToken;
    bytes plexusData;
}

struct BridgeData {
    address srcToken;
    uint256 amount;
    uint64 dstChainId;
    address recipient;
    bytes plexusData;
}

struct MultibridgeValue {
    uint256 value;
    bytes callData;
}

struct SplitData {
    uint256[][] splitRate; // [[100],[20,40,40],[100]] splitRate.length max 3
    bool multiStandard; // swapMultiBridgeV2Call,multiV2BridgeCall default is true,
}

struct Result {
    bool success;
    bytes returnData;
}
