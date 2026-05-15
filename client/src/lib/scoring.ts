import type { AnswerValue, Question } from "@/types/survey";

export type MainCategory = "Awareness" | "Attitudes" | "Habits";
export type HabitSubcategory =
  | "Travel"
  | "Living and accommodation"
  | "Buying and consumption"
  | "Digital habits"
  | "Community engagement";

export interface SurveyScores {
  overall: number;
  categories: Record<MainCategory, number>;
  subcategories: Record<HabitSubcategory, number>;
}

const CATEGORY_TO_BACKEND: Record<MainCategory, string[]> = {
  Awareness: ["AWARENESS"],
  Attitudes: ["ATTITUDES/MOTIVATIONS"],
  Habits: [
    "HABITS - Travel",
    "HABITS - Living and accommodation",
    "HABITS - Buying and consumption",
    "HABITS - Digital habits",
    "HABITS - Engagement in the community",
  ],
};

const SUBCATEGORY_TO_BACKEND: Record<HabitSubcategory, string> = {
  Travel: "HABITS - Travel",
  "Living and accommodation": "HABITS - Living and accommodation",
  "Buying and consumption": "HABITS - Buying and consumption",
  "Digital habits": "HABITS - Digital habits",
  "Community engagement": "HABITS - Engagement in the community",
};

/** Vraća sve numeričke 1..5 vrednosti iz jednog odgovora (LIKERT ili LIKERT-MATRIX). Ostali tipovi → []. */
function extractLikertValues(q: Question, value: AnswerValue): number[] {
  if (q.type === "LIKERT") {
    return typeof value === "number" && value >= 1 && value <= 5 ? [value] : [];
  }
  if (q.type === "LIKERT-MATRIX") {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.values(value as Record<string, number>).filter(
        (v) => typeof v === "number" && v >= 1 && v <= 5,
      );
    }
  }
  return [];
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return Number((sum / values.length).toFixed(1));
}

export function computeScores(
  answers: Record<string, AnswerValue>,
  questions: Question[],
): SurveyScores {
  // Indeks pitanja po kategoriji.
  const byCategory: Record<string, Question[]> = {};
  for (const q of questions) {
    (byCategory[q.category] ||= []).push(q);
  }

  const valuesForBackendCats = (cats: string[]): number[] => {
    const out: number[] = [];
    for (const cat of cats) {
      const qs = byCategory[cat] || [];
      for (const q of qs) {
        const v = answers[q.key];
        if (v === undefined) continue;
        out.push(...extractLikertValues(q, v));
      }
    }
    return out;
  };

  const categories: Record<MainCategory, number> = {
    Awareness: avg(valuesForBackendCats(CATEGORY_TO_BACKEND.Awareness)),
    Attitudes: avg(valuesForBackendCats(CATEGORY_TO_BACKEND.Attitudes)),
    Habits: avg(valuesForBackendCats(CATEGORY_TO_BACKEND.Habits)),
  };

  const subcategories = Object.fromEntries(
    (Object.keys(SUBCATEGORY_TO_BACKEND) as HabitSubcategory[]).map((sub) => [
      sub,
      avg(valuesForBackendCats([SUBCATEGORY_TO_BACKEND[sub]])),
    ]),
  ) as Record<HabitSubcategory, number>;

  // Overall = prosek svih likert vrednosti u svim relevantnim kategorijama.
  const allCats = [
    ...CATEGORY_TO_BACKEND.Awareness,
    ...CATEGORY_TO_BACKEND.Attitudes,
    ...CATEGORY_TO_BACKEND.Habits,
  ];
  const overall = avg(valuesForBackendCats(allCats));

  return { overall, categories, subcategories };
}

export const BACKEND_CATEGORY_KEY: Record<MainCategory, string> = {
  Awareness: "AWARENESS",
  Attitudes: "ATTITUDES/MOTIVATIONS",
  Habits: "HABITS",
};

export const BACKEND_SUBCATEGORY_KEY = SUBCATEGORY_TO_BACKEND;
