import apiFetch from "./api";

export interface RunCodeRequest {
  sourceCode: string;
  languageId: number;
}

export interface ExampleRunResultRead {
  exampleId: number;
  passed: boolean;
  actualOutput: string;
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
