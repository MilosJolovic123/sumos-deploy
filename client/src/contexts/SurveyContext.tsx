import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { fetchQuestions, submitSurvey } from "@/lib/api/questions";
import { deriveMobilityDone } from "@/data/questions";
import type { AnswerValue, Question, Submission } from "@/types/survey";

export interface SurveyResult {
  scores: {
    ecoScore: number;
    categoryScores: Record<string, number>;
    mobility: {
      pre: number;
      during: number;
      after: number;
      overall: number;
      delta1: number;
      delta2: number;
      delta3: number;
    };
  };
  feedback: {
    badge: string;
    message: string;
    suggestions: Record<string, string>;
  };
}

interface SurveyState {
  /** Backend-shaped answers: questionKey -> AnswerValue (number | string | Record<string, number>). */
  answers: Record<string, AnswerValue>;
  /** Legacy demographic block — zadržano radi back-compat sa Survey.tsx step 0 i Benchmark filterima. */
  // generalInfo: {
  //   gender: string;
  //   country: string;
  //   institution: string;
  //   mobility: boolean;
  // };
  //  mobility: boolean;
  isCompleted: boolean;
  isRealAttempt: boolean | null;
  email: string;
  results?: SurveyResult;
}

interface SurveyContextType {
  state: SurveyState;
  questions: Question[];
  questionsLoading: boolean;
  //state za consent
  hasConsented: boolean;
  setHasConsented: (value: boolean) => void;

  /** Univerzalni setter — radi za sve tipove pitanja. */
  setAnswer: (questionKey: string, value: AnswerValue) => void;

  // setGeneralInfo: (info: SurveyState["generalInfo"]) => void;
  setIsRealAttempt: (value: boolean) => void;
  setEmail: (email: string) => void;
  completeSurvey: (overrides?: Partial<SurveyState>) => Promise<void>;
  resetSurvey: () => void;

  /** Skor računa samo nad LIKERT pitanjima (1..5). */
  getScore: () => number;
  getCategoryScore: (category: string) => number;
  /** Backward-compat za stari Survey.tsx — vraća prosečan LIKERT skor pitanja čija kategorija počinje sa "HABITS - <subcategory>". */
  getSubcategoryScore: (subcategory: string) => number;
  /** Procenat odgovorenih pitanja (osim optional koja se ne računaju). */
  getProgress: () => number;

  /** Da li je student bio na razmeni — derivirano iz odgovora `exchange_status`. */
  // mobilityDone: boolean;

  /** Sklapanje payload-a tačno po `Submission` šemi. */
  buildSubmission: () => Submission;
}

const initialState: SurveyState = {
  answers: {},
  // generalInfo: { gender: "", country: "", institution: "", mobility: false },
  // mobility: false,
  isCompleted: false,
  isRealAttempt: null,
  email: "",
};

