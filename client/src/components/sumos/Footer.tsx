import euLogo from "@/assets/eu2.png";
import sumosLogo from "@/assets/sumosLogo2.png";

export function Footer() {
  return (
    <footer className="font-gilroy border-t border-[#E5E7EB] bg-white">
      {/* Glavni gornji deo footera */}
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-6 px-6 py-6 sm:px-10 lg:flex-row lg:px-[120px]">
        
        {/* Leva strana: Logotipi */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {/* SuMoS Logo */}
          <img
            src={sumosLogo}
            alt="Strengthening the ecosystem for sustainable student mobility"
            className="h-12 w-auto object-contain"
          />

          {/* EU Logo */}
          <img
            src={euLogo}
            alt="Co-funded by the Erasmus+ Programme of the European Union"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Desna strana: Navigacioni linkovi */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-[14px] font-medium text-[#333333] md:gap-8">
          <a
            href="https://sumos-project.eu/about-project"
            className="transition-colors hover:text-[#518EFA]"
            target="_blank"
          >
            About SuMoS project
          </a>
          <a
            href="https://sumos-project.eu/partners"
            className="transition-colors hover:text-[#518EFA]"
            target="_blank"
          >
            Contact
          </a>
          <a
            href="/privacy"
            className="transition-colors hover:text-[#518EFA]"
            target="_blank"
          >
            Privacy notice
          </a>
          <a
            href="/cookies"
            className="transition-colors hover:text-[#518EFA]"
            target="_blank"
          >
            Cookie Policy
          </a>
        </nav>
      </div>

      {/* Donja siva traka sa disclaimer-om */}
      <div className="border-t border-[#E5E7EB] bg-[#F9FAFB] py-3">
        <p className="mx-auto max-w-[1440px] px-6 text-center text-[11px] leading-relaxed text-[#7E8299] sm:px-10 lg:px-[120px]">
          The sole responsibility for the content of this website lies with the authors. It does not
          necessarily reflect the opinion of the European Union.
          <br />
          Copyright © 2026 FOI Varaždin. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;