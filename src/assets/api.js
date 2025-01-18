export const handleSaveTransaction = ({ tx, projectId, amount, userAccount }) => {
  return fetch(`http://localhost:3001/web3/save-transaction`, {
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