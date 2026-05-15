import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { BadgeDisplay } from "@/components/shared/BadgeDisplay";
import { QuestionRenderer } from "@/components/survey/QuestionRenderer";
import { useSurvey } from "@/contexts/SurveyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Eye,
  BarChart3,
  Lightbulb,
  Sun,
  MessageSquare,
  Settings,
  Shield,
  User,
  GraduationCap,
  Plane,
  Globe2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Question } from "@/types/survey";
import { toast } from "sonner";
import ConsentStep from "@/components/survey/ConsentStep";
import { DetailedResults } from "@/components/survey/DetailedResults";
import scooterGirl from "@/assets/scooter-girl.png";
import postalEnvelope from "@/assets/postal-envelope.png";
/** Mapiranje backend kategorija na ikonice (case-insensitive prefiks). */
const CATEGORY_META: {
  match: (c: string) => boolean;
  label: string;
  icon: typeof Sun;
}[] = [
  { match: (c) => c === "Demographic data", label: "Demographics", icon: User },
  {
    match: (c) => c === "Study status data",
    label: "Study",
    icon: GraduationCap,
  },
  {
    match: (c) => c === "Exchange experience data",
    label: "Exchange",
    icon: Plane,
  },
  { match: (c) => c === "AWARENESS", label: "Awareness", icon: Sun },
  {
    match: (c) => c === "ATTITUDES/MOTIVATIONS",
    label: "Attitudes",
    icon: MessageSquare,
  },
  { match: (c) => c.startsWith("HABITS"), label: "Habits", icon: Settings },
  { match: (c) => c.startsWith("BARRIERS"), label: "Barriers", icon: Shield },
  { match: (c) => /MOBILITY/i.test(c), label: "Mobility", icon: Globe2 },
];
// Funkcija za mobility done da se samo ovde izvlaci
export function deriveMobilityDone(exchangeStatusValue: string | undefined): boolean {
  if (!exchangeStatusValue) return false;
  return /^Yes|currently on my semester abroad/i.test(exchangeStatusValue);
}

/** Grupiše pitanja u "step grupe" — jedan tab = jedna meta grupa. */
type StepGroup = {
  key: string; // npr. "AWARENESS", "HABITS", "MOBILITY"
  label: string;
  icon: typeof Sun;
  /** Pod-koraci: po backend `category`. Za većinu grupa imaće samo 1 podkorak. */
  subSteps: { category: string; questions: Question[] }[];
};

function buildStepGroups(
  questions: Question[],
  includeMobility: boolean,
): StepGroup[] {
  const groups: StepGroup[] = [];

  for (const q of questions) {
    const foundMeta = CATEGORY_META.find((m) => m.match(q.category));
    const meta = foundMeta
      ? { key: foundMeta.label.toUpperCase(), label: foundMeta.label, icon: foundMeta.icon }
      : { key: q.category.toUpperCase(), label: q.category, icon: Sun };

    if (!includeMobility && meta.label === "Mobility") continue;

    let currentGroup = groups[groups.length - 1];
    if (!currentGroup || currentGroup.key !== meta.key) {
      currentGroup = {
        key: meta.key,
        label: meta.label,
        icon: meta.icon,
        subSteps: [],
      };
      groups.push(currentGroup);
    }

    let currentSubStep = currentGroup.subSteps[currentGroup.subSteps.length - 1];
    if (!currentSubStep || currentSubStep.category !== q.category) {
      currentSubStep = {
        category: q.category,
        questions: [],
      };
      currentGroup.subSteps.push(currentSubStep);
    }

    currentSubStep.questions.push(q);
  }

  return groups;
}

/** Skraćuje "HABITS - Travel" → "Travel"; ostavlja ostale. */
function shortSubLabel(category: string): string {
  const idx = category.indexOf(" - ");
  return idx === -1 ? category : category.slice(idx + 3);
}

function getQuestionStatus(q: Question, answers: Record<string, any>) {
  const val = answers[q.key];
  if (val === undefined || val === null || val === "") return false;
  if (q.type === "LIKERT-MATRIX") {
    const options = q.options as string[];
    if (typeof val !== "object" || val === null) return false;
    return options.every((opt) => val[opt] !== undefined);
  }
  if (q.type === "RUBRIC") {
    const dimensions = q.options as any[];
    if (typeof val !== "object" || val === null) return false;
    return dimensions.every((d) => val[d.dimension] !== undefined);
  }
  return true;
}

