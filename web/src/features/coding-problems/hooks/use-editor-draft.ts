import type { OnMount } from "@monaco-editor/react"
import type { editor as MonacoEditor } from "monaco-editor"
import { useRef } from "react"
import { useDebouncedCallback } from "use-debounce"
import { useLocalStorage } from "@/hooks/use-local-storage"

const DEBOUNCE_DELAY_MS = 500 // Sets the delay until candidate code will be saved in local storage

/**
 * Keeps the candidate's in-progress code for a Monaco editor, saving it to
 * local storage so it survives navigation and reloads.
 *
 * @param storageKey local storage key the draft is saved under
 * @param starterCode the template code the editor falls back to
 */
export function useEditorDraft(storageKey: string, starterCode: string) {
  const { getItem, setItem, removeItem } = useLocalStorage<string>()

  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null)
  const codeRef = useRef(starterCode)

  const debouncedSave = useDebouncedCallback(
    (code: string) => {
      setItem(storageKey, code)
    },
    DEBOUNCE_DELAY_MS,
    { flushOnExit: true }
  )

  const clearDraft = () => {
    debouncedSave.cancel()
    removeItem(storageKey)
  }

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor

    const savedCode = getItem(storageKey)
    const initialCode = savedCode ?? starterCode

    editor.setValue(initialCode)
    codeRef.current = initialCode
  }

  const handleEditorChange = (value?: string) => {
    const currentCode = value ?? ""

    codeRef.current = currentCode

    if (currentCode !== starterCode) {
      debouncedSave(currentCode)
    } else {
      clearDraft()
    }
  }

  const resetDraft = () => {
    codeRef.current = starterCode
    clearDraft()
    editorRef.current?.setValue(starterCode)
  }

  const getCode = () => codeRef.current

  return { handleEditorMount, handleEditorChange, resetDraft, getCode }
}
