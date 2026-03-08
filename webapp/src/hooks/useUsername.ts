import { useState, useEffect } from 'react';

const USERNAME_KEY = 'vocab_username';

/**
 * Hook for managing user's username with localStorage
 */
export const useUsername = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');

  // Load username from localStorage on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem(USERNAME_KEY);
    if (savedUsername) {
      setUsername(savedUsername);
    }
    setIsLoading(false);
  }, []);

  // Save new username
  const saveUsername = (newUsername: string) => {
    const trimmedUsername = newUsername.trim();
    if (!trimmedUsername) {
      alert('Please enter a valid name');
      return false;
    }
    localStorage.setItem(USERNAME_KEY, trimmedUsername);
    setUsername(trimmedUsername);
    setShowUsernameModal(false);
    setUsernameInput('');
    return true;
  };

  // Show modal for rename
  const handleRename = () => {
    setUsernameInput(username || '');
    setShowUsernameModal(true);
  };

  // Show modal for initial username
  const handleInitialUsername = () => {
    setUsernameInput('');
    setShowUsernameModal(true);
  };

  // Handle modal confirmation
  const handleUsernameConfirm = () => {
    saveUsername(usernameInput);
  };

  // Handle modal cancel
  const handleUsernameCancel = () => {
    setShowUsernameModal(false);
    setUsernameInput('');
  };

  return {
    username,
    isLoading,
    showUsernameModal,
    setShowUsernameModal,
    usernameInput,
    setUsernameInput,
    saveUsername,
    handleRename,
    handleInitialUsername,
    handleUsernameConfirm,
    handleUsernameCancel,
  };
};

