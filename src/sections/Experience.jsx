import { motion } from 'framer-motion';
import { experienceData, educationData } from '../data/achievements';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';

export const Experience = () => {
  return (
    <section id="experience" className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-mono">
          <span className="text-primary">&lt;</span> Experience & Education <span className="text-primary">/&gt;</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          My professional journey and academic background.
        </p>
      </motion.div>

      <div className="space-y-16">
        
        {/* Experience Timeline */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary/10 p-3 rounded-lg text-primary">
              <Briefcase size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white">Work Experience</h3>
          </div>
          
          <div className="relative border-l border-slate-800 ml-6 space-y-8 pb-4">
            {experienceData.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 group"
              >
                <div className="absolute w-4 h-4 bg-slate-900 border-2 border-primary rounded-full -left-[9px] top-1 group-hover:bg-primary transition-colors shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 sm:gap-2 mb-2">
                  <h4 className="text-lg sm:text-xl font-bold text-slate-200 group-hover:text-primary transition-colors">{item.role}</h4>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-400 font-mono bg-slate-800/50 px-2 sm:px-3 py-1 rounded-full w-fit">
                    <Calendar size={12} className="sm:w-[14px] sm:h-[14px]" />
                    {item.period}
                  </div>
                </div>
                
                <h5 className="text-base sm:text-lg text-slate-300 font-medium mb-1">{item.company}</h5>
                {item.techStack && (
                  <p className="text-[10px] sm:text-xs font-mono text-primary/80 mb-3 sm:mb-4">{item.techStack}</p>
                )}
                {item.bullets ? (
                  <ul className="list-disc list-outside ml-4 space-y-2 text-slate-400 text-sm">
                    {item.bullets.map((bullet, i) => {
                      const splitIndex = bullet.indexOf(':');
                      if (splitIndex !== -1) {
                        return (
                          <li key={i} className="leading-relaxed">
                            <strong className="text-slate-300">{bullet.substring(0, splitIndex + 1)}</strong>
                            {bullet.substring(splitIndex + 1)}
                          </li>
                        );
                      }
                      return <li key={i} className="leading-relaxed">{bullet}</li>;
                    })}
                  </ul>
                ) : (
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {item.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education Timeline */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-accent/10 p-3 rounded-lg text-accent">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white">Education</h3>
          </div>
          
          <div className="relative border-l border-slate-800 ml-6 space-y-8">
            {educationData.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 group"
              >
                <div className="absolute w-4 h-4 bg-slate-900 border-2 border-accent rounded-full -left-[9px] top-1 group-hover:bg-accent transition-colors shadow-[0_0_10px_rgba(139,92,246,0.3)]" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 sm:gap-2 mb-2">
                  <h4 className="text-lg sm:text-xl font-bold text-slate-200 group-hover:text-accent transition-colors">{item.degree}</h4>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-400 font-mono bg-slate-800/50 px-2 sm:px-3 py-1 rounded-full w-fit">
                    <Calendar size={12} className="sm:w-[14px] sm:h-[14px]" />
                    {item.period}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center mb-1">
                  <h5 className="text-base sm:text-lg text-slate-300 font-medium">{item.institution}</h5>
                  <span className="text-accent text-xs sm:text-sm font-semibold bg-accent/10 px-2 sm:px-3 py-1 rounded w-fit">
                    {item.score}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
