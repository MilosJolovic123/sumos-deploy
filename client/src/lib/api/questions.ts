import type { Question, Submission } from "@/types/survey";

// Load the API host from environment variables dynamically.
// Fallback to an empty string so it defaults to a relative path if the env var is missing.
const API_HOST = import.meta.env.VITE_API_HOST || "";

export async function fetchQuestions(): Promise<Question[]> {
  const response = await fetch(`${API_HOST}/api/questions`);

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }
  sessionStorage.setItem("surveyStartTime", new Date().toString());
  return response.json();
}

export async function submitSurvey(submission: Submission): Promise<{
  message: string;
  submissionId: string;
  result: {
    scores: {
      ecoScore: number;
      categoryScores: Record<string, number>;
      mobility: {
        pre: number;
        during: number;
        after: number;
        overall: number;
        delta1: number;
        delta2: number;
        delta3: number;
      };
    };
    feedback: {
      badge: string;
      message: string;
      suggestions: Record<string, string>;
    };
  };
}> {
  const response = await fetch(`${API_HOST}/api/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submission),
  });

  if (!response.ok) {
    throw new Error("Failed to submit survey");
  }

  return response.json();
}
