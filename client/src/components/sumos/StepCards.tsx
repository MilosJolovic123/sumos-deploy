import iconChecklist from "@/assets/icon-checklist.gif";
import iconBenchmark from "@/assets/icon-benchmark.gif";
import iconHandBulb from "@/assets/icon-hand-bulb.gif";

type Step = {
  step: string;
  badgeBg: string;
  titleColor: string;
  borderColor: string;
  icon: string;
  title: string;
  desc: string;
};

const steps: Step[] = [
  {
    step: "STEP 01",
    badgeBg: "bg-brand-blue",
    titleColor: "text-brand-blue",
    borderColor: "border-brand-blue/30",
    icon: iconChecklist,
    title: "Take a survey",
    desc: "It is a survey about students' green awareness and sustainable habits.",
  },
  {
    step: "STEP 02",
    badgeBg: "bg-brand-green",
    titleColor: "text-brand-green",
    borderColor: "border-brand-green/30",
    icon: iconBenchmark,
    title: "Launch benchmark",
    desc: "Compare your results with others based on gender, country, mobility participation, etc.",
  },
  {
    step: "STEP 03",
    badgeBg: "bg-brand-green-soft",
    titleColor: "text-brand-green-soft",
    borderColor: "border-brand-green-soft/40",
    icon: iconHandBulb,
    title: "Get suggestions",
    desc: "See tips and recommendations to improve your sustainable habits and awareness.",
  },
];

export function StepCards() {
  return (
    <section id="survey" className="bg-background pb-12 pt-4 md:pb-16">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-6 sm:px-10 md:grid-cols-3 lg:px-[160px]">
        {steps.map(({ step, badgeBg, titleColor, borderColor, icon, title, desc }) => (
          <article
            key={title}
            className={`relative rounded-xl border ${borderColor} bg-card p-6 pt-7`}
          >
            <span
              className={`absolute right-6 -top-3 rounded-md px-3 py-1 text-[10px] font-bold tracking-wider text-white ${badgeBg}`}
            >
              {step}
            </span>
            <img src={icon} alt="" className="mb-4 h-20 w-20 object-contain" />
            <h3 className={`mb-2 text-xl font-bold ${titleColor}`}>{title}</h3>
            <p className="text-sm leading-relaxed text-brand-slate">{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
