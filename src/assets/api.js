import { urlApi } from "../config/enviroments";

export const handleSaveTransaction = async ({
  tx,
  projectId,
  amount,
  userAccount,
}) => {
  return fetch(`${urlApi}/web3/save-transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...tx,
      projectId,
      valueUSD: amount,
      userAccount,
    }),
  }).then((response) => {
    return response.json();
  });
};
