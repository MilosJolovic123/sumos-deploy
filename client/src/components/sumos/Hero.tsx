import { ArrowRight } from "lucide-react";
import sumosBadge from "@/assets/hero-sumos-logo.png";
import heroBgShape from "@/assets/hero-bg-shape.svg";

// Import odvojenih slika
import heroPic from "@/assets/hero-pic.png"; 

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Pozadinska figura */}
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto max-w-[1440px]">
        <img
          src={heroBgShape}
          alt=""
          aria-hidden
          className="absolute -top-[67px] right-[649px] h-[637px] w-[791px] max-w-none"
        />
      </div>

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 pt-12 pb-6 sm:px-10 md:grid-cols-2 md:items-center md:pt-16 lg:px-[160px]">
        {/* Leva strana - Tekst i CTA */}
        <div className="relative flex flex-col gap-6">
          <img
            src={sumosBadge}
            alt="SuMoS"
            className="h-[48px] w-[148.966px] object-contain"
          />
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-[36px] font-bold leading-tight text-[#233662] sm:text-[42px] md:text-[48px]">
              Explore your green profile and start building greener habits today
            </h1>
            <div className="flex flex-col items-start gap-7">
              <p className="max-w-[602px] text-[18px] leading-[26px] text-[#444444]">
                Take the survey, benchmark your results against other students, and check tips&tricks to become more sustainable!{" "}
              </p>
              <a
                href="/survey"
                className="inline-flex items-center gap-1 rounded-lg bg-[#518efa] px-6 py-3 text-[16px] font-medium text-white transition-transform hover:-translate-y-0.5"
              >
                Take a survey <ArrowRight className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Desna strana - Jedinstvena hero slika */}
<div className="relative flex justify-center">
  <img
    src={heroPic}
    alt="Student with laptop surrounded by sustainable icons"
    width={1024}
    height={960}
    className="h-auto w-full max-w-[492px] object-contain"
  />
</div>
      </div>
    </section>
  );
}