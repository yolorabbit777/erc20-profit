// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title 9StarGold
 * @dev ERC-20 token that allows users to buy gold (ETH) and receive tokens
 * 1% of the ETH sent is taken as profit and sent to a specified wallet
 */
contract NineStarGold is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant PROFIT_PERCENTAGE = 100; // 1% = 100 basis points
    uint256 public constant BASIS_POINTS = 10000; // 100% = 10000 basis points
    
    address public profitWallet;
    
    event GoldPurchased(address indexed buyer, uint256 ethAmount, uint256 tokensMinted, uint256 profitAmount);
    event ProfitWalletUpdated(address indexed oldWallet, address indexed newWallet);
    
    /**
     * @dev Constructor sets the initial profit wallet to the contract deployer
     */
    constructor() 
        ERC20("9StarGold", "9SG") 
        Ownable(msg.sender)
    {
        profitWallet = msg.sender;
    }
    
    /**
     * @dev Allows users to buy gold by sending ETH
     * @param _profitWallet The wallet address to receive the 1% profit in tokens
     * Requirements:
     * - msg.value must be greater than 0
     * - _profitWallet must not be zero address
     */
    function buyGold(address _profitWallet) external payable nonReentrant {
        require(msg.value > 0, "9StarGold: Must send ETH to buy gold");
        require(_profitWallet != address(0), "9StarGold: Profit wallet cannot be zero address");
        
        // Calculate profit amount in tokens (1% of sent ETH)
        uint256 profitAmount = (msg.value * PROFIT_PERCENTAGE) / BASIS_POINTS;
        
        // Calculate amount for user's token minting (100% of sent ETH)
        uint256 userMintAmount = msg.value;
        
        // Total tokens to mint (101% of sent ETH: 100% for user + 1% for profit)
        uint256 totalMintAmount = msg.value + profitAmount;
        
        // Mint tokens to the buyer (100% of ETH sent)
        _mint(msg.sender, userMintAmount);
        
        // Mint profit tokens to the specified wallet (1% of ETH sent)
        _mint(_profitWallet, profitAmount);
        
        emit GoldPurchased(msg.sender, msg.value, userMintAmount, profitAmount);
    }
    
    /**
     * @dev Allows the owner to update the default profit wallet
     * @param _newProfitWallet The new profit wallet address
     */
    function setProfitWallet(address _newProfitWallet) external onlyOwner {
        require(_newProfitWallet != address(0), "9StarGold: Profit wallet cannot be zero address");
        
        address oldWallet = profitWallet;
        profitWallet = _newProfitWallet;
        
        emit ProfitWalletUpdated(oldWallet, _newProfitWallet);
    }
    
    /**
     * @dev Allows the owner to withdraw any ETH stuck in the contract
     */
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "9StarGold: No ETH to withdraw");
        
        (bool sent, ) = owner().call{value: balance}("");
        require(sent, "9StarGold: Failed to withdraw ETH");
    }
    
    /**
     * @dev Override decimals to use 18 decimals (standard for ERC-20)
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
    
    /**
     * @dev Function to receive ETH. This allows the contract to receive ETH
     */
    receive() external payable {
        // Allow the contract to receive ETH
    }
}
