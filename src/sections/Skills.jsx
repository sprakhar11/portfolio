import { motion } from 'framer-motion';
import { skillsData } from '../data/skills';
import { Code2, Wrench, Users } from 'lucide-react';

const iconMap = {
  Code2: <Code2 size={24} />,
  Wrench: <Wrench size={24} />,
  Users: <Users size={24} />
};

export const Skills = () => {
  return (
    <section id="skills" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-slate-950/50 border-y border-slate-900">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-mono">
           <span className="text-primary">&lt;</span> Core Skills <span className="text-primary">/&gt;</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {skillsData.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
                <div className="bg-primary/10 text-primary p-2 md:p-3 rounded-xl hidden sm:block">
                  {iconMap[category.icon] || <Code2 size={24} />}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white">{category.category}</h3>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {category.items.map((item, i) => {
                  const Icon = item.Icon;
                  return (
                    <span 
                      key={i} 
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-800/50 text-slate-300 rounded-lg text-xs sm:text-sm font-medium border border-slate-700 hover:border-primary/50 hover:text-white hover:bg-slate-800 transition-all cursor-default group"
                    >
                      <Icon className={`text-base sm:text-lg transition-transform group-hover:scale-110 ${item.color}`} />
                      {item.name}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
