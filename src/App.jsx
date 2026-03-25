import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomCursor } from './components/CustomCursor';
import { SmoothScroll } from './components/SmoothScroll';
import { NavigationDots } from './components/NavigationDots';
import { AnonymousMessageModal } from './components/AnonymousMessageModal';
import { Hero } from './sections/Hero';
import { Skills } from './sections/Skills';
import { Experience } from './sections/Experience';
import { Achievements } from './sections/Achievements';
import { Projects } from './sections/Projects';
import { Contact } from './sections/Contact';
import { AdminPage } from './pages/AdminPage';
import { siteConfig } from './config/siteConfig';
import { Mail, FileDown } from 'lucide-react';
import './App.css';

const Portfolio = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    // Check if resume.pdf exists
    fetch(`${import.meta.env.BASE_URL}resume.pdf`, { method: 'HEAD' })
      .then(res => setHasResume(res.ok && res.headers.get('content-type')?.includes('pdf')))
      .catch(() => setHasResume(false));
  }, []);

  return (
    <SmoothScroll>
      <CustomCursor />
      <NavigationDots />

      {/* Floating Say Hello button — top left */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-5 left-5 z-[999] flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 cursor-pointer"
      >
        <Mail size={16} />
        Say Hello
      </button>

      <AnonymousMessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Floating Resume download button — top right */}
      {hasResume && (
        <a
          href={`${import.meta.env.BASE_URL}resume.pdf`}
          download="Prakhar_Sharma_Resume.pdf"
          className="fixed top-5 right-5 z-[999] flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300"
          title="Download Resume"
        >
          <FileDown size={16} />
          Resume
        </a>
      )}

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
};

function App() {
  return (
    <BrowserRouter basename="/portfolio">
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
