import type { WordEntry } from "../utils/data_store"
import type { QuizMode } from "./navbar"
import { useMemo, useState, useEffect } from "react"

type Props = {
  mode: QuizMode
  word: WordEntry
  allWords: WordEntry[]
  quizActive: boolean
  onCorrect: () => void
}

function shuffle<T>(items: T[]): T[] {
  const copy = items.slice()
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = copy[i]
    copy[i] = copy[j]
    copy[j] = tmp
  }
  return copy
}

function buildOptions(current: WordEntry, all: WordEntry[]): string[] {
  const incorrectPool = all.filter(w => w.word !== current.word).map(w => w.meaning)
  const sampleSize = Math.min(3, incorrectPool.length)
  const options: string[] = []
  const poolCopy = incorrectPool.slice()
  while (options.length < sampleSize && poolCopy.length > 0) {
    const index = Math.floor(Math.random() * poolCopy.length)
    options.push(poolCopy.splice(index, 1)[0])
  }
  options.push(current.meaning)
  return shuffle(options)
}

function normalize(text: string): string {
  return text.trim().toLowerCase()
}

function WordDisplay({ mode, word, allWords, quizActive, onCorrect }: Props) {
  const [showMeaning, setShowMeaning] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [typingValue, setTypingValue] = useState("")
  const [feedback, setFeedback] = useState<string | null>(null)

  const mcqOptions = useMemo(() => buildOptions(word, allWords), [word, allWords])

  useEffect(() => {
    setShowMeaning(false)
    setSelectedOption(null)
    setTypingValue("")
    setFeedback(null)
  }, [word.word, mode])

  if (mode === "flashcards") {
    return (
      <div className="card" aria-live="polite">
        <div className="card-word">{word.word}</div>
        <button
          type="button"
          className="btn secondary"
          onClick={() => setShowMeaning(prev => !prev)}
        >
          {showMeaning ? "Hide meaning" : "Reveal meaning"}
        </button>
        {showMeaning && <div className="card-meaning">{word.meaning}</div>}
      </div>
    )
  }

  if (mode === "mcq") {
    function handleSelect(option: string) {
      if (!quizActive) {
        setSelectedOption(option)
        setFeedback("Scoring is inactive. Start the quiz to track score.")
        return
      }
      setSelectedOption(option)
      const isCorrect = normalize(option) === normalize(word.meaning)
      if (isCorrect) {
        setFeedback("Correct")
        onCorrect()
      } else {
        setFeedback("Incorrect")
      }
    }

    return (
      <div className="card" aria-live="polite">
        <div className="card-word">{word.word}</div>
        <ul className="options-list">
          {mcqOptions.map(option => {
            const isSelected = selectedOption === option
            const isCorrect = normalize(option) === normalize(word.meaning)
            const showState = selectedOption !== null
            const classNames = [
              "option",
              isSelected ? "selected" : "",
              showState && isCorrect ? "correct" : "",
              showState && isSelected && !isCorrect ? "incorrect" : "",
            ]
              .filter(Boolean)
              .join(" ")
            return (
              <li key={option}>
                <button
                  type="button"
                  className={classNames}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </button>
              </li>
            )
          })}
        </ul>
        {feedback && (
          <div className="card-feedback" role="status">
            {feedback}
          </div>
        )}
      </div>
    )
  }

  function handleSubmitTyping(e: React.FormEvent) {
    e.preventDefault()
    if (!typingValue.trim()) {
      setFeedback("Please type a meaning.")
      return
    }
    if (!quizActive) {
      setFeedback("Scoring is inactive. Start the quiz to track score.")
      return
    }
    const isCorrect = normalize(typingValue) === normalize(word.meaning)
    if (isCorrect) {
      setFeedback("Correct")
      onCorrect()
    } else {
      setFeedback("Incorrect")
    }
  }

  return (
    <div className="card" aria-live="polite">
      <div className="card-word">{word.word}</div>
      <form className="typing-form" onSubmit={handleSubmitTyping}>
        <label htmlFor="typing-input" className="field-label">
          Type the meaning
        </label>
        <input
          id="typing-input"
          type="text"
          value={typingValue}
          onChange={e => {
            setTypingValue(e.target.value)
            setFeedback(null)
          }}
          className="text-input"
          placeholder="Enter meaning"
        />
        <button type="submit" className="btn primary">
          Submit
        </button>
      </form>
      {feedback && (
        <div className="card-feedback" role="status">
          {feedback}
        </div>
      )}
    </div>
  )
}

export default WordDisplay

