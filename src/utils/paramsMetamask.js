export const USDT_CONTRACT_ADDRESS =
  "0x55d398326f99059fF775485246999027B3197955";

export const USDT_ABI = [
  "function transfer(address to, uint256 amount) public returns (bool)",
];

export const BSC_PARAMS = {
  chainId: "0x38",
  chainName: "Binance Smart Chain",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com"],
};
