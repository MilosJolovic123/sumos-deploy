import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import worldData from "@/assets/countries-110m.json";
import { getScoreColor, NO_DATA_COLOR, SCORE_COLOR_BUCKETS } from "@/lib/score-colors";

const API_HOST = import.meta.env.VITE_API_HOST || "";
const COUNTRY_ALIASES: Record<string, string> = {
  "United States": "United States of America",
  "Czech Republic": "Czechia",
  "South Korea": "Korea",
};

interface CountryScore {
  country: string;
  score: number;
  count: number;
}

function normalizeCountryName(country: string) {
  return COUNTRY_ALIASES[country] || country;
}

export function Awareness() {
  const [countryScores, setCountryScores] = useState<CountryScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch(`${API_HOST}/api/statistics/country-scores`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch country scores");
        return response.json() as Promise<CountryScore[]>;
      })
      .then((data) => {
        if (mounted) setCountryScores(data);
      })
      .catch((error) => {
        console.error("Error loading country scores:", error);
        if (mounted) setHasError(true);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const scoresByCountry = useMemo(
    () => new Map(countryScores.map((item) => [normalizeCountryName(item.country), item])),
    [countryScores],
  );
  const topThree = countryScores.slice(0, 3);

  return (
    <section id="benchmark" className="bg-background py-16">
      <div className="mx-auto max-w-[1280px] px-10">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-4xl font-extrabold text-brand-blue-deep">Green awareness</h2>
          <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline">
            See full statistics <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mb-8 overflow-hidden rounded-[20px] border border-slate-200/70 bg-white/40 p-2">
          <ComposableMap
            projectionConfig={{ scale: 205, center: [0, 18] }}
            width={1200}
            height={540}
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <Geographies geography={worldData as object}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getScoreColor(scoresByCountry.get(geo.properties?.name)?.score ?? -1)}
                    stroke="var(--brand-blue-deep)"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "var(--brand-blue)", fillOpacity: 0.45 },
                      pressed: { outline: "none" },
                    }}
                  >
                    <title>
                      {geo.properties?.name}:{" "}
                      {scoresByCountry.get(geo.properties?.name)
                        ? `${scoresByCountry.get(geo.properties?.name)?.score.toFixed(1)} (n=${scoresByCountry.get(geo.properties?.name)?.count})`
                        : "No data"}
                    </title>
                  </Geography>
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>

        <div className="rounded-xl border border-border bg-card p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-brand-blue-deep">Top 3 countries by score</h3>
            <div className="flex flex-wrap gap-3 text-xs text-brand-slate">
              {SCORE_COLOR_BUCKETS.map((bucket) => (
                <span key={bucket.label} className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: bucket.color }} />
                  {bucket.label}
                </span>
              ))}
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: NO_DATA_COLOR }} />
                No data
              </span>
            </div>
          </div>
          {isLoading && <p className="text-sm text-brand-slate">Loading country scores...</p>}
          {hasError && <p className="text-sm text-red-600">Country scores are currently unavailable.</p>}
          {!isLoading && !hasError && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {topThree.length === 0 && <p className="text-sm text-brand-slate">No country data available.</p>}
              {topThree.map((country, index) => (
                <div key={country.country} className="rounded-lg bg-background p-5">
                  <p className="text-sm font-semibold text-brand-blue-deep">#{index + 1}</p>
                  <p className="mt-2 text-lg font-semibold text-brand-blue-deep">{country.country}</p>
                  <p className="mt-1 text-3xl font-bold" style={{ color: getScoreColor(country.score) }}>
                    {country.score.toFixed(1)}
                    <span className="ml-1 text-sm font-normal text-brand-slate">/ 5</span>
                  </p>
                  <p className="mt-1 text-xs text-brand-slate">{country.count} responses</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
