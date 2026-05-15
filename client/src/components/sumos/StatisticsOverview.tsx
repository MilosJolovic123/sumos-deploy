import { useEffect, useState } from "react";
import axios from "axios";
import { Info } from "lucide-react";
import iconGlobe from "@/assets/icon-globe.gif";
import iconChecklistStat from "@/assets/icon-checklist-stat.svg";
import iconTimeStat from "@/assets/icon-time-stat.svg";

const API_HOST = import.meta.env.VITE_API_HOST || "";

export interface Averages {
  ecoScore: number;
  awareness: number;
  attitudes: number;
  habits: number;
  barriers: number;
}

export interface DashboardData {
  totalSurveys: number;
  mostPopularBadge: string;
  averages: Averages;
}

/** Hook koji povlači statistiku iz baze. Koristi ga i komponenta i Statistics stranica. */
export function useDashboardStats() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await axios.get(`${API_HOST}/api/statistics/get-stats`);
        if (mounted) setData(response.data);
      } catch (error) {
        console.error("Greška pri učitavanju statistike:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { data, isLoading };
}

/* ---------- Footprint bar chart ---------- */
function FootprintChart({ averages }: { averages?: Averages }) {
  const footprintBars = [
    { label: "Awareness", value: averages?.awareness || 0, color: "#518efa" },
    { label: "Attitudes", value: averages?.attitudes || 0, color: "#518efa" },
    { label: "Habits", value: averages?.habits || 0, color: "#97bcff" },
    { label: "Barriers", value: averages?.barriers || 0, color: "#79a7f8" },
  ];
  const max = 5;
  const ticks = [5, 4, 3, 2, 1, 0];

  return (
    <div className="flex h-[288px] w-full min-w-0 flex-col gap-8 rounded-[12px] bg-white px-4 py-8 shadow-[0_0_20px_rgba(94,98,120,0.08)] sm:px-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[20px] font-semibold text-[#233662]">Green scores by category</h3>
        {/* <Info className="h-6 w-6 text-[#444444]" /> */}
      </div>
      <div className="flex flex-1 gap-3">
        <div className="flex flex-col justify-between text-right text-[12px] text-[#444444]">
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-0 flex flex-col justify-between">
            {ticks.map((t) => (
              <div key={t} className="h-px w-full bg-[#e5e7eb]" />
            ))}
          </div>
          <div className="relative flex h-full items-end gap-3 px-2 sm:gap-12 sm:px-8">
            {footprintBars.map((b) => (
              <div
                key={b.label}
                className="flex h-full items-center justify-end flex-1 flex-col items-center"
              >
                <div
                  className="w-full max-w-[100px] transition-all duration-1000"
                  style={{ height: `${(b.value / max) * 100}%`, backgroundColor: b.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3 pl-9 pr-2 sm:gap-12">
        {footprintBars.map((b) => (
          <span key={b.label} className="flex-1 text-center text-[12px] text-[#444444]">
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Green score gauge ---------- */
function GreenScore({ ecoScore }: { ecoScore?: number }) {
  const value = Math.round((ecoScore || 0) * 10) / 10 || 0;
  const max = 5;
  const pct = value / max;
  const r = 90;
  const circ = Math.PI * r;
  const dash = circ * pct;

  const getScoreText = (score: number) => {
    if (score >= 4.2) return "Excellent";
    if (score >= 3.4) return "Very Good";
    if (score >= 2.6) return "Good";
    if (score >= 1.8) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="flex h-[288px] w-full max-w-[360px] mx-auto flex-col items-center justify-between rounded-[12px] bg-white px-6 pb-6 pt-8 shadow-[0_0_20px_rgba(94,98,120,0.08)] lg:mx-0 lg:w-[360px] lg:shrink-0">
      <h3 className="text-[20px] font-semibold text-[#64a550]">Green score</h3>
      <div className="flex flex-col items-center">
        <div className="relative h-[110px] w-[212px]">
          <svg viewBox="0 0 212 110" className="h-full w-full">
            <path
              d="M16,106 A90,90 0 0 1 196,106"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="30"
              strokeLinecap="butt"
            />
            <path
              d="M16,106 A90,90 0 0 1 196,106"
              fill="none"
              stroke="#64A550"
              strokeWidth="30"
              strokeLinecap="butt"
              strokeDasharray={`${dash} ${circ}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-x-0 bottom-1 text-center text-[40px] font-bold leading-none text-[#233662]">
            {value.toString().replace(".", ",")}
          </div>
        </div>
        <div className="mt-1 flex w-[212px] justify-between px-2 text-[12px] text-[#bfbfbf]">
          <span>0</span>
          <span>5</span>
        </div>
      </div>
      <p className="text-center text-[16px] text-[#444444]">
        The overall green score is
        <br />
        <span className="font-semibold">{getScoreText(value)}</span>
      </p>
    </div>
  );
}

interface StatisticsOverviewProps {
  /** Opcioni već učitani podaci. Ako nije prosleđeno, komponenta sama povlači sa API-ja. */
  data?: DashboardData | null;
  /** Opcioni loading flag kada se podaci dobavljaju spolja. */
  isLoading?: boolean;
}

/**
 * Statistics overview sekcija (FootprintChart + GreenScore + 3 stats kartice).
 * Može se koristiti samostalno (sama dovlači podatke) ili sa eksternim podacima.
 */
export function StatisticsOverview({ data, isLoading }: StatisticsOverviewProps = {}) {
  const internal = useDashboardStats();
  // Ako roditelj prosledi data, koristi ga; u suprotnom koristi interni fetch.
  const dashboardData = data !== undefined ? data : internal.data;
  const loading = isLoading !== undefined ? isLoading : internal.isLoading;

  const statsCards = [
    {
      src: iconChecklistStat,
      label: "Number of filled surveys",
      value: dashboardData?.totalSurveys ?? "0",
      color: "text-[#518efa]",
    },
    {
      src: iconTimeStat,
      label: "Average completion time",
      value: "10m 42s",
      color: "text-[#b6d989]",
    },
    {
      src: iconGlobe,
      label: "Popular badge",
      value: loading ? "Loading..." : dashboardData?.mostPopularBadge || "—",
      color: "text-[#64a550]",
    },
  ];

  return (
    <section className="bg-white pt-8 pb-16">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 sm:px-10 lg:px-[160px]">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_360px]">
          <FootprintChart averages={dashboardData?.averages} />
          <GreenScore ecoScore={dashboardData?.averages?.ecoScore} />
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {statsCards.map((s) => (
            <div
              key={s.label}
              className="flex w-full items-center gap-4 rounded-lg border border-[#e5e7eb] bg-white p-6"
            >
              <img src={s.src} alt="" className="h-14 w-14 object-contain" />
              <div className="flex flex-col gap-4">
                <div className="text-[16px] font-semibold uppercase text-[#444444]">{s.label}</div>
                <div className={`text-[24px] font-bold ${s.color}`}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatisticsOverview;