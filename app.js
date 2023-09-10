const { ethers, utils, providers } = require("ethers");

async function call() {
  console.log("\n----- Api3ServerV1.callstatic.multicall ------");

  // Setup two dAPI hashNames, APE/USD and AAVE/USD
  const encodedNameAPE = ethers.utils.formatBytes32String("APE/USD");
  const keccakHashAPE = utils.keccak256(encodedNameAPE);
  const encodedNameAAVE = ethers.utils.formatBytes32String("AAVE/USD");
  const keccakHashAAVE = utils.keccak256(encodedNameAAVE);
  console.log("keccakHash APE/USD:", keccakHashAPE);
  console.log("keccakHash AAVE/USD:", keccakHashAAVE);

  // Provider (Polygon)
  const provider = new ethers.providers.StaticJsonRpcProvider(
    { url: "https://rpc.ankr.com/polygon", timeout: 4000 },
    137
  );

  // Signer, a burner private key used below
  const signer = new ethers.Wallet(
    "0x6035b7e4b29b7d43b8eecdc14b8f69206792d40b67a25b6cd6362d11b8179e6b",
    provider
  );

  // abi
  // probably the wrong one to use callstatic.multicall
  const abi = [
    "function readDataFeedWithDapiNameHash(bytes32) external view returns (int224 value, uint32 timestamp)",
  ];

  // Contract
  const Api3ServerV1 = new ethers.Contract(
    "0x3dEC619dc529363767dEe9E71d8dD1A5bc270D76",
    abi,
    signer
  );

  // my normal call next line, which will work but only gets a single dAPI
  // const res = await Api3ServerV1.readDataFeedWithDapiNameHash(keccakHashAPE);

  // Try to use Api3ServerV1.callstatic.multicall to get multiple dAPIs
  // * Packages needed? callstatic seems to be undefined
  // * The abi is probably wrong
  // See the last_error.md file, shows the latest response for this call
  const res = await Api3ServerV1.callstatic.multicall([
    keccakHashAPE,
    keccakHashAAVE,
  ]);
  console.log(res);

  /** My guess is that this somehow is the solution but I get lost in it.

        const api3ServerV1Interface = new ethers.utils.Interface(
          Api3ServerV1Factory.abi
        );
        api3ServerV1Interface.encodeFunctionData("readDataFeedWithDapiNameHash", [
          dapiNameHash,
        ]);
  */
}

call();
