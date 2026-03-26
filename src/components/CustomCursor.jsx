import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const [resumePos, setResumePos] = useState(null);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('a') || e.target.closest('button');
      if (target) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const updateResumePos = () => {
      const el = document.getElementById('resume-button-link');
      if (el) {
        const rect = el.getBoundingClientRect();
        setResumePos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      } else {
        setResumePos(null);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("resize", updateResumePos);
    
    // Initial check and periodic check in case of layout changes
    updateResumePos();
    const interval = setInterval(updateResumePos, 2000);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("resize", updateResumePos);
      clearInterval(interval);
    };
  }, []);

  const pointerData = useMemo(() => {
    if (!resumePos) return null;
    const dx = resumePos.x - mousePosition.x;
    const dy = resumePos.y - mousePosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Fade out as we get close (start fading at 700px, completely gone at 250px)
    const opacity = Math.min(1, Math.max(0, (distance - 250) / 450));
    
    return { angle, opacity, distance };
  }, [mousePosition, resumePos]);

  return (
    <>
      {/* Small dot cursor */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-blue-500 rounded-full pointer-events-none z-[1000] mix-blend-screen hidden md:block"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovering ? 0 : 1
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      
      {/* Main cursor ring and Resume Pointer */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-blue-500/30 rounded-full pointer-events-none z-[1000] mix-blend-screen hidden md:block"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 1.4 : 1,
          backgroundColor: isHovering ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
          borderWidth: isHovering ? '2px' : '1px'
        }}
        transition={{ type: "spring", stiffness: 250, damping: 25, mass: 0.5 }}
      >
        <AnimatePresence>
          {pointerData && pointerData.opacity > 0 && !isHovering && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: pointerData.opacity, 
                scale: 1,
                rotate: pointerData.angle 
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-end"
            >
              {/* Orbits the cursor, but content stays upright */}
              <div 
                className="ml-16 px-4 py-2 bg-blue-600/80 backdrop-blur-md rounded-2xl border border-blue-400/50 shadow-[0_0_25px_rgba(59,130,246,0.4)] flex items-center gap-2"
                style={{ transform: `rotate(${-pointerData.angle}deg)` }}
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 leading-none mb-1">Find</span>
                  <span className="text-sm font-bold text-white tracking-tight leading-none">RESUME</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center overflow-hidden border border-white/10 backdrop-blur-sm">
                  {/* Rotating Arrow pointing to RESUME */}
                  <motion.div
                    style={{ rotate: pointerData.angle }}
                    className="flex items-center justify-center"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </motion.div>
                </div>
              </div>
              
              {/* Subtle accent trail */}
              <div className="absolute right-0 w-16 h-[1px] bg-gradient-to-l from-blue-400/30 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
