import { ArrowRight } from "lucide-react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import worldData from "@/assets/countries-110m.json";

const left = [
  { country: "Germany", value: 85 },
  { country: "France", value: 78 },
  { country: "Spain", value: 72 },
  { country: "Italy", value: 68 },
];
const right = [
  { country: "Poland", value: 65 },
  { country: "Netherlands", value: 62 },
  { country: "Belgium", value: 58 },
  { country: "Portugal", value: 52 },
];

function Bar({ country, value }: { country: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-brand-slate">{country}</span>
        <span className="font-semibold text-brand-blue-deep">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-brand-green" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function Awareness() {
  return (
    <section id="benchmark" className="bg-background py-16">
      <div className="mx-auto max-w-[1280px] px-10">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-4xl font-extrabold text-brand-blue-deep">Green awareness</h2>
          <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline">
            See full statistics <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mb-8 overflow-hidden">
          <ComposableMap
            projectionConfig={{ scale: 155 }}
            width={980}
            height={460}
            style={{ width: "100%", height: "auto" }}
          >
            <Geographies geography={worldData as object}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="transparent"
                    stroke="var(--brand-blue-deep)"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "var(--brand-blue)", fillOpacity: 0.1 },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>

        <div className="rounded-xl border border-border bg-card p-8">
          <h3 className="mb-6 text-lg font-semibold text-brand-blue-deep">
            Level of awareness by country
          </h3>
          <div className="grid grid-cols-1 gap-x-20 gap-y-5 md:grid-cols-2">
            {left.map((c) => <Bar key={c.country} {...c} />)}
            {right.map((c) => <Bar key={c.country} {...c} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
