import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import getAnswers from '../services/aiChat';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: number;
}

interface AIChatPanelProps {
  word: string;
  wordType: string;
  meaning: string;
  example: string;
  onClose: () => void;
}

interface PredefinedOption {
  label: string;
  prompt: string | null;
  requiresInput?: boolean;
}

const predefinedOptions: PredefinedOption[] = [
  { label: 'Get Synonyms', prompt: 'Provide synonyms for this word' },
  { label: 'Get Antonyms', prompt: 'Provide antonyms for this word' },
  { label: 'Get Examples', prompt: 'Provide more example sentences using this word' },
  { label: 'Translate', prompt: null, requiresInput: true },
  { label: 'Pronounce', prompt: 'How to pronounce this word? Provide phonetic pronunciation and guides.' },
];

export const AIChatPanel: React.FC<AIChatPanelProps> = ({
  word,
  wordType,
  meaning,
  example,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputTextAreaRef.current) {
      inputTextAreaRef.current.style.height = 'auto';
      const newHeight = Math.min(inputTextAreaRef.current.scrollHeight, 100);
      inputTextAreaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    // Add user message
    const userMsgId = `msg-${Date.now()}`;
    const userMessage: Message = {
      id: userMsgId,
      type: 'user',
      content: prompt,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await getAnswers(
        prompt,
        word,
        wordType,
        meaning,
        example,
        ''
      );

      if (response.status && response.data) {
        const aiMessage: Message = {
          id: `msg-${Date.now()}`,
          type: 'ai',
          content: response.data.answer || 'No response received',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: `msg-${Date.now()}`,
          type: 'ai',
          content: response.resp || 'Failed to get response from AI',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        type: 'ai',
        content: 'An error occurred. Please try again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickOption = (option: PredefinedOption) => {
    if (option.requiresInput) {
      // For Translate: fill input and let user complete
      setInputValue(`Translate the word in: `);
      inputTextAreaRef.current?.focus();
    } else if (option.prompt) {
      sendMessage(option.prompt);
    }
  };

  const handleSendMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleSendClick = () => {
    sendMessage(inputValue);
  };

  return (
    <div className="ai-chat-panel">
      <div className="chat-header">
        <span className="chat-title">Ask AI about "{word}"</span>
        <button className="btn-close" onClick={onClose} aria-label="Close chat">
          ✕
        </button>
      </div>

      <div className="chat-options">
        {predefinedOptions.map((option) => (
          <button
            key={option.label}
            className="btn-option-ai"
            onClick={() => handleQuickOption(option)}
            disabled={isLoading}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty-state">
            <p>Ask AI a question about this word...</p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message chat-message-${message.type}`}
          >
            <div className="message-content">
              {message.type === 'ai' ? (
                <Markdown>{message.content}</Markdown>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message chat-message-ai">
            <div className="message-content">
              <span className="loading-dots">Contemplating</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          ref={inputTextAreaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleSendMessage}
          placeholder="Type your question or use quick options above..."
          className="chat-input"
          disabled={isLoading}
          rows={1}
        />
        <button
          className="btn-send"
          onClick={handleSendClick}
          disabled={isLoading || !inputValue.trim()}
          aria-label="Send message"
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default AIChatPanel;
