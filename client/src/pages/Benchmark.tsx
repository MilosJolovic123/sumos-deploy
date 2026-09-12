import { useEffect, useMemo, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Filter, ChevronDown, X } from "lucide-react";
import { Navigation } from "@/components/sumos/Navigation";
import { Footer } from "@/components/sumos/Footer";
import sumosWordmark from "@/assets/sumos-wordmark.png";
import { toast } from "sonner";

// --- Tipovi za API ---
interface CategoryScores {
  Awareness: number;
  Attitudes: number;
  Travel: number;
  Living: number;
  Consumption: number;
  Digital: number;
  Engagement: number;
  Barriers: number;
  Habits: number;
  [key: string]: number;
}

interface UserData {
  ecoScore: number;
  categoryScores: CategoryScores;
  percentile?: number;
  badge?: string;
}

interface GroupData {
  averageScore: number;
  categories: Record<string, number>;
  habits: Record<string, number>;
  resultCount?: number;
}

interface CountryOption {
  country: string;
  institutions: string[];
}

interface BenchmarkResponse {
  myData: UserData;
  otherData: UserData;
}

interface FilterChip {
  id: "country" | "mobility" | "institution";
  label: string;
}

// Pomoćna funkcija za određivanje Green Profila na osnovu ocene
const getGreenProfile = (score: number) => {
  if (score <= 1.8) return "Eco Beginner";
  if (score <= 2.6) return "Eco Explorer";
  if (score <= 3.4) return "Eco Learner";
  if (score <= 4.2) return "Eco Achiever";
  return "Eco Champion";
};

