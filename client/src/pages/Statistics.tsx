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

function SustainableBehaviour({ averages }: ChartProps) {
  const behaviourBars = [
    { label: "Awareness", value: averages?.awareness || 0, color: "#233662" },
    { label: "Attitudes", value: averages?.attitudes || 0, color: "#518efa" },
    { label: "Habits", value: averages?.habits || 0, color: "#185904" },
    { label: "Barriers", value: averages?.barriers || 0, color: "#64a550" },
  ];

  const max = 5;
  const ticks = [5, 4, 3, 2, 1, 0];

  return (
    <div className="flex h-[341px] w-full min-w-0 flex-col gap-6 rounded-[12px] bg-white px-4 py-8 shadow-[0_0_10px_rgba(94,98,120,0.16)] sm:px-6 lg:w-[540px] lg:shrink-0">
      <div className="flex flex-col gap-6">
        <h3 className="text-[20px] font-semibold text-[#233662]">Sustainable categories</h3>
        <div className="h-px w-full bg-[#e5e7eb]" />
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
          <div className="relative flex h-full items-end gap-3 px-2 sm:gap-8 sm:px-6">
            {behaviourBars.map((b) => (
              <div
                key={b.label}
                className="flex h-full flex-1 flex-col items-center justify-end"
              >
                <div
                  className="w-full max-w-[64px] transition-all duration-1000"
                  style={{ height: `${(b.value / max) * 100}%`, backgroundColor: b.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3 pl-9 pr-2 sm:gap-8 sm:pr-6">
        {behaviourBars.map((b) => (
          <span key={b.label} className="flex-1 text-center text-[12px] text-[#444444]">
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Sustainable habits radar (Statično za sada) ---------- */

const radarCountries = ["Croatia", "France", "Slovakia", "Slovenia", "Serbia"];
const radarSeries = [
  { name: "Travel", color: "#233662", values: [60, 50, 70, 40, 55, 45, 65] },
  { name: "Living and accomodation", color: "#b6d989", values: [80, 60, 50, 70, 45, 65, 55] },
  { name: "Food and consumption", color: "#64a550", values: [70, 75, 55, 50, 65, 70, 60] },
  { name: "Digital habits", color: "#518efa", values: [55, 65, 80, 60, 50, 55, 70] },
];

// Dodati tipovi za mapiranje
const radarData = radarCountries.map((country: string, i: number) => ({
  country,
  Travel: radarSeries[0].values[i],
  Living: radarSeries[1].values[i],
  Food: radarSeries[2].values[i],
  Digital: radarSeries[3].values[i],
}));

function SustainableHabits() {
  return (
    <div className="flex min-h-[341px] w-full min-w-0 flex-1 flex-col gap-6 rounded-[12px] bg-white px-4 py-8 shadow-[0_0_10px_rgba(94,98,120,0.16)] sm:px-6">
      <div className="flex flex-col gap-6">
        <h3 className="text-[20px] font-semibold text-[#233662]">Sustainable habits</h3>
        <div className="h-px w-full bg-[#e5e7eb]" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="h-[220px] w-full max-w-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="80%">
              <PolarGrid stroke="#bfbfbf" />
              <PolarAngleAxis dataKey="country" tick={{ fill: "#444444", fontSize: 10 }} />
              <PolarRadiusAxis
                angle={90}
                domain={[1, 5]}
                tick={{ fill: "#bdbdbd", fontSize: 9 }}
                tickCount={5}
                axisLine={false}
              />
              <Radar
                name="Travel"
                dataKey="Travel"
                stroke="#233662"
                fill="#233662"
                fillOpacity={0.25}
              />
              <Radar
                name="Living"
                dataKey="Living"
                stroke="#b6d989"
                fill="#b6d989"
                fillOpacity={0.35}
              />
              <Radar name="Food" dataKey="Food" stroke="#64a550" fill="#64a550" fillOpacity={0.3} />
              <Radar
                name="Digital"
                dataKey="Digital"
                stroke="#518efa"
                fill="#518efa"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex flex-col gap-3">
          {radarSeries.map((s) => (
            <li key={s.name} className="flex items-center gap-2">
              <span className="h-2 w-[21px]" style={{ backgroundColor: s.color }} />
              <span className="whitespace-nowrap text-[14px] font-semibold text-[#444444]">
                {s.name}
              </span>
            </li>
          ))}
        </ul>
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

      <section className="border-b border-[#bfbfbf] bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-10 sm:px-10 lg:px-[160px]">
          <h1 className="font-display text-[32px] font-bold text-[#233662] sm:text-[40px] md:text-[48px]">
            Statistics
          </h1>
          <img src={sumosWordmark} alt="SuMoS" className="h-12 w-auto" />
        </div>
      </section>

      <StatisticsOverview data={dashboardData} isLoading={isLoading} />

      <section className="bg-[#f5f5f5] py-10 pb-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 sm:px-10 lg:px-[160px] lg:flex-row lg:items-stretch">
          <SustainableBehaviour averages={dashboardData?.averages} />
          <SustainableHabits />
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default StatisticsPage;
