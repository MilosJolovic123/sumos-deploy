import { Input } from "@/components/ui/input";

interface Props {
  value: string | undefined;
  onChange: (v: string) => void;
  questionText: string;
}

export function TextInput({ value, onChange, questionText }: Props) {
  return (
    <div className="space-y-2 py-4 border-b border-border/50 last:border-0">
      <p className="text-sm font-medium text-foreground">{questionText}</p>
      <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
