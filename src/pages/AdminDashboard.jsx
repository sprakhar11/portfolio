import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Loader2, CheckCircle, AlertCircle, LogOut, Plus, Trash2,
  User, Briefcase, GraduationCap, Trophy, FileText, Upload, Zap
} from 'lucide-react';
import {
  getFileContent, updateFileContent, uploadBinaryFile, checkFileExists,
  parseSiteConfig, serializeSiteConfig,
  parseAchievementsFile, serializeAchievementsFile,
  parseSkillsFile, serializeSkillsFile
} from '../utils/githubApi';

const TABS = [
  { id: 'siteConfig', label: 'Site Config', icon: User },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'resume', label: 'Resume', icon: FileText },
];

const inputClass = `w-full bg-slate-900/80 text-slate-200 rounded-lg px-3 py-2.5 outline-none
  placeholder:text-slate-600 transition-all text-sm
  focus:ring-2 focus:ring-blue-500/30 border border-slate-700 focus:border-blue-500/50`;

const labelClass = 'block text-xs text-slate-400 font-medium mb-1.5 uppercase tracking-wider';

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 40 }}
    className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl ${
      type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
    }`}
  >
    {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">✕</button>
  </motion.div>
);

export const AdminDashboard = ({ token, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('siteConfig');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Data states
  const [siteConfig, setSiteConfig] = useState(null);
  const [siteConfigSha, setSiteConfigSha] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [achievementsSha, setAchievementsSha] = useState('');
  const [skillsData, setSkillsData] = useState([]);
  const [skillsSha, setSkillsSha] = useState('');
  const [resumeSha, setResumeSha] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [configFile, achievementsFile, skillsFile] = await Promise.all([
        getFileContent(token, 'src/config/siteConfig.js'),
        getFileContent(token, 'src/data/achievements.js'),
        getFileContent(token, 'src/data/skills.js'),
      ]);

      const config = parseSiteConfig(configFile.content);
      if (config) {
        setSiteConfig(config);
        setSiteConfigSha(configFile.sha);
      }

      const achData = parseAchievementsFile(achievementsFile.content);
      if (achData) {
        setAchievements(achData.achievements);
        setExperienceData(achData.experienceData);
        setEducationData(achData.educationData);
        setAchievementsSha(achievementsFile.sha);
      }

      const parsedSkills = parseSkillsFile(skillsFile.content);
      if (parsedSkills) {
        setSkillsData(parsedSkills);
        setSkillsSha(skillsFile.sha);
      }

      // Check if resume exists
      const rSha = await checkFileExists(token, 'public/resume.pdf');
      setResumeSha(rSha);
    } catch (err) {
      showToast(`Failed to load data: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveSiteConfig = async () => {
    setSaving(true);
    try {
      const content = serializeSiteConfig(siteConfig);
      const result = await updateFileContent(token, 'src/config/siteConfig.js', content, siteConfigSha, '🔧 Update site config via admin panel');
      setSiteConfigSha(result.content.sha);
      showToast('Site config saved & committed!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAchievements = async () => {
    setSaving(true);
    try {
      const content = serializeAchievementsFile({ achievements, experienceData, educationData });
      const result = await updateFileContent(token, 'src/data/achievements.js', content, achievementsSha, '🔧 Update portfolio data via admin panel');
      setAchievementsSha(result.content.sha);
      showToast('Data saved & committed!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSkills = async () => {
    setSaving(true);
    try {
      const content = serializeSkillsFile(skillsData);
      const result = await updateFileContent(token, 'src/data/skills.js', content, skillsSha, '🎯 Update skills via admin panel');
      setSkillsSha(result.content.sha);
      showToast('Skills saved & committed!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (file) => {
    setSaving(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const result = await uploadBinaryFile(token, 'public/resume.pdf', base64, resumeSha, '📄 Upload resume via admin panel');
      setResumeSha(result.content.sha);
      showToast('Resume uploaded & committed!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (activeTab === 'siteConfig') return handleSaveSiteConfig();
    if (activeTab === 'skills') return handleSaveSkills();
    if (activeTab === 'resume') return; // resume saves on upload
    return handleSaveAchievements();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0a0f1a]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
              {user?.login?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-semibold">{user?.login}</p>
              <p className="text-xs text-slate-500">Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                bg-gradient-to-r from-blue-500 to-blue-600 text-white
                hover:from-blue-600 hover:to-blue-700 disabled:opacity-40 cursor-pointer"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save & Deploy
            </motion.button>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex gap-1 bg-slate-900/50 rounded-xl p-1 border border-slate-800 w-fit">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
            border: '1px solid rgba(59, 130, 246, 0.1)',
          }}
        >
          {activeTab === 'siteConfig' && siteConfig && (
            <SiteConfigEditor config={siteConfig} onChange={setSiteConfig} />
          )}
          {activeTab === 'skills' && (
            <SkillsEditor data={skillsData} onChange={setSkillsData} />
          )}
          {activeTab === 'experience' && (
            <ExperienceEditor data={experienceData} onChange={setExperienceData} />
          )}
          {activeTab === 'education' && (
            <EducationEditor data={educationData} onChange={setEducationData} />
          )}
          {activeTab === 'achievements' && (
            <AchievementsEditor data={achievements} onChange={setAchievements} />
          )}
          {activeTab === 'resume' && (
            <ResumeEditor hasResume={!!resumeSha} onUpload={handleResumeUpload} saving={saving} />
          )}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

/* ========== SECTION EDITORS ========== */

const ToggleSwitch = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-900/60 border border-slate-800">
    <span className="text-sm text-slate-300">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
        checked ? 'bg-blue-500' : 'bg-slate-700'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

const SiteConfigEditor = ({ config, onChange }) => {
  const update = (key, val) => onChange({ ...config, [key]: val });

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Profile Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { key: 'name', label: 'Full Name' },
            { key: 'role', label: 'Role / Title' },
            { key: 'email', label: 'Email' },
            { key: 'githubUsername', label: 'GitHub Username' },
            { key: 'linkedin', label: 'LinkedIn Handle' },
            { key: 'twitter', label: 'Twitter Handle' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input className={inputClass} value={config[key] || ''} onChange={(e) => update(key, e.target.value)} />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className={labelClass}>Description / Bio</label>
            <textarea
              rows={3}
              className={`${inputClass} resize-none`}
              value={config.description || ''}
              onChange={(e) => update('description', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Section Visibility</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ToggleSwitch label="Skills" checked={config.showSkills !== false} onChange={(v) => update('showSkills', v)} />
          <ToggleSwitch label="Experience" checked={config.showExperience !== false} onChange={(v) => update('showExperience', v)} />
          <ToggleSwitch label="Achievements" checked={config.showAchievements !== false} onChange={(v) => update('showAchievements', v)} />
          <ToggleSwitch label="Projects" checked={config.showProjects !== false} onChange={(v) => update('showProjects', v)} />
          <ToggleSwitch label="Contact" checked={config.showContact !== false} onChange={(v) => update('showContact', v)} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Feature Toggles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ToggleSwitch label="Email Service (Say Hello)" checked={config.enableEmailService !== false} onChange={(v) => update('enableEmailService', v)} />
          <ToggleSwitch label="Resume Download" checked={config.enableResumeDownload !== false} onChange={(v) => update('enableResumeDownload', v)} />
        </div>
      </div>
    </div>
  );
};

const ExperienceEditor = ({ data, onChange }) => {
  const update = (idx, field, val) => {
    const updated = [...data];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  const updateBullet = (expIdx, bulletIdx, val) => {
    const updated = [...data];
    const bullets = [...(updated[expIdx].bullets || [])];
    bullets[bulletIdx] = val;
    updated[expIdx] = { ...updated[expIdx], bullets };
    onChange(updated);
  };

  const addBullet = (expIdx) => {
    const updated = [...data];
    updated[expIdx] = { ...updated[expIdx], bullets: [...(updated[expIdx].bullets || []), ''] };
    onChange(updated);
  };

  const removeBullet = (expIdx, bulletIdx) => {
    const updated = [...data];
    const bullets = [...(updated[expIdx].bullets || [])];
    bullets.splice(bulletIdx, 1);
    updated[expIdx] = { ...updated[expIdx], bullets };
    onChange(updated);
  };

  const addEntry = () => {
    onChange([...data, { id: Date.now(), role: '', company: '', period: '', techStack: '', bullets: [''] }]);
  };

  const removeEntry = (idx) => {
    const updated = [...data];
    updated.splice(idx, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-8">
      {data.map((exp, idx) => (
        <div key={exp.id || idx} className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-xs text-blue-400 font-mono">#{idx + 1}</span>
            <button onClick={() => removeEntry(idx)} className="text-red-400 hover:text-red-300 p-1 cursor-pointer">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Role</label>
              <input className={inputClass} value={exp.role} onChange={(e) => update(idx, 'role', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Company</label>
              <input className={inputClass} value={exp.company} onChange={(e) => update(idx, 'company', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Period</label>
              <input className={inputClass} value={exp.period} onChange={(e) => update(idx, 'period', e.target.value)} placeholder="e.g. Sep 2025 - Present" />
            </div>
            <div>
              <label className={labelClass}>Tech Stack</label>
              <input className={inputClass} value={exp.techStack || ''} onChange={(e) => update(idx, 'techStack', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Bullet Points</label>
            <div className="space-y-2">
              {(exp.bullets || []).map((bullet, bIdx) => (
                <div key={bIdx} className="flex gap-2">
                  <input
                    className={`${inputClass} flex-1`}
                    value={bullet}
                    onChange={(e) => updateBullet(idx, bIdx, e.target.value)}
                    placeholder="Describe an achievement or responsibility..."
                  />
                  <button onClick={() => removeBullet(idx, bIdx)} className="text-red-400 hover:text-red-300 p-2 cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button onClick={() => addBullet(idx)} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1 cursor-pointer">
                <Plus size={12} /> Add bullet
              </button>
            </div>
          </div>
        </div>
      ))}
      <button onClick={addEntry} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 cursor-pointer">
        <Plus size={16} /> Add Experience
      </button>
    </div>
  );
};

const EducationEditor = ({ data, onChange }) => {
  const update = (idx, field, val) => {
    const updated = [...data];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  const addEntry = () => {
    onChange([...data, { id: Date.now(), degree: '', institution: '', period: '', score: '' }]);
  };

  const removeEntry = (idx) => {
    const updated = [...data];
    updated.splice(idx, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {data.map((edu, idx) => (
        <div key={edu.id || idx} className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-xs text-blue-400 font-mono">#{idx + 1}</span>
            <button onClick={() => removeEntry(idx)} className="text-red-400 hover:text-red-300 p-1 cursor-pointer">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Degree</label>
              <input className={inputClass} value={edu.degree} onChange={(e) => update(idx, 'degree', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Institution</label>
              <input className={inputClass} value={edu.institution} onChange={(e) => update(idx, 'institution', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Period</label>
              <input className={inputClass} value={edu.period} onChange={(e) => update(idx, 'period', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Score</label>
              <input className={inputClass} value={edu.score} onChange={(e) => update(idx, 'score', e.target.value)} placeholder="e.g. CGPA: 8.47" />
            </div>
          </div>
        </div>
      ))}
      <button onClick={addEntry} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 cursor-pointer">
        <Plus size={16} /> Add Education
      </button>
    </div>
  );
};

const AchievementsEditor = ({ data, onChange }) => {
  const update = (idx, field, val) => {
    const updated = [...data];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  const addEntry = () => {
    onChange([...data, { id: Date.now(), title: '', description: '', icon: 'Trophy' }]);
  };

  const removeEntry = (idx) => {
    const updated = [...data];
    updated.splice(idx, 1);
    onChange(updated);
  };

  const iconOptions = ['Trophy', 'Code', 'Zap', 'Database', 'Shield', 'Server'];

  return (
    <div className="space-y-6">
      {data.map((ach, idx) => (
        <div key={ach.id || idx} className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-xs text-blue-400 font-mono">#{idx + 1}</span>
            <button onClick={() => removeEntry(idx)} className="text-red-400 hover:text-red-300 p-1 cursor-pointer">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title</label>
              <input className={inputClass} value={ach.title} onChange={(e) => update(idx, 'title', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Icon</label>
              <select
                className={inputClass}
                value={ach.icon}
                onChange={(e) => update(idx, 'icon', e.target.value)}
              >
                {iconOptions.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                rows={2}
                className={`${inputClass} resize-none`}
                value={ach.description}
                onChange={(e) => update(idx, 'description', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      <button onClick={addEntry} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 cursor-pointer">
        <Plus size={16} /> Add Achievement
      </button>
    </div>
  );
};

const ICON_LIBS = [
  { value: 'fa', label: 'Font Awesome (Fa...)' },
  { value: 'si', label: 'Simple Icons (Si...)' },
  { value: 'vsc', label: 'VS Code Icons (Vsc...)' },
  { value: 'lucide', label: 'Lucide' },
];

const SkillsEditor = ({ data, onChange }) => {
  const updateCategory = (idx, field, val) => {
    const updated = [...data];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  const updateItem = (catIdx, itemIdx, field, val) => {
    const updated = [...data];
    const items = [...updated[catIdx].items];
    items[itemIdx] = { ...items[itemIdx], [field]: val };
    updated[catIdx] = { ...updated[catIdx], items };
    onChange(updated);
  };

  const addCategory = () => {
    onChange([...data, { category: 'New Category', icon: 'Code2', items: [] }]);
  };

  const removeCategory = (idx) => {
    const updated = [...data];
    updated.splice(idx, 1);
    onChange(updated);
  };

  const addItem = (catIdx) => {
    const updated = [...data];
    updated[catIdx] = {
      ...updated[catIdx],
      items: [...updated[catIdx].items, { name: '', iconLib: 'lucide', iconName: 'Zap', color: 'text-slate-400' }]
    };
    onChange(updated);
  };

  const removeItem = (catIdx, itemIdx) => {
    const updated = [...data];
    const items = [...updated[catIdx].items];
    items.splice(itemIdx, 1);
    updated[catIdx] = { ...updated[catIdx], items };
    onChange(updated);
  };

  return (
    <div className="space-y-8">
      {data.map((cat, catIdx) => (
        <div key={catIdx} className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-xs text-blue-400 font-mono">Category #{catIdx + 1}</span>
            <button onClick={() => removeCategory(catIdx)} className="text-red-400 hover:text-red-300 p-1 cursor-pointer">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category Name</label>
              <input className={inputClass} value={cat.category} onChange={(e) => updateCategory(catIdx, 'category', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Category Icon (lucide name)</label>
              <input className={inputClass} value={cat.icon} onChange={(e) => updateCategory(catIdx, 'icon', e.target.value)} placeholder="e.g. Code2, Wrench, Users" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Skills</label>
            <div className="space-y-3">
              {cat.items.map((item, itemIdx) => (
                <div key={itemIdx} className="grid grid-cols-[1fr_auto_1fr_1fr_auto] gap-2 items-end">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Skill Name</label>
                    <input className={inputClass} value={item.name} onChange={(e) => updateItem(catIdx, itemIdx, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Icon Lib</label>
                    <select className={inputClass} value={item.iconLib} onChange={(e) => updateItem(catIdx, itemIdx, 'iconLib', e.target.value)}>
                      {ICON_LIBS.map(lib => <option key={lib.value} value={lib.value}>{lib.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Icon Name</label>
                    <input className={inputClass} value={item.iconName} onChange={(e) => updateItem(catIdx, itemIdx, 'iconName', e.target.value)} placeholder="e.g. FaJava, SiRedis" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Color Class</label>
                    <input className={inputClass} value={item.color} onChange={(e) => updateItem(catIdx, itemIdx, 'color', e.target.value)} placeholder="e.g. text-orange-500" />
                  </div>
                  <button onClick={() => removeItem(catIdx, itemIdx)} className="text-red-400 hover:text-red-300 p-2 cursor-pointer mb-0.5">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button onClick={() => addItem(catIdx)} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1 cursor-pointer">
                <Plus size={12} /> Add Skill
              </button>
            </div>
          </div>
        </div>
      ))}
      <button onClick={addCategory} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 cursor-pointer">
        <Plus size={16} /> Add Category
      </button>
    </div>
  );
};

const ResumeEditor = ({ hasResume, onUpload, saving }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large (max 10MB).');
      return;
    }
    onUpload(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-3 h-3 rounded-full ${hasResume ? 'bg-green-400' : 'bg-slate-600'}`} />
        <span className="text-sm text-slate-300">
          {hasResume ? 'Resume is currently uploaded' : 'No resume uploaded yet'}
        </span>
        {hasResume && (
          <a
            href={`https://raw.githubusercontent.com/sprakhar11/portfolio/main/public/resume.pdf`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            View current
          </a>
        )}
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-blue-400 bg-blue-500/10'
            : 'border-slate-700 hover:border-slate-500 hover:bg-slate-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {saving ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-blue-400" />
            <p className="text-slate-300 font-medium">Uploading to GitHub...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload size={32} className="text-slate-500" />
            <p className="text-slate-300 font-medium">
              {hasResume ? 'Replace resume' : 'Upload resume'}
            </p>
            <p className="text-slate-500 text-sm">
              Drag & drop a PDF here, or click to browse
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
