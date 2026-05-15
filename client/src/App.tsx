import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Benchmark from "./pages/Benchmark";
import Statistics from "./pages/Statistics";
import Tips from "./pages/Tips";
import Survey from "./pages/Survey";


function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/benchmark" element={<Benchmark />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/survey" element={<Survey />} />
        
        <Route path="/survey/tips" element={<Tips />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
