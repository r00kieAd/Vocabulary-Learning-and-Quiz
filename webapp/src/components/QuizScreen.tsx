import React, { useState } from 'react';
import ProgressHeader from './ProgressHeader';
import QuestionCard from './QuestionCard';
import FeedbackToast from './FeedbackToast';
import type { QuizQuestion } from '../types/quiz';

interface QuizScreenProps {
  questions: QuizQuestion[];
  onQuizEnd: (score: number) => void;
  onQuit: () => void;
  quizMode?: 'flashcard' | 'random';
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  onQuizEnd,
  onQuit,
  quizMode = 'random',
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(
    null
  );
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="quiz-screen">
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>No questions available</p>
          <button className="btn-primary" onClick={onQuit}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleOptionSelect = (optionId: string) => {
    const selectedText =
      currentQuestion.options.find((option) => option.id === optionId)?.text ?? '';
    const isCorrect = selectedText === currentQuestion.correctAnswer;
    setSelectedOption(optionId);
    setAnsweredCorrectly(isCorrect);
    setShowFeedback(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (isLastQuestion) {
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

  return (
    <div className="quiz-screen">
      <ProgressHeader
        current={currentQuestionIndex + 1}
        total={questions.length}
        hearts={0}
        quizMode={quizMode}
        word={currentQuestion.word}
        wordType={currentQuestion.wordType}
        onQuit={onQuit}
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
        type={answeredCorrectly ? 'correct' : 'wrong'}
        visible={showFeedback}
        score={answeredCorrectly ? score + 1 : score}
      />
    </div>
  );
};

export default QuizScreen;
