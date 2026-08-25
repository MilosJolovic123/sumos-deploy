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
        type="text" // 1. Promenjeno iz "number" u "text"
        inputMode="numeric" // 2. Zadržava numeričku tastaturu na mobilnim uređajima
        value={value ?? ""}
        onChange={(e) => {
          const val = e.target.value;

          // Ako je korisnik obrisao zadnju cifru (ostavio prazno)
          if (val === "") {
            onChange(undefined);
            return;
          }

          // Propušta ISKLJUČIVO brojeve (nema minusa, slova e, tačaka, zareza)
          if (/^\d+$/.test(val)) {
            onChange(Number(val));
          }
        }}
        // Uklonjene su klase za skrivanje strelica jer kod text inputa one ne postoje
        className="max-w-[160px]"
      />
    </div>
  );
}
