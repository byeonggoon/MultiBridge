const { utils } = require("ethers");

const { getSelectors, FacetCutAction } = require("./libraries/diamond.js");

async function getFunctionSelectorsAndSignatures(functionSignatures) {
  return functionSignatures.map((functionSignature) => {
    const hash = utils.keccak256(utils.toUtf8Bytes(functionSignature));
    const selector = hash.slice(0, 10); // '0x'를 포함한 앞 4바이트
    return {
      selector: selector,
      signature: functionSignature,
    };
  });
}
const BridgeSignature = [
  "bridgeToHyphen((address,uint256,uint64,address,bytes))",
  "bridgeToCctp((address,uint256,uint64,address,bytes))",
  "bridgeToSymbiosis((address,uint256,uint64,address,bytes),bytes)",
  "bridgeToL2pass((address,uint256,uint64,address,bytes),uint256)",
  "bridgeToCbridge((address,uint256,uint64,address,bytes),(uint64,uint32))",
  "bridgeToSquid((address,uint256,uint64,address,bytes),(bytes,uint256))",
  "bridgeToRouter((address,uint256,uint64,address,bytes),(address,uint256))",
  "bridgeToAllbridge((address,uint256,uint64,address,bytes),(uint,address,uint))",
  "bridgeToConnext((address,uint256,uint64,address,bytes),(uint256,uint256,address))",
  "bridgeToXybridge((address,uint256,uint64,address,bytes),(address,address,address))",
  "bridgeToDln((address,uint256,uint64,address,bytes),(address,uint256,uint256,uint256))",
  "bridgeToAcross((address,uint256,uint64,address,bytes),(int64,uint32,bytes,uint256,address))",
  "bridgeToStargate((address,uint256,uint256,address,uint256,uint256,uint256,bytes,bytes))",
  "bridgeToHop((address,uint256,uint64,address,bytes),(uint256,uint256,uint256,uint256,uint256),bool)",
  "bridgeToSynapse((address,uint256,uint64,address,bytes),((address,address,uint256,uint256,bytes),(address,address,uint256,uint256,bytes)))",

  "relaySwapMulti((uint256,bytes)[])",
  "multicallValue((address,bool,uint256,bytes))",
];

const SwapBridgeSignatures = [
  // "swapAndBridgeToHyphen((address,address,(address,uint256)[],(address)[],(address,uint256)[],bytes,address,bytes),(address,uint256,uint64,address,bytes))",
  // "swapAndBridgeToCctp((address,address,(address,uint256)[],(address)[],(address,uint256)[],bytes,address,bytes),(address,uint256,uint64,address,bytes))",
  // "swapAndBridgeToCbridge((address,address,(address,uint256)[],(address)[],(address,uint256)[],bytes,address,bytes),(address,uint256,uint64,address,bytes),(uint64,uint32))",
  // "swapAndBridgeToStargate((address,address,(address,uint256)[],(address)[],(address,uint256)[],bytes,address,bytes),(address,uint256,uint256,address,uint256,uint256,uint256,bytes,bytes))",
  // "swapAndBridgeToHop((address,address,(address,uint256)[],(address)[],(address,uint256)[],bytes,address,bytes),(address, uint256, uint64, address,bytes),(uint256, uint256, uint256, uint256, uint256))",
  // "swapAndBridgeToSynapse((address,address,(address,uint256)[],(address)[],(address,uint256)[],bytes,address,bytes),(address,uint256,uint64,address,bytes),((address,address,uint256,uint256,bytes),(address,address,uint256,uint256,bytes)))",
  // "swapAndBridgeToAcross((address,address,(address,uint256)[],(address)[],(address,uint256)[],bytes,address,bytes),(address, uint256, uint64, address,bytes),(int64,uint32,bytes,uint256,address))",
  // "swapAndBridgeToConnext((address,address,(address,uint256)[],(address)[],(address,uint256)[],bytes,address,bytes),(address, uint256, uint64, address,bytes),( uint256,uint256,address))",
  // "swapAndBridgeToXybridge((address,address,(address,uint256)[],(address)[],(address,uint256)[],bytes,address,bytes),(address, uint256, uint64, address, bytes),(address,address,address))",
  // "swapAndBridgeToSymbiosis((address,address,(address,uint256)[],(address)[],(address,uint256)[],bytes,address,bytes),(address,uint256,uint64,address,bytes),bytes)",
  // "swapAndBridgeToAllbridge((address,address,(address,uint256)[],(address)[],(address,uint256)[],bytes,address,bytes),(address,uint256,uint64,address,bytes),(uint,address,uint))",
  // "swapAndBridgeToOrbit((address,address,(address,uint256)[],(address)[],(address,uint256)[],bytes,address,bytes),(address,uint256,uint64,address,bytes))",
  // "swapAndBridgeToDln((address,address,(address,uint256)[],(address)[],(address,uint256)[],bytes,address,bytes),(address,uint256,uint64,address,bytes),(address,uint256,uint256,uint256))",
  // "swapAndBridgeToRouter((address,address,(address,uint256)[],(address)[],(address,uint256)[],bytes,address,bytes),(address,uint256,uint64,address,bytes),(uint256,address))",
];

