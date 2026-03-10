import { CustomCursor } from './components/CustomCursor';
import { SmoothScroll } from './components/SmoothScroll';
import { NavigationDots } from './components/NavigationDots';
import { Hero } from './sections/Hero';
import { Skills } from './sections/Skills';
import { Experience } from './sections/Experience';
import { Achievements } from './sections/Achievements';
import { Projects } from './sections/Projects';
import { Contact } from './sections/Contact';
import { siteConfig } from './config/siteConfig';
import './App.css';

function App() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <NavigationDots />
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

export default App;
