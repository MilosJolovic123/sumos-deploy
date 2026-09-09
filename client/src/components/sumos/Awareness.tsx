import worldData from "@/assets/countries-110m.json";
import { getScoreColor, NO_DATA_COLOR, SCORE_COLOR_BUCKETS } from "@/lib/score-colors";
import { ArrowRight, ZoomIn, ZoomOut, Maximize2, Expand, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { geoMercator } from "d3-geo";
import { feature } from "topojson-client";
import { Link } from "react-router-dom";

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 450;

const worldObjectKey = Object.keys((worldData as any).objects)[0];
const worldGeoJsonRaw = feature(worldData as any, (worldData as any).objects[worldObjectKey]);

// izbacivanje Antartika
const worldGeoJson = {
  ...worldGeoJsonRaw,
  features: (worldGeoJsonRaw as any).features.filter(
    (f: any) => f.properties?.name !== "Antarctica",
  ),
};

const worldProjection = geoMercator().fitSize([MAP_WIDTH, MAP_HEIGHT], worldGeoJson as any);

// Izvuci tačnu geo-koordinatu koja odgovara centru platna kod ove projekcije,
// da bi ZoomableGroup centrirao oko iste tačke koju je fitSize već izračunao
const invertedCenter = worldProjection.invert?.([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
const DEFAULT_CENTER: [number, number] = invertedCenter
  ? [invertedCenter[0], invertedCenter[1]]
  : [0, 0];

const API_HOST = import.meta.env.VITE_API_HOST || "";
const COUNTRY_ALIASES: Record<string, string> = {
  "United States": "United States of America",
  "Czech Republic": "Czechia",
  "South Korea": "Korea",
  "Russian Federation": "Russia",
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

interface CountryScore {
  country: string;
  score: number;
  count: number;
}

interface TooltipState {
  x: number;
  y: number;
  name: string;
  text: string;
}

function normalizeCountryName(country: string) {
  return COUNTRY_ALIASES[country] || country;
}

export function Awareness() {
  const [countryScores, setCountryScores] = useState<CountryScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [position, setPosition] = useState({
    coordinates: DEFAULT_CENTER,
    zoom: 1,
  });
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  function handleMoveEnd(newPosition: { coordinates: [number, number]; zoom: number }) {
    setPosition(newPosition);
  }

  function handleZoomIn() {
    setPosition((pos) => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, MAX_ZOOM) }));
  }

  function handleZoomOut() {
    setPosition((pos) => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, MIN_ZOOM) }));
  }

  function handleReset() {
    setPosition({ coordinates: DEFAULT_CENTER, zoom: 1 });
  }

  // Escape zatvara fullscreen modal
  useEffect(() => {
    if (!isFullscreen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsFullscreen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    // blokiraj scroll pozadine dok je modal otvoren
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isFullscreen]);

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

  function handleGeographyEnter(e: React.MouseEvent<SVGPathElement, MouseEvent>, geo: any) {
    const name = geo.properties?.name;
    const data = scoresByCountry.get(name);
    setTooltip({
      x: e.clientX,
      y: e.clientY,
      name: name ?? "Unknown",
      text: data ? `${data.score.toFixed(1)} (n=${data.count})` : "No data",
    });
  }

  function handleGeographyMove(e: React.MouseEvent<SVGPathElement, MouseEvent>) {
    setTooltip((t) => (t ? { ...t, x: e.clientX, y: e.clientY } : t));
  }

  function handleGeographyLeave() {
    setTooltip(null);
  }

  // Zajednička mapa - koristi se i u normalnom i u fullscreen prikazu,
  // da ne duplira ZoomableGroup/Geographies logiku
  function renderMap() {
    return (
      <ComposableMap
        projection={
          worldProjection as unknown as (width: number, height: number) => typeof worldProjection
        }
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          translateExtent={[
            [0, 0],
            [MAP_WIDTH, MAP_HEIGHT],
          ]}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={worldData as object}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getScoreColor(scoresByCountry.get(geo.properties?.name)?.score ?? -1)}
                  stroke="var(--brand-blue-deep)"
                  strokeWidth={0.4 / position.zoom}
                  onMouseEnter={(e) => handleGeographyEnter(e, geo)}
                  onMouseMove={handleGeographyMove}
                  onMouseLeave={handleGeographyLeave}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "var(--brand-blue)", fillOpacity: 0.45 },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    );
  }

  // Traka sa alatima (zoom in/out/reset + fullscreen toggle)
  function renderToolbar(options?: { showClose?: boolean }) {
    return (
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-1 rounded-lg border border-slate-200 bg-white/90 p-1 shadow-sm">
        <button
          onClick={handleZoomIn}
          className="rounded p-1.5 hover:bg-slate-100"
          aria-label="Zoom in"
          type="button"
        >
          <ZoomIn className="h-4 w-4 text-brand-blue-deep" />
        </button>
        <button
          onClick={handleZoomOut}
          className="rounded p-1.5 hover:bg-slate-100"
          aria-label="Zoom out"
          type="button"
        >
          <ZoomOut className="h-4 w-4 text-brand-blue-deep" />
        </button>
        <button
          onClick={handleReset}
          className="rounded p-1.5 hover:bg-slate-100"
          aria-label="Reset view"
          type="button"
        >
          <Maximize2 className="h-4 w-4 text-brand-blue-deep" />
        </button>
        {options?.showClose ? (
          <button
            onClick={() => setIsFullscreen(false)}
            className="rounded p-1.5 hover:bg-slate-100"
            aria-label="Close fullscreen"
            type="button"
          >
            <X className="h-4 w-4 text-brand-blue-deep" />
          </button>
        ) : (
          <button
            onClick={() => setIsFullscreen(true)}
            className="rounded p-1.5 hover:bg-slate-100"
            aria-label="Open fullscreen"
            type="button"
          >
            <Expand className="h-4 w-4 text-brand-blue-deep" />
          </button>
        )}
      </div>
    );
  }

  return (
    <section id="benchmark" className="bg-background py-16">
      <div className="mx-auto max-w-[1280px] px-10">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-4xl font-extrabold text-brand-blue-deep">Green awareness</h2>
          <Link
            to="/statistics"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline"
          >
            See full statistics <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mx-auto max-w-[1280px] px-10">
          <div className="relative mb-8 overflow-hidden rounded-xl border border-border bg-card p-8">
            {renderToolbar()}
            {renderMap()}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-8">
          <div className="mb-6 flex flex-wrap justify-center gap-4">
            <h3 className="text-lg font-semibold text-brand-blue-deep">Top 3 countries by score</h3>
            <div className="flex flex-wrap gap-3 text-xs text-brand-slate">
              {/* legenda - po potrebi otkomentarisati
              {SCORE_COLOR_BUCKETS.map((bucket) => (
                <span key={bucket.label} className="flex items-center gap-1">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: bucket.color }}
                  />
                  {bucket.label}
                </span>
              ))}
              <span className="flex items-center gap-1">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: NO_DATA_COLOR }}
                />
                No data
              </span>
              */}
            </div>
          </div>
          {isLoading && <p className="text-sm text-brand-slate">Loading country scores...</p>}
          {hasError && (
            <p className="text-sm text-red-600">Country scores are currently unavailable.</p>
          )}
          {!isLoading && !hasError && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {topThree.length === 0 && (
                <p className="text-sm text-brand-slate">No country data available.</p>
              )}
              {topThree.map((country, index) => (
                <div
                  key={country.country}
                  className="flex flex-col items-center rounded-xl border border-border bg-background p-5 text-center"
                >
                  <p className="text-sm font-semibold text-brand-blue-deep">#{index + 1}</p>
                  <p className="mt-2 text-lg font-semibold text-brand-blue-deep">
                    {country.country}
                  </p>
                  <p
                    className="mt-1 text-3xl font-bold"
                    style={{ color: getScoreColor(country.score) }}
                  >
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

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative w-full max-w-[1400px] overflow-hidden rounded-xl border border-border bg-card p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {renderToolbar({ showClose: true })}
            {renderMap()}
          </div>
        </div>
      )}

      {/* Tooltip - zajednički za oba prikaza mape */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-[60] rounded-md bg-slate-900 px-2 py-1 text-xs text-white shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
        >
          <strong>{tooltip.name}</strong>: {tooltip.text}
        </div>
      )}
    </section>
  );
}
