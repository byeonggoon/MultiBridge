const { oneInchCall } = require("./oneInch");
const { odosCall } = require("./odosCall");
const { hyphenbridgeBytesCode } = require("./bridgeCallData");
const { xyBytesCode } = require("./xyCallData");
const { cctpbridgeBytesCode } = require("./cctpBridgeCalldata");
const { routerBytesCode } = require("./routerCallData");
const { hopbridgeBytesCode } = require("./hopCallData");
const { StargateBytesCode } = require("./stargateCallData");

// Exporting all modules
module.exports = {
  oneInchCall,
  odosCall,
  hyphenbridgeBytesCode,
  xyBytesCode,
  cctpbridgeBytesCode,
  routerBytesCode,
  hopbridgeBytesCode,
  StargateBytesCode,
};
