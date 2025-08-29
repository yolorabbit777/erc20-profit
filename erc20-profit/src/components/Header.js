import React from 'react';
import { shortenAddress } from '../config';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import './Header.css';

const Header = () => {
  const { address, isConnected } = useAppKitAccount();
  const { open, disconnect } = useAppKit();

  const formatAddress = (address) => {
    return shortenAddress(address);
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-section">
          <h1 className="app-title">
            <span className="logo-icon">🌟</span>
            9StarGold Token
          </h1>
          <p className="app-subtitle">Buy gold tokens with ETH and earn rewards!</p>
        </div>

        <div className="wallet-section">
          {isConnected ? (
            <div className="wallet-info">
              <div className="wallet-status">
                <div className="status-indicator connected"></div>
                <span className="status-text">Connected</span>
              </div>
              <div className="wallet-address">
                {formatAddress(address)}
              </div>
              <button 
                className="disconnect-btn"
                onClick={disconnect}
                title="Disconnect Wallet"
              >
                <span className="btn-icon">🔌</span>
                Disconnect
              </button>
            </div>
          ) : (
            <div className="connect-section">
              <div className="wallet-status">
                <div className="status-indicator disconnected"></div>
                <span className="status-text">Not Connected</span>
              </div>
              <button 
                className="connect-btn"
                onClick={open}
                title="Connect Wallet"
              >
                <span className="btn-icon">🔗</span>
                Connect Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
