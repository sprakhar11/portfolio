import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { siteConfig } from '../config/siteConfig';

const StarParticles = (props) => {
  const ref = useRef();
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  
  // Use useMemo here if performance drops, but static initialization is usually fine
  const sphere = random.inSphere(new Float32Array(3000), { radius: 1.5 });

  useEffect(() => {
    const handleClick = () => {
      setSpeedMultiplier(8); // Speed up significantly on click
      setTimeout(() => {
        setSpeedMultiplier(1); // Return to normal speed after 500ms
      }, 500);
    };
    
    // Add event listener to the window so clicking anywhere on the hero section triggers it
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useFrame((state, delta) => {
    if(ref.current) {
        // Use smooth interpolation for the speed to make it feel more natural if desired, 
        // but simple multiplier works well for a "burst" effect.
        ref.current.rotation.x -= (delta / 10) * speedMultiplier;
        ref.current.rotation.y -= (delta / 15) * speedMultiplier;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

export const Hero = () => {
  return (
    <section id="hero" className="relative w-full h-screen mx-auto overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <StarParticles />
        </Canvas>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="text-xs md:text-lg font-mono text-primary mb-3 md:mb-4 tracking-widest uppercase">
              Hello, I'm
            </h2>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 md:mb-6 bg-gradient-to-br from-white via-slate-300 to-slate-600 bg-clip-text text-transparent tracking-tighter"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {siteConfig.name}
          </motion.h1>

          <motion.h3 
            className="text-xl sm:text-2xl md:text-4xl font-semibold text-slate-300 mb-6 md:mb-8 tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {siteConfig.role}
          </motion.h3>

          <motion.p 
            className="text-sm sm:text-base md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed font-light px-4 md:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {siteConfig.description}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <button 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-full font-semibold transition-all hover:bg-blue-600 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] cursor-pointer text-sm sm:text-base"
            >
              View Experience
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-transparent border border-slate-700 text-white rounded-full font-semibold transition-all hover:bg-slate-800 hover:border-slate-500 cursor-pointer text-sm sm:text-base"
            >
              Contact Me
            </button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-sm font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="tracking-widest uppercase text-xs">Scroll</span>
        <motion.div 
          className="w-[1px] h-12 bg-gradient-to-b from-primary/80 to-transparent"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
};
