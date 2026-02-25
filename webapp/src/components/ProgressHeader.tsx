import React, { useState } from 'react';
import { fetchAndPlayTTS } from '../services/ttsAudio';

interface ProgressHeaderProps {
  current: number;
  total: number;
  hearts: number;
  quizMode?: 'flashcard' | 'random';
  word?: string;
  wordType?: string;
  onQuit?: () => void;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  current,
  total,
  hearts,
  quizMode = 'random',
  word = '',
  onQuit,
}) => {
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');

  const handlePlayAudio = async () => {
    if (audioState === 'loading' || audioState === 'playing' || !word) return;

    try {
      setAudioState('loading');
      await fetchAndPlayTTS(
        word,
        () => setAudioState('playing'),
        () => setAudioState('idle')
      );
    } catch (error) {
      console.error('Audio playback failed:', error);
      setAudioState('error');
      // Revert to idle after 2 seconds
      setTimeout(() => setAudioState('idle'), 2000);
    }
  };

  const handleQuit = () => {
    if (onQuit) {
      onQuit();
    }
  };
  return (
    <div className="progress-header">
      <div className="question-counter">
        {quizMode === 'flashcard' && <span className="mode-badge">Learned Words</span>}
        Question {current} of {total}
      </div>
      <div className="header-right">
        {hearts > 0 && (
          <div className="hearts">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`heart ${i < hearts ? '' : 'empty'}`}>
                {i < hearts ? 'Heart' : 'Empty'}
              </span>
            ))}
          </div>
        )}
        {word && (
          <button
            className="btn-play-audio"
            onClick={handlePlayAudio}
            disabled={audioState === 'loading' || audioState === 'playing'}
            title="Play pronunciation"
          >
            {audioState === 'idle' && <i className="fa-solid fa-volume"></i>}
            {audioState === 'loading' && <i className="fa-solid fa-volume fa-beat-fade"></i>}
            {audioState === 'playing' && <i className="fa-solid fa-volume fa-shake"></i>}
            {audioState === 'error' && <i className="fa-solid fa-volume-xmark" style={{ color: 'rgb(225, 49, 29)' }}></i>}
          </button>
        )}
        {onQuit && (
          <button
            className="btn-quit-quiz"
            onClick={handleQuit}
            title="Exit quiz"
          >
            <i className="fa-solid fa-x"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProgressHeader;
