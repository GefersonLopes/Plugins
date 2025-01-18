import { BSC_PARAMS } from "./paramsMetamask";

export async function switchToBSC() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BSC_PARAMS.chainId }],
    });
  } catch (error) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [BSC_PARAMS],
      });
    } else {
      console.error("Erro ao trocar/adicionar a rede BSC:", error);
    }
  }
}

export async function switchToBSCWithWalletProvider(walletProvider) {
  try {
    await walletProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BSC_PARAMS.chainId }],
    });
  } catch (error) {
    if (error.code === 4902) {
      await walletProvider.request({
        method: "wallet_addEthereumChain",
        params: [BSC_PARAMS],
      });
    } else {
      console.error("Erro ao trocar/adicionar a rede BSC:", error);
      throw error;
    }
  }
}
