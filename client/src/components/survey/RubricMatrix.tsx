import { cn } from "@/lib/utils";
import type { RubricDimension } from "@/types/survey";

interface Props {
  dimensions: RubricDimension[];
  value: Record<string, number> | undefined;
  onChange: (v: Record<string, number>) => void;
  questionText: string;
}

/**
 * RUBRIC: dimenzija × 5 nivoa, svaka ćelija sadrži opisni text.
 * Vrednost se čuva kao `Record<dimension, 1..5>`.
 */
export function RubricMatrix({ dimensions, value, onChange, questionText }: Props) {
  const current = value ?? {};

  const setLevel = (dimension: string, level: number) => {
    onChange({ ...current, [dimension]: level });
  };

  return (
    <div className="space-y-4 py-4 border-b border-border/50 last:border-0">
      <p className="text-sm font-medium text-foreground whitespace-pre-line">{questionText}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="text-muted-foreground">
              <th className="text-left font-medium pb-2 pr-2 align-bottom">Dimension</th>
              {[1, 2, 3, 4, 5].map((n) => (
                <th key={n} className="px-1 pb-2 text-center font-semibold">
                  Level {n}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dim) => (
              <tr key={dim.dimension} className="border-t border-border/40">
                <td className="py-2 pr-2 align-top font-semibold text-foreground whitespace-nowrap">
                  {dim.dimension}
                </td>
                {[1, 2, 3, 4, 5].map((level) => {
                  const active = current[dim.dimension] === level;
                  const text = dim.levels[level as 1 | 2 | 3 | 4 | 5];
                  return (
                    <td key={level} className="p-1 align-top">
                      <button
                        type="button"
                        onClick={() => setLevel(dim.dimension, level)}
                        className={cn(
                          "block h-full w-full rounded-md border p-2 text-left text-[10px] leading-snug transition-colors",
                          active
                            ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                            : "border-border bg-card text-muted-foreground hover:bg-muted",
                        )}
                      >
                        {text}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
