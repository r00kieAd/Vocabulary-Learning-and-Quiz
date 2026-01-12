export type WordEntry = {
  word: string
  meaning: string
  date_modified: string
}

export type ScoreEntry = {
  username: string
  score: number
}

const WORDS_KEY = "vlq_words"
const SCORES_KEY = "vlq_scores"
const WORDS_JSON_KEY = "vlq_words_json"
const SCORES_JSON_KEY = "vlq_scores_json"

import initialWords from "../data/words.json"
import initialScores from "../data/scores.json"

function readLocalStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function writeLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export async function initializeStore(): Promise<{
  words: WordEntry[]
  scores: ScoreEntry[]
}> {
  const existingWords = readLocalStorage<WordEntry[]>(WORDS_KEY)
  const existingScores = readLocalStorage<ScoreEntry[]>(SCORES_KEY)

  const words = existingWords && Array.isArray(existingWords) && existingWords.length > 0
    ? existingWords
    : (initialWords as WordEntry[])

  const scores = existingScores && Array.isArray(existingScores)
    ? existingScores
    : (initialScores as ScoreEntry[])

  writeLocalStorage(WORDS_KEY, words)
  writeLocalStorage(SCORES_KEY, scores)
  writeLocalStorage(WORDS_JSON_KEY, words)
  writeLocalStorage(SCORES_JSON_KEY, scores)

  return {
    words,
    scores,
  }
}

export async function getWords(): Promise<WordEntry[]> {
  const words = readLocalStorage<WordEntry[]>(WORDS_KEY)
  if (words && Array.isArray(words)) return words
  return (initialWords as WordEntry[])
}

export async function getScores(): Promise<ScoreEntry[]> {
  const scores = readLocalStorage<ScoreEntry[]>(SCORES_KEY)
  if (scores && Array.isArray(scores)) return scores
  return (initialScores as ScoreEntry[])
}

export async function addWord(entry: Omit<WordEntry, "date_modified">): Promise<WordEntry[]> {
  const words = await getWords()
  const exists = words.some(
    w => w.word.trim().toLowerCase() === entry.word.trim().toLowerCase()
  )
  if (exists) {
    throw new Error("Word already exists")
  }
  const now = new Date().toISOString().slice(0, 10)
  const next: WordEntry[] = [
    ...words,
    {
      ...entry,
      date_modified: now,
    },
  ]
  writeLocalStorage(WORDS_KEY, next)
  writeLocalStorage(WORDS_JSON_KEY, next)
  return next
}

export async function updateWord(
  originalWord: string,
  updates: { word: string; meaning: string }
): Promise<WordEntry[]> {
  const words = await getWords()
  const index = words.findIndex(
    w => w.word.trim().toLowerCase() === originalWord.trim().toLowerCase()
  )
  if (index === -1) {
    throw new Error("Word not found")
  }
  const duplicate = words.some(
    (w, i) =>
      i !== index &&
      w.word.trim().toLowerCase() === updates.word.trim().toLowerCase()
  )
  if (duplicate) {
    throw new Error("Another word with the same spelling already exists")
  }
  const now = new Date().toISOString().slice(0, 10)
  const next = words.slice()
  next[index] = {
    word: updates.word,
    meaning: updates.meaning,
    date_modified: now,
  }
  writeLocalStorage(WORDS_KEY, next)
  writeLocalStorage(WORDS_JSON_KEY, next)
  return next
}

export async function appendScore(entry: ScoreEntry): Promise<ScoreEntry[]> {
  if (!entry.username.trim()) {
    throw new Error("Username is required")
  }
  const scores = await getScores()
  const next = [...scores, entry]
  writeLocalStorage(SCORES_KEY, next)
  writeLocalStorage(SCORES_JSON_KEY, next)
  return next
}