function getSubStatus(sub: { questions: Question[] }, answers: Record<string, any>) {
  let totalMandatory = 0;
  let answeredMandatory = 0;
  let hasAnyAnswer = false;
  for (const q of sub.questions) {
    const answered = getQuestionStatus(q, answers);
    if (answered) hasAnyAnswer = true;
    if (!q.optional) {
      totalMandatory++;
      if (answered) answeredMandatory++;
    }
  }
  if (totalMandatory === 0) return hasAnyAnswer ? "completed" : "empty";
  if (answeredMandatory === totalMandatory) return "completed";
  if (hasAnyAnswer || answeredMandatory > 0) return "partial";
  return "empty";
}

function getGroupStatus(g: StepGroup, answers: Record<string, any>) {
  let allCompleted = true;
  let hasAnyAnswer = false;
  for (const sub of g.subSteps) {
    const s = getSubStatus(sub, answers);
    if (s !== "completed") allCompleted = false;
    if (s !== "empty") hasAnyAnswer = true;
  }
  if (allCompleted) return "completed";
  if (hasAnyAnswer) return "partial";
  return "empty";
}

export default function SurveyPage() {
  const {
    state,
    questions,
    questionsLoading,
    setAnswer,
   // setGeneralInfo,
    setIsRealAttempt,
    setEmail,
    completeSurvey,
    getScore,
    getProgress,
    // mobilityDone,
    hasConsented,
    setHasConsented,
  } = useSurvey();

  const [currentStep, setCurrentStep] = useState(0);
  const [groupIdx, setGroupIdx] = useState(0);
  const [subIdx, setSubIdx] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBeforeFinish, setShowBeforeFinish] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  //const [mobilityDone, setMobilityDone] = useState(false);
  const navigate = useNavigate();

  const mobilityDone = useMemo(() => {
    const v = state.answers["exchange_status"];
    return (
      deriveMobilityDone(typeof v === "string" ? v : undefined) 
      
    );
  }, [state.answers]);

  const handleDisagree = () => {
    // Toast sa trajanjem (duration) od 3000ms (3 sekunde)
    toast.error("The survey is interrupted", {
      description: "You did not provide consent. Redirecting to home...",
      duration: 3000, // Ovo rešava tvoje pitanje o ograničenju toasta
    });

    // Pauza od 3 sekunde pre navigacije
    setTimeout(() => {
      setHasConsented(false);
      navigate("/");
    }, 3000);
  };

  const groups = useMemo(
    () => buildStepGroups(questions, mobilityDone),
    [questions, mobilityDone],
  );

  const allQuestionsNav = useMemo(() => {
    let globalNum = 1;
    const nav: { num: number; q: Question; gIdx: number; sIdx: number; isAnswered: boolean }[] = [];
    groups.forEach((g, gIdx) => {
      g.subSteps.forEach((s, sIdx) => {
        s.questions.forEach((q) => {
          nav.push({
            num: globalNum++,
            q,
            gIdx,
            sIdx,
            isAnswered: getQuestionStatus(q, state.answers),
          });
        });
      });
    });
    return nav;
  }, [groups, state.answers]);

  const currentGroup = groups[groupIdx];
  const currentSub = currentGroup?.subSteps[subIdx];
  const currentQuestions = currentSub?.questions ?? [];

  const isLastSub = currentGroup
    ? subIdx === currentGroup.subSteps.length - 1
    : true;
  const isLastGroup = groupIdx === groups.length - 1;

  const globalValidate = () => {
    for (let gIdx = 0; gIdx < groups.length; gIdx++) {
      const group = groups[gIdx];
      for (let sIdx = 0; sIdx < group.subSteps.length; sIdx++) {
        const sub = group.subSteps[sIdx];
        for (const q of sub.questions) {
          if (!q.optional && !getQuestionStatus(q, state.answers)) {
            return { gIdx, sIdx, key: q.key };
          }
        }
      }
    }
    return null;
  };

