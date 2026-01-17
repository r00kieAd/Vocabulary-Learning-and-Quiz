import React, { useState } from 'react';
import ProgressHeader from './ProgressHeader';
import QuestionCard from './QuestionCard';
import FeedbackToast from './FeedbackToast';

interface Option {
  id: string;
  text: string;
}

interface QuizQuestion {
  vocabId: number;
  word: string;
  wordType: string;
  correctAnswer: string;
  options: Option[];
}

interface QuizScreenProps {
  questions: QuizQuestion[];
  onQuizEnd: (score: number) => void;
  onQuit: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  onQuizEnd,
  onQuit,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(
    null
  );
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleOptionSelect = (optionId: string) => {
    const isCorrect = optionId === currentQuestion.correctAnswer;
    setSelectedOption(optionId);
    setAnsweredCorrectly(isCorrect);
    setShowFeedback(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setHearts((prev) => Math.max(0, prev - 1));
    }

    // Move to next question after delay
    setTimeout(() => {
      if (hearts <= 1 && !isCorrect) {
        // Game over
        onQuizEnd(score);
      } else if (isLastQuestion) {
        // Quiz completed
        onQuizEnd(isCorrect ? score + 1 : score);
      } else {
        // Next question
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setAnsweredCorrectly(null);
        setShowFeedback(false);
      }
    }, 1500);
  };

  if (hearts === 0) {
    return (
      <div className="completion-screen">
        <div className="celebration">💔</div>
        <h1>Game Over!</h1>
        <div className="final-score">
          <div className="label">Final Score</div>
          <div className="score">{score} / {questions.length}</div>
        </div>
        <div className="action-buttons">
          <button className="btn-play-again" onClick={() => window.location.reload()}>
            Try Again
          </button>
          <button className="btn-home" onClick={onQuit}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-screen">
      <ProgressHeader
        current={currentQuestionIndex + 1}
        total={questions.length}
        hearts={hearts}
      />
      <QuestionCard
        word={currentQuestion.word}
        wordType={currentQuestion.wordType}
        options={currentQuestion.options}
        selectedOption={selectedOption}
        answeredCorrectly={answeredCorrectly}
        onSelectOption={handleOptionSelect}
      />
      <FeedbackToast
        message={answeredCorrectly ? 'Correct!' : 'Try again!'}
        type={answeredCorrectly ? 'correct' : 'wrong'}
        visible={showFeedback}
      />
    </div>
  );
};

export default QuizScreen;
