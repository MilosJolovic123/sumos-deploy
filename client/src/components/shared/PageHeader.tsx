import sumosLogo from "@/assets/hero-sumos-logo.png";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-background">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-10 sm:px-10 lg:px-[160px]">
        <div>
          <h1 className="font-gilroy text-[36px] font-bold tracking-tight text-[#233662] sm:text-[42px] md:text-[48px]">
            {title}
          </h1>
          {subtitle && (
            <p className="font-gilroy text-[16px] font-medium text-[#444444] sm:text-[18px] md:text-[20px]">{subtitle}</p>
          )}
        </div>
        <img
          src={sumosLogo}
          alt="SuMoS"
          className="hidden h-12 w-auto object-contain md:block"
        />
      </div>
      <div className="h-px w-full bg-[#e5e7eb]" />
    </div>
  );
}
