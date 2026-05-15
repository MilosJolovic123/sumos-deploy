import { cn } from "@/lib/utils";

interface Props {
  options: string[];
  value: Record<string, number> | undefined;
  onChange: (v: Record<string, number>) => void;
  questionText: string;
  /** Default scale labels (1..5). */
  scaleLabels?: [string, string];
}

/**
 * LIKERT-MATRIX: red po opciji × 5 kolona (1..5).
 * Vrednost se čuva kao `Record<option, 1..5>`.
 */
export function LikertMatrix({
  options,
  value,
  onChange,
  questionText,
  scaleLabels = ["Never", "Always"],
}: Props) {
  const current = value ?? {};

  const setLevel = (opt: string, level: number) => {
    onChange({ ...current, [opt]: level });
  };

  return (
    <div className="space-y-4 py-4 border-b border-border/50 last:border-0">
      <p className="text-sm font-medium text-foreground">{questionText}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground">
              <th className="text-left font-normal pb-2"></th>
              {[1, 2, 3, 4, 5].map((n) => (
                <th key={n} className="px-2 pb-2 text-center font-medium">
                  {n}
                  {n === 1 && <div className="text-[10px] font-normal">{scaleLabels[0]}</div>}
                  {n === 5 && <div className="text-[10px] font-normal">{scaleLabels[1]}</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {options.map((opt) => (
              <tr key={opt} className="border-t border-border/40">
                <td className="py-2 pr-3 text-foreground">{opt}</td>
                {[1, 2, 3, 4, 5].map((level) => {
                  const active = current[opt] === level;
                  return (
                    <td key={level} className="px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => setLevel(opt, level)}
                        aria-label={`${opt} - ${level}`}
                        className={cn(
                          "h-5 w-5 rounded-full border-2 transition-colors",
                          active
                            ? "border-primary bg-primary"
                            : "border-border bg-card hover:border-primary/50",
                        )}
                      />
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
