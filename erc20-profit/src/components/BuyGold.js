import React, { useState } from 'react';
import { isValidAddress } from '../config';
import './BuyGold.css';
import { useActions } from '../hooks/useActions';

const BuyGold = ({ onTransactionComplete, loading, setMessage }) => {
  const [ethAmount, setEthAmount] = useState('');
  const [profitWallet, setProfitWallet] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const { buyGold, getMaxAmount } = useActions();

  // Calculate expected tokens and profit
  const calculateExpectedTokens = () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) return { userTokens: 0, profitTokens: 0 };
    
    const amount = parseFloat(ethAmount);
    const profitAmount = amount * 0.01; // 1% profit
    const userTokens = amount; // 100% of ETH for user
    
    return {
      userTokens: userTokens.toFixed(6),
      profitTokens: profitAmount.toFixed(6)
    };
  };

  const { userTokens, profitTokens } = calculateExpectedTokens();

  const handleBuyGold = async () => {
    if (!ethAmount || !profitWallet) {
      setMessage('Please fill in all fields');
      return;
    }

    if (!isValidAddress(profitWallet)) {
      setMessage('Please enter a valid profit wallet address');
      return;
    }

    if (parseFloat(ethAmount) <= 0) {
      setMessage('Please enter a valid ETH amount');
      return;
    }

    try {
      setMessage('');

      // Use real blockchain transaction
      setMessage('Transaction sent! Waiting for confirmation...');
      await buyGold(ethAmount, profitWallet);
      
      setMessage('Gold purchased successfully! 🎉');
      setEthAmount('');
      setProfitWallet('');
      
      if (onTransactionComplete) {
        onTransactionComplete();
      }
    } catch (error) {
      console.error('Error buying gold:', error);
      setMessage(`Error: ${error.message || 'Transaction failed'}`);
    }
  };

  const handleMaxAmount = async () => {
    try {
      setIsCalculating(true);
      const maxAmount = await getMaxAmount();
      setEthAmount(maxAmount);
    } catch (error) {
      console.error('Error getting max amount:', error);
      setMessage('Error getting wallet balance');
    } finally {
      setIsCalculating(false);
    }
  };

  const isFormValid = ethAmount && profitWallet && parseFloat(ethAmount) > 0 && isValidAddress(profitWallet);

  return (
    <div className="buy-gold-container">
      <div className="buy-gold-card">
        <div className="card-header">
          <h2>💰 Buy Gold</h2>
          <p>Send ETH to receive 9StarGold tokens. 1% profit will be minted to the profit wallet.</p>
        </div>

        <div className="form-section">
          <div className="input-group">
            <label htmlFor="ethAmount">ETH Amount</label>
            <div className="input-with-button">
              <input
                id="ethAmount"
                type="number"
                value={ethAmount}
                onChange={(e) => setEthAmount(e.target.value)}
                placeholder="0.1"
                step="0.01"
                min="0"
                disabled={loading}
              />
              <button 
                type="button" 
                className="max-btn"
                onClick={handleMaxAmount}
                disabled={loading || isCalculating}
              >
                {isCalculating ? '...' : 'MAX'}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="profitWallet">Profit Wallet Address</label>
            <input
              id="profitWallet"
              type="text"
              value={profitWallet}
              onChange={(e) => setProfitWallet(e.target.value)}
              placeholder="0x..."
              disabled={loading}
              className={profitWallet && !isValidAddress(profitWallet) ? 'error' : ''}
            />
            {profitWallet && !isValidAddress(profitWallet) && (
              <span className="error-text">Invalid Ethereum address</span>
            )}
          </div>
        </div>

        {ethAmount && parseFloat(ethAmount) > 0 && (
          <div className="calculation-section">
            <h3>Transaction Summary</h3>
            <div className="calculation-grid">
              <div className="calc-item">
                <span className="label">You will receive:</span>
                <span className="value">{userTokens} 9SG</span>
              </div>
              <div className="calc-item">
                <span className="label">Profit wallet receives:</span>
                <span className="value">{profitTokens} 9SG</span>
              </div>
              <div className="calc-item total">
                <span className="label">Total tokens minted:</span>
                <span className="value">{(parseFloat(userTokens) + parseFloat(profitTokens)).toFixed(6)} 9SG</span>
              </div>
            </div>
          </div>
        )}

        <div className="action-section">
          <button 
            className="buy-btn"
            onClick={handleBuyGold}
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <>
                <span className="btn-icon">🌟</span>
                Buy Gold
              </>
            )}
          </button>
        </div>

        <div className="info-section">
          <div className="info-item">
            <span className="icon">ℹ️</span>
            <span>You receive 100% of your ETH as tokens</span>
          </div>
          <div className="info-item">
            <span className="icon">💎</span>
            <span>1% additional tokens are minted to the profit wallet</span>
          </div>
          <div className="info-item">
            <span className="icon">⚡</span>
            <span>Transaction is processed on the blockchain</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyGold;
