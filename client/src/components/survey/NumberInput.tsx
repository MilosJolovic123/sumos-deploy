import { Input } from "@/components/ui/input";

interface Props {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  questionText: string;
}

export function NumberInput({ value, onChange, questionText }: Props) {
  return (
    <div className="space-y-2 py-4 border-b border-border/50 last:border-0">
      <p className="text-sm font-medium text-foreground">{questionText}</p>
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        value={value ?? ""}
        onKeyDown={(e) => {
          // Prevent typing negative signs, exponents, and decimals
          if (["-", "e", "E", "+", ".", ","].includes(e.key)) {
            e.preventDefault();
          }
        }}
        onChange={(e) => {
          if (e.target.value === "") {
            onChange(undefined);
            return;
          }
          const n = Number(e.target.value);
          if (!Number.isNaN(n) && n >= 0) onChange(n);
        }}
        className="max-w-[160px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
}
