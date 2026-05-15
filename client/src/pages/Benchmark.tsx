import { useState, useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
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
}

interface BenchmarkResponse {
  myData: UserData;
  otherData: UserData;
}

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

function BenchmarkPage() {
  const [myCode, setMyCode] = useState("");
  const [otherCode, setOtherCode] = useState("");
  const [data, setData] = useState<BenchmarkResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const API_HOST = import.meta.env.VITE_API_HOST || "";

  const handleCompare = async () => {
    if (!myCode || !otherCode) {
      toast.error("Invalid input", {
        description: "Please enter both benchmark codes.",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    setData(null); // Čistimo prethodne rezultate dok se učitavaju novi

    try {
      const response = await fetch(`${API_HOST}/api/benchmark/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          myBenchmarkCode: myCode,
          otherBenchmarkCode: otherCode,
        }),
      });

      // Uvek prvo parsiramo odgovor (bilo da je uspeh ili NestJS greška)
      const result = await response.json();

      // Ručno hvatamo HTTP greške (400, 404, 500)
      if (!response.ok) {
        // result.message je tekst koji šalje tvoj NestJS
        throw new Error(
          result.message || "THere was an error processing your request. Please try again.",
        );
      }

      // Ako je response.ok true, setujemo podatke
      setData(result);
    } catch (error) {
      console.error("Benchmark error:", error);

      // Proveravamo da li je to stvarna greška i izvlačimo poruku,
      // u suprotnom bacamo generički string.
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

  // --- Priprema podataka za Radare (Prazni ako nema podataka) ---
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

  return (
    <main className="min-h-screen bg-background font-sans">
      <Navigation />

      <section className="border-b border-[#bfbfbf] bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-10 sm:px-10 lg:px-[160px]">
          <h1 className="text-[40px] font-bold text-[#233662] md:text-[48px]">Benchmark</h1>
          <img src={sumosWordmark} alt="SuMoS" className="hidden h-12 w-auto md:block" />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 pb-20 pt-8 sm:px-10 lg:px-[160px]">
          <div className="flex flex-col gap-4">
            <h2 className="text-[28px] font-semibold text-[#233662] md:text-[32px]">
              Benchmark with a friend or yourself
            </h2>
            <p className="text-[18px] text-[#444] md:text-[20px]">
              This option allows user to{" "}
              <span className="font-semibold">make 1 to 1 benchmark</span> with other respondents.
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

            {/* Ecological footprint card */}
            <div className="flex flex-1 flex-col gap-8 rounded-[12px] bg-white p-6 shadow-[0_0_10px_0_rgba(94,98,120,0.08)]">
              <div className="flex items-center justify-between">
                <h3 className="text-[24px] font-semibold text-[#233662]">
                  Students ecological footprint
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
                      fill="#518EFA"
                      fillOpacity={0.5}
                    />
                    <Radar
                      name="Me"
                      dataKey="me"
                      stroke="#64A550"
                      fill="#64A550"
                      fillOpacity={0.5}
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
                      fill="#518EFA"
                      fillOpacity={0.5}
                    />
                    <Radar
                      name="Me"
                      dataKey="me"
                      stroke="#64A550"
                      fill="#64A550"
                      fillOpacity={0.5}
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