// 각 함수 시그니처에 대한 선택자와 시그니처를 계산합니다.
const BridgeSignatureInfo = getFunctionSelectorsAndSignatures(BridgeSignature);
const SwapBridgeSignaturesInfo =
  getFunctionSelectorsAndSignatures(SwapBridgeSignatures);

console.log(BridgeSignatureInfo); // 배열 형태로 각 함수 시그니처와 선택자를 출력합니다.
console.log(SwapBridgeSignaturesInfo);

async function getSelectorAndFunc() {
  if (FacetNames.length == FacetAddress.length) {
    for (let i = 0; i < FacetNames.length; i++) {
      const Facet = await ethers.getContractFactory(FacetNames[i]);
      const facet = await Facet.attach([FacetAddress[i]]);

      SwapFacetSelector = getSelectors(facet).get([
        "addDex(address[])",
        "removeDex(address[])",
        "swapRouter( (address,address, (address,uint256)[], (address)[], (address,uint256)[],bytes,address,bytes))",
        "relaySwapRouter( ( (address,address, (address,uint256)[], (address)[], (address,uint256)[],bytes,address,bytes),address), (bytes,uint256,uint256,address,bytes32),bytes[],bytes)",
        "setSigner(address[])",
        "setProxy(address,address)",
      ]);
      CBridgeFacetSelector = getSelectors(facet).get([
        "bridgeToCbridge( (address, uint256, uint64, address, bytes), (uint64,uint32))",
        "swapAndBridgeToCbridge( (address,address, (address,uint256)[], (address)[], (address,uint256)[],bytes,address,bytes), (address, uint256, uint64, address,bytes), (uint64,uint32))",
        "sigWithdraw(bytes, bytes[],address[],uint256[])",
      ]);
      DiamondManagerFacetSelector = getSelectors(facet).get([
        "setFee(uint256)",
        "setFeeReceiver(address)",
        "feeAndReceiverUpdate(uint256,address)",
        "EmergencyWithdraw(address,uint256)",
      ]);
      HyphenFacetSelector = getSelectors(facet).get([
        "bridgeToHyphen( (address,uint256,uint64,address,bytes))",
        "swapAndBridgeToHyphen( (address,address, (address,uint256)[], (address)[], (address,uint256)[],bytes,address,bytes), (address,uint256,uint64,address,bytes))",
      ]);
      StargateFacetSelector = getSelectors(facet).get([
        "getFee(address,uint256,uint256,address,uint256)",
        "getLayerZeroFee(uint16,bytes)",
        "bridgeToStargate( (address,uint256,uint256,address,uint256,uint256,uint256,bytes,bytes))",
        "swapAndBridgeToStargate( (address,address, (address,uint256)[], (address)[], (address,uint256)[],bytes,address,bytes), (address,uint256,uint256,address,uint256,uint256,uint256,bytes,bytes))",
        "initStargate( (address,uint16)[], (uint256,uint16)[])",
        "stargatePoolId(address)",
        "stargateLayerZeroId(uint256)",
      ]);
      HopFacetSelector = getSelectors(facet).get([
        "initHop( (address,address,address)[])",
        "bridgeToHop((address, uint256, uint64, address,bytes),(uint256,uint256,uint256,uint256,uint256))",
        "swapAndBridgeToHop( (address,address, (address,uint256)[], (address)[], (address,uint256)[],bytes,address,bytes), (address, uint256, uint64, address,bytes), (uint256, uint256, uint256, uint256, uint256))",
      ]);
      SynapseFacetSelector = getSelectors(facet).get([
        "bridgeToSynapse( (address, uint256, uint64, address,bytes), ( (address,address,uint256,uint256,bytes), (address,address,uint256,uint256,bytes)))",
        "swapAndBridgeToSynapse( (address,address, (address,uint256)[], (address)[], (address,uint256)[],bytes,address,bytes), (address,uint256,uint64,address,bytes), ( (address,address,uint256,uint256,bytes), (address,address,uint256,uint256,bytes)))",
        "callBridgeFee(address,uint256)",
        "callAmountOut(address,address,uint256)",
      ]);
      AcrossFacetSelector = getSelectors(facet).get([
        "bridgeToAcross( (address, uint256, uint64, address,bytes), (int64,uint32,bytes,uint256,address))",
        "swapAndBridgeToAcross( (address,address, (address,uint256)[], (address)[], (address,uint256)[],bytes,address,bytes), (address, uint256, uint64, address,bytes), (int64,uint32,bytes,uint256,address))",
      ]);
      ConnextFacetSelector = getSelectors(facet).get([
        "setDomainId( (uint64,uint64)[])",
        "getDomainId(uint64)",
        "bridgeToConnext( (address, uint256, uint64, address,bytes), (uint256,uint256,address))",
        "swapAndBridgeToConnext( (address,address, (address,uint256)[], (address)[], (address,uint256)[],bytes,address,bytes), (address, uint256, uint64, address,bytes), ( uint256,uint256,address))",
        "connextUpdateSlippage( (uint32,uint32,uint32,address,address,bool,bytes,uint256,address,uint256,uint256,uint256,bytes32),uint256)",
        "connextBumpTransfer(bytes32,address,uint256)",
      ]);
      XyBridgeFacetSelector = getSelectors(facet).get([
        "bridgeToXybridge( (address, uint256, uint64, address, bytes), (address,address,address))",
        "swapAndBridgeToXybridge( (address,address, (address,uint256)[], (address)[], (address,uint256)[],bytes,address,bytes), (address, uint256, uint64, address, bytes), (address,address,address))",
      ]);
      SymbiosisFacetSelector = getSelectors(facet).get([
        "bridgeToSymbiosis( (address,uint256,uint64,address,bytes),bytes)",
        "swapAndBridgeToSymbiosis( (address,address, (address,uint256)[], (address)[], (address,uint256)[],bytes,address,bytes), (address,uint256,uint64,address,bytes),bytes)",
        "getBiosis()",
        "getApproveAddress()",
        "setBiosis(address,address)",
      ]);
      AllBridgeFacetSelector = getSelectors(facet).get([
        "setChainId(uint64[], uint[])",
        "viewChainId(uint64)",
        "bridgeToAllbridge( (address,uint256,uint64,address,bytes), (uint,address,uint))",
        "swapAndBridgeToAllbridge( (address,address, (address,uint256)[], (address)[], (address,uint256)[],bytes,address,bytes), (address,uint256,uint64,address,bytes), (uint,address,uint))",
      ]);

      DLNFacetSelector = getSelectors(facet).get([
        "bridgeToDln( (address,uint256,uint64,address,bytes), (address,uint256,uint256,uint256))",
        "swapAndBridgeToDln( (address,address, (address,uint256)[], (address)[], (address,uint256)[],bytes,address,bytes), (address,uint256,uint64,address,bytes), (address,uint256,uint256,uint256))",
      ]);
      CctpFacetSelector = getSelectors(facet).get([
        "setChainId(uint64[], uint32[])", //
        "setTxFee(uint64[], uint256[])",
        "bridgeToCctp( (address,uint256,uint64,address,bytes))",
        "swapAndBridgeToCctp( (address,address, (address,uint256)[], (address)[], (address,uint256)[],bytes,address,bytes), (address,uint256,uint64,address,bytes))",
        "setCctpFeeReceiver(address)",
        "getTxFee(uint64)",
        "receiveMessage(bytes,bytes,address,address,uint256,bytes)",
        "receiveMessageAndRelayswap(bytes,bytes, ( (address,address, (address,uint256)[], (address)[], (address,uint256)[],bytes,address,bytes),address), (bytes,uint256,uint256,address,bytes32),bytes[],bytes)",
      ]);
    }
  } else {
    console.log("length not matched");
  }
}
