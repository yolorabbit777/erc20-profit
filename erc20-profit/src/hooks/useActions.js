import { useState, useEffect } from 'react';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
import { CONTRACT_ADDRESS } from '../constants';
import NineStarGold from '../abi/NineStarGold.json';

export const useActions = () => {
    const { address, isConnected } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider('eip155');
    const [tokenInfo, setTokenInfo] = useState({
        name: '',
        symbol: '',
        decimals: 18,
        totalSupply: '0',
        userBalance: '0'
    });
    const [ethBalance, setEthBalance] = useState('0');
    const [loading, setLoading] = useState(false);

    // Get contract instance
    const getContract = async () => {
        if (!isConnected || !walletProvider) return null;
        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();
        return new Contract(CONTRACT_ADDRESS, NineStarGold, signer);
    };

    // Get provider instance
    const getProvider = async () => {
        if (!walletProvider) return null;
        return new BrowserProvider(walletProvider);
    };

    // Load token information
    const loadTokenInfo = async () => {
        if (!isConnected || !address) return;

        try {
            const contract = await getContract();
            const provider = await getProvider();
            
            if (!contract || !provider) return;

            const [name, symbol, decimals, totalSupply, userBalance, ethBalanceWei] = await Promise.all([
                contract.name(),
                contract.symbol(),
                contract.decimals(),
                contract.totalSupply(),
                contract.balanceOf(address),
                provider.getBalance(address)
            ]);

            setTokenInfo({
                name,
                symbol,
                decimals: Number(decimals),
                totalSupply: formatEther(totalSupply),
                userBalance: formatEther(userBalance)
            });

            setEthBalance(formatEther(ethBalanceWei));
        } catch (error) {
            console.error('Error loading token info:', error);
        }
    };

    // Get current ETH balance for MAX button
    const getEthBalance = async () => {
        if (!isConnected || !address) return '0';
        
        try {
            const provider = await getProvider();
            if (!provider) return '0';
            
            const balance = await provider.getBalance(address);
            const formattedBalance = formatEther(balance);
            setEthBalance(formattedBalance);
            return formattedBalance;
        } catch (error) {
            console.error('Error getting ETH balance:', error);
            return '0';
        }
    };

    // Calculate MAX amount (reserve some ETH for gas)
    const getMaxAmount = async () => {
        const balance = await getEthBalance();
        const gasReserve = 0.01; // Reserve 0.01 ETH for gas
        const maxAmount = Math.max(0, parseFloat(balance) - gasReserve);
        return maxAmount.toFixed(4);
    };

    // Buy gold function
    const buyGold = async (amount, profitWallet) => {
        if (!isConnected) {
            throw new Error('Wallet not connected');
        }

        try {
            setLoading(true);
            const contract = await getContract();
            if (!contract) throw new Error('Contract not available');

            const amountWei = parseEther(amount);
            const tx = await contract.buyGold(profitWallet, { value: amountWei });
            await tx.wait();
            
            // Refresh token info after successful transaction
            await loadTokenInfo();
            return true;
        } catch (error) {
            console.error('Error buying gold:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Load token info when wallet connects or address changes
    useEffect(() => {
        if (isConnected && address) {
            loadTokenInfo();
        }
    }, [isConnected, address]);

    return {
        buyGold,
        loadTokenInfo,
        getEthBalance,
        getMaxAmount,
        tokenInfo,
        ethBalance,
        loading
    };
};