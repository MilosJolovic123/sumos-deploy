// Frontend tipovi 1:1 sa NestJS/Mongoose šemama (Question, Answer, Submission)
// Cilj: nikakva transformacija između frontend-a i backend-a.

export type QuestionType =
  | "LIKERT"
  | "SINGLE_CHOICE"
  | "NUMBER"
  | "TEXT"
  | "LIKERT-MATRIX"
  | "RUBRIC";

export interface RubricDimension {
  dimension: string;
  levels: { 1: string; 2: string; 3: string; 4: string; 5: string };
}

export interface Question {
  key: string;
  text: string;
  category: string;
  type: QuestionType;
  /**
   * Sadržaj zavisi od `type`:
   *  - SINGLE_CHOICE / LIKERT-MATRIX: string[]
   *  - RUBRIC: RubricDimension[]
   *  - LIKERT / NUMBER / TEXT: [] (ignoriše se)
   */
  options: string[] | RubricDimension[];
  version: number;
  active: boolean;
  optional: boolean;
  /** True za 3 mobility rubrike — prikazuju se samo ako je student bio na razmeni. */
  requiresMobility?: boolean;
}

/**
 * Vrednost odgovora po tipu pitanja:
 *  - LIKERT          -> number (1..5)
 *  - SINGLE_CHOICE   -> string
 *  - NUMBER          -> number
 *  - TEXT            -> string
 *  - LIKERT-MATRIX   -> Record<option, 1..5>
 *  - RUBRIC          -> Record<dimension, 1..5>
 */
export type AnswerValue = number | string | Record<string, number>;

export interface Answer {
  questionKey: string;
  questionText: string;
  category: string;
  questionVersion: number;
  value: AnswerValue;
}

export interface Submission {
  //  state: string;
  //  institution: string;
  // questionnaireVersion: number;
  email: string;
  completionTimeSeconds: number;
  //  mobilityDone: boolean;
  isRealAttempt: boolean;
  answers: Answer[];
}
