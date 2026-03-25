import { useState } from 'react';
import { motion } from 'framer-motion';
import { siteConfig } from '../config/siteConfig';
import { Mail, Linkedin, Github } from 'lucide-react';
import { AnonymousMessageModal } from '../components/AnonymousMessageModal';

export const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="contact" className="py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-black mb-8 text-white">Let's Connect</h2>
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            I'm currently exploring new opportunities. Whether you have a question or just want to say hi, my inbox is always open.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all cursor-pointer"
            >
              <Mail size={24} />
              Say Hello
            </motion.button>

            <div className="flex gap-4">
               <motion.a 
                 whileHover={{ y: -5, backgroundColor: '#1e293b' }}
                 href={`https://github.com/${siteConfig.githubUsername}`} 
                 target="_blank" 
                 rel="noreferrer"
                 className="p-5 bg-slate-900 rounded-full border border-slate-800 text-slate-300 hover:text-white transition-colors"
                 title="GitHub"
               >
                 <Github size={24} />
               </motion.a>
               <motion.a 
                 whileHover={{ y: -5, backgroundColor: '#1e293b' }}
                 href={`https://linkedin.com/in/${siteConfig.linkedin}`} 
                 target="_blank" 
                 rel="noreferrer"
                 className="p-5 bg-slate-900 rounded-full border border-slate-800 text-slate-300 hover:text-white transition-colors"
                 title="LinkedIn"
               >
                 <Linkedin size={24} />
               </motion.a>
               <motion.a 
                 whileHover={{ y: -5, backgroundColor: '#20bd5a' }}
                 href="https://wa.me/919140884038?text=Hi%20Prakhar!%20I%20saw%20your%20portfolio%20and%20wanted%20to%20connect." 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="p-5 bg-[#25D366] text-white rounded-full border border-[#20bd5a] hover:text-white hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-all"
                 title="WhatsApp: +91 9140884038"
               >
                 <svg 
                   xmlns="http://www.w3.org/2000/svg" 
                   width="24" 
                   height="24" 
                   viewBox="0 0 24 24" 
                   fill="none" 
                   stroke="currentColor" 
                   strokeWidth="2" 
                   strokeLinecap="round" 
                   strokeLinejoin="round"
                 >
                   <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                 </svg>
               </motion.a>
            </div>
            
            <div className="mt-6 sm:mt-0 flex flex-col items-center gap-2 block sm:hidden">
              <a href="tel:+919140884038" className="text-slate-500 font-mono text-sm hover:text-white transition-colors">+91 9140884038</a>
              <a href="mailto:prakhar.infinity@gmail.com" className="text-slate-500 font-mono text-sm hover:text-white transition-colors">prakhar.infinity@gmail.com</a>
            </div>
          </div>
          
          {/* Desktop visible phone & email below links */}
          <div className="hidden sm:flex mt-8 gap-4 items-center justify-center mx-auto w-fit">
            <a href="tel:+919140884038" className="text-slate-400 font-mono bg-slate-900/50 px-6 py-3 rounded-full border border-slate-800 hover:text-white hover:border-slate-600 transition-colors">
              +91 9140884038
            </a>
            <a href="mailto:prakhar.infinity@gmail.com" className="text-slate-400 font-mono bg-slate-900/50 px-6 py-3 rounded-full border border-slate-800 hover:text-white hover:border-slate-600 transition-colors">
              prakhar.infinity@gmail.com
            </a>
          </div>
        </motion.div>
      </div>

      {/* Anonymous Message Modal */}
      <AnonymousMessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};
