import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { validateToken } from '../utils/githubApi';

export const AdminLogin = ({ onAuth }) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setError('');

    try {
      const user = await validateToken(token.trim());
      if (user) {
        sessionStorage.setItem('gh_token', token.trim());
        onAuth(token.trim(), user);
      } else {
        setError('Invalid token. Please check and try again.');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-5 border border-blue-500/20">
            <Lock size={28} className="text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400 text-sm">Enter your GitHub Personal Access Token to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.05)',
            }}
          >
            <label className="block text-sm text-slate-300 font-medium mb-2">
              GitHub PAT
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => { setToken(e.target.value); setError(''); }}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-slate-900/80 text-slate-200 rounded-xl px-4 py-3 outline-none
                placeholder:text-slate-600 transition-all duration-200 text-sm font-mono
                focus:ring-2 focus:ring-blue-500/40 border border-slate-700 focus:border-blue-500/60"
              autoFocus
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mt-3 text-red-400 text-sm"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !token.trim()}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
                bg-gradient-to-r from-blue-500 to-blue-600 text-white
                hover:from-blue-600 hover:to-blue-700 hover:shadow-[0_0_24px_rgba(59,130,246,0.3)]
                disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Verifying...</>
              ) : (
                <><ArrowRight size={18} /> Access Dashboard</>
              )}
            </motion.button>
          </div>
        </form>

        <p className="text-center mt-6 text-slate-600 text-xs">
          Need a token? Go to GitHub → Settings → Developer Settings → Personal Access Tokens (fine-grained) → Generate with <code className="text-slate-400">contents:write</code> scope.
        </p>
      </motion.div>
    </div>
  );
};
