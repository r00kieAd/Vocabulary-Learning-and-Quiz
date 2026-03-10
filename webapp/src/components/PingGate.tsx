import React, { useEffect, useState } from 'react';
import { pingServer, fetchVocabs, fetchScores, fetchHighScores, insertScore } from '../services';
import type { Vocab, Score } from '../services';
import FullscreenLoader from './FullscreenLoader';
import PingError from './PingError';
import GameShell from './GameShell';

type AppState = 'loading' | 'error' | 'ready';

export const PingGate: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [error, setError] = useState<string>('');
  const [vocabs, setVocabs] = useState<Vocab[]>([]);
  const [highScore, setHighScore] = useState<Score | null>(null);
  const [topScores, setTopScores] = useState<Score[]>([]);

  const refreshHighScore = async () => {
    try {
      const highScoreResult = await fetchHighScores();
      if (highScoreResult.status && highScoreResult.data && highScoreResult.data.length > 0) {
        const sorted = [...highScoreResult.data].sort(
          (a, b) => b.high_score - a.high_score
        );
        const topThree = sorted.slice(0, 3);
        setTopScores(topThree);
        setHighScore(topThree[0]);
      }
    } catch (err) {
      console.error('Failed to refresh high score:', err);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Step 1: Ping the server
        const pingResult = await pingServer();
        if (!pingResult.status) {
          setError(pingResult.resp || 'Failed to connect to server');
          setAppState('error');
          return;
        }

        // Step 2: Fetch vocabs and scores in parallel
        const [vocabsResult, , highScoreResult] = await Promise.all([
          fetchVocabs(),
          fetchScores(),
          fetchHighScores(),
        ]);

        if (!vocabsResult.status || !vocabsResult.data) {
          setError('Failed to load vocabularies');
          setAppState('error');
          return;
        }

        setVocabs(vocabsResult.data);
        
        if (highScoreResult.status && highScoreResult.data?.length) {
          const sorted = [...highScoreResult.data].sort(
            (a, b) => b.high_score - a.high_score
          );
          const topThree = sorted.slice(0, 3);
          setTopScores(topThree);
          setHighScore(topThree[0] || null);
        }

        setAppState('ready');
      } catch (err) {
        setError('An unexpected error occurred');
        setAppState('error');
      }
    };

    initializeApp();
  }, []);

  const handleRetry = () => {
    setAppState('loading');
    setError('');
    window.location.reload();
  };

  if (appState === 'loading') {
    return <FullscreenLoader />;
  }

  if (appState === 'error') {
    return <PingError error={error} onRetry={handleRetry} />;
  }

    return (
      <GameShell
        vocabs={vocabs}
        highScore={highScore?.high_score || 0}
        highScorer={highScore?.high_scorer || 'None'}
        topScores={topScores}
        onScoreInsert={insertScore}
        onRefreshHighScore={refreshHighScore}
      />
    );
  };

export default PingGate;
