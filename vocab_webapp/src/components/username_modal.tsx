import { useState, useEffect } from "react"

type Props = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (username: string) => void
  currentUsername?: string
}

function UsernameModal({ isOpen, onClose, onConfirm, currentUsername = "" }: Props) {
  const [username, setUsername] = useState(currentUsername)

  useEffect(() => {
    setUsername(currentUsername)
  }, [currentUsername])

  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose()
        }
      }
      window.addEventListener("keydown", handleEscape)
      return () => window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (username.trim()) {
      onConfirm(username.trim())
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Enter Username</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <label htmlFor="modal-username-input" className="field-label">
              Username
            </label>
            <input
              id="modal-username-input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="text-input"
              placeholder="Enter your name"
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn primary" disabled={!username.trim()}>
              Confirm
            </button>
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UsernameModal
