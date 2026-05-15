import { AlertCircle, ArrowRight, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ConsentStep({
  onAgree,
  onDisagree,
}: {
  onAgree: () => void;
  onDisagree: () => void;
}) {
  const [value, setValue] = useState<string>("");
  const [isTerminating, setIsTerminating] = useState(false);

  // Ako je korisnik kliknuo "Finish" na "I do not agree"
  if (isTerminating) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-12 text-center shadow-sm">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Survey Terminated
          </h2>
          <p className="text-muted-foreground">
            You have chosen not to provide consent. You will be redirected to
            the homepage shortly.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-muted overflow-hidden rounded-full">
              <div className="h-full bg-destructive animate-progress-fast" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <div className="flex gap-4 mb-6 items-start">
          <Shield className="h-6 w-6 text-primary shrink-0 mt-1" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              Informed Consent
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              By participating in the survey, I consent to my anonymous
              responses being used for research purposes.
            </p>
          </div>
        </div>

        <RadioGroup onValueChange={setValue} className="space-y-3">
          <div
            className={cn(
              "flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer",
              value === "agree"
                ? "bg-secondary/10 border-secondary"
                : "hover:bg-muted",
            )}
          >
            <RadioGroupItem value="agree" id="agree" />
            <Label
              htmlFor="agree"
              className="flex-1 cursor-pointer font-medium"
            >
              I agree and wish to continue
            </Label>
          </div>

          <div
            className={cn(
              "flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer",
              value === "disagree"
                ? "bg-destructive/5 border-destructive/20"
                : "hover:bg-muted",
            )}
          >
            <RadioGroupItem value="disagree" id="disagree" />
            <Label
              htmlFor="disagree"
              className="flex-1 cursor-pointer font-medium text-destructive"
            >
              I do not agree
            </Label>
          </div>
        </RadioGroup>

        <div className="mt-8 flex justify-end">
          <Button
            className="rounded-full bg-secondary px-8 text-secondary-foreground hover:bg-secondary/90"
            disabled={!value}
            onClick={() => {
              if (value === "agree") {
                onAgree();
              } else {
                setIsTerminating(true); // Prikaži poruku o redirekciji
                onDisagree(); // Pokreni tajmer i toast
              }
            }}
          >
            {value === "disagree" ? "End the survey" : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
