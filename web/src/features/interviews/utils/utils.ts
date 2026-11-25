/**
 * Splits an interview's comma-separated topics string into unique, trimmed topics.
 *
 * @param topics the raw topics string from the API
 * @returns the list of topics, empty if none are set
 */
export function parseTopics(topics: string | null) {
  if (!topics) {
    return []
  }

  const parsed = topics
    .split(",")
    .map((topic) => topic.trim())
    .filter(Boolean)

  return [...new Set(parsed)]
}
