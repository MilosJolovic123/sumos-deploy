import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-illustration.png";
import sumosBadge from "@/assets/hero-sumos-logo.png";
import heroBgShape from "@/assets/hero-bg-shape.svg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto max-w-[1440px]">
        <img
          src={heroBgShape}
          alt=""
          aria-hidden
          className="absolute -top-[67px] right-[649px] h-[637px] w-[791px] max-w-none"
        />
      </div>
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 pt-12 pb-6 sm:px-10 md:grid-cols-2 md:items-center md:pt-16 lg:px-[160px]">
        <div className="relative flex flex-col gap-6">
          <img
            src={sumosBadge}
            alt="SuMoS"
            className="h-[48px] w-[148.966px] object-contain"
          />
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-[36px] leading-tight text-[#233662] font-bold sm:text-[42px] md:text-[48px]">
              Benchmarking tool
            </h1>
            <div className="flex flex-col gap-7 items-start">
              <p className="max-w-[602px] text-[18px] leading-[26px] text-[#444444]">
                The benchmarking tool is part of the Erasmus+ European Commission
                co-funded Education project{" "}
                <span className="font-semibold">
                  &ldquo;Strengthening the Ecosystem for Sustainable Modern Industry&rdquo;
                </span>{" "}
                (SuMoS).
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
        <div className="relative flex justify-center">
          <img
            src={heroImg}
            alt="Student with laptop surrounded by European landmarks"
            width={1024}
            height={960}
            className="h-auto w-full max-w-[492px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
