const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

const {
  oneInchCall,
  odosCall,
  hyphenbridgeBytesCode,
  xyBytesCode,
  cctpbridgeBytesCode,
  routerBytesCode,
  hopbridgeBytesCode,
  StargateBytesCode,
} = require("../scripts/libraries/index");

const IERC20_SOURCE = "contracts/interfaces/IERC20.sol:IERC20";

const NATIVE = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

const POLY_PLEXUS = "0x9522261525DF0eF42aD8297a152091B480AF34dA";
const POLY_USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
const POLY_USDCe = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const POLY_USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const POLY_WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

const ARBI_PLEXUS = "0x52cdB00b69f11C4cA932fA9108C6BFdD65F20d62";
const ARBI_USDC = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
const ARBI_USDCe = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const ARBI_USDT = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
const ARBI_WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";

const OPTI_USDT = "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58";
const OPTI_USDC = "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85";
const OPTI_USDCe = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607";

const fromChainId = 42161;
const toChainId = 10;

const srcToken = POLY_USDCe;
const dstToken = ARBI_USDCe;
const amount = "20000000000000000";
const oneInch = "0x111111125421ca6dc452d289314280a0f8842a65";
//https://github.com/odos-xyz/odos-router-v2
const polygon_odos = "0x4E3288c9ca110bCC82bf38F09A7b425c095d92Bf";
const arbitrum_odos = "0xa669e7A0d4b3e4Fa48af2dE86BD4CD7126Be4e13";

