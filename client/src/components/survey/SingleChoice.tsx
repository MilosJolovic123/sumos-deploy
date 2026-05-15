import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  options: string[];
  value: string | undefined;
  onChange: (v: string) => void;
  questionText: string;
}

export function SingleChoice({ options, value, onChange, questionText }: Props) {
  return (
    <div className="space-y-3 py-4 border-b border-border/50 last:border-0">
      <p className="text-sm font-medium text-foreground">{questionText}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full sm:w-[300px]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
