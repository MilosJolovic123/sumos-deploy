export const SCORE_COLOR_BUCKETS = [
  { min: 4, color: "#64a550", label: "Excellent" },
  { min: 3, color: "#A3C27C", label: "Very good" },
  { min: 2, color: "#455369", label: "Good" },
  { min: 1.05, color: "#D89B39", label: "Fair" },
  { min: 0, color: "#DC493A", label: "Needs improvement" },
] as const;

export const NO_DATA_COLOR = "#E5E7EB";

export function getScoreColor(score: number): string {
  return SCORE_COLOR_BUCKETS.find((bucket) => score >= bucket.min)?.color ?? NO_DATA_COLOR;
}
