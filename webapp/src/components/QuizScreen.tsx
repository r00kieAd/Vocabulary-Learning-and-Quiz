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
    const isCorrect = optionId === currentQuestion.correctAnswer;
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
