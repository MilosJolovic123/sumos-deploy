import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import navLogo from "@/assets/nav-logo.png";

const links: { label: string; to: string }[] = [
  { label: "SURVEY", to: "/survey" },
  { label: "BENCHMARK", to: "/benchmark" },
  { label: "STATISTICS", to: "/statistics" },
  { label: "TIPS AND TRICKS", to: "/tips" },
];

export function Navigation() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <header
      className="bg-white"
      style={{
        boxShadow:
          "0 13px 14px rgba(0,0,0,0.04), 0 50px 25px rgba(0,0,0,0.04), 0 114px 34px rgba(0,0,0,0.02), 0 202px 40.5px rgba(0,0,0,0.01)",
      }}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-[160px]">
        <Link to="/" className="block h-[72px] w-[170px] shrink-0 md:h-[100px] md:w-[233.645px]" aria-label="SuMoS">
          <img src={navLogo} alt="SuMoS — Strengthening the ecosystem for sustainable student mobility" className="h-full w-full object-contain" />
        </Link>
        <ul className="hidden items-center gap-2 md:flex">
          {links.map(({ label, to }) => {
            const path = to.split("#")[0] || "/";
            const isActive = location.pathname === path && (path !== "/" || to === "/");
            return (
              <li key={label} className="flex">
                <a
                  href={to}
                  className={`flex h-[144px] items-center justify-center whitespace-nowrap px-2 text-center text-[14px] font-medium uppercase transition-colors ${
                    isActive
                      ? "bg-[#233662] px-4 text-white"
                      : "text-[#233662] hover:text-[#518efa]"
                  }`}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#233662] hover:bg-[#f3f4f6] md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-[#e5e7eb] bg-white md:hidden">
          <ul className="flex flex-col px-6 py-2 sm:px-10">
            {links.map(({ label, to }) => {
              const path = to.split("#")[0] || "/";
              const isActive = location.pathname === path;
              return (
                <li key={label}>
                  <a
                    href={to}
                    onClick={() => setOpen(false)}
                    className={`block py-3 text-[14px] font-medium uppercase ${
                      isActive ? "text-[#518efa]" : "text-[#233662]"
                    }`}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
