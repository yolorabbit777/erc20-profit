# 9StarGold ERC-20 Token Contract

## Overview

The `9StarGold` contract is an ERC-20 token that allows users to "buy gold" by sending ETH to the contract. When users buy gold, they receive tokens in a 1:1 ratio with the ETH sent, and an additional 1% profit in tokens is minted to a specified wallet address.

## Contract Features

### Core Functionality
- **ERC-20 Standard**: Full ERC-20 token implementation using OpenZeppelin
- **Buy Gold Function**: Users can send ETH to receive tokens
- **Profit Distribution**: 1% of sent ETH is automatically minted as tokens to a profit wallet
- **Owner Controls**: Contract owner can update profit wallet and withdraw stuck ETH

### Token Details
- **Name**: 9StarGold
- **Symbol**: 9SG
- **Decimals**: 18
- **Initial Supply**: 0 (tokens are minted when users buy gold)

## Functions

### `buyGold(address _profitWallet)`
Allows users to buy gold by sending ETH.

**Parameters:**
- `_profitWallet`: The wallet address to receive the 1% profit in tokens

**Requirements:**
- `msg.value` must be greater than 0
- `_profitWallet` must not be the zero address

**Behavior:**
- Calculates 1% profit from sent ETH
- Mints tokens to `msg.sender` (100% of sent ETH)
- Mints 1% profit tokens to `_profitWallet`
- Emits `GoldPurchased` event

### `setProfitWallet(address _newProfitWallet)`
Allows the contract owner to update the default profit wallet.

**Parameters:**
- `_newProfitWallet`: The new profit wallet address

**Requirements:**
- Only callable by contract owner
- `_newProfitWallet` must not be the zero address

### `withdrawETH()`
Allows the contract owner to withdraw any ETH stuck in the contract.

**Requirements:**
- Only callable by contract owner
- Contract must have ETH balance

## Events

### `GoldPurchased`
Emitted when a user successfully buys gold.

```solidity
event GoldPurchased(
    address indexed buyer,
    uint256 ethAmount,
    uint256 tokensMinted,
    uint256 profitAmount
);
```

### `ProfitWalletUpdated`
Emitted when the profit wallet is updated.

```solidity
event ProfitWalletUpdated(
    address indexed oldWallet,
    address indexed newWallet
);
```

## Usage Examples

### Buying Gold
```javascript
// Send 1 ETH to buy gold
const ethAmount = ethers.parseEther("1.0");
const profitWallet = "0x..."; // Address to receive 1% profit in tokens

await nineStarGold.buyGold(profitWallet, { value: ethAmount });
// User receives 1.0 tokens (100% of 1 ETH)
// Profit wallet receives 0.01 tokens (1% of 1 ETH)
```

### Updating Profit Wallet
```javascript
// Only owner can call this
await nineStarGold.setProfitWallet(newProfitWalletAddress);
```

### Withdrawing Stuck ETH
```javascript
// Only owner can call this
await nineStarGold.withdrawETH();
```

## Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks on the `buyGold` function
- **Ownable**: Restricts sensitive functions to contract owner only
- **Input Validation**: Validates all user inputs
- **Safe ETH Transfers**: Uses low-level calls with proper error handling

## Deployment

To deploy the contract:

```bash
npx hardhat run scripts/deploy-9StarGold.ts --network <network-name>
```

## Testing

To run the tests:

```bash
npx hardhat test test/9StarGold.test.ts
```

## License

MIT License
