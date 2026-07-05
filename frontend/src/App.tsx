// src/App.tsx
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

import GlobeBackground from "./components/GlobeBackground";
import CustomCursor from "./components/CustomCursor";
import SplashScreen from "./components/SplashScreen";
import PageLoader from "./components/PageLoader";
import Navigation from "./components/Navigation";
import PageTransition from "./components/PageTransition";
import { ToastContainer } from "./components/Toast";

import Home from "./pages/Home";
import CalculatorPage from "./pages/Calculator";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import { ToastMessage } from "./types";

export default function App() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [targetPage, setTargetPage] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [apiOffline, setApiOffline] = useState(false);
  
  // Check if splash was already viewed in this tab session
  useEffect(() => {
    const hasSeen = sessionStorage.getItem("gp_has_loaded") === "true";
    if (hasSeen) {
      setHasLoaded(true);
    }
  }, []);

  const navigateTo = (page: string) => {
    if (page === currentPage) return;
    setTargetPage(page);
    setIsPageLoading(true);
  };

  const handlePageTransitionComplete = () => {
    if (targetPage) {
      setCurrentPage(targetPage);
    }
    setIsPageLoading(false);
    setTargetPage(null);
  };

  const getPageDisplayName = (pageId: string | null) => {
    if (!pageId) return "";
    if (pageId === "home") return "HOME";
    if (pageId === "how-it-works") return "METHODOLOGY";
    return pageId.replace("-", " ").toUpperCase();
  };

  // Scroll to top on page change for beautiful, professional transitions
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  // Toast controls
  const addToast = (type: "success" | "error" | "warning", title: string, msg: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, title, message: msg }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Render the currently selected page
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home onNavigate={navigateTo} />;
      case "calculator":
        return (
          <CalculatorPage
            addToast={addToast}
            setApiOffline={setApiOffline}
          />
        );
      case "how-it-works":
        return <HowItWorks />;
      case "about":
        return <About />;
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="relative min-h-screen text-white bg-[#010101] overflow-x-hidden font-sans select-none antialiased">
      {/* Cinematic Custom Fluid Cursor */}
      <CustomCursor />

      {/* Holographic Glowing SVG Rotating Globe */}
      <GlobeBackground />

      {/* Exquisite Page Transition Loader Overlay */}
      <PageLoader 
        isVisible={isPageLoading} 
        onTransitionComplete={handlePageTransitionComplete} 
        targetPageName={getPageDisplayName(targetPage)}
      />

      <AnimatePresence mode="wait">
        {!hasLoaded ? (
          <SplashScreen key="splash" onComplete={() => setHasLoaded(true)} />
        ) : (
          <motion.div
            key="app-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col min-h-screen relative z-10"
          >
            {/* Nav Menu */}
            <Navigation 
              currentPage={currentPage} 
              onPageChange={navigateTo} 
            />

            {/* Cinematic Page Slider-Transition container */}
            <main className="flex-1 w-full flex flex-col justify-start">
              <PageTransition triggerKey={currentPage}>
                {renderPage()}
              </PageTransition>
            </main>

            {/* Toasts */}
            <ToastContainer
              toasts={toasts}
              onDismiss={removeToast}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
