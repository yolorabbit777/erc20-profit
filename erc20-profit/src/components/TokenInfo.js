import React from 'react';
import { formatTokenAmount } from '../config';
import './TokenInfo.css';

const TokenInfo = ({ tokenInfo, account }) => {
  const { name, symbol, decimals, totalSupply, userBalance } = tokenInfo;

  console.log(tokenInfo)

  // Show loading state if data is not yet loaded
  const isLoading = !name || !symbol;

  // Custom format function for 6 decimal places
  const formatWith6Decimals = (amount) => {
    if (!amount) return "0.000000";
    const formatted = parseFloat(amount);
    return formatted.toLocaleString('en-US', {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6
    });
  };

  return (
    <div className="token-info-container">
      <div className="token-info-card">
        <div className="card-header">
          <h3>📊 Token Information</h3>
        </div>
        
        <div className="info-grid">
          <div className={`info-item ${isLoading ? 'loading' : ''}`}>
            <div className="info-icon">🏷️</div>
            <div className="info-content">
              <span className="label">Token Name</span>
              <span className="value">{isLoading ? 'Loading...' : name}</span>
            </div>
          </div>
          
          <div className={`info-item ${isLoading ? 'loading' : ''}`}>
            <div className="info-icon">💎</div>
            <div className="info-content">
              <span className="label">Symbol</span>
              <span className="value">{isLoading ? 'Loading...' : symbol}</span>
            </div>
          </div>
          
          <div className={`info-item ${isLoading ? 'loading' : ''}`}>
            <div className="info-icon">🔢</div>
            <div className="info-content">
              <span className="label">Decimals</span>
              <span className="value">{decimals || '18'}</span>
            </div>
          </div>
          
          <div className={`info-item ${isLoading ? 'loading' : ''}`}>
            <div className="info-icon">💰</div>
            <div className="info-content">
              <span className="label">Your Balance</span>
              <span className="value">
                {isLoading ? 'Loading...' : `${formatWith6Decimals(userBalance, decimals)} ${symbol}`}
              </span>
            </div>
          </div>
          
          <div className={`info-item ${isLoading ? 'loading' : ''}`}>
            <div className="info-icon">🌐</div>
            <div className="info-content">
              <span className="label">Total Supply</span>
              <span className="value">
                {isLoading ? 'Loading...' : `${formatWith6Decimals(totalSupply, decimals)} ${symbol}`}
              </span>
            </div>
          </div>
          
          <div className={`info-item ${isLoading ? 'loading' : ''}`}>
            <div className="info-icon">👤</div>
            <div className="info-content">
              <span className="label">Your Address</span>
              <span className="value address">
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-value">
              {isLoading ? '...' : formatWith6Decimals(userBalance, decimals)}
            </div>
            <div className="stat-label">Your 9SG Tokens</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">
              {isLoading ? '...' : formatWith6Decimals(totalSupply, decimals)}
            </div>
            <div className="stat-label">Total Supply</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInfo;
