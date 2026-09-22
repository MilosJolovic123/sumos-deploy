import logoFoi from "@/assets/logo-foi.jpg";
import logoEsiea from "@/assets/logo-esiea.png";
import logoZilina from "@/assets/logo-zilina.png";
import logoMaribor from "@/assets/logo-maribor.png";
import logoFon from "@/assets/logo-fon.png";

const items = [
  { name: "FOI", src: logoFoi, href: "/documents/FOI_GREEN_Dokument_A4_v2.pdf" },
  {
    name: "ESIEA",
    src: logoEsiea,
    href: "/documents/Catalogue_of_Green_Practices_ESIEA_Sept2026.pdf",
  },
  { name: "University of Žilina", src: logoZilina, href: "/documents/zilina-green-practices.pdf" },
  {
    name: "University of Maribor",
    src: logoMaribor,
    href: "/documents/03_Catalogue_of_Green_Practices_UM_FOV.pdf",
  },
  {
    name: "FON Belgrade",
    src: logoFon,
    href: "/documents/Catalogue_of_Green_Practices_UB_FON_new_version.pdf",

  },
];

export function Institutions() {
  return (
    <section id="tips" className="bg-background pb-12 pt-8 md:pb-16">
      <div className="mx-auto max-w-[1440px] px-6 text-center sm:px-10 lg:px-[160px]">
        <h2 className="mb-8 text-[28px] text-brand-blue-deep md:mb-10 md:text-3xl font-bold">
          Explore Green practices by institution
        </h2>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
          {items.map((it) => (
            <a
              key={it.name}
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${it.name} green practices PDF`}
              className="grid h-[180px] place-items-center rounded-xl border border-border bg-card p-6 transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep"
            >
              <img
                src={it.src}
                alt={it.name}
                className="max-h-[120px] max-w-full object-contain"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}