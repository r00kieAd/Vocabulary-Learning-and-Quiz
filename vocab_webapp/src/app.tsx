import { useEffect, useState } from "react"
import Loader from "./components/loader"
import DisplayError from "./components/display_error"
import { useGlobal } from "./utils/global_context"
import { initializeStore, type ScoreEntry, type WordEntry } from "./utils/data_store"
import Homepage from "./components/homepage"

export function App() {
  const [appError, setAppError] = useState<string | undefined>(undefined)
  const [words, setWords] = useState<WordEntry[]>([])
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const { loaderActive, setLoaderActive } = useGlobal()

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await initializeStore()
        if (cancelled) return
        setWords(data.words)
        setScores(data.scores)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        if (!cancelled) {
          setAppError(message)
        }
      } finally {
        if (!cancelled) {
          setLoaderActive(false)
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [setLoaderActive])

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {appError && <DisplayError errorMessage={appError} />}
      {loaderActive && <Loader />}
      {!loaderActive && (
        <Homepage
          initialWords={words}
          initialScores={scores}
          onWordsChange={setWords}
          onScoresChange={setScores}
        />
      )}
    </div>
  )
}
