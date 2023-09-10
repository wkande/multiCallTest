# multiCall

Both `ethers` and `viem` have the ability to make multiple function call (batching) on-chain.

## ethers.js

This file is not working.

```sh
yarn ethers
```

## viem.js

This file works and is very fast. It passes 123 `dapiNames` to four test chains and takes 1.3 to 1.7 seconds.

```sh
yarn viem
```
