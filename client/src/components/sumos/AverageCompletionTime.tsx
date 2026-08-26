interface AverageCompletionTimeProps {
  valueMs?: number | null;
  loading?: boolean;
  className?: string;
}

export function formatDurationFromMs(valueMs?: number | null): string {
  if (valueMs === null || valueMs === undefined || Number.isNaN(valueMs)) {
    return "0s";
  }

  const totalSeconds = Math.max(0, Math.round(valueMs / 1000));
  if (totalSeconds < 60) return `${totalSeconds}s`;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 24) return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

export function AverageCompletionTime({
  valueMs,
  loading = false,
  className = "",
}: AverageCompletionTimeProps) {
  return (
    <span className={className}>{loading ? "Loading..." : formatDurationFromMs(valueMs)}</span>
  );
}
