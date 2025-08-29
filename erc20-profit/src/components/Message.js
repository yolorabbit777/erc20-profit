import React, { useEffect, useState } from 'react';
import './Message.css';

const Message = ({ message, type = 'info', onClose, autoClose = true, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (autoClose && message) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, autoClose, duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  if (!message || !isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  return (
    <div className={`message-container ${getTypeClass()} ${isClosing ? 'closing' : ''}`}>
      <div className="message-content">
        <div className="message-icon">
          {getIcon()}
        </div>
        <div className="message-text">
          {message}
        </div>
        <button 
          className="message-close"
          onClick={handleClose}
          aria-label="Close message"
        >
          ×
        </button>
      </div>
      {autoClose && (
        <div className="message-progress">
          <div className="progress-bar"></div>
        </div>
      )}
    </div>
  );
};

export default Message;
