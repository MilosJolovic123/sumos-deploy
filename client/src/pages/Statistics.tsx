import React from "react";
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

/* ---------- 1. Sustainability Categories ---------- */
export function SustainableBehaviour({ averages }: ChartProps) {
  const categoryBars = [
    { label: "Awareness", value: averages?.awareness || 0, color: "#61A348" },
    { label: "Attitudes", value: averages?.attitudes || 0, color: "#61A348" },
    { label: "Habits", value: averages?.habits || 0, color: "#61A348" },
    { label: "Barriers", value: averages?.barriers || 0, color: "#61A348" },
  ];

  const max = 5;
  const ticks = [5, 4, 3, 2, 1, 0];

  return (
    <div className="flex min-h-[340px] w-full min-w-0 flex-1 flex-col justify-between rounded-[16px] border border-[#e5e7eb] bg-white p-4 sm:p-6 shadow-[0_0_20px_rgba(94,98,120,0.08)]">
      {/* Naslov */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1E2B4D]">
          Sustainability categories
        </h3>
        <div className="h-px w-full bg-[#F1F1F4]" />
      </div>

      {/* Grafikon */}
      <div className="flex flex-1 gap-2 sm:gap-3 pt-3 pb-12">
        {/* Y-Osa */}
        <div className="relative flex w-5 sm:w-6 flex-col justify-between text-right text-[11px] font-medium text-[#B5B5C3]">
          {ticks.map((t) => (
            <span key={t} className="transform -translate-y-1/2 leading-none">
              {t}
            </span>
          ))}
        </div>

        {/* Mreža i stubići */}
        <div className="relative flex flex-1 flex-col min-w-0">
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between">
            {ticks.map((t) => (
              <div key={t} className="h-px w-full bg-[#F1F1F4]" />
            ))}
          </div>

          <div className="relative flex h-full items-end justify-between px-1 sm:px-6">
            {categoryBars.map((b) => (
              <div
                key={b.label}
                className="relative flex h-full flex-1 min-w-0 items-end justify-center"
              >
                <div
                  className="z-10 w-full max-w-[36px] sm:max-w-[42px] rounded-t-[4px] transition-all duration-1000"
                  style={{
                    height: `${(b.value / max) * 100}%`,
                    backgroundColor: b.color,
                  }}
                />

                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-full max-w-[80px] flex items-center justify-center">
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

/* ---------- 2. Sustainable Habits ---------- */
export function SustainableHabits({ averages }: ChartProps) {
  const habitBars = [
    { label: "Travel", value: averages?.travel || 0, color: "#4C8CFF" },
    { label: "Living and accomodation", value: averages?.living || 0, color: "#4C8CFF" },
    { label: "Food and consumption", value: averages?.consumption || 0, color: "#4C8CFF" },
    { label: "Digital habits", value: averages?.digital || 0, color: "#4C8CFF" },
    { label: "Community engagement", value: averages?.engagement || 0, color: "#4C8CFF" },
  ];

  const max = 5;
  const ticks = [5, 4, 3, 2, 1, 0];

  return (
    <div className="flex min-h-[340px] w-full min-w-0 flex-1 flex-col justify-between rounded-[16px] border border-[#e5e7eb] bg-white p-4 sm:p-6 shadow-[0_0_20px_rgba(94,98,120,0.08)]">
      {/* Naslov */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1E2B4D]">
          Sustainable habits
        </h3>
        <div className="h-px w-full bg-[#F1F1F4]" />
      </div>

      {/* Grafikon */}
      <div className="flex flex-1 gap-2 sm:gap-3 pt-3 pb-12">
        {/* Y-Osa */}
        <div className="relative flex w-5 sm:w-6 flex-col justify-between text-right text-[11px] font-medium text-[#B5B5C3]">
          {ticks.map((t) => (
            <span key={t} className="transform -translate-y-1/2 leading-none">
              {t}
            </span>
          ))}
        </div>

        {/* Mreža i stubići */}
        <div className="relative flex flex-1 flex-col min-w-0">
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between">
            {ticks.map((t) => (
              <div key={t} className="h-px w-full bg-[#F1F1F4]" />
            ))}
          </div>

          <div className="relative flex h-full items-end justify-between px-1 sm:px-4">
            {habitBars.map((b) => (
              <div
                key={b.label}
                className="relative flex h-full flex-1 min-w-0 items-end justify-center"
              >
                <div
                  className="z-10 w-full max-w-[32px] sm:max-w-[40px] rounded-t-[4px] transition-all duration-1000"
                  style={{
                    height: `${(b.value / max) * 100}%`,
                    backgroundColor: b.color,
                  }}
                />

                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-full max-w-[75px] sm:max-w-[90px] flex items-center justify-center">
                  <span className="font-gilroy font-normal text-center text-[9px] sm:text-[11px] leading-tight text-[#464E5F] break-words">
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
      <main className="min-h-screen flex items-center justify-center bg-background px-4 text-center">
        <div className="text-[20px] sm:text-[24px] font-semibold text-[#233662]">
          Loading statistics...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* HEADER SEKCIJA */}
      <section className="border-b border-[#e5e7eb] bg-white ">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-8 sm:px-10 lg:px-[160px] lg:py-10">
          <div className="flex flex-col gap-2 sm:gap-3">
            <h1 className="font-gilroy text-[28px] font-bold tracking-tight text-[#233662] sm:text-[36px] md:text-[48px]">
              Explore statistics
            </h1>
            <p className="font-gilroy text-[14px] font-medium text-[#444444] sm:text-[18px] md:text-[20px]">
              Explore Green scores and sustainability patterns from all survey responses.
            </p>
          </div>

          <img
            src={sumosWordmark}
            alt="SuMoS"
            className="hidden h-10 sm:h-12 w-auto object-contain md:block"
          />
        </div>
      </section>

      {/* OVERVIEW STATISTIKA */}
      <StatisticsOverview
        data={dashboardData}
        isLoading={isLoading}
        showStatisticsLink={false}
      />

      {/* SEKCIJA SA DVA GRAFIKONA */}
      <section className="bg-[#f5f5f5] py-8 sm:py-10 pb-16 sm:pb-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 sm:gap-10 px-4 sm:px-10 lg:px-[160px] lg:flex-row lg:items-stretch">
          <SustainableBehaviour averages={dashboardData?.averages} />
          <SustainableHabits averages={dashboardData?.averages} />
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default StatisticsPage;