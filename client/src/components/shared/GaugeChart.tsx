interface GaugeChartProps {
  value: number;
  maxValue?: number;
  size?: number;
  label?: string;
  sublabel?: string;
}

export function GaugeChart({ value, maxValue = 5, size = 140, label, sublabel }: GaugeChartProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const radius = 40;
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Color based on percentage - matching Figma (green/blue/yellow tiers)
  const getColor = () => {
    if (percentage >= 60) return "#64a550"; // green
    if (percentage >= 40) return "#518efa"; // blue
    if (percentage >= 25) return "#f0a500"; // yellow/orange (low)
    return "#e85d3a"; // red (very low)
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size * 0.65 }}>
        <svg
          width={size}
          height={size * 0.65}
          viewBox="0 0 100 65"
        >
          {/* Background arc */}
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke="hsl(210, 15%, 88%)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke={getColor()}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          {/* Min/max labels */}
          <text x="8" y="63" fontSize="6" fill="hsl(210, 10%, 60%)" textAnchor="middle">0</text>
          <text x="92" y="63" fontSize="6" fill="hsl(210, 10%, 60%)" textAnchor="middle">{maxValue}</text>
        </svg>
        {/* Center value */}
        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{ paddingBottom: size * 0.04 }}
        >
          <span
            className="font-bold text-brand-blue-deep"
            style={{ fontSize: size * 0.19 }}
          >
            {value.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).replace(".", ",")}
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-1 text-sm font-medium text-foreground">{label}</span>
      )}
      {sublabel && (
        <span className="text-xs text-muted-foreground">{sublabel}</span>
      )}
    </div>
  );
}
