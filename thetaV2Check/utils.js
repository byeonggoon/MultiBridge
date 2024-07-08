const { utils } = require("ethers");

const fromWei = (value, decimals) => utils.formatUnits(value, decimals);
const getBignum = (value, decimals) => utils.parseUnits(value, decimals);

exports.fromWei = fromWei;
exports.getBignum = getBignum;
