import type { Question, AnswerValue, RubricDimension } from "@/types/survey";
import { LikertScale } from "@/components/shared/LikertScale";
import { SingleChoice } from "./SingleChoice";
import { NumberInput } from "./NumberInput";
import { TextInput } from "./TextInput";
import { LikertMatrix } from "./LikertMatrix";
import { RubricMatrix } from "./RubricMatrix";

interface Props {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
}

/**
 * Univerzalni renderer pitanja. Switch po `question.type`.
 * Sve sub-komponente koriste isti API: { question, value, onChange }.
 */
export function QuestionRenderer({ question, value, onChange }: Props) {
  // Append an asterisk if the question is mandatory
  const displayText = question.optional ? question.text : `${question.text} *`;

  switch (question.type) {
    case "LIKERT": {
      const v = typeof value === "number" ? value : 3;
      return (
        <LikertScale
          questionText={displayText}
          value={v}
          onChange={(n: number) => onChange(n)}
          labels={["Strongly disagree", "Strongly agree"]}
        />
      );
    }
    case "SINGLE_CHOICE":
      return (
        <SingleChoice
          questionText={displayText}
          options={question.options as string[]}
          value={typeof value === "string" ? value : undefined}
          onChange={(v) => onChange(v)}
        />
      );
    case "NUMBER":
      return (
        <NumberInput
          questionText={displayText}
          value={typeof value === "number" ? value : undefined}
          onChange={(n) => { if (n !== undefined) onChange(n); }}
        />
      );
    case "TEXT":
      return (
        <TextInput
          questionText={displayText}
          value={typeof value === "string" ? value : undefined}
          onChange={(v) => onChange(v)}
        />
      );
    case "LIKERT-MATRIX":
      return (
        <LikertMatrix
          questionText={displayText}
          options={question.options as string[]}
          value={isRecord(value) ? value : undefined}
          onChange={(v) => onChange(v)}
        />
      );
    case "RUBRIC":
      return (
        <RubricMatrix
          questionText={displayText}
          dimensions={question.options as RubricDimension[]}
          value={isRecord(value) ? value : undefined}
          onChange={(v) => onChange(v)}
        />
      );
    default:
      return null;
  }
}

function isRecord(v: unknown): v is Record<string, number> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
