import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Navigation } from "@/components/sumos/Navigation";
import { Footer } from "@/components/sumos/Footer";
import sumosWordmark from "@/assets/sumos-wordmark.png";
import {
  StatisticsOverview,
  useDashboardStats,
  type Averages,
} from "@/components/sumos/StatisticsOverview";

interface ChartProps {
  averages?: Averages;
}

/* ---------- Sustainable behaviour bar chart ---------- */


// // Tip za Averages koji se prosleđuje komponenti
// export interface Averages {
//   awareness?: number;
//   attitudes?: number;
//   habits?: number;
//   barriers?: number;
//   travel?: number;
//   living?: number;
//   food?: number;
//   digital?: number;
//   community?: number;
// }

// interface ChartProps {
//   averages?: Averages;
// }

/* ---------- 1. Sustainability Categories ---------- */
export function SustainableBehaviour({ averages }: ChartProps) {
  // Svi stubići su ujednačene zelene boje sa slike (#61A348)
  const categoryBars = [
    { label: "Awareness", value: averages?.awareness || 3.2, color: "#61A348" },
    { label: "Attitudes", value: averages?.attitudes || 3.2, color: "#61A348" },
    { label: "Habits", value: averages?.habits || 1.2, color: "#61A348" },
    { label: "Barriers", value: averages?.barriers || 2.6, color: "#61A348" },
  ];

  const max = 5;
  const ticks = [5, 4, 3, 2, 1, 0];

  return (
    <div className="flex h-[320px] w-full min-w-0 flex-1 flex-col justify-between rounded-[12px] bg-white p-6 shadow-[0_0_20px_rgba(94,98,120,0.08)]">
      {/* Naslov */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[20px] font-bold text-[#1E2B4D]">
          Sustainability categories
        </h3>
        <div />
      </div>

      {/* Grafikon */}
      <div className="flex flex-1 gap-3 pt-3 pb-5">
        {/* Y-Osa (0-5) u ravni sa linijama */}
        <div className="relative flex w-6 flex-col justify-between text-right text-[11px] font-medium text-[#B5B5C3]">
          {ticks.map((t) => (
            <span key={t} className="transform -translate-y-1/2 leading-none">
              {t}
            </span>
          ))}
        </div>

        {/* Mreža i stubići */}
        <div className="relative flex flex-1 flex-col">
          {/* Horizontalne linije mreže */}
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between">
            {ticks.map((t) => (
              <div key={t} className="h-px w-full bg-[#F1F1F4]" />
            ))}
          </div>

          {/* Stubići */}
          <div className="relative flex h-full items-end justify-between px-4 sm:px-10">
            {categoryBars.map((b) => (
              <div
                key={b.label}
                className="relative flex h-full w-[70px] flex-col items-center justify-end"
              >
                <div
                  className="z-10 w-[42px] rounded-t-[4px] transition-all duration-1000"
                  style={{
                    height: `${(b.value / max) * 100}%`,
                    backgroundColor: b.color,
                  }}
                />

                <div className="absolute top-full mt-0 left-1/2 -translate-x-1/2 w-[90px] h-10 flex items-center justify-center">
  <span className="font-gilroy font-normal text-center text-[12px] leading-tight text-[#464E5F]">
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

/* ---------- 2. Sustainable Habits ---------- */
export function SustainableHabits({ averages }: ChartProps) {
  // Plavi stubići sa slike (#4C8CFF), skala od 0 do 100
  const habitBars = [
    { label: "Travel", value: 66, //averages?.travel || 66
       color: "#4C8CFF" },
    {
      label: "Living and accomodation",
      value:  66,// averages?.living || 66
      color: "#4C8CFF",
    },
    {
      label: "Food and consumption",
      value: 26, //averages?.food || 26
      color: "#4C8CFF",
    },
    {
      label: "Digital habits",
      value: 54, //averages?.digital || 54
      color: "#4C8CFF",
    },
    {
      label: "Community engagement",
      value:  54, //averages?.community || 54
      color: "#4C8CFF",
    },
  ];

  const max = 100;
  const ticks = [100, 80, 60, 40, 20, 0];

  return (
    <div className="flex h-[320px] w-full min-w-0 flex-1 flex-col justify-between rounded-[12px] bg-white p-6 shadow-[0_0_20px_rgba(94,98,120,0.08)]">
      {/* Naslov */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[20px] font-bold text-[#1E2B4D]">
          Sustainable habits
        </h3>
        <div/>
      </div>

      {/* Grafikon */}
      <div className="flex flex-1 gap-3 pt-3 pb-8">
        {/* Y-Osa (0-100) u ravni sa linijama */}
        <div className="relative flex w-8 flex-col justify-between text-right text-[11px] font-medium text-[#B5B5C3]">
          {ticks.map((t) => (
            <span key={t} className="transform -translate-y-1/2 leading-none">
              {t}
            </span>
          ))}
        </div>

        {/* Mreža i stubići */}
        <div className="relative flex flex-1 flex-col">
          {/* Horizontalne linije mreže */}
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between">
            {ticks.map((t) => (
              <div key={t} className="h-px w-full bg-[#F1F1F4]" />
            ))}
          </div>

          {/* Stubići i višeredni labeli */}
          <div className="relative flex h-full items-end justify-between px-2 sm:px-6">
            {habitBars.map((b) => (
              <div
                key={b.label}
                className="relative flex h-full w-[70px] flex-col items-center justify-end"
              >
                <div
                  className="z-10 w-[40px] rounded-t-[4px] transition-all duration-1000"
                  style={{
                    height: `${(b.value / max) * 100}%`,
                    backgroundColor: b.color,
                  }}
                />

                {/* Višeredni centrirani labeli ispod nulte linije */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[90px] h-10 flex items-center justify-center">
  <span className="font-gilroy font-normal text-center text-[12px] leading-tight text-[#464E5F]">
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

/* ---------- Page (Smart Component) ---------- */

function StatisticsPage() {
  const { data: dashboardData, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-[24px] font-semibold text-[#233662]">Loading statistics...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="border-b border-[#e5e7eb] bg-white shadow-[inset_0_16px_10px_-4px_rgba(0,0,0,0.08)]">
  <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-10 sm:px-10 lg:px-[160px]">
    
    <div className="flex flex-col gap-3">
      <h1 className="font-gilroy text-[36px] font-bold tracking-tight text-[#233662] sm:text-[42px] md:text-[48px]">
        Explore statistics
      </h1>
      <p className="font-gilroy text-[16px] font-medium text-[#444444] sm:text-[18px] md:text-[20px]">
        Explore Green scores and sustainability patterns from all survey responses.
      </p>
    </div>

    <img
      src={sumosWordmark}
      alt="SuMoS"
      className="hidden h-12 w-auto object-contain md:block"
    />

  </div>
</section>

      <StatisticsOverview data={dashboardData} isLoading={isLoading}/>

      <section className="bg-[#f5f5f5] py-10 pb-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 sm:px-10 lg:px-[160px] lg:flex-row lg:items-stretch">
          <SustainableBehaviour averages={dashboardData?.averages}  />
          <SustainableHabits />
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default StatisticsPage;
