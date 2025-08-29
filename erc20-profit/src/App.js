import React, { useState } from 'react';
import { AppKitProvider } from '@reown/appkit/react';
import Header from './components/Header';
import BuyGold from './components/BuyGold';
import TokenInfo from './components/TokenInfo';
import Message from './components/Message';
import './App.css';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import './createAppKit';
import { useActions } from './hooks/useActions';

function GoldTokenApp() {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { tokenInfo, loading, buyGold, loadTokenInfo } = useActions();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleTransactionComplete = () => {
    // Token info will be automatically updated by the useActions hook
    showMessage('Transaction completed successfully!', 'success');
  };

  const handleMessageClose = () => {
    setMessage('');
  };

  if (!isConnected) {
    return (
      <div className="app">
        <Header/>
        <div className="welcome-container">
          <div className="welcome-card">
            <h1>🌟 9StarGold Token</h1>
            <p>Buy gold tokens with ETH and earn rewards!</p>
            <div className="welcome-features">
              <div className="feature">
                <span className="feature-icon">💎</span>
                <span>100% of ETH converted to tokens</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎁</span>
                <span>1% bonus tokens to profit wallet</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span>Instant blockchain transactions</span>
              </div>
            </div>
            <button className="connect-btn-large" onClick={() => open()}>
              <span className="btn-icon">🔗</span>
              Connect Wallet to Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header/>
      
      <Message 
        message={message}
        type={messageType}
        onClose={handleMessageClose}
        autoClose={messageType !== 'error'}
      />

      <main className="main-content">
        <div className="content-grid">
          <div className="left-panel">
            <TokenInfo tokenInfo={tokenInfo} account={address} />
          </div>
          
          <div className="right-panel">
            <BuyGold 
              onTransactionComplete={handleTransactionComplete}
              loading={loading}
              setMessage={showMessage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppKitProvider>
      <GoldTokenApp />
    </AppKitProvider>
  );
}

export default App;
