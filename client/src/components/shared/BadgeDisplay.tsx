import { Globe2 } from "lucide-react";

interface BadgeDisplayProps {
  name: string;
  description: string;
  size?: "sm" | "lg";
}

export function BadgeDisplay({ name, size = "lg" }: BadgeDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div
        className={`flex items-center justify-center rounded-full bg-brand-green-soft/30 ${
          size === "lg" ? "h-24 w-24" : "h-16 w-16"
        }`}
      >
        <Globe2
          className={`text-brand-green ${size === "lg" ? "h-12 w-12" : "h-9 w-9"}`}
          strokeWidth={1.5}
        />
      </div>
      <h3
        className={`font-extrabold text-brand-green ${size === "lg" ? "text-xl" : "text-base"}`}
      >
        {name}
      </h3>
    </div>
  );
}
