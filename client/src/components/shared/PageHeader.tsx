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
          <h1 className="font-display text-[36px] leading-tight text-brand-blue-deep sm:text-[42px] font-bold">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-[#444444]">{subtitle}</p>
          )}
        </div>
        <img
          src={sumosLogo}
          alt="SuMoS"
          className="hidden h-[40px] w-auto object-contain sm:block"
        />
      </div>
      <div className="h-px w-full bg-[#e5e7eb]" />
    </div>
  );
}
