import type { ProgrammingLanguageRead } from "@/lib/api/generated"

const PREFERRED_LANGUAGE_NAME = "Python"

/**
 * Helper function to pick the language the editor opens with. Shared by the
 * technical route loader (to prefetch its template) and the EditorPanel.
 *
 * @param languages the languages supported by a coding problem
 * @returns the preferred language if supported, otherwise the first supported language.
 */
export function getPreferredLanguage(languages: ProgrammingLanguageRead[]) {
  return (
    languages.find((language) => language.name === PREFERRED_LANGUAGE_NAME) ??
    languages[0]
  )
}
