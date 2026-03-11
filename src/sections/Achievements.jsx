import { motion } from 'framer-motion';
import { achievements } from '../data/achievements';
import { Trophy, Code, Zap, Database, Shield, Server } from 'lucide-react';

const iconMap = {
  Trophy: <Trophy size={24} />,
  Code: <Code size={24} />,
  Zap: <Zap size={24} />,
  Database: <Database size={24} />,
  Shield: <Shield size={24} />,
  Server: <Server size={24} />
};

export const Achievements = () => {
  return (
    <section id="achievements" className="py-24 px-6 md:px-12 bg-white dark:bg-slate-950 relative border-t border-slate-200 dark:border-slate-900 border-b transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 dark:text-white transition-colors">Milestones & Impact</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg transition-colors">
            Highlights from my professional journey and competitive programming.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-accent/40 dark:hover:border-accent/40 transition-all flex flex-col gap-4 relative overflow-hidden group shadow-sm dark:shadow-none"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
              
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-500 shadow-sm dark:shadow-lg">
                {iconMap[item.icon] || <Trophy size={24} />}
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-2 transition-colors">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
