import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { Info, ArrowRight } from "lucide-react";
import iconGlobe from "@/assets/icon-globe.gif";
import iconChecklistStat from "@/assets/icon-checklist-stat.svg";
import iconTimeStat from "@/assets/icon-time-stat.svg";
import { AverageCompletionTime } from "@/components/sumos/AverageCompletionTime";
import ecoScoreLevelsImg from "@/assets/modal1.png";

const API_HOST = import.meta.env.VITE_API_HOST || "";

export interface Averages {
  ecoScore: number;
  awareness: number;
  attitudes: number;
  habits: number;
  barriers: number;
  travel: number;
  living: number;
  consumption: number;
  digital: number;
  engagement: number;
}

export interface DashboardData {
  totalSurveys: number;
  mostPopularBadge: string;
  averageCompletionTimeMs?: number;
  averageCompletionTimeSeconds?: number;
  averages: Averages;
  profilePercentages: Record<string, number>;
}

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

/* ---------- Footprint bar chart (Green profiles) ---------- */
function FootprintChart({
  profilePercentages,
}: {
  averages?: Averages;
  profilePercentages?: Record<string, number>;
}) {
  const [showModal, setShowModal] = useState(false);

  const profileBars = [
    { label: "Eco Beginner", value: profilePercentages?.ecoBeginner || 0, color: "#414C62" },
    { label: "Eco Explorer", value: profilePercentages?.ecoExplorer || 0, color: "#4C8CFF" },
    { label: "Eco Learner", value: profilePercentages?.ecoLearner || 0, color: "#233863" },
    { label: "Eco Achiever", value: profilePercentages?.ecoAchiever || 0, color: "#1D5906" },
    { label: "Eco Champion", value: profilePercentages?.ecoChampion || 0, color: "#61A348" },
  ];

  const ticks = [100, 80, 60, 40, 20, 0];

  return (
    <div className="flex h-[290px] w-full min-w-0 flex-col justify-between rounded-[12px] bg-white p-6 shadow-[0_0_20px_rgba(94,98,120,0.08)]">
      
      {/* Naslov sa Info ikonicom i responzivnim popover modalom */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[20px] font-bold text-[#1E2B4D]">Green profiles</h3>
        
        <div className="group relative flex items-center">
          <Info 
            onClick={() => setShowModal((prev) => !prev)}
            className="h-5 w-5 cursor-pointer text-[#A0A4B8] transition-colors hover:text-[#1E2B4D]" 
          />
          
          <div 
            onClick={() => setShowModal(false)}
            className={`absolute right-0 bottom-8 z-50 w-[300px] sm:w-[480px] rounded-[16px] bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-200 border border-[#E5E7EB] ${
              showModal 
                ? "pointer-events-auto opacity-100" 
                : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
            }`}
          >
            <img 
              src={ecoScoreLevelsImg} 
              alt="Eco Score Levels" 
              className="h-auto w-full object-contain rounded-[12px]" 
            />
            {/* Trougao na dnu */}
            <div className="absolute -bottom-2 right-2.5 h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.05)]" />
          </div>
        </div>
      </div>

      {/* Grafikon */}
      <div className="flex flex-1 gap-3 pt-3 pb-5">
        
        {/* Y-Osa */}
        <div className="relative flex w-8 flex-col justify-between text-right text-[11px] font-medium text-[#B5B5C3]">
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

          <div className="relative flex h-full items-end justify-between gap-1 px-1 sm:gap-4 sm:px-6">
            {profileBars.map((b) => (
              <div
                key={b.label}
                className="relative flex h-full flex-1 min-w-0 flex-col items-center justify-end"
              >
                <span className="mb-1 text-[11px] font-bold text-[#1E2B4D] sm:text-[13px]">
                  {b.value}%
                </span>

                <div
                  className="z-10 w-full max-w-[48px] rounded-t-[4px] transition-all duration-1000"
                  style={{
                    height: `${b.value}%`,
                    backgroundColor: b.color,
                  }}
                />

                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-full max-w-[100px] flex items-center justify-center">
                  <span className="font-gilroy font-normal text-center text-[10px] sm:text-[12px] leading-tight text-[#464E5F] break-words">
                    {b.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}

/* ---------- Green score gauge ---------- */
function GreenScore({ ecoScore }: { ecoScore?: number }) {
  const [showModal, setShowModal] = useState(false);

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
    <div className="relative mx-auto flex h-[290px] w-full max-w-[360px] flex-col items-center justify-between rounded-[12px] bg-white px-6 pb-6 pt-6 shadow-[0_0_20px_rgba(94,98,120,0.08)] lg:mx-0 lg:w-[360px] lg:shrink-0">
      
      {/* Header sa naslovom i responzivnom Info ikonicom */}
      <div className="flex w-full items-center justify-between">
        <h3 className="text-[20px] font-semibold text-[#64a550]">Green score</h3>

        <div className="group relative flex items-center">
          <Info 
            onClick={() => setShowModal((prev) => !prev)}
            className="h-5 w-5 cursor-pointer text-[#A0A4B8] transition-colors hover:text-[#64a550]" 
          />

          <div 
            onClick={() => setShowModal(false)}
            className={`absolute right-0 bottom-8 z-50 w-[240px] rounded-[10px] bg-white p-4 text-center text-[12px] font-normal leading-relaxed text-[#5E6278] shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-200 border border-[#E5E7EB] ${
              showModal 
                ? "pointer-events-auto opacity-100" 
                : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
            }`}
          >
            Green Score is calculated from individual survey responses and reflects individual environmental awareness, attitudes, and sustainable habits.
            <div className="absolute -bottom-2 right-2.5 h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.05)]" />
          </div>
        </div>
      </div>

      {/* Polukružni Gauge */}
      <div className="mt-1 flex flex-col items-center">
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
  data?: DashboardData | null;
  isLoading?: boolean;
  showStatisticsLink?: boolean;
}

export function StatisticsOverview({
  data,
  isLoading,
  showStatisticsLink = true,
}: StatisticsOverviewProps = {}) {
  const internal = useDashboardStats();
  const dashboardData = data !== undefined ? data : internal.data;
  const loading = isLoading !== undefined ? isLoading : internal.isLoading;

  const statsCards: Array<{
    src: string;
    label: string;
    value: ReactNode;
    color: string;
  }> = [
    {
      src: iconChecklistStat,
      label: "Number of filled surveys",
      value: dashboardData?.totalSurveys ?? "0",
      color: "text-[#444444]",
    },
    {
      src: iconTimeStat,
      label: "Average completion time",
      value: (
        <AverageCompletionTime
          valueMs={dashboardData?.averageCompletionTimeMs}
          loading={loading}
          className="text-[#444444]"
        />
      ),
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
    <section className="bg-[#F5F5F5] pb-16 pt-12">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 sm:px-10 lg:px-[160px]">
        
        <div className="flex items-center justify-between">
          <h2 className="text-[36px] font-bold text-[#233662] md:text-[40px]">
            Green statistics
          </h2>
          {showStatisticsLink && (
            <a
              href="/statistics"
              className="inline-flex items-center gap-1.5 text-[16px] font-medium text-[#518efa] transition-colors hover:text-[#233662]"
            >
              Go to statistics <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_360px]">
          <FootprintChart
            averages={dashboardData?.averages}
            profilePercentages={dashboardData?.profilePercentages}
          />
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