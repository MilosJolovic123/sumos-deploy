import { useSurvey } from "@/contexts/SurveyContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import ecoGlobe from "@/assets/icon-globe.gif";

const fmt = (n: number) =>
  n.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).replace(".", ",");

function CategoryGauge({
  name,
  value,
  size = "lg",
}: {
  name: string;
  value: number;
  size?: "lg" | "sm";
}) {
  const max = 5;
  const pct = Math.min(value / max, 1);
  const r = 90;
  const circ = Math.PI * r;
  const dash = circ * pct;

  const color =
    pct >= 0.8 ? "#64a550" : pct >= 0.6 ? "#A3C27C": pct >= 0.4 ? "#455369" : pct >= 0.21 ? "#D89B39" : "#DC493A";

  if (size === "sm") {
    return (
      <div className="flex h-[200px] w-[200px] shrink-0 flex-col items-center justify-between rounded-[12px] bg-white px-3 pb-4 pt-5 shadow-[0_0_20px_rgba(94,98,120,0.08)] font-sans">
        <h3 className="text-center text-[14px] font-semibold leading-tight text-sumos-blue-300">
          {name}
        </h3>
        <div className="flex flex-col items-center">
          <div className="relative h-[80px] w-[150px]">
            <svg viewBox="0 0 212 110" className="h-full w-full">
              <path d="M16,106 A90,90 0 0 1 196,106" fill="none" stroke="#E5E7EB" strokeWidth="22" />
              <path d="M16,106 A90,90 0 0 1 196,106" fill="none" stroke={color} strokeWidth="22" strokeDasharray={`${dash} ${circ}`} />
            </svg>
            <div className="absolute inset-x-0 bottom-0 text-center text-[28px] font-bold leading-none text-sumos-blue-300">
              {fmt(value)}
            </div>
          </div>
          <div className="mt-1 flex w-[150px] justify-between px-2 text-[10px] text-sumos-gray-200">
            <span>0</span>
            <span>5</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[288px] w-[360px] shrink-0 flex-col items-center justify-between rounded-[12px] bg-white px-6 pb-6 pt-8 shadow-[0_0_20px_rgba(94,98,120,0.08)]">
      <h3 className="text-center text-[20px] font-semibold" style={{ color }}>
        {name}
      </h3>
      <div className="flex flex-col items-center">
        <div className="relative h-[110px] w-[212px]">
          <svg viewBox="0 0 212 110" className="h-full w-full">
            <path d="M16,106 A90,90 0 0 1 196,106" fill="none" stroke="#E5E7EB" strokeWidth="30" strokeLinecap="butt"/>
            <path d="M16,106 A90,90 0 0 1 196,106" fill="none" stroke={color} strokeWidth="30" strokeLinecap="butt" strokeDasharray={`${dash} ${circ}`} />
          </svg>
          <div className="absolute inset-x-0 bottom-1 text-center text-[40px] font-bold leading-none text-sumos-blue-300">
            {fmt(value)}
          </div>
        </div>
        <div className="mt-1 flex w-[212px] justify-between px-2 text-[12px] text-sumos-gray-200">
          <span>0</span>
          <span>5</span>
        </div>
      </div>
      <p className="text-center text-[16px] text-sumos-blue-200">Your score</p>
    </div>
  );
}

export function DetailedResults() {
  const { state } = useSurvey();

  const results = state.results;
  const scores = results?.scores;
  const feedback = results?.feedback;

  const overallScore = scores?.ecoScore ?? 0;
  const badgeName = feedback?.badge ?? "Eco Explorer";
  const overallMessage = feedback?.message ?? "";

  const cs = scores?.categoryScores ?? {};
  const sg = feedback?.suggestions ?? {};

  const toBullets = (s: string) =>
    s
      ? s
          .split(/\r?\n|•|·|;|(?<=\.)\s+(?=[A-Z])/)
          .map((x) => x.trim())
          .filter(Boolean)
      : [];

  const categoryConfig = [
    { key: "Awareness", label: "Awareness" },
    { key: "Attitudes", label: "Attitudes" },
    { key: "Travel", label: "Travel habits" },
    { key: "Living", label: "Living and accommodation" },
    { key: "Consumption", label: "Buying and consumption" },
    { key: "Digital", label: "Digital habits" },
    { key: "Engagement", label: "Community engagement" },
  ];

  const allCategories = categoryConfig.map((cfg) => ({
    name: cfg.label,
    value: cs[cfg.key] ?? 0,
    bullets: toBullets(sg[cfg.key] ?? ""),
    suggestion: sg[cfg.key] ?? "",
  }));

  return (
    <div className="space-y-0">
      <section className="bg-background">
        <div className="mx-auto w-full max-w-[1440px] px-3 pb-12 pt-8 sm:px-6">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-stretch lg:gap-[60px]">
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-[320px] overflow-hidden rounded-xl border-4 border-brand-green bg-card px-8 py-8 shadow-[0_0_20px_rgba(94,98,120,0.08)] sm:w-[360px]">
                <div className="pointer-events-none absolute inset-0 rounded-[8px] border-[12px] border-[#f9f8d6]" />
                <div className="relative flex flex-col items-center gap-6">
                  <p className="text-2xl font-semibold text-sumos-blue-300">My Green Profile</p>
                  <img src={ecoGlobe} alt="" className="h-[120px] w-[120px] object-contain" />
                  <p className="text-[32px] font-semibold text-sumos-green-300 text-center">{badgeName}</p>
                </div>
              </div>
              <p className="text-2xl font-semibold text-sumos-blue-300">
                Your result is: <span className="font-bold text-sumos-green-300">{fmt(overallScore)}</span>
              </p>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-6 pt-2">
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-sumos-blue-300">Description</h3>
                <p className="text-base leading-relaxed text-sumos-blue-200 sm:text-lg">
                   {overallMessage}
                </p>
              </div>
              <div className="flex justify-end">
                <Link to="/tips" className="inline-flex items-center gap-1 rounded-lg px-6 py-3 text-base font-medium text-sumos-blue-100 hover:underline">
                  View suggestions <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5]">
        <div className="mx-auto w-full max-w-[1440px] px-3 pb-20 pt-8 sm:px-6">
          <h2 className="mb-8 text-[32px] font-bold text-sumos-blue-300 sm:text-[40px]">What should you do next?</h2>
          <div className="h-px w-full bg-sumos-gray-100" />
          <div className="mt-10 space-y-12">
            {allCategories.map((cat) => (
              <div key={cat.name} className="flex w-full flex-col items-center gap-10 md:flex-row md:items-center">
                <CategoryGauge name={cat.name} value={cat.value} />
                <div className="flex-1 space-y-4 py-6">
                  <h4 className="text-2xl font-semibold text-sumos-blue-300">Suggestion</h4>
                  {cat.bullets.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-6 text-base leading-relaxed text-sumos-blue-200">
                      {cat.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-base leading-relaxed text-sumos-blue-200">{cat.suggestion || "—"}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}