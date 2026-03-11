import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Path generators for the curved SVG transition based on viewport width/height
const getInitialPath = (w, h) => `M 0 0 L ${w} 0 L ${w} ${h} Q ${w/2} ${h} 0 ${h} L 0 0`;
const getTargetPath = (w, h) => `M 0 0 L ${w} 0 L ${w} ${h} Q ${w/2} ${h+300} 0 ${h} L 0 0`;
const getExitPath = (w, h) => `M 0 0 L ${w} 0 L ${w} 0 Q ${w/2} -300 0 0 L 0 0`;
const getFinalPath = (w, h) => `M 0 0 L ${w} 0 L ${w} 0 Q ${w/2} 0 0 0 L 0 0`;

export const PageTransition = ({ isTransitioning, targetId, onTransitionComplete }) => {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Only set dimensions after mount to avoid SSR issues
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    
    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle the actual scroll routing when the overlay fully covers the screen
  const handleHalfway = () => {
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView();
    }
  };

  // Only animate if we have valid dimensions
  if (windowDimensions.width === 0) return null;

  const w = windowDimensions.width;
  const h = windowDimensions.height;

  const curveInitial = {
    initial: {
      d: getInitialPath(w, h),
    },
    enter: {
      d: getTargetPath(w, h),
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    },
    exit: {
      d: getExitPath(w, h),
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  };

  return (
    <AnimatePresence 
      onExitComplete={() => {
        if (onTransitionComplete) onTransitionComplete();
      }}
    >
      {isTransitioning && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          initial={{ top: '100%' }}
          animate={{ top: 0 }}
          exit={{ top: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={(definition) => {
            if (definition === 'enter') {
              handleHalfway();
            }
          }}
        >
          {/* Black overlay block */}
          <div className="absolute inset-0 bg-[#0f172a]" />
          
          {/* SVG curved top attached to the block */}
          <svg 
            className="absolute top-0 left-0 w-full h-[300px] pointer-events-none -mt-[300px]"
            viewBox={`0 0 ${w} 300`} 
            preserveAspectRatio="none"
          >
            <motion.path 
              fill="#0f172a"
              variants={curveInitial}
              initial="initial"
              animate="enter"
              exit="exit"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
