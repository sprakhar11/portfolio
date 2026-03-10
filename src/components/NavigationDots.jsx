import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'achievements', label: 'Impact' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
];

export const NavigationDots = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      // Find the current section in view
      const sectionElements = sections.map(sec => document.getElementById(sec.id));
      
      const currentScroll = window.scrollY + (window.innerHeight / 3);
      
      let currentIdx = 0;
      for (let i = 0; i < sectionElements.length; i++) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= currentScroll) {
          currentIdx = i;
        }
      }
      setActiveSection(sections[currentIdx].id);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // We can use native scroll behavior or let Lenis handle it if it intercepts
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4 items-end pointer-events-none">
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        
        return (
          <div 
            key={section.id} 
            className="group flex items-center justify-end gap-4 cursor-pointer pointer-events-auto"
            onClick={() => scrollToSection(section.id)}
          >
            <span className={`text-xs font-mono uppercase transition-all duration-300 ${isActive ? 'text-primary opacity-100 translate-x-0' : 'text-slate-500 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`}>
              {section.label}
            </span>
            <motion.div 
              className={`w-[2px] rounded-full transition-all duration-300 ${isActive ? 'bg-primary h-12' : 'bg-slate-700 h-6 group-hover:bg-slate-400 group-hover:h-8'}`}
              layout
            />
          </div>
        );
      })}
    </div>
  );
};
