import apiFetch from "./api";

export type Difficulty = "easy" | "medium" | "hard";

export interface ProgrammingLanguage {
  id: number;
  name: string;
  extension: string;
}

export interface ProblemExample {
  id: number;
  input: Record<string, unknown>;
  expectedOutput: unknown;
  explanation: string | null;
  ordinal: number;
}

export interface CodingProblem {
  id: number;
  title: string;
  prompt: string;
  difficulty: Difficulty;
  examples: ProblemExample[];
  languages: ProgrammingLanguage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProblemLanguageTemplate {
  id: number;
  starterCode: string;
}

export async function findCodingProblemForPhase(
  token: string,
  phaseId: number,
) {
  const response = await apiFetch(`/phases/${phaseId}/coding-problem`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch coding problem for phase with id: ${phaseId}`,
    );
  }

  return (await response.json()) as CodingProblem;
}

export async function findLanguageTemplateForPhase(
  token: string,
  phaseId: number,
  languageId: number,
) {
  const response = await apiFetch(
    `/phases/${phaseId}/coding-problem/template?language_id=${languageId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch language template for phase with id: ${phaseId}`,
    );
  }

  return (await response.json()) as ProblemLanguageTemplate;
}
