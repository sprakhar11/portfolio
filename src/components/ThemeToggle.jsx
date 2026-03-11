import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true); // Default to dark initially

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial state
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`fixed top-6 right-6 md:top-8 md:right-8 z-[60] p-3 rounded-full flex items-center justify-center transition-all shadow-lg ${
        isDark 
          ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-primary' 
          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-primary'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </motion.div>
    </motion.button>
  );
};
