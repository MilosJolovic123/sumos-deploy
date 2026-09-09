import { useState } from "react";
import { Navigation } from "@/components/sumos/Navigation";
import { Footer } from "@/components/sumos/Footer";
import { Institutions } from "@/components/sumos/Institutions";
import sumosWordmark from "@/assets/sumos-wordmark.png";
import {
  Lightbulb,
  MessageSquare,
  ThumbsUp,
  Users,
  Plane,
  Home,
  ShoppingBag,
  Smartphone,
  ArrowUpRight,
} from "lucide-react";

// --- TIPOVANJE ---
type LinkItem = {
  label: string;
  url: string;
};

type TipItem = {
  text: string;
  links?: LinkItem[];
};

type TipGroup = {
  sectionTitle: string;
  items: TipItem[];
};

type CategoryKey = "awareness" | "attitudes" | "habits" | "community";
type HabitSubCategoryKey = "travel" | "living" | "buying" | "digital";


// --- PODACI ---
const tipsData: Record<
  CategoryKey,
  Record<string, TipGroup[]>
> = {
  awareness: {
    default: [
      {
        sectionTitle: "Online content and social media",
        items: [
          {
            text: "Follow 2–3 short-form content creators on TikTok or Instagram who explain climate topics in simple ways.",
            links: [
              { label: "LINK 1", url: "https://www.tiktok.com/@bbcearth" },
              { label: "LINK 2", url: "https://www.tiktok.com/tag/sdgs" },
              { label: "LINK 3", url: "https://www.instagram.com/unsdg/" },
              { label: "LINK 4", url: "https://www.instagram.com/natgeo/" },
            ],
          },
          {
            text: "Watch 1 short video per week about topics like climate change, pollution, or sustainable living.",
            links: [
              { label: "LINK 1", url: "https://www.youtube.com/watch?v=fsjvwQclGLo" },
              { label: "LINK 2", url: "https://www.youtube.com/watch?v=yiw6_JakZFc" },
            ],
          },
          {
            text: "When you see environmental content online, don't scroll immediately – give it 30 seconds.",
          },
        ],
      },
      {
        sectionTitle: "SDGs, footprint and key concepts",
        items: [
          {
            text: "Check out the United Nations Sustainable Development Goals.",
            links: [
              { label: "LINK", url: "https://sdgs.un.org/goals" },
            ],
          },
          {
            text: "You can check our progress in SDG achievements.",
            links: [{ label: "LINK", url: "https://dashboards.sdgindex.org/explorer/" }],
          },
          {
            text: "Explore 2–3 SDGs that relate to your life (e.g. climate action, responsible consumption).",
          },
          {
            text: "Look up simple explainers like 'SDGs in 2 minutes' on YouTube.",
            links: [{ label: "LINK", url: "https://www.youtube.com/watch?v=qmZ7_N9MEYQ" }],
          },
          {
            text: "Try a quick online ecological footprint quiz to understand your personal impact.",
            links: [{ label: "LINK", url: "https://www.footprintcalculator.org/home/en" }],
          },
          {
            text: "Repeat the ecological footprint quiz after a few months and see whether your habits have changed.",
          },
          {
            text: "Watch a short video about 'a day in a sustainable vs unsustainable lifestyle' on YouTube.",
            links: [
              { label: "LINK 1", url: "https://www.youtube.com/watch?v=K-O2O6108xA" },
              { label: "LINK 2", url: "https://www.youtube.com/watch?v=Ee9ZbEq1LsE" },
            ],
          },
          {
            text: "Learn a few key actions that reduce your footprint – like using public transport, reducing food waste, and buying fewer new items – and try one this week.",
            links: [
              { label: "LINK 1", url: "https://www.unep.org/news-and-stories/story/five-tips-living-more-sustainably" },
              { label: "LINK 2", url: "https://www.un.org/en/actnow/ten-actions" },
            ],
          },
        ],
      },
      {
        sectionTitle: "Local initiatives and community",
        items: [
          {
            text: "Search your university website or social media to see if there are any student sustainability groups or events you can check out.",
          },
          {
            text: "Attend one event (e.g. clean-up, workshop, swap market) just to see what it's like – no pressure to join.",
          },
          {
            text: "Ask classmates or friends if they know about any local sustainability activities or groups.",
          },
        ],
      },
    ],
  },
  attitudes: {
    default: [
      {
        sectionTitle: "Shifting your mindset",
        items: [
          {
            text: "Remember that change doesn't come from one person, but from many individuals doing small things consistently.",
          },
          {
            text: "Even if one person can't change everything, small actions like reducing waste or using public transport still add up.",
          },
          {
            text: "Prioritise changes that have the biggest impact, such as travel, food choices, and energy use.",
          },
          {
            text: "Don't aim for 'being sustainable' – just try doing one thing a bit differently and see how it feels.",
          },
          {
            text: "Think about how today's environmental problems (air, food, climate) could directly affect your own future lifestyle and opportunities.",
            links: [{ label: "LINK", url: "https://www.noaa.gov/education/resource-collections/climate/climate-change-impacts" }],
          },
          {
            text: "Imagine the kind of world you'd like to live in 10–20 years and how current choices shape that direction.",
          },
          {
            text: "Reflect on how small actions now can prevent bigger problems later, even if the impact isn't immediate.",
          },
        ],
      },
      {
        sectionTitle: "Making it stick",
        items: [
          {
            text: "Start with one super easy habit (e.g. reusable bottle, shorter showers, less food waste).",
          },
          {
            text: "Surround yourself with people who make sustainable choices.",
          },
          {
            text: "Link sustainable habits to things you enjoy (e.g. walking, cooking, minimalism).",
          },
          {
            text: "Reward yourself mentally when you make a better choice.",
          },
          {
            text: "Give yourself credit for small improvements – every step counts, even if it doesn't feel like much.",
          },
        ],
      },
    ],
  },
  habits: {
    travel: [
      {
        sectionTitle: "Daily commuting",
        items: [
          {
            text: "Try replacing a few car trips per week with walking, biking, or public transport when it's convenient.",
          },
          {
            text: "Carpool with classmates occasionally to reduce costs and environmental impact.",
          },
          {
            text: "Plan ahead to choose more sustainable routes when possible – it doesn't have to be every day.",
          },
          {
            text: "Consider combining several activities into one trip to reduce the number of journeys you make.",
          },
        ],
      },
      {
        sectionTitle: "Air travel",
        items: [
          {
            text: "Even if you make sustainable choices daily, one or two flights per year can have a bigger environmental impact than many of those efforts combined.",
          },
          {
            text: "See how flights compare to other daily habits using the European Environment Agency overview on transport emissions.",
            links: [
              {
                label: "LINK",
                url: "https://www.eea.europa.eu/en/topics/in-depth/transport-and-mobility",
              },
            ],
          },
          {
            text: "Explore a simple personal impact comparison with a flight calculator from the International Civil Aviation Organization.",
            links: [
              {
                label: "LINK",
                url: "https://www.icao.int/environmental-protection/environmental-tools/icec",
              },
            ],
          },
          {
            text: "If possible, choose direct flights, as take-off and landing account for a large share of aviation emissions.",
          },
        ],
      },
    ],
    living: [
      {
        sectionTitle: "Laundry",
        items: [
          {
            text: "Wear clothes more than once when possible; many items don't need washing after a single use.",
            links: [
              {
                label: "LINK",
                url: "https://www.nationalgeographic.com/environment/article/partner-content-laundry-lightening-the-load",
              },
            ],
          },
          {
            text: "Wash only full loads to reduce the number of cycles per week.",
          },
          {
            text: "Choose eco or short cycles when available to reduce environmental impact.",
          },
          {
            text: "Air-dry clothes whenever possible instead of using a tumble dryer.",
          },
        ],
      },
      {
        sectionTitle: "Room temperature - winter",
        items: [
          {
            text: "Lower your room temperature by 1°C - it can reduce energy use without you really noticing.",
            links: [
              {
                label: "LINK",
                url: "https://www.wwf.org.uk/challenges/turn-down-one-degree",
              },
            ],
          },
          {
            text: "Wear warm clothes indoors instead of increasing heating.",
          },
          {
            text: "Air out rooms briefly instead of leaving windows open for long periods.",
          },
          {
            text: "Adjust heating when you're not in the room to avoid unnecessary energy user.",
          },
        ],
      },
      {
        sectionTitle: "Room temperature - summer",
        items: [
          {
            text: "Close blinds or curtains during the day to prevent heat from entering.",
            links: [
              {
                label: "LINK",
                url: "https://www.iea.org/reports/the-future-of-cooling",
              },
            ],
          },
          {
            text: "Air out your room early in the morning or late in the evening when it's cooler.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=4BLfYtE4Kow",
              },
            ],
          },
          {
            text: "Avoid setting AC too low—each degree lower increases energy use significantly.",
          },

        ],
      },
      {
        sectionTitle: "Showers",
        items: [
          {
            text: "Challenge yourself to slightly shorter showers (e.g. 1–2 minutes less) than usual.",
            links: [
              {
                label: "LINK",
                url: "https://www.nationalgeographic.com/environment/article/paid-content-five-ways-to-wash-with-less-water",
              },
            ],
          },
          {
            text: "Remember that shorter showers save both water and energy without affecting your routine much.",
          },

        ],
      },
      {
        sectionTitle: "Tap water",
        items: [
          {
            text: "Make it a habit to turn off the tap while brushing or soaping—it only takes a second and saves a lot of water.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=V9ODb6YAeFc",
              },
            ],
          },

        ],
      },
      {
        sectionTitle: "Devices and chargers",
        items: [
          {
            text: "Unplug chargers and devices when not in use—they still use energy even when idle.",
          },
          {
            text: "Charge devices only when needed and avoid leaving them plugged in overnight.",
          },
          {
            text: "Use power strips with switches to turn off multiple devices at once.",
          },

        ],
      },
      {
        sectionTitle: "Recycling/waste separation",
        items: [
          {
            text: "Set up simple bins (paper, plastic, mixed) so recycling is easy and automatic.",
            links: [
              {
                label: "LINK",
                url: "https://www.bbc.co.uk/teach/school-radio/articles/z8hrydm",
              },
            ],
          },
          {
            text: "Check local guidelines to make sure you separate waste correctly.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=y2GKFtWBLRk",
              },
            ],
          },
          {
            text: "Rinse packaging quickly before recycling to avoid contamination.",
          },

        ],
      },
    ],
    buying: [
      {
        sectionTitle: "Meat consumption",
        items: [
          {
            text: "Not sure why eating meat could be a problem for the environment? Check the link for explanation.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=F1Hq8eVOMHs",
              },
            ],
          },
          {
            text: "Try having 1–2 meat-free days per week (e.g. 'Meatless Monday') to reduce your impact.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=NxvQPzrg2Wg",
              },
            ],
          },
          {
            text: "Choose smaller portions of meat and add more vegetables or plant-based proteins.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=5sVfTPaxRwk",
              },
            ],
          },
        ],
      },
      {
        sectionTitle: "Takeaways and home cooking",
        items: [
          {
            text: "Cook simple meals at home more often to reduce packaging waste and save money.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=5qx2WFpNTPs",
              },
            ],
          },
          {
            text: "Choose local restaurants to reduce transport impact.",
            links: [
              {
                label: "LINK",
                url: "https://www.unep.org/news-and-stories/story/seven-ways-cut-your-food-waste-and-support-planet",
              },
            ],
          },
          {
            text: "Plan meals ahead so you're less likely to rely on takeaways.",
          },
          
        ],
      },
      {
        sectionTitle: "Meal planning and food waste",
        items: [
          {
            text: "Store leftovers in visible containers so you don't forget to eat them.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=Lm56PvEYUVQ",
              },
            ],
          },
          {
            text: "Plan just a few meals per week to avoid overbuying and wasting food.",
          },
          {
            text: "Watch the impact of buying local food.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=pC8V78nCVg4",
              },
            ],
          },
        ],
      },
      {
        sectionTitle: "Local and seasonal food",
        items: [
          {
            text: "Try visiting a local market occasionally instead of doing all your shopping in supermarkets.",
          },
          {
            text: "Look for seasonal products, they're often cheaper, fresher and richer in nutrients.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=y6-8EDwvklM",
              },
            ],
          },
          {
            text: "Plan meals around seasonal ingredients.",
          },
        ],
      },
      {
        sectionTitle: "Reusable bags",
        items: [
          {
            text: "Keep a reusable bag in your backpack so you always have it when shopping.",
            links: [
              {
                label: "LINK",
                url: "https://www.nationalgeographic.com/environment/article/plastic-pollution",
              },
            ],
          },
          {
            text: "Choose durable bags you like so you'll use them more often.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=C4hiOf86ufg",
              },
            ],
          },
        ],
      },
      {
        sectionTitle: "Reusable bottle and mug",
        items: [
          {
            text: "Carry a reusable bottle or mug with you daily, so you don't need to buy single-use drinks.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=m6msEeBMumE",
              },
            ],
          },
          {
            text: "Refill your bottle regularly instead of buying bottled water or takeaway coffee.",
            links: [
              {
                label: "LINK",
                url: "https://www.nationalgeographic.com/science/article/why-tap-water-is-better",
              },
            ],
          },
        ],
      },
      {
        sectionTitle: "Second-hand, rental and repair",
        items: [
          {
            text: "Try buying second-hand clothing or gear for some items instead of always choosing new.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=tLfNUD0-8ts",
              },
            ],
          },
          {
            text: "Explore thrift shops or online platforms to find affordable and unique pieces.",
            links: [
              {
                label: "LINK",
                url: "https://www.vinted.com/",
              },
            ],
          },
          {
            text: "Consider renting items for occasional use instead of buying them.",
            links: [
              {
                label: "LINK",
                url: "https://www.biologicaldiversity.org/programs/population_and_sustainability/sustainability/secondhand_101",
              },
            ],
          },
          {
            text: "Exchange books, clothing, or equipment with other students before buying new items.",
          }
        ],
      },
      {
        sectionTitle: "New clothing purchases",
        items: [
          {
            text: "Try buying fewer new items by choosing only what you really need.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=VaS-iVwaOLw",
              },
            ],
          },
          {
            text: "Reduce impulse purchases by waiting a day before buying something new.",
          },
        ],
      },
    ],
    digital: [
      {
        sectionTitle: "Device lifespan",
        items: [
          {
            text: "Use your devices if they still work well instead of upgrading too early.",
            links: [
              {
                label: "LINK",
                url: "https://learninglab.gitlabpages.inria.fr/mooc-impacts-num/mooc-impacts-num-ressources/en/Partie2/Activites/Capsule_Partie2_4_Agir/story.html",
              },
            ],
          },
          {
            text: "Repair small issues (battery, screen) instead of replacing the whole device.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=eyUqqA8wA0A",
              },
            ],
          },
          {
            text: "Protect your device (case, screen protector) to extend its lifespan.",
          },
        ],
      },
      {
        sectionTitle: "Energy-saving modes",
        items: [
          {
            text: "Turn on energy-saving mode on your phone and laptop—it reduces energy use without affecting daily use much.",
            links: [
              {
                label: "LINK",
                url: "https://www.nationalgeographic.com/environment/article/plastic-pollution",
              },
            ],
          },
          {
            text: "Lower screen brightness and enable auto-brightness to save energy effortlessly.",
            links: [
              {
                label: "LINK",
                url: "https://learninglab.gitlabpages.inria.fr/mooc-impacts-num/mooc-impacts-num-ressources/en/Partie3/Activites/Capsule_Partie3_3_Mesurer/story.html",
              },
            ],
          },
          {
            text: "Use sleep mode or auto-lock to avoid devices staying on unnecessarily.",
          },
          {
            text: "Turn off Bluetooth, GPS, or other background services when not needed .",
          },
        ],
      },
      {
        sectionTitle: "Digital clean-up",
        items: [
          {
            text: "Do a quick digital clean-up once a month (files, apps, emails) to keep things organized and efficient.",
          },
          {
            text: "Delete apps you don't use—less clutter and better device performance.",
            links: [
              {
                label: "LINK",
                url: "https://www.digitalcleanupday.org/",
              },
            ],
          },
          {
            text: "Unsubscribe from emails you never open to reduce inbox clutter.",
            links: [
              {
                label: "LINK",
                url: "https://learninglab.gitlabpages.inria.fr/mooc-impacts-num/mooc-impacts-num-ressources/en/Partie3/Activites/Capsule_Partie3_2_ComplementVideo/story.html",
              },
            ],
          },
        ],
      },
      {
        sectionTitle: "Trade-in and recycling programs",
        items: [
          {
            text: "Use trade-in programs when buying a new device to recycle your old one responsibly.",
            links: [
              {
                label: "LINK",
                url: "https://www.bbc.co.uk/newsround/68684673",
              },
            ],
          },
          {
            text: "Check if your retailer offers discounts when you return your old device.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=_ES_Crcgfvc",
              },
            ],
          },
          {
            text: "Look for brands that support recycling and repair programs.",
          },
        ],
      },
      {
        sectionTitle: "E-waste disposal",
        items: [
          {
            text: "Take old chargers, cables, and batteries to designated e-waste collection points instead of throwing them away.",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=4GtWGHvX-rk",
              },
            ],
          },
          {
            text: "Check where the nearest e-waste bin is (supermarkets, electronics stores, campus).",
            links: [
              {
                label: "LINK",
                url: "https://www.youtube.com/watch?v=gAAWVfcnk3A",
              },
            ],
          },
          {
            text: "Think of e-waste as recyclable, not regular trash.",
          },
        ],
      },
    ],
  },
  community: {
    default: [
      {
        sectionTitle: "Community Engagement",
        items: [
          {
            text: "Engage with local environmental groups and participate in community sustainability projects.",
          },
        ],
      },
    ],
  },
};

function TipsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("awareness");
  const [activeHabitSub, setActiveHabitSub] = useState<HabitSubCategoryKey>("travel");
  const handleHabitSubChange = (sub: HabitSubCategoryKey) => {
  setActiveHabitSub(sub);
  window.scrollTo({ top: 0, behavior: "smooth" }); // Vraca na vrh sa glatkom animacijom
};

  // Trenutna grupa saveta za prikaz
  const currentGroups: TipGroup[] =
    activeCategory === "habits"
      ? tipsData.habits[activeHabitSub] || []
      : tipsData[activeCategory]?.default || [];

  return (
    <main className="font-gilroy min-h-screen bg-white text-[#333333]">
      <Navigation />

      {/* Header Band */}
      <section className="border-b border-[#E5E7EB] bg-white py-8">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 sm:px-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] font-bold tracking-tight text-[#1E2B4D] md:text-[38px]">
              Check Tips &amp; Tricks
            </h1>
            <p className="text-[15px] text-[#555555] md:text-[17px]">
              Discover simple tips &amp; tricks to improve your Green score and build more sustainable habits.
            </p>
          </div>
          <img
            src={sumosWordmark}
            alt="SuMoS"
            className="hidden h-10 w-auto object-contain md:block"
          />
        </div>
      </section>

      {/* Main Content Area */}
      <section className="min-h-[500px] bg-white py-10 relative min-h-screen">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
          
          {/* Top Green Category Navigation */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* AWARENESS */}
            <button
              onClick={() => setActiveCategory("awareness")}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-bold tracking-wide transition-all ${
                activeCategory === "awareness"
                  ? "border-[#65AD55] bg-[#65AD55] text-white shadow-sm"
                  : "border-[#D0D0D0] bg-white text-[#4A4A4A] hover:border-[#65AD55]"
              }`}
            >
              <Lightbulb className="h-4 w-4 shrink-0" />
              <span>AWARENESS</span>
            </button>

            {/* ATTITUDES/MOTIVATIONS */}
            <button
              onClick={() => setActiveCategory("attitudes")}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-bold tracking-wide transition-all ${
                activeCategory === "attitudes"
                  ? "border-[#65AD55] bg-[#65AD55] text-white shadow-sm"
                  : "border-[#D0D0D0] bg-white text-[#4A4A4A] hover:border-[#65AD55]"
              }`}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span>ATTITUDES/MOTIVATIONS</span>
            </button>

            {/* HABITS */}
            <button
              onClick={() => setActiveCategory("habits")}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-bold tracking-wide transition-all ${
                activeCategory === "habits"
                  ? "border-[#65AD55] bg-[#65AD55] text-white shadow-sm"
                  : "border-[#D0D0D0] bg-white text-[#4A4A4A] hover:border-[#65AD55]"
              }`}
            >
              <ThumbsUp className="h-4 w-4 shrink-0" />
              <span>HABITS</span>
            </button>

            {/* COMMUNITY ENGAGEMENT */}
            <button
              onClick={() => setActiveCategory("community")}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-bold tracking-wide transition-all ${
                activeCategory === "community"
                  ? "border-[#65AD55] bg-[#65AD55] text-white shadow-sm"
                  : "border-[#D0D0D0] bg-white text-[#4A4A4A] hover:border-[#65AD55]"
              }`}
            >
              <Users className="h-4 w-4 shrink-0" />
              <span>COMMUNITY ENGAGEMENT</span>
            </button>
          </div>

          {/* List of Tips */}
          <div className="mx-auto max-w-[850px] space-y-10">
            {currentGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-4">
                {/* Section Title with Green Left Border */}
                <div className="border-l-4 border-[#65AD55] py-0.5 pl-3">
                  <h2 className="text-[20px] font-bold text-[#1E2B4D]">
                    {group.sectionTitle}
                  </h2>
                </div>

                {/* Items */}
                <ul className="space-y-4 pl-1">
                  {group.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-3">
                      {/* Custom bullet point */}
                      <span className="mt-[8px] h-2 w-2 shrink-0 rounded-full bg-[#65AD55]" />
                      
                      <div className="flex flex-col gap-2 text-[14px] leading-relaxed text-[#4A4A4A]">
                        <span>{item.text}</span>

                        {/* Blue Link Badges (Pilula dizajn) */}
                        {item.links && item.links.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-2">
                            {item.links.map((link, lIdx) => (
                              <a
                                key={lIdx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#4D8CFF] bg-white px-3 py-0.5 text-[12px] text-[#4D8CFF] transition-all hover:bg-[#F2F7FF]"
                              >
                                <span>{link.label}</span>
                                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Dark Blue Floating Habits Menu */}
{activeCategory === "habits" && (
  <div className="sticky bottom-6 z-50 mx-auto flex w-fit justify-center pt-8">
    <div className="inline-flex max-w-full items-center gap-1.5 overflow-x-auto rounded-2xl border border-[#172545] bg-[#213560] p-1.5 shadow-lg sm:gap-2">
      
      {/* TRAVEL */}
      <button
        onClick={() => handleHabitSubChange("travel")}
        className={`flex min-w-[95px] flex-col items-center justify-center rounded-xl px-3 py-2 transition-all sm:min-w-[110px] ${
          activeHabitSub === "travel"
            ? "bg-white font-bold text-[#213560] shadow-sm"
            : "font-medium text-white hover:bg-white/10"
        }`}
      >
        <Plane className={`mb-1 h-4 w-4 ${activeHabitSub === "travel" ? "text-[#65AD55]" : "text-white"}`} />
        <span className="text-center text-[10px] uppercase tracking-wider">TRAVEL</span>
      </button>

      {/* LIVING AND ACCOMMODATION */}
      <button
        onClick={() => handleHabitSubChange("living")}
        className={`flex min-w-[115px] flex-col items-center justify-center rounded-xl px-3 py-2 transition-all sm:min-w-[135px] ${
          activeHabitSub === "living"
            ? "bg-white font-bold text-[#213560] shadow-sm"
            : "font-medium text-white hover:bg-white/10"
        }`}
      >
        <Home className={`mb-1 h-4 w-4 ${activeHabitSub === "living" ? "text-[#65AD55]" : "text-white"}`} />
        <span className="text-center text-[10px] uppercase leading-tight tracking-wider">
          LIVING AND<br />ACCOMMODATION
        </span>
      </button>

      {/* BUYING AND CONSUMPTION */}
      <button
        onClick={() => handleHabitSubChange("buying")}
        className={`flex min-w-[115px] flex-col items-center justify-center rounded-xl px-3 py-2 transition-all sm:min-w-[135px] ${
          activeHabitSub === "buying"
            ? "bg-white font-bold text-[#213560] shadow-sm"
            : "font-medium text-white hover:bg-white/10"
        }`}
      >
        <ShoppingBag className={`mb-1 h-4 w-4 ${activeHabitSub === "buying" ? "text-[#65AD55]" : "text-white"}`} />
        <span className="text-center text-[10px] uppercase leading-tight tracking-wider">
          BUYING AND<br />CONSUMPTION
        </span>
      </button>

      {/* DIGITAL HABITS */}
      <button
        onClick={() => handleHabitSubChange("digital")}
        className={`flex min-w-[95px] flex-col items-center justify-center rounded-xl px-3 py-2 transition-all sm:min-w-[110px] ${
          activeHabitSub === "digital"
            ? "bg-white font-bold text-[#213560] shadow-sm"
            : "font-medium text-white hover:bg-white/10"
        }`}
      >
        <Smartphone className={`mb-1 h-4 w-4 ${activeHabitSub === "digital" ? "text-[#65AD55]" : "text-white"}`} />
        <span className="text-center text-[10px] uppercase leading-tight tracking-wider">
          DIGITAL<br />HABITS
        </span>
      </button>

    </div>
  </div>
)}

        </div>
      </section>

      <Institutions />
      <Footer />
    </main>
  );
}

export default TipsPage;