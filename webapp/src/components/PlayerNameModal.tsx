import React, { useState } from 'react';

interface PlayerNameModalProps {
  isOpen: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export const PlayerNameModal: React.FC<PlayerNameModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    onConfirm(trimmedName);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content player-name-modal">
        <h2>Enter Your Name</h2>
        <p>What's your name, player?</p>
        
        <input
          type="text"
          className="modal-input"
          placeholder="Your name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          onKeyPress={handleKeyPress}
          autoFocus
        />

        {error && <div className="modal-error">{error}</div>}

        <div className="modal-buttons">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerNameModal;
