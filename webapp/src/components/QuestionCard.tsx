import React from 'react';

interface Option {
  id: string;
  text: string;
}

interface QuestionCardProps {
  word: string;
  wordType: string;
  options: Option[];
  selectedOption: string | null;
  answeredCorrectly: boolean | null;
  onSelectOption: (optionId: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  word,
  wordType,
  options,
  selectedOption,
  answeredCorrectly,
  onSelectOption,
}) => {
  return (
    <div className="question-card">
      <div className="word-section">
        <div className="word">{word}</div>
        <div className="word-type">{wordType}</div>
      </div>
      <div className="options">
        {options.map((option) => (
          <button
            key={option.id}
            className={`option ${
              selectedOption === option.id
                ? answeredCorrectly
                  ? 'correct'
                  : answeredCorrectly === false
                    ? 'wrong'
                    : 'selected'
                : ''
            }`}
            onClick={() => onSelectOption(option.id)}
            disabled={selectedOption !== null}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
