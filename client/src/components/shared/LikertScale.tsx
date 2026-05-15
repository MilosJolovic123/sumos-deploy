import * as SliderPrimitive from "@radix-ui/react-slider";

interface LikertScaleProps {
  value: number;
  onChange: (value: number) => void;
  labels: [string, string];
  questionText: string;
}

export function LikertScale({ value, onChange, labels, questionText }: LikertScaleProps) {
  return (
    <div className="space-y-4 py-6 border-b border-border/50 last:border-0">
      <p className="text-center text-sm text-[#444444] max-w-[640px] mx-auto leading-relaxed">
        {questionText}
      </p>

      <div className="mx-auto max-w-[640px]">
        <div className="flex items-center gap-4">
          <span className="min-w-[110px] text-right text-xs text-[#444444]">
            {labels[0]}
          </span>

          <SliderPrimitive.Root
            value={[value]}
            onValueChange={([v]) => onChange(v)}
            min={1}
            max={5}
            step={1}
            className="relative flex flex-1 touch-none select-none items-center py-2"
          >
            <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[#e5e7eb]">
              <SliderPrimitive.Range className="absolute h-full bg-brand-blue-deep" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-brand-blue-deep bg-white shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40" />
          </SliderPrimitive.Root>

          <span className="min-w-[110px] text-left text-xs text-[#444444]">
            {labels[1]}
          </span>
        </div>

        <div className="mt-2 flex justify-between px-[126px]">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={
                n === value
                  ? "text-sm font-bold text-brand-blue-deep"
                  : "text-xs text-[#9ca3af]"
              }
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
