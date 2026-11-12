import apiFetch from "./api";

export interface RunCodeRequest {
  sourceCode: string;
  languageId: number;
}

export interface ExampleRunResultRead {
  testCaseId: number;
  passed: boolean;
  stderr: string | null;
  compileOutput: string | null;
  output: string;
}

export interface ProblemSubmissionRead {
  accepted: boolean;
  totalTestCases: number;
  passedTestCases: number | null;
  stderr: string | null;
  compileOutput: string | null;
}

export interface ProblemSubmissionHistoryRead {
  id: number;
  problemId: number;
  languageId: number;
  phaseId: number;
  sourceCode: string;
  accepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function runCodeAgainstExamples(
  token: string,
  phaseId: number,
  request: RunCodeRequest,
) {
  const response = await apiFetch(`/coding-problems/${phaseId}/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to run code execution");
  }

  return (await response.json()) as ExampleRunResultRead[];
}

export async function submitCandidateCode(
  token: string,
  phaseId: number,
  request: RunCodeRequest,
) {
  const response = await apiFetch(`/coding-problems/${phaseId}/submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Code submission failed for problem");
  }

  return (await response.json()) as ProblemSubmissionRead;
}

export async function getProblemSubmissions(token: string, phaseId: number) {
  const response = await apiFetch(`/coding-problems/${phaseId}/submissions`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as ProblemSubmissionHistoryRead[];
}

export async function deleteAllProblemSubmissions(
  token: string,
  phaseId: number,
) {
  const response = await apiFetch(
    `/coding-problems/${phaseId}/submissions/delete/all`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete problem submissions");
  }
}