//uvek na top
  useEffect(() => {
  if (!errorKey) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}, [groupIdx, subIdx, errorKey]);

  const goNext = () => {
    if (isLastGroup && isLastSub) {
      const errorLoc = globalValidate();
      if (errorLoc) {
        toast.error("Missing answers", {
          description: "Please answer all mandatory questions. We've highlighted the missing one.",
          duration: 4000,
        });
        setGroupIdx(errorLoc.gIdx);
        setSubIdx(errorLoc.sIdx);
        setErrorKey(errorLoc.key);
        setTimeout(() => {
          document.getElementById(`question-${errorLoc.key}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
        return;
      }
      
      setErrorKey(null);
      setCurrentStep(1);
      setShowBeforeFinish(true);
      return;
    }

    setErrorKey(null);
    if (currentGroup && !isLastSub) {
      setSubIdx(subIdx + 1);
      return;
    }
    if (!isLastGroup) {
      setGroupIdx(groupIdx + 1);
      setSubIdx(0);
      return;
    }
    ;
  };

  const goBack = () => {
    setErrorKey(null);
    if (subIdx > 0) {
      setSubIdx(subIdx - 1);
    } else if (groupIdx > 0) {
      const prev = groups[groupIdx - 1];
      setGroupIdx(groupIdx - 1);
      setSubIdx(prev.subSteps.length - 1);
    } else {
      setHasConsented(false);
    }

  };

  const fillRandomAnswers = () => {
    const rand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    for (const q of questions) {
      // Mobility pitanja preskači ako student nije bio na razmeni
      if (q.requiresMobility && !mobilityDone) continue;

      switch (q.type) {
        case "LIKERT":
          setAnswer(q.key, randInt(1, 5));
          break;
        case "SINGLE_CHOICE": {
          const opts = q.options as string[];
          if (opts?.length) setAnswer(q.key, rand(opts));
          break;
        }
        case "NUMBER":
          setAnswer(q.key, randInt(0, 50));
          break;
        case "TEXT":
          setAnswer(q.key, "Test answer");
          break;
        case "LIKERT-MATRIX": {
          const opts = q.options as string[];
          const v: Record<string, number> = {};
          opts?.forEach((o) => (v[o] = randInt(1, 5)));
          setAnswer(q.key, v);
          break;
        }
        case "RUBRIC": {
          const dims = q.options as { dimension: string }[];
          const v: Record<string, number> = {};
          dims?.forEach((d) => (v[d.dimension] = randInt(1, 5)));
          setAnswer(q.key, v);
          break;
        }
      }
    }
    setErrorKey(null);
    toast.success("Survey filled with random answers");
  };

  const handleAttemptChoice = async (isReal: boolean) => {
    setIsRealAttempt(isReal);
    setShowBeforeFinish(false);
    if (isReal) {
      setShowEmailModal(true);
    } else {
      try {
        await completeSurvey({ isRealAttempt: false });
        setCurrentStep(2);
      } catch (error) {
        toast.error("Failed to submit to backend. Check console for details.");
      }
    }
  };

  const handleEmailSubmit = async () => {
    setShowEmailModal(false);
    try {
      await completeSurvey({ isRealAttempt: true, email: state.email });
      setCurrentStep(2);
    } catch (error) {
      toast.error("Failed to submit to backend. Check console for details.");
    }
  };
  //Ovde treba hendlovati logiku odgovora i bedz koji je dobio - tu treba prosiriti model dodatno moramo da vidimo kako ce se vracati rezultati
  //I gde ce se zapravo cuvati bedz - da li ima smisla perzistirati ga ili ga racunati svaki put naknadno
  const score = getScore();
  // const badge = getBadge(score);
  const progress = getProgress();

  // const comparisonData = [
  //   ...countryFootprintData.slice(0, 5).map((d: { country: string; score: number; color: string }) => ({ ...d, isYou: false })),
  //   { country: "You", score, color: "hsl(210, 70%, 55%)", isYou: true },
  // ];

  const headerTitle =
    currentStep === 2
      ? "View detailed result"
      : "Complete the Survey";

  return (
    <Layout>
      <PageHeader
        title={headerTitle}
        subtitle="Students' Green Awareness and Sustainable Habits"
      />

      <div className={cn("w-full", currentStep === 2 ? "py-0" : "px-4 py-8")}>
        <div className={cn("relative w-full", currentStep === 2 ? "" : "mx-auto max-w-3xl")}>
          
          {/* Left Sidebar (Question Navigator) - absolute so it doesn't shift centered content */}
          {hasConsented && currentStep === 0 && (
            <div className="hidden lg:block lg:absolute lg:right-full lg:top-0 lg:mr-8 w-64 xl:w-80 shrink-0">
              <div className="sticky top-8 max-h-[85vh] overflow-y-auto rounded-lg border bg-card p-4 shadow-sm scrollbar-thin">
                <h3 className="text-base font-bold mb-4 text-foreground text-center">Question Navigator</h3>
                <div className="grid grid-cols-10 gap-1">
                  {allQuestionsNav.map((item) => (
                    <button
                      key={item.q.key}
                      onClick={() => {
                        setErrorKey(null);
                        setGroupIdx(item.gIdx);
                        setSubIdx(item.sIdx);
                        setTimeout(() => {
                          document.getElementById(`question-${item.q.key}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }, 100);
                      }}
                      title={item.q.text}
                      className={cn(
                        "aspect-square rounded text-[9px] sm:text-[10px] font-bold transition-all flex items-center justify-center border",
                        item.isAnswered 
                          ? "bg-green-500 text-white border-green-600 shadow-sm" 
                          : "bg-yellow-400 text-yellow-950 border-yellow-500 shadow-sm",
                        item.gIdx === groupIdx && item.sIdx === subIdx && "ring-2 ring-primary ring-offset-2"
                      )}
                    >
                      {item.num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 w-full max-w-6xl mx-auto">
          {!hasConsented ? (
            <ConsentStep
              onAgree={() => setHasConsented(true)}
              onDisagree={handleDisagree}
            />
          ) : (
            <>
              {/* ─────────── Step 0 & 1: Dinamička pitanja ─────────── */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  {questionsLoading || groups.length === 0 ? (
                    <div className="rounded-lg border bg-card p-10 text-center text-base text-muted-foreground">
                      Loading questions…
                    </div>
                  ) : (
                    <>
                      {/* Glavni tab-ovi (grupe) — povezani pill row kao u Figmi */}
                      <div className="mx-auto inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-card p-1 shadow-[var(--shadow-card)]">
                        {groups.map((g, i) => {
                          const Icon = g.icon;
                          const status = getGroupStatus(g, state.answers);
                          const isActive = i === groupIdx;
                          let btnClass =
                            "bg-card text-muted-foreground border border-border hover:bg-muted";

                          if (isActive) {
                            btnClass = "bg-brand-green text-white shadow-sm";
                          } else if (i < groupIdx) {
                            btnClass =
                              i === 0
                                ? "bg-brand-blue-deep text-white"
                                : "bg-brand-blue text-white";
                          } else if (status === "completed") {
                            btnClass = "bg-brand-blue text-white";
                          } else if (status === "partial") {
                            btnClass = "bg-brand-blue/70 text-white";
                          }

                          return (
                            <button
                              key={g.key}
                              onClick={() => {
                                setErrorKey(null);
                                setGroupIdx(i);
                                setSubIdx(0);
                              }}
                              className={cn(
                                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold tracking-wider transition-colors",
                                btnClass,
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              {g.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Pod-koraci (samo ako grupa ima više sub-step-ova, npr. HABITS) */}
                      {currentGroup && currentGroup.subSteps.length > 1 && (
                        <div className="flex items-start justify-center gap-0 py-4 flex-nowrap w-full overflow-x-auto">
                          {currentGroup.subSteps.map((sub, i) => {
                            const subStatus = getSubStatus(sub, state.answers);
                            const isCurrent = subIdx === i;
                            return (
                              <div key={sub.category} className="flex items-start">
                                <button
                                  onClick={() => {
                                    setErrorKey(null);
                                    setSubIdx(i);
                                  }}
                                  className="flex w-[110px] flex-col items-center gap-2"
                                >
                                  <div
                                    className={cn(
                                      "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors",
                                      isCurrent
                                        ? "bg-brand-green text-white"
                                        : subStatus === "completed"
                                          ? "bg-brand-blue text-white"
                                          : subStatus === "partial"
                                            ? "bg-brand-blue/70 text-white"
                                            : "bg-card border border-border text-muted-foreground",
                                    )}
                                  >
                                    {String(i + 1).padStart(2, "0")}
                                  </div>
                                  <span
                                    className={cn(
                                      "max-w-[100px] text-center text-[11px] leading-tight",
                                      isCurrent
                                        ? "font-semibold text-brand-blue-deep"
                                        : "text-muted-foreground",
                                    )}
                                  >
                                    {shortSubLabel(sub.category)}
                                  </span>
                                </button>
                                {i < currentGroup.subSteps.length - 1 && (
                                  <div className="mt-4 h-px flex-1 min-w-[16px] bg-border" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Pitanja */}
                      <div className="rounded-lg border bg-card p-6 space-y-2">
                        {currentSub && (
                          <div className="mb-2 border-b border-border pb-3">
                            <h3 className="text-base font-bold text-foreground">
                              {currentSub.category}
                            </h3>
                          </div>
                        )}
                        {currentQuestions.map((q) => (
                          <div
                            key={q.key}
                            id={`question-${q.key}`}
                            className={cn(
                              "transition-all duration-300",
                              errorKey === q.key ? "ring-2 ring-destructive ring-offset-2 p-3 bg-destructive/5 rounded-xl" : ""
                            )}
                          >
                            <QuestionRenderer
                              question={q}
                              value={state.answers[q.key]}
                              onChange={(v) => {
                                if (errorKey === q.key) setErrorKey(null);
                                setAnswer(q.key, v);
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Bottom nav */}
                      <div className="space-y-3 pt-2">
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full border-dashed text-sm"
                            onClick={fillRandomAnswers}
                          >
                            🎲 Fill with random answers (dev)
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            className="rounded-full px-6"
                            onClick={goBack}
                          >
                            Back
                          </Button>
                          <span className="text-base font-bold text-foreground">
                            {progress}%
                          </span>
                          <Button
                            className="rounded-full bg-brand-green px-8 text-white hover:bg-brand-green/90"
                            onClick={goNext}
                          >
                            {isLastGroup && isLastSub ? "Finish" : "Next"}
                          </Button>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ─────────── Step 2: Detailed Results ─────────── */}
              {currentStep === 2 && <DetailedResults />}
            </>
          )}
          </div>

          {/* Right Dummy Element (Balances the Left Sidebar to keep the main form perfectly centered) */}
          {hasConsented && currentStep === 0 && (
            <div className="hidden lg:block w-64 xl:w-80 shrink-0" />
          )}
        </div>
      </div>

      {/* Before finishing modal — Real attempt vs Pilot */}
      <Dialog
        open={showBeforeFinish}
        onOpenChange={(open) => {
          if (!open) {
            setShowBeforeFinish(false);
            setCurrentStep(0);
          }
        }}
      >
        <DialogContent className="max-w-[760px] rounded-3xl p-0 overflow-hidden border border-border/40">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] items-center bg-white p-6">
            <div className="px-2 lg:px-8 py-6 max-w-[460px]">
              <DialogHeader>
                <DialogTitle className="mb-6 text-3xl font-bold text-brand-blue-deep leading-tight text-left">
                  Before finishing the survey....
                </DialogTitle>
                <DialogDescription className="mb-8 text-base text-muted-foreground leading-relaxed text-left">
                  Please tell us whether you actually completed the survey for
                  real or were just trying it out.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 w-full max-w-[400px]">
                <Button
                  className="w-full h-12 rounded-lg bg-brand-blue text-white hover:bg-brand-blue/90 text-base font-medium"
                  onClick={() => handleAttemptChoice(true)}
                >
                  Real attempt
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-lg border-foreground/70 text-foreground text-base font-medium hover:bg-muted"
                  onClick={() => handleAttemptChoice(false)}
                >
                  Just trying it out (pilot attempt)
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <img
                src={scooterGirl}
                alt="Person riding an electric scooter with groceries"
                width={348}
                height={480}
                loading="lazy"
                className="h-[420px] w-auto object-contain"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="max-w-[520px] rounded-2xl p-10">
          <div className="flex justify-center">
            <img
              src={postalEnvelope}
              alt="Envelope with benchmark code"
              width={140}
              height={140}
              className="h-[120px] w-auto object-contain"
            />
          </div>
          <DialogHeader className="mt-2">
            <DialogTitle className="text-3xl font-extrabold text-brand-blue-deep text-center">
              Before You Leave
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground text-center mt-2 px-2">
              Make sure to enter your email now so we can generate and send your
              benchmark code.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-base font-semibold text-foreground">
                E-mail address
              </Label>
              <Input
                type="email"
                placeholder="marko@example.com"
                className="mt-2 h-11 rounded-md"
                value={state.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center px-2">
              If you leave this page without requesting the results, you won't
              be able to return to your completed survey.
            </p>
            <Button
              onClick={handleEmailSubmit}
              className="w-full h-12 rounded-md bg-brand-blue text-white text-base font-semibold hover:bg-brand-blue/90"
            >
              Get my Benchmark Code
            </Button>
            <button
              className="w-full text-center text-base font-semibold text-foreground hover:underline"
              onClick={() => {
                setShowEmailModal(false);
                completeSurvey();
                setCurrentStep(2);
              }}
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
