import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.DEV
  ? 'http://localhost:3001'
  : (import.meta.env.VITE_API_URL || '');

export const AnonymousMessageModal = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const textareaRef = useRef(null);
  const modalRef = useRef(null);

  // Focus textarea on open
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setErrorMsg('Please write a message before sending.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/api/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('');
        setTimeout(() => {
          onClose();
          setStatus('idle');
        }, 2500);
      } else {
        setErrorMsg(data.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status === 'sending') return;
    onClose();
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
      setErrorMsg('');
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  const charCount = message.length;
  const maxChars = 2000;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              boxShadow: '0 0 60px rgba(59, 130, 246, 0.1), 0 25px 50px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <div>
                <h3 className="text-xl font-bold text-white">Send Anonymous Message</h3>
                <p className="text-slate-400 text-sm mt-1">Your identity stays hidden ✨</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                  <p className="text-green-400 font-semibold text-lg">Message Sent!</p>
                  <p className="text-slate-400 text-sm">Thanks for reaching out 🙏</p>
                </motion.div>
              ) : (
                <>
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(e) => {
                        if (e.target.value.length <= maxChars) {
                          setMessage(e.target.value);
                          if (status === 'error') setStatus('idle');
                        }
                      }}
                      placeholder="Write your message here... It could be feedback, a question, or just a kind word 💭"
                      rows={6}
                      disabled={status === 'sending'}
                      className="w-full bg-slate-900/80 text-slate-200 rounded-xl px-4 py-3 resize-none outline-none
                        placeholder:text-slate-500 transition-all duration-200
                        focus:ring-2 focus:ring-blue-500/40 border border-slate-700 focus:border-blue-500/60
                        disabled:opacity-50 disabled:cursor-not-allowed text-sm leading-relaxed"
                    />
                    <span className={`absolute bottom-3 right-3 text-xs font-mono ${
                      charCount > maxChars * 0.9 ? 'text-amber-400' : 'text-slate-500'
                    }`}>
                      {charCount}/{maxChars}
                    </span>
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {status === 'error' && errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-2 mt-3 text-red-400 text-sm"
                      >
                        <AlertCircle size={14} />
                        {errorMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* Footer */}
            {status !== 'success' && (
              <div className="px-6 pb-6 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={status === 'sending' || !message.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base transition-all duration-200
                    bg-gradient-to-r from-blue-500 to-blue-600 text-white
                    hover:from-blue-600 hover:to-blue-700 hover:shadow-[0_0_24px_rgba(59,130,246,0.3)]
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
