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

  // You should consider using dotenv library to put RPC urls and PRIVATE KEYs in a .env file
  // Provider (Polygon)
  const provider = new ethers.providers.StaticJsonRpcProvider(
    { url: "https://rpc.ankr.com/polygon", timeout: 4000 },
    137
  );

  // Please make sure to never send ANY funds to this wallet (even testnet tokens)
  // Signer, a burner private key used below
  const signer = new ethers.Wallet(
    "0x6035b7e4b29b7d43b8eecdc14b8f69206792d40b67a25b6cd6362d11b8179e6b",
    provider
  );

  // abi
  // probably the wrong one to use callstatic.multicall
  const abi = [
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "dapiNameHash",
          type: "bytes32",
        },
      ],
      name: "readDataFeedWithDapiNameHash",
      outputs: [
        {
          internalType: "int224",
          name: "value",
          type: "int224",
        },
        {
          internalType: "uint32",
          name: "timestamp",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes[]",
          name: "data",
          type: "bytes[]",
        },
      ],
      name: "tryMulticall",
      outputs: [
        {
          internalType: "bool[]",
          name: "successes",
          type: "bool[]",
        },
        {
          internalType: "bytes[]",
          name: "returndata",
          type: "bytes[]",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  // Maybe this is better since types are being exported from @api3/airnode-protocol-v1
  // const api3ServerV1 = new Api3ServerV1__factory().attach(api3ServerV1Address);

  // Contract
  const api3ServerV1 = new ethers.Contract(
    "0x3dEC619dc529363767dEe9E71d8dD1A5bc270D76",
    abi,
    signer
  );

  // Used tryMulticall instead of multicall in case any of the read fails
  const { successes, returndata } = await api3ServerV1.callStatic.tryMulticall([
    api3ServerV1.interface.encodeFunctionData("readDataFeedWithDapiNameHash", [
      keccakHashAPE,
    ]),
    api3ServerV1.interface.encodeFunctionData("readDataFeedWithDapiNameHash", [
      keccakHashAAVE,
    ]),
  ]);
  console.log(successes, returndata);

  console.log(
    "APE/USD",
    ethers.utils.defaultAbiCoder.decode(["int224", "uint32"], returndata[0])
  );
  console.log(
    "AAVE/USD",
    ethers.utils.defaultAbiCoder.decode(["int224", "uint32"], returndata[1])
  );
}

call();
