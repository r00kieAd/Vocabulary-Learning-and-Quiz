import { useState } from "react"
import type { WordEntry } from "../utils/data_store"
import { addWord, updateWord } from "../utils/data_store"
import { BookIcon, PlusIcon, EditIcon, EmptyStateIcon } from "./svgs"

type Props = {
  words: WordEntry[]
  currentWord: WordEntry | null
  onWordsChange: (words: WordEntry[]) => void
  onClose: () => void
}

function WordManagement({ words, onWordsChange, onClose }: Props) {
  const [wordFormWord, setWordFormWord] = useState("")
  const [wordFormMeaning, setWordFormMeaning] = useState("")
  const [editingWord, setEditingWord] = useState<WordEntry | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isAddingWord, setIsAddingWord] = useState(false)
  const [isUpdatingWord, setIsUpdatingWord] = useState(false)

  function handleWordFormReset() {
    setWordFormWord("")
    setWordFormMeaning("")
    setEditingWord(null)
    setErrorMessage(null)
  }

  function beginEditWord(word: WordEntry) {
    setEditingWord(word)
    setWordFormWord(word.word)
    setWordFormMeaning(word.meaning)
    setErrorMessage(null)
  }

  function cancelEdit() {
    setEditingWord(null)
    setWordFormWord("")
    setWordFormMeaning("")
    setErrorMessage(null)
  }

  async function handleSubmitWord(e: React.FormEvent) {
    e.preventDefault()
    const word = wordFormWord.trim()
    const meaning = wordFormMeaning.trim()
    if (!word || !meaning) {
      setErrorMessage("Word and meaning are required.")
      return
    }
    setErrorMessage(null)
    if (editingWord) {
      setIsUpdatingWord(true)
      try {
        const nextWords = await updateWord(editingWord.word, {
          word,
          meaning,
        })
        onWordsChange(nextWords)
        setEditingWord(null)
        setWordFormWord("")
        setWordFormMeaning("")
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        setErrorMessage(message)
      } finally {
        setIsUpdatingWord(false)
      }
    } else {
      setIsAddingWord(true)
      try {
        const nextWords = await addWord({
          word,
          meaning,
        })
        onWordsChange(nextWords)
        setWordFormWord("")
        setWordFormMeaning("")
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        setErrorMessage(message)
      } finally {
        setIsAddingWord(false)
      }
    }
  }

  return (
    <div className="word-management-page">
      <header className="page-header">
        <div className="page-header-content">
          <div className="page-title-group">
            <BookIcon className="page-title-icon" />
            <h1>Word Management</h1>
          </div>
          <button type="button" className="btn secondary" onClick={onClose}>
            Back to Quiz
          </button>
        </div>
      </header>

      <div className="word-management-content">
        <section className="word-form-section">
          <header className="section-header">
            <div className="section-title-group">
              {editingWord ? (
                <>
                  <EditIcon className="section-icon" />
                  <h2>Edit Word</h2>
                </>
              ) : (
                <>
                  <PlusIcon className="section-icon" />
                  <h2>Add New Word</h2>
                </>
              )}
            </div>
            {editingWord && (
              <button
                type="button"
                onClick={cancelEdit}
                className="btn tertiary"
              >
                Cancel Edit
              </button>
            )}
          </header>
          <form className="word-form" onSubmit={handleSubmitWord}>
            <div className="form-row">
              <label htmlFor="word-input" className="field-label">
                Word
              </label>
              <input
                id="word-input"
                type="text"
                value={wordFormWord}
                onChange={e => setWordFormWord(e.target.value)}
                className="text-input"
                placeholder="Enter word"
                autoFocus={!editingWord}
              />
            </div>
            <div className="form-row">
              <label htmlFor="meaning-input" className="field-label">
                Meaning
              </label>
              <textarea
                id="meaning-input"
                value={wordFormMeaning}
                onChange={e => setWordFormMeaning(e.target.value)}
                className="text-input"
                placeholder="Enter meaning"
                rows={4}
              />
            </div>
            {errorMessage && (
              <div className="form-error" role="alert">
                {errorMessage}
              </div>
            )}
            <div className="form-actions">
              <button
                type="submit"
                className="btn primary"
                disabled={isAddingWord || isUpdatingWord}
              >
                {editingWord ? "Update Word" : "Add Word"}
              </button>
              <button
                type="button"
                className="btn secondary"
                onClick={handleWordFormReset}
                disabled={isAddingWord || isUpdatingWord}
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className="word-list-section">
          <header className="section-header">
            <h2>All Words ({words.length})</h2>
          </header>
          {words.length === 0 && (
            <div className="empty-state">
              <EmptyStateIcon className="empty-state-icon" />
              <p>No words available. Add a new word to get started.</p>
            </div>
          )}
          {words.length > 0 && (
            <ul className="word-list">
              {words.map((word, idx) => (
                <li
                  key={`${word.word}-${idx}`}
                  className={`word-list-item ${editingWord?.word === word.word ? "editing" : ""}`}
                >
                  <div className="word-list-content">
                    <div className="word-list-word">{word.word}</div>
                    <div className="word-list-meaning">{word.meaning}</div>
                    <div className="word-list-meta">
                      Modified: {word.date_modified}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => beginEditWord(word)}
                    aria-label={`Edit ${word.word}`}
                  >
                    <EditIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default WordManagement
