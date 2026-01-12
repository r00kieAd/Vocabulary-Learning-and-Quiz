import { useEffect, useMemo, useState, useCallback } from "react"
import type { ScoreEntry, WordEntry } from "../utils/data_store"
import Navbar from "./navbar"
import type { QuizMode } from "./navbar"
import WordDisplay from "./word_display"
import UsernameModal from "./username_modal"
import WordManagement from "./word_management"
import { appendScore, getWords } from "../utils/data_store"

type Props = {
  initialWords: WordEntry[]
  initialScores: ScoreEntry[]
  onWordsChange: (words: WordEntry[]) => void
  onScoresChange: (scores: ScoreEntry[]) => void
}

function Homepage({ initialWords, initialScores, onWordsChange, onScoresChange }: Props) {
  const [mode, setMode] = useState<QuizMode>("flashcards")
  const [index, setIndex] = useState(0)
  const [username, setUsername] = useState("")
  const [quizActive, setQuizActive] = useState(false)
  const [score, setScore] = useState(0)
  const [words, setWords] = useState<WordEntry[]>(initialWords)
  const [scores, setScores] = useState<ScoreEntry[]>(initialScores)
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [showWordManagement, setShowWordManagement] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isStartingQuiz, setIsStartingQuiz] = useState(false)
  const [isSavingScore, setIsSavingScore] = useState(false)

  const currentWord = words[index] ?? null
  const atStart = index === 0
  const atEnd = index === Math.max(words.length - 1, 0)
  const isScoringMode = mode === "mcq" || mode === "typing"

  useEffect(() => {
    setWords(initialWords)
  }, [initialWords])

  useEffect(() => {
    setScores(initialScores)
  }, [initialScores])

  useEffect(() => {
    if (isScoringMode && !username && !showUsernameModal && !quizActive) {
      const timer = setTimeout(() => {
        setShowUsernameModal(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [mode])

  const handlePrev = useCallback(() => {
    if (index <= 0) return
    setIndex(prev => prev - 1)
  }, [index])

  const handleNext = useCallback(() => {
    if (index >= words.length - 1) return
    setIndex(prev => prev + 1)
  }, [index, words.length])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        handleNext()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        handlePrev()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => {
      window.removeEventListener("keydown", handleKey)
    }
  }, [handleNext, handlePrev])

  function handleModeChange(next: QuizMode) {
    setMode(next)
    setScore(0)
    setQuizActive(false)
    if (next === "flashcards") {
      setUsername("")
    }
  }

  function handleUsernameConfirm(confirmedUsername: string) {
    setUsername(confirmedUsername)
    setShowUsernameModal(false)
  }

  function handleUsernameModalClose() {
    if (isScoringMode && !username) {
      setMode("flashcards")
    }
    setShowUsernameModal(false)
  }

  async function handleStartQuiz() {
    if (!username.trim()) {
      setShowUsernameModal(true)
      return
    }
    if (!words.length) {
      setErrorMessage("No words available to start the quiz.")
      return
    }
    setIsStartingQuiz(true)
    setErrorMessage(null)
    try {
      setScore(0)
      setQuizActive(true)
    } finally {
      setIsStartingQuiz(false)
    }
  }

  async function handleEndQuiz() {
    if (!quizActive) return
    if (!username.trim()) return
    setIsSavingScore(true)
    try {
      const entry: ScoreEntry = {
        username: username.trim(),
        score,
      }
      const nextScores = await appendScore(entry)
      setScores(nextScores)
      onScoresChange(nextScores)
      setQuizActive(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setErrorMessage(message)
    } finally {
      setIsSavingScore(false)
    }
  }

  function handleCorrectAnswer() {
    if (!quizActive) return
    setScore(prev => prev + 1)
  }

  const sortedScores = useMemo(
    () => scores.slice().sort((a, b) => b.score - a.score),
    [scores]
  )

  async function handleWordManagementClose() {
    setShowWordManagement(false)
    try {
      const refreshedWords = await getWords()
      setWords(refreshedWords)
      onWordsChange(refreshedWords)
    } catch (error) {
      console.error("Failed to refresh words:", error)
    }
  }

  if (showWordManagement) {
    return (
      <div className="app-root">
        <Navbar
          mode={mode}
          onModeChange={handleModeChange}
          onWordManagementClick={() => setShowWordManagement(false)}
          showQuizModes={false}
        />
        <WordManagement
          words={words}
          currentWord={null}
          onWordsChange={(nextWords) => {
            setWords(nextWords)
            onWordsChange(nextWords)
          }}
          onClose={handleWordManagementClose}
        />
      </div>
    )
  }

  return (
    <div className="app-root">
      <UsernameModal
        isOpen={showUsernameModal}
        onClose={handleUsernameModalClose}
        onConfirm={handleUsernameConfirm}
        currentUsername={username}
      />
      <Navbar
        mode={mode}
        onModeChange={handleModeChange}
        onWordManagementClick={() => setShowWordManagement(true)}
        showQuizModes={true}
      />
      <main className="app-main">
        <section className="quiz-panel">
          {isScoringMode && (
            <header className="quiz-header">
              <div className="quiz-controls">
                <button
                  type="button"
                  onClick={handleStartQuiz}
                  disabled={isStartingQuiz || !username.trim() || !words.length || quizActive}
                  className="btn primary"
                >
                  {quizActive ? "Quiz Active" : "Start Quiz"}
                </button>
                <button
                  type="button"
                  onClick={handleEndQuiz}
                  disabled={isSavingScore || !quizActive}
                  className="btn secondary"
                >
                  Save Score
                </button>
                <div className="quiz-score" aria-live="polite">
                  Score: {score}
                </div>
                {username && (
                  <div className="quiz-username">
                    User: {username}
                  </div>
                )}
              </div>
            </header>
          )}

          <section className="word-panel">
            {!words.length && (
              <div className="empty-state">
                <p>No words available. Use Word Management to add words.</p>
              </div>
            )}
            {words.length > 0 && currentWord && (
              <WordDisplay
                key={`${mode}-${index}`}
                mode={mode}
                word={currentWord}
                allWords={words}
                quizActive={quizActive}
                onCorrect={handleCorrectAnswer}
              />
            )}
            <div className="navigation">
              <button
                type="button"
                onClick={handlePrev}
                disabled={atStart || !words.length}
                className="btn tertiary"
              >
                Previous
              </button>
              <div className="navigation-status">
                {words.length > 0 ? `${index + 1} / ${words.length}` : "0 / 0"}
              </div>
              <button
                type="button"
                onClick={handleNext}
                disabled={atEnd || !words.length}
                className="btn tertiary"
              >
                Next
              </button>
            </div>
          </section>
          {errorMessage && (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          )}
        </section>

        {isScoringMode && (
          <aside className="scoreboard" aria-label="Previous scores">
            <header className="section-header">
              <h2>Scoreboard</h2>
            </header>
            {sortedScores.length === 0 && (
              <div className="empty-state">
                <p>No scores saved yet. Complete a quiz session to see results here.</p>
              </div>
            )}
            {sortedScores.length > 0 && (
              <ul className="score-list">
                {sortedScores.map((entry, idx) => (
                  <li key={`${entry.username}-${idx}`} className="score-item">
                    <span className="score-name">{entry.username}</span>
                    <span className="score-value">{entry.score}</span>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        )}
      </main>
    </div>
  )
}

export default Homepage
