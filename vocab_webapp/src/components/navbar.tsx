export type QuizMode = "flashcards" | "mcq" | "typing"

type Props = {
  mode: QuizMode
  onModeChange: (mode: QuizMode) => void
  onWordManagementClick?: () => void
  showQuizModes?: boolean
}

function Navbar({ mode, onModeChange, onWordManagementClick, showQuizModes = true }: Props) {
  return (
    <header className="app-navbar">
      <div className="app-title" aria-label="Vocabulary learning and quiz">
        Vocabulary Quiz
      </div>
      <nav className="navbar-nav" aria-label="Navigation">
        {showQuizModes && (
          <>
            <button
              type="button"
              className={`nav-btn ${mode === "flashcards" ? "active" : ""}`}
              onClick={() => onModeChange("flashcards")}
            >
              Flashcards
            </button>
            <button
              type="button"
              className={`nav-btn ${mode === "mcq" ? "active" : ""}`}
              onClick={() => onModeChange("mcq")}
            >
              MCQ
            </button>
            <button
              type="button"
              className={`nav-btn ${mode === "typing" ? "active" : ""}`}
              onClick={() => onModeChange("typing")}
            >
              Typing
            </button>
          </>
        )}
        {onWordManagementClick && (
          <button
            type="button"
            className={`nav-btn ${!showQuizModes ? "active" : ""}`}
            onClick={onWordManagementClick}
          >
            Word Management
          </button>
        )}
      </nav>
    </header>
  )
}

export default Navbar

