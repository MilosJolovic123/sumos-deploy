
import { Navigation } from "@/components/sumos/Navigation";
import { Footer } from "@/components/sumos/Footer";
import { Institutions } from "@/components/sumos/Institutions";
import sumosWordmark from "@/assets/sumos-wordmark.png";
import tipTravel from "@/assets/tip-travel.jpg";
import tipHome from "@/assets/tip-home.jpg";
import tipDevice from "@/assets/tip-device.jpg";

type TipItem = string | { bold: string } | {link:string, url:string};


type Tip = {
  image: string;
  title: string;
  items: Array<Array<TipItem>>;
};

const tips: Tip[] = [
  {
    image: tipTravel,
    title: "Practice ways to reduce your impact while traveling:",
    items: [
      ["Even if you make sustainable choices every day, just one or two flights a year can seriously increase your environmental footprint."],
      ["Curious how much travel matters compared to your daily habits? See how flights compare using the ", {link: "European Environment Agency overview on transport emissions", url: "https://www.eea.europa.eu/en/topics/in-depth/transport-and-mobility"},"."],
      ["Explore a simple personal impact comparison with a flight calculator from the ", {link:"International Civil Aviation Organization", url: "https://www.icao.int/environmental-protection/environmental-tools/icec"},"."]]
  },
  {
    image: tipHome,
    title: "Choose greener choices at home:",
    items: [
      ["Small changes in how often and how you wash clothes can save water, energy, and time. Wear clothes more than once when possible - many items don't need washing after a single use. Want to know ",{link:"more", url:"https://www.nationalgeographic.com/environment/article/partner-content-laundry-lightening-the-load"},"? "],
      ["Staying warm does not always mean turning the heating up. Lower your room temperature by 1°C - it can reduce energy use without you really noticing. Here’s the ", {link:"proof",url:"https://www.wwf.org.uk/challenges/turn-down-one-degree"},". "]    ],
  },
  {
    image: tipDevice,
    title: "Use your devices smarter and greener:",
    items: [
      ["Use your devices while they still work well instead of upgrading too early and here’s ", { link: "why",url:"https://learninglab.gitlabpages.inria.fr/mooc-impacts-num/mooc-impacts-num-ressources/en/Partie2/Activites/Capsule_Partie2_4_Agir/story.html" }, ""],
      ["Try and repair small issues (like battery or screen) instead of replacing the whole device. Watch a ", { link: "short video",url:"https://www.youtube.com/watch?v=eyUqqA8wA0A" }, " if you want to know more about this."],
      ["Use trade-in programs when buying a new device to ",{ link: "recycle", url:"https://www.bbc.co.uk/newsround/68684673" }, " your old one responsibly. "],
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
      {parts.map((p, j) => {
        // 1. Ako je običan tekst
        if (typeof p === "string") {
          return <span key={j}>{p}</span>;
        }

        // 2. Ako je objekat sa 'bold' tekstom
        if ("bold" in p) {
          return (
            <span key={j} className="font-semibold">
              {p.bold}
            </span>
          );
        }

        // 3. Ako je objekat sa 'linkom'
        if ("link" in p) {
          return (
            <a
              key={j}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#518EFA] underline hover:text-[#233662] transition-colors font-medium"
            >
              {p.link}
            </a>
          );
        }

        return null;
      })}
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
