import { ReactNode } from "react";
import { Navigation } from "@/components/sumos/Navigation";
import { Footer } from "@/components/sumos/Footer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