// --- Gauge Komponenta (1 decimala, evropski format) ---
function Gauge({
  value,
  max = 5,
  color,
  trackColor = "#E5E7EB",
}: {
  value: number;
  max?: number;
  color: string;
  trackColor?: string;
}) {
  const cx = 105.849;
  const cy = 105.849;
  const rOuter = 105.849;
  const rInner = 76.211;
  const ratio = Math.max(0, Math.min(1, value / max));

  const polar = (r: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  };

  const arcPath = (sweepDeg: number) => {
    if (sweepDeg <= 0) return "";
    const startOuter = polar(rOuter, 180);
    const endOuter = polar(rOuter, 180 - sweepDeg);
    const endInner = polar(rInner, 180 - sweepDeg);
    const startInner = polar(rInner, 180);
    const largeArc = sweepDeg > 180 ? 1 : 0;
    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${endInner.x} ${endInner.y}`,
      `A ${rInner} ${rInner} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}`,
      "Z",
    ].join(" ");
  };

  return (
    <div className="relative h-[130px] w-[212px]">
      <svg viewBox="0 0 212 106" width="212" height="106" className="absolute left-0 top-0 block">
        <path d={arcPath(180)} fill={trackColor} />
        <path d={arcPath(ratio * 180)} fill={color} />
      </svg>
      <div className="absolute left-0 right-0 top-[58px] text-center font-bold text-[40px] leading-none text-[#233662]">
        {value.toFixed(1).replace(".", ",")}
      </div>
      <div className="absolute left-[2px] top-[112px] px-[10px] text-[12px] leading-none text-[#bfbfbf]">
        0
      </div>
      <div className="absolute right-[2px] top-[112px] px-[10px] text-[12px] leading-none text-[#bfbfbf]">
        {max}
      </div>
    </div>
  );
}

// --- Grafik 1: Sustainability Categories Comparison (0 - 5 scale) ---
function DetailedCategoryComparison({
  filterScores,
  userScores,
}: {
  filterScores: Record<string, number>;
  userScores: Record<string, number>;
}) {
  const categories = [
    { key: "Awareness", label: "Awareness" },
    { key: "Attitudes", label: "Attitudes" },
    { key: "Habits", label: "Habbits" },
    { key: "Barriers", label: "Barriers" },
  ];
  const max = 5;
  const ticks = [5, 4, 3, 2, 1, 0];

  return (
    <div className="flex h-[340px] w-full flex-col justify-between rounded-[16px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3">
        <h3 className="text-[20px] font-bold text-[#1E2B4D]">Sustainability categories</h3>
        <div  />
      </div>

      <div className="flex flex-1 gap-3 pt-3 pb-8">
        {/* Y-Osa */}
        <div className="relative flex w-6 flex-col justify-between text-right text-[11px] font-medium text-[#B5B5C3]">
          {ticks.map((t) => (
            <span key={t} className="transform -translate-y-1/2 leading-none">
              {t}
            </span>
          ))}
        </div>

        {/* Mreža i stubići */}
        <div className="relative flex flex-1 flex-col">
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between">
            {ticks.map((t) => (
              <div key={t} className="h-px w-full bg-[#F1F1F4]" />
            ))}
          </div>

          <div className="relative flex h-full items-end justify-between px-4 sm:px-12">
            {categories.map((cat) => {
              const filterVal = filterScores[cat.key] || 0;
              const userVal = userScores[cat.key] || 0;

              return (
                <div key={cat.key} className="relative flex h-full items-end justify-center gap-1.5 w-[70px]">
                  {/* Tamnozeleni stubić (Prosek grupe) */}
                  <div
                    className="w-[18px] sm:w-[22px] rounded-t-[4px] bg-[#1B432C] transition-all duration-700"
                    style={{ height: `${(filterVal / max) * 100}%` }}
                    title={`Group average: ${filterVal}`}
                  />
                  {/* Svetlozeleni stubić (Uneseni kod) */}
                  <div
                    className="w-[18px] sm:w-[22px] rounded-t-[4px] bg-[#61A348] transition-all duration-700"
                    style={{ height: `${(userVal / max) * 100}%` }}
                    title={`Your score: ${userVal}`}
                  />

                  {/* Labela ispod */}
                  <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-[85px] h-10 flex items-center justify-center">
                    <span className="font-gilroy font-normal text-center text-[12px] leading-tight text-[#464E5F]">
                      {cat.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-6 pt-2 my-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#1B432C]" />
          <span className="text-[12px] font-medium text-[#464E5F]">Filtered average</span>
      
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#61A348]" />
          <span className="text-[12px] font-medium text-[#464E5F]">Your score</span>
        </div>
      </div>
    </div>
  );
}

// --- Grafik 2: Sustainable Habits Comparison (Sada na skali 0 - 5) ---
function DetailedHabitsComparison({
  filterScores,
  userScores,
}: {
  filterScores: Record<string, number>;
  userScores: Record<string, number>;
}) {
  const habits = [
    { key: "Travel", label: "Travel" },
    { key: "Living", label: "Living and accomodation" },
    { key: "Consumption", label: "Food and consumption" },
    { key: "Digital", label: "Digital habits" },
    { key: "Engagement", label: "Community engagement" },
  ];
  const max = 5;
  const ticks = [5, 4, 3, 2, 1, 0];

  return (
    <div className="flex h-[340px] w-full flex-col justify-between rounded-[16px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3">
        <h3 className="text-[20px] font-bold text-[#1E2B4D]">Sustainable habits</h3>
        <div/>
      </div>

      <div className="flex flex-1 gap-3 pt-3 pb-8">
        {/* Y-Osa (0 - 5) */}
        <div className="relative flex w-6 flex-col justify-between text-right text-[11px] font-medium text-[#B5B5C3]">
          {ticks.map((t) => (
            <span key={t} className="transform -translate-y-1/2 leading-none">
              {t}
            </span>
          ))}
        </div>

        {/* Mreža i stubići */}
        <div className="relative flex flex-1 flex-col">
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between">
            {ticks.map((t) => (
              <div key={t} className="h-px w-full bg-[#F1F1F4]" />
            ))}
          </div>

          <div className="relative flex h-full items-end justify-between px-2 sm:px-6">
            {habits.map((item) => {
              const filterVal = filterScores[item.key] || 0;
              const userVal = userScores[item.key] || 0;

              return (
                <div key={item.key} className="relative flex h-full items-end justify-center gap-1.5 w-[70px]">
                  {/* Tamnoplavi stubić (Prosek grupe) */}
                  <div
                    className="w-[16px] sm:w-[18px] rounded-t-[4px] bg-[#172545] transition-all duration-700"
                    style={{ height: `${(filterVal / max) * 100}%` }}
                    title={`Group average: ${filterVal}`}
                  />
                  {/* Svetloplavi stubić (Uneseni kod) */}
                  <div
                    className="w-[16px] sm:w-[18px] rounded-t-[4px] bg-[#4C8CFF] transition-all duration-700"
                    style={{ height: `${(userVal / max) * 100}%` }}
                    title={`Your score: ${userVal}`}
                  />

                  {/* Labela ispod */}
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[90px] h-10 flex items-center justify-center">
                    <span className="font-gilroy font-normal text-center text-[11px] leading-tight text-[#464E5F]">
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-6 pt-2 my-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#172545]" />
          <span className="text-[12px] font-medium text-[#464E5F]">Filtered average</span>
          
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#4C8CFF]" />
          <span className="text-[12px] font-medium text-[#464E5F]">Your score</span>
        </div>
      </div>
    </div>
  );
}

function BenchmarkPage() {
  // Benchmark with friend stanja
  const [myCode, setMyCode] = useState("");
  const [otherCode, setOtherCode] = useState("");
  const [data, setData] = useState<BenchmarkResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Detailed Results Stanja
  const [singleCode, setSingleCode] = useState("");
  const [singleCodeLoading, setSingleCodeLoading] = useState(false);

  // Stanja polja za 3 filtera
  const [mobilityStatus, setMobilityStatus] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [initialGroupData, setInitialGroupData] = useState<GroupData | null>(null);
  const [filterLoading, setFilterLoading] = useState(false);

  // Čipovi primenjenih filtera
  const [appliedFilters, setAppliedFilters] = useState<FilterChip[]>([]);

  // Podaci za Filtriranu Grupu (0 - 5 skala za sve kategorije)
  const [groupData, setGroupData] = useState<GroupData>({
    averageScore: 0,
    categories: {},
    habits: {},
  });

  // Podaci za Uneseni Kod Korisnika (0 - 5 skala za sve kategorije)
  const [userData, setUserData] = useState<UserData>({
    ecoScore: 0,
    categoryScores: {},
  });

  const API_HOST = import.meta.env.VITE_API_HOST || "";

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const response = await fetch(`${API_HOST}/api/benchmark/overview`);
        if (!response.ok) throw new Error("Unable to load benchmark data.");
        const result = await response.json();
        setGroupData(result.groupData);
        setInitialGroupData(result.groupData);
        setCountryOptions(result.countries || []);
      } catch (error) {
        toast.error("Unable to load benchmark", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    };

    void loadOverview();
  }, [API_HOST]);

  // Pretraga pojedinačnog koda
  const handleShowSingleResults = async () => {
    if (!singleCode.trim()) {
      toast.error("Invalid input", { description: "Please enter a valid single-code." });
      return;
    }

    setSingleCodeLoading(true);
    try {
      const response = await fetch(
        `${API_HOST}/api/benchmark/single/${encodeURIComponent(singleCode.trim())}`,
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Code not found or invalid.");

      setUserData({
        ecoScore: result.ecoScore,
        categoryScores: result.categoryScores,
        badge: result.badge,
        percentile: result.percentile,
      });

      toast.success("Results loaded", { description: `Showing details for code: ${singleCode}` });
    } catch (error) {
      toast.error("Unable to load results", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSingleCodeLoading(false);
    }
  };

  // Primena filtera
  const handleApplyFilters = async () => {
    if (!userData.badge) return;
    const newFilters: FilterChip[] = [];

    if (selectedCountry) {
      newFilters.push({ id: "country", label: selectedCountry });
    }

    if (mobilityStatus === "Yes") {
      newFilters.push({ id: "mobility", label: "Student mobility" });
    } else if (mobilityStatus === "No") {
      newFilters.push({ id: "mobility", label: "No mobility" });
    }

    if (selectedInstitution) {
      newFilters.push({ id: "institution", label: selectedInstitution });
    }

    setFilterLoading(true);
    try {
      const response = await fetch(`${API_HOST}/api/benchmark/filter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobilityStatus: mobilityStatus || undefined,
          country: selectedCountry || undefined,
          institution: selectedInstitution || undefined,
          benchmarkCode: singleCode.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to apply filters.");
      setGroupData(result);
      setUserData((previous) => ({
        ...previous,
        percentile:
          typeof result.userPercentile === "number"
            ? result.userPercentile
            : previous.percentile,
      }));
      setAppliedFilters(newFilters);
      toast.success("Filters applied", { description: "Updated average score for the selected group." });
    } catch (error) {
      toast.error("Unable to apply filters", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setFilterLoading(false);
    }
  };

  const removeFilter = (idToRemove: FilterChip["id"]) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== idToRemove));

    if (idToRemove === "mobility") setMobilityStatus("");
    if (idToRemove === "country") {
      setSelectedCountry("");
      setSelectedInstitution("");
    }
    if (idToRemove === "institution") setSelectedInstitution("");
  };

  const clearAllFilters = () => {
    setAppliedFilters([]);
    setMobilityStatus("");
    setSelectedCountry("");
    setSelectedInstitution("");
    if (initialGroupData) setGroupData(initialGroupData);
    if (userData.badge) {
      void fetch(`${API_HOST}/api/benchmark/filter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ benchmarkCode: singleCode.trim() }),
      })
        .then(async (response) => {
          if (!response.ok) throw new Error("Unable to restore benchmark percentile.");
          return response.json();
        })
        .then((result) => {
          if (typeof result.userPercentile === "number") {
            setUserData((previous) => ({
              ...previous,
              percentile: result.userPercentile,
            }));
          }
        })
        .catch((error) => {
          toast.error("Unable to restore benchmark percentile", {
            description: error instanceof Error ? error.message : "Please try again.",
          });
        });
    }
  };

  // Benchmark 1 on 1 sa prijateljem
  const handleCompare = async () => {
    if (!myCode || !otherCode) {
      toast.error("Invalid input", {
        description: "Please enter both benchmark codes.",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    setData(null);

    try {
      const response = await fetch(`${API_HOST}/api/benchmark/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          myBenchmarkCode: myCode,
          otherBenchmarkCode: otherCode,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "There was an error processing your request. Please try again."
        );
      }

      setData(result);
    } catch (error) {
      console.error("Benchmark error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Connection error. Please try again.";

      toast.error("Unsuccessful benchmark", {
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const radarData = useMemo(() => {
    const categories = ["Awareness", "Attitudes", "Habits", "Barriers"];
    return categories.map((cat) => ({
      axis: cat,
      me: data ? data.myData.categoryScores[cat] || 0 : 0,
      mate: data ? data.otherData.categoryScores[cat] || 0 : 0,
    }));
  }, [data]);

  const habitsRadarData = useMemo(() => {
    const subCats = [
      { key: "Travel", label: "Travel" },
      { key: "Living", label: "Living and accommodation" },
      { key: "Consumption", label: "Buying and consumption" },
      { key: "Digital", label: "Digital habits" },
      { key: "Engagement", label: "Community engagement" },
    ];
    return subCats.map((sub) => ({
      axis: sub.label,
      me: data ? data.myData.categoryScores[sub.key] || 0 : 0,
      mate: data ? data.otherData.categoryScores[sub.key] || 0 : 0,
    }));
  }, [data]);

  const groupProfile = getGreenProfile(groupData.averageScore);
  const selectedCountryOption = countryOptions.find(
    (option) => option.country === selectedCountry,
  );

  return (
    <main className="min-h-screen bg-background font-sans">
      <Navigation />

      {/* HEADER SEKCIJA */}
      <section className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-10 sm:px-10 lg:px-[160px]">
          <div className="flex flex-col gap-3">
            <h1 className="font-gilroy text-[36px] font-bold tracking-tight text-[#233662] sm:text-[42px] md:text-[48px]">
              Benchmark
            </h1>
            <p className="font-gilroy text-[16px] font-medium text-[#444444] sm:text-[18px] md:text-[20px]">
              Compare your results with others via a unique code, sent by you through email.
            </p>
          </div>

          <img
            src={sumosWordmark}
            alt="SuMoS"
            className="hidden h-12 w-auto object-contain md:block"
          />
        </div>
      </section>

      {/* DETAILED RESULTS SEKCIJA */}
      <section className="border-b border-[#e5e7eb] bg-white py-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 sm:px-10 lg:px-[160px]">
          
          {/* Naslov i Pretraga po Kod-u */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <h2 className="font-gilroy text-[32px] font-bold text-[#233662]">
              View detailed results
            </h2>

            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
              <div className="flex flex-col">
                <label className="text-[12px] font-semibold text-[#444444]">
                  Your single-code:
                </label>
                <input
                  type="text"
                  value={singleCode}
                  onChange={(e) => setSingleCode(e.target.value)}
                  placeholder="Enter your code"
                  className="h-10 w-[240px] rounded-[6px] border border-[#d1d5db] bg-white px-3 text-[14px] text-[#233662] placeholder-[#a0a4b8] focus:border-[#61A348] focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleShowSingleResults}
                disabled={singleCodeLoading}
                className="mt-4 h-10 rounded-[6px] bg-[#61A348] px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#528a3d] disabled:opacity-50 sm:mt-4"
              >
                {singleCodeLoading ? "Loading..." : "Show results"}
              </button>
            </div>
          </div>

          {/* Traka sa Filterima i Čipovima */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e5e7eb] pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-[18px] font-bold text-[#233662]">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {appliedFilters.map((filter) => (
                  <span
                    key={filter.id}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#F1F5F9] px-3 py-1.5 text-[13px] font-medium text-[#233662]"
                  >
                    {filter.label}
                    <button
                      onClick={() => removeFilter(filter.id)}
                      className="text-[#94A3B8] transition-colors hover:text-[#233662]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {appliedFilters.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[13px] font-semibold text-[#233662] underline underline-offset-2 transition-colors hover:text-[#61A348]"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* PRVI RED: Padajući meniji, Green score (Prosek grupe) i Eco Profile (Uneti kod) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
            
            {/* Leva kolona: 3 Padajuća menija i Apply dugme */}
            <div className="flex flex-col justify-between gap-4 lg:col-span-3">
              <div className="flex flex-col gap-4">
                {/* 1. Mobility status */}
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-semibold text-[#444444]">
                    Mobility status
                  </label>
                  <div className="relative">
                    <select
                      value={mobilityStatus}
                      onChange={(e) => setMobilityStatus(e.target.value)}
                      className="h-10 w-full appearance-none rounded-[6px] border border-[#d1d5db] bg-white px-3 text-[14px] text-[#233662] focus:border-[#61A348] focus:outline-none"
                    >
                      <option value="">Select status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-[#94A3B8]" />
                  </div>
                </div>

                {/* 2. Country */}
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-semibold text-[#444444]">
                    Country
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e.target.value);
                        setSelectedInstitution("");
                      }}
                      className="h-10 w-full appearance-none rounded-[6px] border border-[#d1d5db] bg-white px-3 text-[14px] text-[#233662] focus:border-[#61A348] focus:outline-none"
                    >
                      <option value="">Select country by name</option>
                      {countryOptions.map((option) => (
                        <option key={option.country} value={option.country}>
                          {option.country}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-[#94A3B8]" />
                  </div>
                </div>

                {/* 3. Institution */}
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-semibold text-[#444444]">
                    Institution
                  </label>
                  <div className="relative">
                    <select
                      value={selectedInstitution}
                      onChange={(e) => setSelectedInstitution(e.target.value)}
                      disabled={!selectedCountry}
                      className="h-10 w-full appearance-none rounded-[6px] border border-[#d1d5db] bg-white px-3 text-[14px] text-[#233662] focus:border-[#61A348] focus:outline-none"
                    >
                      <option value="">Select institution by name</option>
                      {(selectedCountryOption?.institutions || []).map((institution) => (
                        <option key={institution} value={institution}>
                          {institution}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-[#94A3B8]" />
                  </div>
                </div>
              </div>

              {/* Apply dugme */}
              <button
                type="button"
                onClick={handleApplyFilters}
                disabled={!userData.badge || filterLoading}
                className="mt-2 h-10 w-[140px] rounded-[6px] bg-[#61A348] text-[14px] font-semibold text-white transition-colors hover:bg-[#528a3d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {filterLoading ? "Loading..." : "Apply"}
              </button>
            </div>

            {/* Srednja kolona: Green Score Polukrug (PROSEK FILTRIRANIH REZULTATA) */}
            <div className="flex flex-col items-center justify-between rounded-[16px] border border-[#e5e7eb] bg-white p-6 shadow-sm lg:col-span-4">
              <h3 className="text-[20px] font-bold text-[#233662]">Green score</h3>
              
              <div className="my-4 flex flex-col items-center">
                <Gauge value={groupData.averageScore} color="#61A348" />
              </div>

              <div className="text-center">
                <p className="text-[14px] text-[#64748B]">The overall green score is</p>
                <p className="text-[16px] font-bold text-[#61A348]">{groupProfile}</p>
              </div>
            </div>

            {/* Desna kolona: Bedž unetog koda */}
            <div className="flex flex-col justify-center rounded-[16px] border border-[#e5e7eb] bg-white p-8 shadow-sm lg:col-span-5">
              <h3 className="mb-4 text-[28px] font-bold text-[#61A348]">
                {userData.badge || "Your Badge"}
              </h3>
              {userData.badge ? (
                <p className="text-[16px] leading-relaxed font-semibold text-[#233662]">
                  Your overall score is{" "}
                  <span className="font-bold text-[#61A348]">
                    {userData.ecoScore.toFixed(2).replace(".", ",")}
                  </span>
                  .{" "}
                  {(userData.percentile ?? 0) < 50 ? (
                    <>Your habits are clearly improving but you can do even better to match these filters, keep up the good work!</>
                  ) : (
                    <>
                      You are better than{" "}
                      <span className="font-bold text-[#61A348]">
                        {userData.percentile}%
                      </span>{" "}
                      of other respondents according to the selected filter.
                    </>
                  )}
                </p>
              ) : (
                <p className="text-[16px] leading-relaxed font-semibold text-[#233662]">
                  Enter your code and click “Show results” to see your badge.
                </p>
              )}
            </div>

          </div>

          {/* DRUGI RED: DVA UPOREDNA GRAFIKONA (Sada oba na 0 - 5 skali) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-2">
            {/* Grafik 1: Sustainability categories (Filtered avg vs User score) */}
            <DetailedCategoryComparison
              filterScores={groupData.categories}
              userScores={userData.badge ? userData.categoryScores : {}}
            />

            {/* Grafik 2: Sustainable habits (Filtered avg vs User score, 0 - 5 scale) */}
            <DetailedHabitsComparison
              filterScores={groupData.habits}
              userScores={userData.badge ? userData.categoryScores : {}}
            />
          </div>

        </div>
      </section>

      {/* BENCHMARK WITH A FRIEND SEKCIJA (NETAKNUTA) */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 pb-20 pt-12 sm:px-10 lg:px-[160px]">
          <div className="flex flex-col gap-4">
            <h2 className="text-[28px] font-semibold text-[#233662] md:text-[32px]">
              Benchmark with a friend or yourself
            </h2>
            <p className="text-[18px] text-[#444] md:text-[20px]">
              This option allows you to{" "}
              <span className="font-semibold">make 1 on 1 benchmark</span> with other respondents, using their code.
            </p>
          </div>

          <div className="h-px w-full bg-[#e5e7eb]" />

          {/* PRVI RED: Polja za kodove i Gauges */}
          <div className="flex flex-col gap-6 xl:flex-row xl:items-stretch">
            {/* Form card */}
            <div className="flex w-full shrink-0 flex-col justify-between gap-6 rounded-[12px] bg-white px-4 py-6 shadow-[0_0_20px_0_rgba(94,98,120,0.08)] xl:w-[280px]">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <label className="px-2 text-[14px] font-semibold text-[#444]">Your code</label>
                  <input
                    type="text"
                    value={myCode}
                    onChange={(e) => setMyCode(e.target.value)}
                    placeholder="Enter your code"
                    className="h-10 w-full rounded-[4px] border border-[#bfbfbf] bg-white px-3 text-[16px] focus:border-[#518efa] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="px-2 text-[14px] font-semibold text-[#444]">Another code</label>
                  <input
                    type="text"
                    value={otherCode}
                    onChange={(e) => setOtherCode(e.target.value)}
                    placeholder="Enter another code"
                    className="h-10 w-full rounded-[4px] border border-[#bfbfbf] bg-white px-3 text-[16px] focus:border-[#518efa] focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={handleCompare}
                disabled={loading}
                className="h-10 w-full rounded-[8px] bg-[#64a550] text-[16px] font-medium text-white transition-colors hover:bg-[#5a9347] disabled:opacity-50"
              >
                {loading ? "Comparing..." : "Compare"}
              </button>
            </div>

            {/* Student green score card */}
            <div className="flex flex-1 flex-col gap-8 rounded-[12px] bg-white p-6 shadow-[0_0_10px_0_rgba(94,98,120,0.08)]">
              <div className="flex items-center justify-between">
                <h3 className="text-[24px] font-semibold text-[#233662]">
                  Student green score
                </h3>
                <span className="grid h-6 w-6 place-items-center rounded-full border border-[#bfbfbf] text-[12px] text-[#bfbfbf]">
                  i
                </span>
              </div>
              <div className="flex flex-col items-center justify-around gap-6 md:flex-row">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-center">
                    <div className="text-[20px] font-semibold text-[#64a550]">Your green score</div>
                    <div className="text-[18px] text-[#444]">Overall</div>
                  </div>
                  <Gauge value={data?.myData.ecoScore || 0} color="#64A550" />
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="text-center">
                    <div className="text-[20px] font-semibold text-[#518efa]">
                      Another green score
                    </div>
                    <div className="text-[18px] text-[#444]">Overall</div>
                  </div>
                  <Gauge value={data?.otherData.ecoScore || 0} color="#518EFA" />
                </div>
              </div>
            </div>
          </div>

          {/* DRUGI RED: Radari */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
            {/* Survey Results Radar */}
            <div className="flex flex-1 flex-col items-center gap-6 rounded-[12px] bg-white py-6 shadow-[0_0_10px_0_rgba(94,98,120,0.16)]">
              <h3 className="w-full px-6 text-[24px] font-semibold text-[#233662]">
                Survey results
              </h3>
              <div className="h-px w-full bg-[#e5e7eb]" />
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius={100}>
                    <PolarGrid stroke="#bfbfbf" />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: "#444", fontSize: 13 }} />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 5]}
                      tick={{ fill: "#bfbfbf", fontSize: 10 }}
                      stroke="transparent"
                    />
                    <Radar
                      name="Another"
                      dataKey="mate"
                      stroke="#518EFA"
                      strokeWidth={3}
                      fill="#518EFA"
                      fillOpacity={0.2}
                    />
                    <Radar
                      name="Me"
                      dataKey="me"
                      stroke="#64A550"
                      strokeWidth={3}
                      fill="#64A550"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-5 bg-[#64A550]" />
                  <span className="text-[14px] font-semibold text-[#444]">Me</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-5 bg-[#518EFA]" />
                  <span className="text-[14px] font-semibold text-[#444]">Another</span>
                </div>
              </div>
            </div>

            {/* Habits Radar */}
            <div className="flex flex-1 flex-col items-center gap-6 rounded-[12px] bg-white py-6 shadow-[0_0_10px_0_rgba(94,98,120,0.16)]">
              <h3 className="w-full px-6 text-[24px] font-semibold text-[#233662]">
                Habits — subsection averages
              </h3>
              <div className="h-px w-full bg-[#e5e7eb]" />
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={habitsRadarData} outerRadius={100}>
                    <PolarGrid stroke="#bfbfbf" />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: "#444", fontSize: 13 }} />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 5]}
                      tick={{ fill: "#bfbfbf", fontSize: 10 }}
                      stroke="transparent"
                    />
                    <Radar
                      name="Another"
                      dataKey="mate"
                      stroke="#518EFA"
                      strokeWidth={3}
                      fill="#518EFA"
                      fillOpacity={0.2}
                    />
                    <Radar
                      name="Me"
                      dataKey="me"
                      stroke="#64A550"
                      strokeWidth={3}
                      fill="#64A550"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-5 bg-[#64A550]" />
                  <span className="text-[14px] font-semibold text-[#444]">Me</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-5 bg-[#518EFA]" />
                  <span className="text-[14px] font-semibold text-[#444]">Another</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default BenchmarkPage;