const SurveyContext = createContext<SurveyContextType | null>(null);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SurveyState>(initialState);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchQuestions()
      .then((qs) => {
        if (mounted) {
          setQuestions(qs);
          setQuestionsLoading(false);
        }
      })
      .catch(() => mounted && setQuestionsLoading(false));
    return () => { mounted = false; };
  }, []);

  const setAnswer = (questionKey: string, value: AnswerValue) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionKey]: value },
    }));
  };

  const setIsRealAttempt = (value: boolean) => {
    setState((prev) => ({ ...prev, isRealAttempt: value }));
  };

  const setEmail = (email: string) => {
    setState((prev) => ({ ...prev, email }));
  };

  const completeSurvey = async (overrides?: Partial<SurveyState>) => {
    const finalState = { ...state, ...overrides };
    const submission = buildSubmissionFrom(finalState, questions);

    try {
      const response = await submitSurvey(submission);
      
      setState((prev) => ({
        ...prev,
        ...overrides,
        isCompleted: true,
        // Backend vraća "result" (jednina) sa scores i feedback poljima
        results: response.result, 
      }));
    } catch (error) {
      console.error("Survey submission failed:", error);
      setState((prev) => ({ ...prev, ...overrides, isCompleted: true }));
      throw error;
    }
  };

  const resetSurvey = () => setState(initialState);

  // Ažurirani helperi koji čitaju iz nove 'scores' strukture
  const getScore = () => state.results?.scores.ecoScore || 0;

  const getCategoryScore = (category: string) =>
    state.results?.scores.categoryScores?.[category] || 0;

  const getSubcategoryScore = (subcategory: string) => {
    // Mapiranje naziva iz UI-a na ključeve koje šalje backend
    const mapping: Record<string, string> = {
      "Travel": "Travel",
      "Living and accommodation": "Living",
      "Buying and consumption": "Consumption",
      "Digital habits": "Digital",
      "Community engagement": "Engagement"
    };
    const backendKey = mapping[subcategory] || subcategory;
    return state.results?.scores.categoryScores?.[backendKey] || 0;
  };

  const getProgress = () => {
    const required = questions.filter((q) => !q.optional);
    if (required.length === 0) return 0;
    const answered = required.filter((q) => state.answers[q.key] !== undefined).length;
    return Math.round((answered / required.length) * 100);
  };

  // const buildSubmission = () => buildSubmissionFrom(state, questions, mobilityDone);
  const buildSubmission = () => buildSubmissionFrom(state, questions);

  return (
    <SurveyContext.Provider
      value={{
        state,
        questions,
        questionsLoading,
        hasConsented,
        setHasConsented,
        setAnswer,
        // setGeneralInfo,
        setIsRealAttempt,
        setEmail,
        completeSurvey,
        resetSurvey,
        getScore,
        getCategoryScore,
        getSubcategoryScore,
        getProgress,
        //        mobilityDone,
        buildSubmission,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}

// export function SurveyProvider({ children }: { children: ReactNode }) {
//   const [state, setState] = useState<SurveyState>(initialState);
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [questionsLoading, setQuestionsLoading] = useState(true);
//   const [hasConsented, setHasConsented] = useState(false);

//   // Učitavanje pitanja preko API loader-a.
//   useEffect(() => {
//     let mounted = true;
//     fetchQuestions()
//       .then((qs) => {
//         if (mounted) {
//           setQuestions(qs);
//           setQuestionsLoading(false);
//         }
//       })
//       .catch(() => mounted && setQuestionsLoading(false));
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const setAnswer = (questionKey: string, value: AnswerValue) => {
//     setState((prev) => ({
//       ...prev,
//       answers: { ...prev.answers, [questionKey]: value },
//     }));
//   };

//   // const setGeneralInfo = (info: SurveyState["generalInfo"]) => {
//   //   setState((prev) => ({ ...prev, generalInfo: info }));
//   // };

//   const setIsRealAttempt = (value: boolean) => {
//     setState((prev) => ({ ...prev, isRealAttempt: value }));
//   };

//   const setEmail = (email: string) => {
//     setState((prev) => ({ ...prev, email }));
//   };

//   // const mobilityDone = useMemo(() => {
//   //   const v = state.answers["exchange_status"];
//   //   return (
//   //     deriveMobilityDone(typeof v === "string" ? v : undefined) ||
//   //     state.mobility
//   //   );
//   // }, [state.answers, state.mobility]);

//   const completeSurvey = async (overrides?: Partial<SurveyState>) => {
//    const finalState = { ...state, ...overrides };
//    const submission = buildSubmissionFrom(finalState, questions);
   
//     try {
//       const response = await submitSurvey(submission);
//       setState((prev) => ({
//         ...prev,
//         ...overrides,
//         isCompleted: true,
//         results: response.results,
//       }));
//     } catch (error) {
//       console.error("Survey submission failed:", error);
//       setState((prev) => ({ ...prev, ...overrides, isCompleted: true }));
//       throw error;
//     }
//   };

//   const resetSurvey = () => setState(initialState);

//   //  Skor helperi oslanjaju se na rezultate sa backend-a 
//   const getScore = () => state.results?.overallScore || 0;
//   const getCategoryScore = (category: string) =>
//     state.results?.categoryScores?.[category] || 0;
//   const getSubcategoryScore = (subcategory: string) =>
//     state.results?.categoryScores?.[`HABITS - ${subcategory}`] || 0;

//   const getProgress = () => {
//     const required = questions.filter((q) => !q.optional);
//     if (required.length === 0) return 0;
//     const answered = required.filter(
//       (q) => state.answers[q.key] !== undefined,
//     ).length;
//     return Math.round((answered / required.length) * 100);
//   };

// // const buildSubmission = () => buildSubmissionFrom(state, questions, mobilityDone);
//  const buildSubmission = () => buildSubmissionFrom(state, questions);
 
//   return (
//     <SurveyContext.Provider
//       value={{
//         state,
//         questions,
//         questionsLoading,
//         hasConsented,
//         setHasConsented,
//         setAnswer,
//        // setGeneralInfo,
//         setIsRealAttempt,
//         setEmail,
//         completeSurvey,
//         resetSurvey,
//         getScore,
//         getCategoryScore,
//         getSubcategoryScore,
//         getProgress,
// //        mobilityDone,
//         buildSubmission,
//       }}
//     >
//       {children}
//     </SurveyContext.Provider>
//   );
// }

function buildSubmissionFrom(
  state: SurveyState,
  questions: Question[],
  //  mobilityDone: boolean
): Submission {
  const answersArray = Object.entries(state.answers).map(([key, value]) => {
    const q = questions.find((q) => q.key === key);
    return {
      questionKey: key,
      questionText: q?.text || key,
      category: q?.category || "Unknown",
      questionVersion: q?.version || 1,
      value,
    };
  });

  const startTimeStr = sessionStorage.getItem("surveyStartTime");
  let completionTimeSeconds = 0;

  if (startTimeStr) {
    const startTime = parseInt(startTimeStr, 10);
    const endTime = Date.now();
    // Računamo razliku u sekundama i zaokružujemo
    completionTimeSeconds = Math.floor((endTime - startTime) / 1000);

    // Opciono: Čistimo storage jer smo završili
    sessionStorage.removeItem("surveyStartTime");
  }

  //  const stateVal = state.answers["country"] || state.answers["country_of_study"] || state.generalInfo.country;
  //  const institutionVal = state.answers["institution"] || state.answers["home_university"] || state.generalInfo.institution;
  //  const stateVal = state.answers["country"] || state.answers["country_of_study"];
  //const institutionVal = state.answers["institution"] || state.answers["home_university"];

  return {
    //  state: typeof stateVal === "string" && stateVal ? stateVal : "Unknown",
    //  institution: typeof institutionVal === "string" && institutionVal ? institutionVal : "Unknown",
    //  questionnaireVersion: 1,
    email: state.email,
    //  mobilityDone: mobilityDone,
    completionTimeSeconds: completionTimeSeconds,
    isRealAttempt: state.isRealAttempt ?? false,
    answers: answersArray,
  };
}

export function useSurvey() {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error("useSurvey must be used within SurveyProvider");
  return ctx;
}
