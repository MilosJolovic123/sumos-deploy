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

  // Escape zatvara fullscreen modal + čisti tooltip
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

  // Tooltip se ne prenosi između normalnog i fullscreen prikaza
  useEffect(() => {
    setTooltip(null);
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

  function buildTooltip(x: number, y: number, geo: any): TooltipState {
    const name = geo.properties?.name;
    const data = scoresByCountry.get(name);
    return {
      x,
      y,
      name: name ?? "Unknown",
      text: data ? `${data.score.toFixed(1)} (n=${data.count})` : "No data",
    };
  }

  // Desktop hover ponašanje
  function handleGeographyEnter(e: React.MouseEvent<SVGPathElement, MouseEvent>, geo: any) {
    setTooltip(buildTooltip(e.clientX, e.clientY, geo));
  }

  function handleGeographyMove(e: React.MouseEvent<SVGPathElement, MouseEvent>) {
    setTooltip((t) => (t ? { ...t, x: e.clientX, y: e.clientY } : t));
  }

  function handleGeographyLeave() {
    setTooltip(null);
  }

  // Mobile/touch ponašanje - tap na državu prikazuje tooltip,
  // tap van države (na pozadinu mape) ga zatvara
  function handleGeographyTap(e: React.MouseEvent<SVGPathElement, MouseEvent>, geo: any) {
    e.stopPropagation();
    setTooltip((current) => {
      const next = buildTooltip(e.clientX, e.clientY, geo);
      // drugi tap na istu državu zatvara tooltip (toggle)
      if (current && current.name === next.name) return null;
      return next;
    });
  }

  function handleMapBackgroundTap() {
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
                  onClick={(e) => handleGeographyTap(e, geo)}
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
  // Veći touch target na mobilnom (p-2.5 / h-5 w-5), vraća se na originalne
  // desktop dimenzije (p-1.5 / h-4 w-4) od md: naviše
  function renderToolbar(options?: { showClose?: boolean }) {
    return (
      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 rounded-lg border border-slate-200 bg-white/90 p-1 shadow-sm md:right-4 md:top-4">
        <button
          onClick={handleZoomIn}
          className="rounded p-2.5 hover:bg-slate-100 active:bg-slate-200 md:p-1.5"
          aria-label="Zoom in"
          type="button"
        >
          <ZoomIn className="h-5 w-5 text-brand-blue-deep md:h-4 md:w-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="rounded p-2.5 hover:bg-slate-100 active:bg-slate-200 md:p-1.5"
          aria-label="Zoom out"
          type="button"
        >
          <ZoomOut className="h-5 w-5 text-brand-blue-deep md:h-4 md:w-4" />
        </button>
        <button
          onClick={handleReset}
          className="rounded p-2.5 hover:bg-slate-100 active:bg-slate-200 md:p-1.5"
          aria-label="Reset view"
          type="button"
        >
          <Maximize2 className="h-5 w-5 text-brand-blue-deep md:h-4 md:w-4" />
        </button>
        {options?.showClose ? (
          <button
            onClick={() => setIsFullscreen(false)}
            className="rounded p-2.5 hover:bg-slate-100 active:bg-slate-200 md:p-1.5"
            aria-label="Close fullscreen"
            type="button"
          >
            <X className="h-5 w-5 text-brand-blue-deep md:h-4 md:w-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsFullscreen(true)}
            className="rounded p-2.5 hover:bg-slate-100 active:bg-slate-200 md:p-1.5"
            aria-label="Open fullscreen"
            type="button"
          >
            <Expand className="h-5 w-5 text-brand-blue-deep md:h-4 md:w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <section id="benchmark" className="bg-background py-10 md:py-16">
      <div className="mx-auto max-w-[1280px] px-4 md:px-10">
        <div className="mb-6 flex items-end justify-between md:mb-8">
          <h2 className="text-2xl font-extrabold text-brand-blue-deep md:text-4xl">
            Green awareness
          </h2>
          <Link
            to="/statistics"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline"
          >
            <span className="hidden sm:inline">See full statistics</span>
            <span className="sm:hidden">Statistics</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mx-auto max-w-[1280px] px-0 md:px-10">
          <div
            className="relative mb-2 touch-none overflow-hidden rounded-xl border border-border bg-card p-3 md:mb-8 md:p-8"
            onClick={handleMapBackgroundTap}
          >
            {renderToolbar()}
            {renderMap()}
          </div>
          <p className="mb-6 text-center text-xs text-brand-slate md:hidden">
            Tapni na državu za detalje • Pinch za zumiranje
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 md:p-8">
          <div className="mb-6 flex flex-wrap justify-center gap-4">
            <h3 className="text-base font-semibold text-brand-blue-deep md:text-lg">
              Top 3 countries by score
            </h3>
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

      {/* Fullscreen modal - na mobilnom zauzima ceo ekran (h-full),
          na desktopu ostaje centriran sa marginama kao pre */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 md:p-6"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative h-full w-full overflow-hidden rounded-none border-0 border-border bg-card p-3 md:h-auto md:max-w-[1400px] md:rounded-xl md:border md:p-8"
            onClick={(e) => {
              e.stopPropagation();
              handleMapBackgroundTap();
            }}
          >
            {renderToolbar({ showClose: true })}
            <div className="flex h-full items-center md:block">{renderMap()}</div>
          </div>
        </div>
      )}

      {/* Tooltip - zajednički za oba prikaza mape */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-[60] max-w-[220px] rounded-md bg-slate-900 px-2 py-1 text-xs text-white shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
        >
          <strong>{tooltip.name}</strong>: {tooltip.text}
        </div>
      )}
    </section>
  );
}
