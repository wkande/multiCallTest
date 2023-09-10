```sh
----- Api3ServerV1.callstatic.multicall ------
keccakHash APE/USD: 0x92a9cc5f71d9c25cec742aa1cee3666daadbdee4124b2398da95f4ec21d0ee66
keccakHash AAVE/USD: 0x3e6791c633b4eafdb85e54d05eaba5ce82e5b20ace55abd8f38bb0894e33cdef
/Users/warren/DEV/centurion/multiCall/app.js:46
  const res = await Api3ServerV1.callstatic.multicall([
                                            ^

TypeError: Cannot read properties of undefined (reading 'multicall')
    at call (/Users/warren/DEV/centurion/multiCall/app.js:46:45)
    at Object.<anonymous> (/Users/warren/DEV/centurion/multiCall/app.js:53:1)
    at Module._compile (node:internal/modules/cjs/loader:1218:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1272:10)
    at Module.load (node:internal/modules/cjs/loader:1081:32)
    at Module._load (node:internal/modules/cjs/loader:922:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:23:47
```
