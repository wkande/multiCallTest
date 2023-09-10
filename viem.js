const { createPublicClient, http } = require("viem");
const { arbitrum, avalanche, polygon, polygonZkEvm } = require("viem/chains");

const { ethers, utils } = require("ethers");
const { dapiNames } = require("./dapiNames.js");

async function call(chain) {
  console.time(chain.name);

  // >>> client >>>
  const publicClient = createPublicClient({
    chain: chain,
    transport: http(),
  });

  // >>> abi >>>
  const api3serverAbi = [
    {
      inputs: [{ name: "dapiNameHash", type: "bytes32" }],
      name: "readDataFeedWithDapiNameHash",
      outputs: [
        { name: "value", type: "int224" },
        { name: "timestamp", type: "uint32" },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  // >>> Call contract multicall >>>
  const api3serverContract = {
    address: "0x3dEC619dc529363767dEe9E71d8dD1A5bc270D76",
    abi: api3serverAbi,
  };

  // >>> build contracts w/hashNames >>>
  const contracts = [];
  for (let i = 0; i < dapiNames.length; i++) {
    contracts.push({
      ...api3serverContract,
      functionName: "readDataFeedWithDapiNameHash",
      args: [getHashName(dapiNames[i])],
      myDapiName: dapiNames[i],
    });
  }

  const data = await publicClient.multicall({ contracts });
  console.log(">>>", chain.name);

  let successCnt = 0;
  let failCnt = 0;
  for (let i = 0; i < data.length; i++) {
    const el = data[i];
    if (el.status === "success") {
      successCnt++;
      //console.log(contracts[i].myDapiName, el.result);
    } else {
      failCnt++;
      //console.log(contracts[i].myDapiName, "(not deployed)");
    }
  }
  console.log("deployed:", successCnt);
  console.log("NOT deployed:", failCnt);

  console.timeEnd(chain.name);
  console.log("-----------------------------");
}

function getHashName(dapiName) {
  return utils.keccak256(ethers.utils.formatBytes32String(dapiName));
}

async function start() {
  // All chains can be run a the same time
  console.log("\n*---------------------------------------*");
  console.log(`* Getting dAPI values from Api3ServerV1 *`);
  console.log("*---------------------------------------*");
  call(arbitrum);
  call(avalanche);
  call(polygon);
  call(polygonZkEvm);
}

start();
