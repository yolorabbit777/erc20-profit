// Configuration file for 9StarGold Token App (UI Only)

// Helper function to validate Ethereum address format
export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Helper function to shorten address for display
export const shortenAddress = (address, chars = 4) => {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

// Helper function to format token amounts
export const formatTokenAmount = (amount, decimals = 18) => {
  if (!amount) return "0";
  const formatted = parseFloat(amount) / Math.pow(10, decimals);
  return formatted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  });
};

// Helper function to format ETH amounts
export const formatETHAmount = (amount) => {
  if (!amount) return "0";
  const formatted = parseFloat(amount) / Math.pow(10, 18);
  return formatted.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6
  });
};
