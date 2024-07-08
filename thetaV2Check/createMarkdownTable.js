const { fromWei } = require("./utils");

function createMarkdownTable(inputAmount, fromToken, sortedResults) {
  const maxLengths = {
    name: "Bridge".length,
    amount: "Amount".length,
    fee: "Fee".length,
    slippage: "slippage".length,
    totalGap: "totalGap".length,
  };

  sortedResults.forEach((result) => {
    maxLengths.name = Math.max(maxLengths.name, result.name.length);
    maxLengths.amount = Math.max(
      maxLengths.amount,
      result.amount.toString().length
    );
    maxLengths.fee = Math.max(maxLengths.fee, result.fee.toString().length);
    maxLengths.slippage = Math.max(
      maxLengths.slippage,
      result.slippage.toString().length
    );
  });

  const header = `| ${"Bridge".padEnd(maxLengths.name)} | ${"Amount".padStart(
    maxLengths.amount
  )} | ${"Fee".padStart(maxLengths.fee)} | ${"slippage".padStart(
    maxLengths.slippage
  )} | ${"totalGap".padStart(maxLengths.slippage)}`;

  const separator = `|${"-".repeat(maxLengths.name + 2)}|${":".padStart(
    maxLengths.amount + 1,
    "-"
  )}${":".padEnd(2, "-")}|${":".padStart(maxLengths.fee + 1, "-")}${":".padEnd(
    2,
    "-"
  )}| ${":".padStart(maxLengths.slippage + 1, "-")}${":".padEnd(
    2,
    "-"
  )}| ${":".padStart(maxLengths.totalGap + 1, "-")}${":".padEnd(2, "-")}`;

  let markdownTable = `input ${fromWei(
    inputAmount,
    fromToken.decimals
  )}\n ${header}\n${separator}\n`;
  sortedResults.forEach((result) => {
    markdownTable += `| ${result.name.padEnd(maxLengths.name)} | ${result.amount
      .toString()
      .padStart(maxLengths.amount)} | ${result.fee
      .toString()
      .padStart(maxLengths.fee)} |${result.slippage
      .toString()
      .padStart(maxLengths.slippage)} |${result.totalGap
      .toString()
      .padStart(maxLengths.slippage)} |\n`;
  });

  return markdownTable;
}

exports.createMarkdownTable = createMarkdownTable;
