
import { Navigation } from "@/components/sumos/Navigation";
import { Hero } from "@/components/sumos/Hero";
import { StepCards } from "@/components/sumos/StepCards";
import { Statistics } from "@/components/sumos/Statistics";
import { Awareness } from "@/components/sumos/Awareness";
import { Institutions } from "@/components/sumos/Institutions";
import { Footer } from "@/components/sumos/Footer";
import StatisticsOverview from "@/components/sumos/StatisticsOverview";


function Index() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <StepCards />
      <StatisticsOverview />
      <div className="hidden"><Awareness /></div>
      <Institutions />
      <Footer />
    </main>
  );
}
export default Index;
