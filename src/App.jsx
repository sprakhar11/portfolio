import { useState, createContext, useContext } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { SmoothScroll } from './components/SmoothScroll';
import { NavigationDots } from './components/NavigationDots';
import { PageTransition } from './components/PageTransition';
import { ThemeToggle } from './components/ThemeToggle';
import { Hero } from './sections/Hero';
import { Skills } from './sections/Skills';
import { Experience } from './sections/Experience';
import { Achievements } from './sections/Achievements';
import { Projects } from './sections/Projects';
import { Contact } from './sections/Contact';
import { siteConfig } from './config/siteConfig';
import './App.css';

// Create a global context for triggering page transitions
export const TransitionContext = createContext();

export const useTransition = () => useContext(TransitionContext);

// AppContent isolates the hooks and context usage
function AppContent() {
  const { isTransitioning, targetId, completeTransition } = useTransition();

  return (
    <SmoothScroll>
      <CustomCursor />
      <ThemeToggle />
      <NavigationDots />
      <PageTransition 
        isTransitioning={isTransitioning} 
        targetId={targetId} 
        onTransitionComplete={completeTransition} 
      />
      <main className="bg-background text-foreground min-h-screen">
        <Hero />
        <Skills />
        <Experience />
        <Achievements />
        <Projects />
        <Contact />
      </main>
      <footer className="text-center py-10 bg-black text-slate-500 text-sm border-t border-slate-900">
        <p className="tracking-wide">Built by <span className="text-slate-300">{siteConfig.name}</span>.<br className="md:hidden" /> Designed with ♥️</p>
      </footer>
    </SmoothScroll>
  );
}

function App() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetId, setTargetId] = useState(null);

  const triggerTransition = (target) => {
    setTargetId(target);
    setIsTransitioning(true);
    // Auto-dismiss the transition overlay after scroll (matches enter timing)
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const completeTransition = () => {
    setTargetId(null);
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, targetId, triggerTransition, completeTransition }}>
      <AppContent />
    </TransitionContext.Provider>
  );
}

export default App;
