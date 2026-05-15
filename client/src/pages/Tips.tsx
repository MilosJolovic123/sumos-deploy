
import { Navigation } from "@/components/sumos/Navigation";
import { Footer } from "@/components/sumos/Footer";
import { Institutions } from "@/components/sumos/Institutions";
import sumosWordmark from "@/assets/sumos-wordmark.png";
import tipTravel from "@/assets/tip-travel.jpg";
import tipHome from "@/assets/tip-home.jpg";
import tipEngage from "@/assets/tip-engage.jpg";


type Tip = {
  image: string;
  title: string;
  items: Array<Array<string | { bold: string }>>;
};

const tips: Tip[] = [
  {
    image: tipTravel,
    title: "Practice ways to reduce your carbon footprint while traveling:",
    items: [
      ["Prefer ", { bold: "train, bus, or carpool" }, " instead of short flights."],
      ["If flying, ", { bold: "choose direct flights" }, " (less emissions than connecting flights)."],
      [{ bold: "Combine transport modes" }, " — e.g., train + bike or public transit."],
      [{ bold: "Walk or cycle" }, " for short distances."],
    ],
  },
  {
    image: tipHome,
    title: "Choose greener choices at home and accommodations:",
    items: [
      ["Take ", { bold: "shorter showers" }, " and turn off taps when not in use."],
      ["Turn ", { bold: "off lights, chargers, and electronics" }, " when not needed."],
      [{ bold: "Separate waste" }, " in your home or accommodations."],
    ],
  },
  {
    image: tipEngage,
    title: "Engage and learn about sustainable travel options:",
    items: [
      ["Visit ", { bold: "Erasmus+ or institutions websites" }, " for guidance on sustainable travel."],
      [{ bold: "Attend workshops, webinars, or info sessions" }, " on low-carbon transport."],
      [{ bold: "Read guides or blogs" }, " about eco-friendly travel tips."],
    ],
  },
];

function TipsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header band */}
      <section className="border-b border-[#bfbfbf] bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-10 sm:px-10 lg:px-[160px]">
          <div className="flex flex-col gap-4">
            <h1 className="text-[40px] font-bold leading-tight text-[#233662] md:text-[48px]">
              View suggestions
            </h1>
            <p className="text-[18px] font-semibold text-[#444] md:text-[20px]">
              Students' Green Awareness and Sustainable Habits
            </p>
          </div>
          <img
            src={sumosWordmark}
            alt="SuMoS"
            className="hidden h-12 w-auto md:block"
          />
        </div>
      </section>

      {/* Tip cards */}
      <section className="bg-[#f5f5f5]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 pb-20 pt-8 sm:px-10 lg:px-[160px]">
          {tips.map((tip, i) => (
            <div key={tip.title}>
              <div className="flex flex-col items-center gap-10 md:flex-row">
                <div
                  className="h-[280px] w-full shrink-0 overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white shadow-[0_0_20px_0_rgba(94,98,120,0.08)] md:w-[320px]"
                >
                  <img
                    src={tip.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-6 py-6">
                  <h2 className="text-[20px] font-semibold text-[#233662] md:text-[24px]">
                    {tip.title}
                  </h2>
                  <ul className="list-disc space-y-4 pl-6 text-[16px] text-[#444]">
                    {tip.items.map((parts, idx) => (
                      <li key={idx} className="leading-normal">
                        {parts.map((p, j) =>
                          typeof p === "string" ? (
                            <span key={j}>{p}</span>
                          ) : (
                            <span key={j} className="font-semibold">
                              {p.bold}
                            </span>
                          ),
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {i < tips.length - 1 && (
                <div className="mt-6 h-px w-full bg-[#e5e7eb]" />
              )}
            </div>
          ))}
        </div>
      </section>

      <Institutions />
      <Footer />
    </main>
  );
}
export default TipsPage;
