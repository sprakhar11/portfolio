import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchGithubProjects } from '../utils/github';
import { Github, ExternalLink, Star } from 'lucide-react';

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchGithubProjects();
      setProjects(data);
      setLoading(false);
    };
    loadProjects();
  }, []);

  return (
    <section id="projects" className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative transition-colors duration-500">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="mb-20 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-mono text-slate-800 dark:text-white transition-colors">
          <span className="text-primary">&lt;</span> Featured Projects <span className="text-primary">/&gt;</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto transition-colors">
          A selection of my best open-source work pulled dynamically from GitHub.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-8 rounded-2xl flex flex-col group relative overflow-hidden transition-colors hover:border-primary/50 dark:hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-900/80 shadow-sm dark:shadow-none"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              
              <div className="flex justify-between items-start mb-6">
                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                  <Github size={24} />
                </div>
                {project.stargazers_count > 0 && (
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-sm font-medium bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
                    <Star size={14} className="text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                    {project.stargazers_count}
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow line-clamp-3 text-sm leading-relaxed transition-colors">
                {project.description || 'No description provided.'}
              </p>

              <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800/80 flex justify-between items-center transition-colors">
                <span className="text-xs font-mono text-primary/80 uppercase px-2 py-1 bg-primary/5 rounded">
                  {project.language || 'Code'}
                </span>
                <div className="flex gap-4">
                  <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                    <Github size={20} />
                  </a>
                  {project.homepage && (
                     <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