const PlexusDiammond = ARBI_PLEXUS; //
describe("ThetaV2", function () {
  async function deployThetaV2() {
    const [owner, otherAccount] = await ethers.getSigners();

    const importAddress = process.env.MAIN_ADDR;

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [importAddress],
    });
    user = await ethers.getSigner(importAddress);
    // user = owner;

    const ThetaV2 = await ethers.getContractFactory("ThetaV2");
    const thetaV2 = await ThetaV2.deploy(PlexusDiammond);

    const AcrossFixtool = await ethers.getContractFactory("AcrossFixtool");
    const acrossFixtool = await AcrossFixtool.deploy();
    const CbridgeFixtool = await ethers.getContractFactory("CbridgeFixtool");
    const cbridgeFixtool = await CbridgeFixtool.deploy();
    const SimpleFixtool = await ethers.getContractFactory("SimpleFixtool");
    const simpleFixtool = await SimpleFixtool.deploy();
    const XybridgeFixtool = await ethers.getContractFactory("XybridgeFixtool");
    const xybridgeFixtool = await XybridgeFixtool.deploy();
    const HopFixtool = await ethers.getContractFactory("HopFixtool");
    const hopFixtool = await HopFixtool.deploy();
    const RouterFixtool = await ethers.getContractFactory("RouterFixtool");
    const routerFixtool = await RouterFixtool.deploy();
    const StargateFixtool = await ethers.getContractFactory("StargateFixtool");
    const stargateFixtool = await StargateFixtool.deploy();

    await thetaV2.setSelector(
      [
        0xa8d735fa, 0x1347dc45, 0x1595b636, 0x157779e4, 0x7c2f2e6d, 0xa3668e8d,
        0x5b4979c3, 0x14d847a6,
      ],
      [
        simpleFixtool.address,
        simpleFixtool.address,
        xybridgeFixtool.address,
        hopFixtool.address,
        routerFixtool.address,
        cbridgeFixtool.address,
        acrossFixtool.address,
        stargateFixtool.address,
      ]
    );

    // await thetaV2.setSelector(0xa8d735fa, simpleFixtool.address); // hyphen
    // await thetaV2.setSelector(0x1347dc45, simpleFixtool.address); // cctp
    // await thetaV2.setSelector(0x1595b636, xybridgeFixtool.address); // xy
    // await thetaV2.setSelector(0x157779e4, hopFixtool.address); // hop
    // await thetaV2.setSelector(0x7c2f2e6d, routerFixtool.address); //router
    // await thetaV2.setSelector(0xa3668e8d, cbridgeFixtool.address); // cbridge
    // await thetaV2.setSelector(0x5b4979c3, acrossFixtool.address); // across
    // await thetaV2.setSelector(0x14d847a6, stargateFixtool.address); // stargate

    await thetaV2.addDex([oneInch, arbitrum_odos]);
    expect(await thetaV2.dexCheck(oneInch)).to.equal(true);
    expect(await thetaV2.dexCheck(arbitrum_odos)).to.equal(true);

    usdtToken = await hre.ethers.getContractAt(IERC20_SOURCE, ARBI_USDT);
    usdcToken = await hre.ethers.getContractAt(IERC20_SOURCE, ARBI_USDC);
    // wethToken = await hre.ethers.getContractAt(IERC20_SOURCE, ARBI_WETH);

    await usdtToken.connect(user).approve(thetaV2.address, 1000000000);
    console.log("APPROVE CLEAR 1");
    await usdcToken.connect(user).approve(thetaV2.address, 1000000000);
    console.log("APPROVE CLEAR 2");
    // await wethToken
    //   .connect(user)
    //   .approve(thetaV2.address, ethers.utils.parseUnits("0.02", 18));
    console.log("APPROVE CLEAR 3");

    console.log(
      "user USDT Balance",
      (await usdtToken.balanceOf(user.address)).toString()
    );

    console.log(
      "user USDC Balance",
      (await usdcToken.balanceOf(user.address)).toString()
    );
    // console.log(
    //   "user WETH Balance",
    //   (await wethToken.balanceOf(user.address)).toString()
    // );
    console.log(
      "user ETH Balance",
      (await ethers.provider.getBalance(user.address)).toString()
    );

    hyphenBytes = await hyphenbridgeBytesCode(
      NATIVE,
      ethers.utils.parseUnits("0.0008", 18).toString(),
      "10",
      process.env.MAIN_ADDR,
      "0x"
    );
    console.log("hyphenBytes", hyphenBytes);

    xyBytes = await xyBytesCode(
      NATIVE,
      NATIVE,
      ethers.utils.parseUnits("0.01", 18).toString(),
      "42161",
      process.env.MAIN_ADDR,
      "0x"
    );

    console.log("xyBytes", xyBytes);

    cctpBytes = await cctpbridgeBytesCode(
      ARBI_USDC,
      11000000, //swapCalldata.dstAmount,
      "10",
      process.env.MAIN_ADDR,
      "0x"
    );
    // console.log("cctpBytes", cctpBytes);

    hopBytes = await hopbridgeBytesCode(
      POLY_USDCe,
      10000000,
      42161,
      "USDC",
      "polygon",
      "arbitrum",
      process.env.MAIN_ADDR,
      "0x"
    );
    // console.log("hopBytes", hopBytes);

    routerBytes = await routerBytesCode(
      ARBI_USDCe,
      OPTI_USDCe,
      ethers.utils.parseUnits("20", 6).toString(),
      42161,
      10,
      user.address,
      "0x"
    );
    console.log("routerBytes", routerBytes);

    // oneInchSwapCalldata = await oneInchCall(
    //   chainId,
    //   NATIVE, //srcToken
    //   ARBI_USDT, //dstToken
    //   amount,
    //   thetaV2.address.toString() //fromAddr
    // );

    // console.log("oneInchSwapCalldata", oneInchSwapCalldata);

    console.log("SETTING CLEAR");

    return { thetaV2 };
  }

  describe("Deployment", function () {
    testcase = "18";

    if (testcase == 1)
      it("thetaV2BridgeCall oneToken -> oneBrdige TEST ", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);

        await thetaV2.connect(user).thetaV2BridgeCall([["0", cctpBytes]]);
      });
    if (testcase == 2)
      it("thetaV2BridgeCall multiToken -> multiBrdige TEST ", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);

        await thetaV2.connect(user).thetaV2BridgeCall([
          ["0", hyphenBytes],
          ["0", cctpBytes],
        ]);
      });
    if (testcase == 3)
      it("swapAndThetaV2Call oneToken -> 1inch -> oneToken -> one bridge TEST", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);

        await thetaV2.swapThetaV2Call(
          [
            oneInch,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                srcToken, // srcToken
                amount, // amount
              ],
            ],
            [[ARBI_USDT]], // dstToken
            [["0x0000000000000000000000000000000000000000", "0"]], // dup
            oneInchSwapCalldata.tx.data,
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [[0, hyphenBytes]], // amount noproblem
          [[[100]], true],
          { value: amount }
        );
      });
    if (testcase == 4)
      it("swapAndThetaV2Call oneToken -> 1inch -> oneToken -> two bridge TEST", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);

        await thetaV2.swapThetaV2Call(
          [
            oneInch,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                srcToken, // srcToken
                amount, // amount
              ],
            ],
            [[ARBI_USDT]], // dstToken
            [["0x0000000000000000000000000000000000000000", "0"]], // dup
            oneInchSwapCalldata.tx.data,
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [
            [0, hyphenBytes],
            [0, xyBytes],
          ],
          [[[70, 30]], true],
          { value: amount }
        );
      });
    if (testcase == 5)
      it("swapAndThetaV2Call multiToken(ETH,USDC) -> odos -> oneToken(USDT) -> two bridge TEST", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);

        const inputTokens = [
          {
            tokenAddress: "0x0000000000000000000000000000000000000000", // odos api native
            amount: amount, // input amount as a string in fixed integer precision
          },
          {
            tokenAddress: ARBI_USDC, // checksummed input token address
            amount: "4000000", // input amount as a string in fixed integer precision
          },
        ];

        const outputTokens = [
          {
            tokenAddress: ARBI_USDT, // checksummed output token address
            proportion: 1,
          },
        ];

        const odosSwapCalldata = await odosCall(
          thetaV2.address.toString(),
          chainId,
          inputTokens,
          outputTokens
        );
        console.log("odosSwapCalldata", odosSwapCalldata);

        console.log(
          "odosSwapCalldata.transaction.data",
          odosSwapCalldata.transaction.data
        );
        await thetaV2.connect(user).swapThetaV2Call(
          [
            arbitrum_odos,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                NATIVE, // srcToken
                amount, // amount
              ],
              [ARBI_USDC, 4000000],
            ],
            [[ARBI_USDT]], // dstToken
            [["0x0000000000000000000000000000000000000000", "0"]], // dup
            odosSwapCalldata.transaction.data,
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [
            [0, hyphenBytes],
            [0, xyBytes],
          ],
          [[[70, 30]], true],
          { value: amount }
        );
      });
    if (testcase == 6)
      it("swapAndThetaV2Call oneToken(ETH) -> odos -> multiToken(USDT,USDC) -> two bridge TEST", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);

        console.log("UNIT START");
        const inputTokens = [
          {
            tokenAddress: "0x0000000000000000000000000000000000000000", // odos api native
            amount: amount, // input amount as a string in fixed integer precision
          },
        ];

        const outputTokens = [
          {
            tokenAddress: ARBI_USDT, // checksummed output token address
            proportion: 0.9,
          },
          {
            tokenAddress: ARBI_USDC, // checksummed output token address
            proportion: 0.1,
          },
        ];

        const odosSwapCalldata = await odosCall(
          thetaV2.address.toString(),
          chainId,
          inputTokens,
          outputTokens
        );

        console.log("odosSwapCalldata CLEAR ");
        console.log(odosSwapCalldata);

        await thetaV2.connect(user).swapThetaV2Call(
          [
            arbitrum_odos,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                srcToken, // srcToken
                amount, // amount
              ],
            ],
            [[ARBI_USDT], [ARBI_USDC]], // dstToken
            [[ZERO_ADDR, "0"]], // dup
            odosSwapCalldata.transaction.data,
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [
            [0, hyphenBytes],
            [0, cctpBytes],
          ],
          [[[0]], true],
          { value: amount }
        );
      });
    if (testcase == 7)
      it("swapAndThetaV2Call multiToken -> odos -> multiToken(twoToken) -> two bridge TEST", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);
        const inputTokens = [
          {
            tokenAddress: "0x0000000000000000000000000000000000000000", // odos api native
            amount: amount, // input amount as a string in fixed integer precision
          },
          {
            tokenAddress: POLY_WETH,
            amount: "4000000000000000",
          },
        ];

        const outputTokens = [
          {
            tokenAddress: POLY_USDT, // checksummed output token address
            proportion: 0.5,
          },
          {
            tokenAddress: POLY_USDC, // checksummed output token address
            proportion: 0.5,
          },
        ];

        const odosSwapCalldata = await odosCall(
          thetaV2.address.toString(),
          chainId,
          inputTokens,
          outputTokens
        );

        await thetaV2.connect(user).swapThetaV2Call(
          [
            polygon_odos,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                srcToken, // srcToken
                amount, // amount
              ],
              [
                POLY_WETH, // srcToken
                "4000000000000000", // amount
              ],
            ],
            [[POLY_USDT], [POLY_USDC]], // dstToken
            [["0x0000000000000000000000000000000000000000", "0"]], // dup
            odosSwapCalldata.transaction.data,
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [
            [0, hyphenBytes],
            [0, cctpBytes],
          ],
          [[[0]], true],
          { value: amount }
        );
      });
    if (testcase == 8)
      it("swapAndThetaV2Call multiToken -> odos -> oneToken(native) -> two bridge TEST", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);

        hyphenBytes = await hyphenbridgeBytesCode(
          NATIVE,
          10000000, //swapCalldata.dstAmount,
          "10",
          process.env.MAIN_ADDR,
          "0x"
        );

        xyBytes = await xybridgeBytesCode(
          NATIVE,
          6000000, //swapCalldata.dstAmount,
          "10",
          process.env.MAIN_ADDR,
          "0x",
          NATIVE
        );

        const inputTokens = [
          {
            tokenAddress: ARBI_USDT, // odos api native
            amount: "20000000", // input amount as a string in fixed integer precision
          },
          {
            tokenAddress: ARBI_USDC,
            amount: "4000000",
          },
        ];

        const outputTokens = [
          {
            tokenAddress: "0x0000000000000000000000000000000000000000", // checksummed output token address
            proportion: 1,
          },
        ];

        const odosSwapCalldata = await odosCall(
          thetaV2.address.toString(),
          chainId,
          inputTokens,
          outputTokens
        );

        console.log("odosSwapCalldata", odosSwapCalldata);

        console.log(
          "odosSwapCalldata.transaction.data",
          odosSwapCalldata.transaction.data
        );

        await thetaV2.connect(user).swapThetaV2Call(
          [
            arbitrum_odos,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                ARBI_USDT, // srcToken
                "20000000", // amount
              ],
              [
                ARBI_USDC, // srcToken
                "4000000", // amount
              ],
            ],
            [[NATIVE]], // dstToken
            [[ZERO_ADDR, "0"]], // dup
            odosSwapCalldata.transaction.data,
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [
            [0, hyphenBytes],
            [0, xyBytes],
          ],
          [[[60, 40]], true],
          { value: 0 }
        );
      });
    if (testcase == 9)
      it("swapAndThetaV2Call native -> odos -> two multiToken -> three bridge TEST", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);
        const inputTokens = [
          {
            tokenAddress: "0x0000000000000000000000000000000000000000", // odos api native
            amount: amount, // input amount as a string in fixed integer precision
          },
        ];

        const outputTokens = [
          {
            tokenAddress: ARBI_USDT, // checksummed output token address
            proportion: 0.5,
          },
          {
            tokenAddress: ARBI_USDC, // checksummed output token address
            proportion: 0.5,
          },
        ];

        const odosSwapCalldata = await odosCall(
          thetaV2.address.toString(),
          chainId,
          inputTokens,
          outputTokens
        );
        // console.log("odosSwapCalldata", odosSwapCalldata);

        await thetaV2.connect(user).swapThetaV2Call(
          [
            arbitrum_odos,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                srcToken, // srcToken
                amount, // amount
              ],
              // [
              //   ARBI_WETH, // srcToken
              //   "4000000000000000", // amount
              // ],
            ],
            [[ARBI_USDT], [ARBI_USDC]], // dstToken
            [["0x0000000000000000000000000000000000000000", "0"]], // dup
            odosSwapCalldata.transaction.data,
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [
            [0, hyphenBytes],
            [0, xyBytes],
            [0, cctpBytes],
          ],
          [[[65, 35], [100]], false],
          { value: amount }
        );
      });
    if (testcase == 10)
      it("swapAndThetaV2Call onToken -> odos -> two multiToken -> three bridge TEST", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);
        const inputTokens = [
          {
            tokenAddress: "0x0000000000000000000000000000000000000000", // odos api native
            amount: amount, // input amount as a string in fixed integer precision
          },
        ];

        const outputTokens = [
          {
            tokenAddress: ARBI_USDT, // checksummed output token address
            proportion: 0.8,
          },
          {
            tokenAddress: ARBI_USDC, // checksummed output token address
            proportion: 0.2,
          },
        ];

        const odosSwapCalldata = await odosCall(
          thetaV2.address.toString(),
          chainId,
          inputTokens,
          outputTokens
        );

        await thetaV2.connect(user).swapThetaV2Call(
          [
            polygon_odos,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                srcToken, // srcToken
                amount, // amount
              ],
            ],
            [[ARBI_USDT], [ARBI_USDC]], // dstToken
            [["0x0000000000000000000000000000000000000000", "0"]], // dup
            odosSwapCalldata.transaction.data,
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [
            [0, hyphenBytes],
            [0, xyBytes],
            [0, cctpBytes],
          ],
          [[[70, 30], [100]], false],
          { value: amount }
        );
      });
    if (testcase == 11)
      it("swapAndThetaV2Call two Token -> 1inch -> oenToken(dup) -> two bridge TEST", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);

        const oneDATA = await oneInchCall(
          137,
          POLY_USDC,
          POLY_USDT,
          4000000,
          thetaV2.address
        );
        console.log("oneDATA", oneDATA);

        await thetaV2.connect(user).swapThetaV2Call(
          [
            oneInch,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                POLY_USDC, // srcToken
                4000000, // amount
              ],
            ],
            [[POLY_USDT]], // dstToken
            [[POLY_USDT, 15000000]], // dup
            oneDATA.tx.data,
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [
            [0, hyphenBytes],
            [0, xyBytes],
          ],
          [[[78, 22]], true],
          { value: 0 }
        );
      });
    if (testcase == 12)
      it("swapAndThetaV2Call two Token -> 1inch -> two Token( one dup)  -> (hop,cctp)bridge TEST", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);

        const oneDATA = await oneInchCall(
          137,
          POLY_USDT,
          POLY_USDCe,
          15000000,
          thetaV2.address
        );
        console.log("oneDATA", oneDATA.tx.data);
        console.log("hopBytes", hopBytes);
        console.log("cctpBytes", cctpBytes);

        await thetaV2.connect(user).swapThetaV2Call(
          [
            oneInch,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                POLY_USDT, // srcToken
                15000000, // amount
              ],
            ],
            [[POLY_USDCe], [POLY_USDC]], // dstToken
            [[POLY_USDC, 4000000]], // dup
            oneDATA.tx.data,
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [
            [0, hopBytes],
            [0, cctpBytes],
          ],
          [[[100], [100]], true],
          { value: 0 }
        );
      });
    if (testcase == 13)
      it("swapAndThetaV2Call (USDT,USDC,ETH) -> odos -> ETH(hyphen,xy),USDT(router) bridge TEST", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);

        console.log("ININ");
        const inputTokens = [
          {
            tokenAddress: ARBI_USDC, // odos api native
            amount: "4000000", // input amount as a string in fixed integer precision
          },
        ];

        const outputTokens = [
          {
            tokenAddress: ZERO_ADDR, // checksummed output token address
            proportion: 1,
          },
        ];

        const odosSwapCalldata = await odosCall(
          thetaV2.address.toString(),
          fromChainId,
          inputTokens,
          outputTokens
        );
        console.log("odosSwapCalldata", odosSwapCalldata.transaction.data);

        const remixOdosCall = await odosCall(
          "0x4d2F718B4AFfC509D4CF2843c1Cd85b3C446A157",
          fromChainId,
          inputTokens,
          outputTokens
        );
        console.log("remixOdosCall", remixOdosCall.transaction.data);

        console.log("hyphenBytes", hyphenBytes);
        console.log("xyBytes", xyBytes);
        console.log("routerBytes", routerBytes);

        await thetaV2.connect(user).swapThetaV2Call(
          [
            arbitrum_odos,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                ARBI_USDC, // srcToken
                4000000, // amount
              ],
            ],
            [[NATIVE], [ARBI_USDT]], // dstToken
            [
              [NATIVE, ethers.utils.parseUnits("0.01", 18)],
              [ARBI_USDT, ethers.utils.parseUnits("20", 6)],
            ], // dup
            odosSwapCalldata.transaction.data,
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [
            [0, hyphenBytes],
            [0, xyBytes],
            [0, routerBytes],
          ],
          [[[80, 20], [100]], false],
          { value: ethers.utils.parseUnits("0.01", 18) }
        );
      });
    if (testcase == 14)
      it("swapAndThetaV2Call (USDC,ETH) -> odos -> ETH(hyphen,xy)bridge TEST", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);

        console.log("ININ");

        const oneInchCalldata = await oneInchCall(
          42161,
          ARBI_USDC,
          NATIVE,
          20000000,
          thetaV2.address
        );
        console.log("oneInchCalldata", oneInchCalldata.tx.data);

        console.log("hyphenBytes", hyphenBytes);
        console.log("xyBytes", xyBytes);

        await thetaV2.connect(user).swapThetaV2Call(
          [
            oneInch,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                ARBI_USDC, // srcToken
                20000000, // amount
              ],
            ],
            [[NATIVE]], // dstToken
            [[NATIVE, ethers.utils.parseUnits("0.01", 18)]], // dup
            oneInchCalldata.tx.data,
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [
            [0, hyphenBytes],
            [0, xyBytes],
          ],
          [[[40, 60]], true],
          { value: ethers.utils.parseUnits("0.01", 18) }
        );
      });
    if (testcase == 15)
      it("thetaV2BridgeCall multiToken(USDC,ETH) -> Router,Hyphen TEST ", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);
        hyphenBytes = await hyphenbridgeBytesCode(
          NATIVE,
          ethers.utils.parseUnits("0.01", 18).toString(),
          "10",
          process.env.MAIN_ADDR,
          "0x"
        );
        console.log("hyphenBytes", hyphenBytes);

        routerBytes = await routerBytesCode(
          ARBI_USDC,
          OPTI_USDC,
          ethers.utils.parseUnits("20", 6).toString(),
          42161,
          10,
          process.env.MAIN_ADDR,
          "0x"
        );
        console.log("routerBytes", routerBytes);

        console.log("START", ethers.utils.parseUnits("0.01", 18));

        await thetaV2.connect(user).thetaV2BridgeCall(
          [
            ["0", routerBytes],
            [ethers.utils.parseUnits("0.01", 18), hyphenBytes],
          ],
          { value: ethers.utils.parseUnits("0.01", 18) }
        );
      });

    if (testcase == 16)
      it("swapAndThetaV2Call opti USDC ->1inch-> USDC(CCTP),ETH(XY) TEST ", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);

        const oneDATA16 = await oneInchCall(
          10,
          OPTI_USDC,
          NATIVE,
          33750000,
          "0x6D21EBfa729e1db00a4395d08baB0f22103db0eA"
        );
        console.log("oneDATA", oneDATA16.tx.data);
        console.log("cctpBytes", cctpBytes);
        console.log("xyBytes", xyBytes);

        console.log(
          "user USDC Balance",
          (await usdcToken.balanceOf(user.address)).toString()
        );
        await thetaV2.connect(user).swapThetaV2Call(
          [
            oneInch,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                OPTI_USDC, // srcToken
                33750000, // amount
              ],
            ],
            [[OPTI_USDC], [NATIVE]], // dstToken
            [[OPTI_USDC, 11250000]], // dup
            oneDATA16.tx.data,
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [
            [0, cctpBytes],
            [0, xyBytes],
          ],
          [[[100]], true],
          { value: 0 }
        );
        console.log(
          "user USDC Balance",
          (await usdcToken.balanceOf(user.address)).toString()
        );
      });
    if (testcase == 17)
      it("swapAndThetaV2Call arbi ETH ->1inch-> USDC(CCTP),ETH(Hyphen) TEST ", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);

        const oneDATA16 = await oneInchCall(
          42161,
          NATIVE,
          ARBI_USDC,
          ethers.utils.parseUnits("0.003", 18).toString(),
          thetaV2.address
        );
        console.log("oneDATA", oneDATA16.tx.data);
        console.log("cctpBytes", cctpBytes);
        console.log("xyBytes", hyphenBytes);

        console.log(
          "user USDC Balance",
          (await usdcToken.balanceOf(user.address)).toString()
        );
        await thetaV2.connect(user).swapThetaV2Call(
          [
            oneInch,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                NATIVE, // srcToken
                ethers.utils.parseUnits("0.003", 18).toString(), // amount
                ,
              ],
            ],
            [[ARBI_USDC], [NATIVE]], // dstToken
            [[NATIVE, ethers.utils.parseUnits("0", 18).toString()]], // dup
            oneDATA16.tx.data,
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [
            [0, cctpBytes],
            [ethers.utils.parseUnits("0.007", 18).toString(), hyphenBytes],
          ],
          [[[100]], true],
          { value: ethers.utils.parseUnits("0.01", 18).toString() }
        );
        //0.014000000000000000
        console.log(
          "user USDC Balance",
          (await usdcToken.balanceOf(user.address)).toString()
        );
      });
    if (testcase == 18)
      it("swapAndThetaV2Call arbi USDC,ETH -> 1inch->ETH(Stargate,Xy) TEST ", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);

        const oneDATA16 = await oneInchCall(
          42161,
          ARBI_USDC,
          NATIVE,
          ethers.utils.parseUnits("10", 6).toString(),
          thetaV2.address
        );
        console.log("oneDATA", oneDATA16.tx.data);

        const stargateBytes = await StargateBytesCode(
          NATIVE,
          ethers.utils.parseUnits("0.002", 18).toString(),
          42161,
          10,
          13,
          ethers.utils.parseUnits("0.002", 12).toString(),
          user.address,
          "0x"
        );

        console.log("stargateBytes", stargateBytes);

        console.log("xyBytes", xyBytes);

        console.log(
          "user USDC Balance",
          (await usdcToken.balanceOf(user.address)).toString()
        );
        await thetaV2.connect(user).swapThetaV2Call(
          [
            oneInch,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                ARBI_USDC, // srcToken
                ethers.utils.parseUnits("10", 6).toString(), // amount
                ,
              ],
            ],
            [[NATIVE]], // dstToken
            [[NATIVE, ethers.utils.parseUnits("0.0021", 18).toString()]], // dup
            oneDATA16.tx.data, // 0.006793208045275620
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [
            [0, stargateBytes],
            [0, xyBytes],
          ],
          [[[55, 45]], true],
          { value: ethers.utils.parseUnits("0.0021", 18).toString() }
        );
        //0.014000000000000000
        console.log(
          "user USDC Balance",
          (await usdcToken.balanceOf(user.address)).toString()
        );
      });
    if (testcase == 19)
      it("swapAndThetaV2Call USDT -> odos -> USDC,ETH -> USDC(cctp,xy) ETH(hyphen)", async function () {
        const { thetaV2 } = await loadFixture(deployThetaV2);
        const inputTokens = [
          {
            tokenAddress: ARBI_USDT, // odos api native
            amount: "50000000", // input amount as a string in fixed integer precision
          },
        ];

        const outputTokens = [
          {
            tokenAddress: "0x0000000000000000000000000000000000000000", // checksummed output token address
            proportion: 0.3,
          },
          {
            tokenAddress: ARBI_USDCe, // checksummed output token address
            proportion: 0.7,
          },
        ];

        const odosSwapCalldata = await odosCall(
          thetaV2.address.toString(),
          42161,
          inputTokens,
          outputTokens
        );
        console.log("odosSwapCalldata", odosSwapCalldata);

        await thetaV2.connect(user).swapThetaV2Call(
          [
            arbitrum_odos,
            thetaV2.address, // 받을 컨트랙트 주소
            [
              [
                ARBI_USDT, // srcToken
                50000000, // amount
              ],
            ],
            [[NATIVE], [ARBI_USDCe]], // dstToken
            [["0x0000000000000000000000000000000000000000", "0"]], // dup
            odosSwapCalldata.transaction.data,
            "0x0000000000000000000000000000000000000000",
            "0x",
          ],
          [
            [0, hyphenBytes],
            [0, xyBytes],
            [0, routerBytes],
          ],
          [[[100], [65, 35]], false],
          { value: 0 }
        );
      });
  });
});
