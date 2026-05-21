import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface LikertScaleProps {
  value: number | undefined;
  onChange: (value: number) => void;
  labels: [string, string];
  questionText: string;
}

export function LikertScale({ value, onChange, labels, questionText }: LikertScaleProps) {
  const hasAnswered = value !== undefined && value > 0;
  const sliderValue = hasAnswered ? value : 1;

  return (
    <div className="space-y-4 py-6 border-b border-border/50 last:border-0 font-sans">
      <p className="text-center text-sm text-[#444444] max-w-[640px] mx-auto leading-relaxed px-4">
        {questionText}
      </p>

      <div className="mx-auto max-w-[640px] px-2">
        {/* Glavni kontejner koji drži sve usklađeno */}
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              {/* LEVI LABEL - Smanjen na mobilnom, wrapuje se obavezno */}
              <td className="w-[65px] sm:w-[110px] text-right align-middle pr-2 sm:pr-4">
                <span className="block text-[10px] sm:text-xs text-[#444444] whitespace-normal break-words leading-tight">
                  {labels[0]}
                </span>
              </td>

              {/* CENTRALNA ZONA - Slider i brojevi dele isti prozor */}
              <td className="align-middle">
                <div className="flex flex-col w-full">
                  
                  {/* Slider */}
                  <SliderPrimitive.Root
                    value={[sliderValue]}
                    onValueChange={([v]) => onChange(v)}
                    min={1}
                    max={5}
                    step={1}
                    className="relative flex touch-none select-none items-center py-2 cursor-pointer"
                  >
                    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[#e5e7eb]">
                      <SliderPrimitive.Range className={cn("absolute h-full bg-brand-blue-deep", !hasAnswered && "bg-transparent")} />
                    </SliderPrimitive.Track>
                    <SliderPrimitive.Thumb className={cn(
                      "block h-5 w-5 rounded-full border-2 border-brand-blue-deep bg-white shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40",
                      hasAnswered ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-0 pointer-events-none"
                    )} />
                  </SliderPrimitive.Root>

                  {/* BROJEVI - Savršeno poravnati sa ivicama slidera bez fiksnih paddinga */}
                  <div className="flex justify-between w-full px-1.5 mt-1 select-none">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className={cn(
                          "transition-all duration-200 text-center w-4",
                          hasAnswered && n === value
                            ? "text-sm font-bold text-brand-blue-deep"
                            : "text-xs text-[#9ca3af]"
                        )}
                      >
                        {n}
                      </span>
                    ))}
                  </div>

                </div>
              </td>

              {/* DESNI LABEL - Isti uslovi kao za levi */}
              <td className="w-[65px] sm:w-[110px] text-left align-middle pl-2 sm:pl-4">
                <span className="block text-[10px] sm:text-xs text-[#444444] whitespace-normal break-words leading-tight">
                  {labels[1]}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}