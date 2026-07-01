import { useState, FormEvent } from 'react';
import { Project, Skill, Language, Translation } from '../types';
import { 
  Settings, Globe, Monitor, Sun, Moon, Sparkles, User, RefreshCw, Check, 
  Volume2, VolumeX, Lock, Trash2, Plus, FileText, Image, Code, Layers, Sparkle 
} from 'lucide-react';
import { playToastSound, playClickSound } from '../utils/audio';

interface SettingsPanelProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  themePreference: 'system' | 'light' | 'dark';
  onThemePreferenceChange: (pref: 'system' | 'light' | 'dark') => void;
  
  // Custom user identity
  currentUser: { 
    name: string; 
    role: string; 
    avatar: string; 
    cvUrl: string; 
    cvText: string; 
  };
  onUserUpdate: (userData: { 
    name: string; 
    role: string; 
    avatar: string; 
    cvUrl: string; 
    cvText: string; 
  }) => void;
  
  // Projects dynamic state
  projects: Project[];
  onProjectsChange: (projects: Project[]) => void;
  
  // Skills dynamic state
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
  
  t: Translation;
  lang: Language;
  onAddNotification: (type: 'success' | 'info' | 'warning', title: string, desc: string) => void;
  id?: string;
}

export default function SettingsPanel({
  currentLang,
  onLanguageChange,
  themePreference,
  onThemePreferenceChange,
  currentUser,
  onUserUpdate,
  projects,
  onProjectsChange,
  skills,
  onSkillsChange,
  t,
  lang,
  onAddNotification,
  id
}: SettingsPanelProps) {
  // Authentication State (using sessionStorage to keep active during tab lifecycle)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('portfolio_authenticated') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active settings sub-tab
  const [activeTab, setActiveTab] = useState<'preferences' | 'identity' | 'projects' | 'skills'>('preferences');

  // Account identity form states
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileRole, setProfileRole] = useState(currentUser.role);
  const [profileAvatar, setProfileAvatar] = useState(currentUser.avatar || '');
  const [profileCvUrl, setProfileCvUrl] = useState(currentUser.cvUrl || '');
  const [profileCvText, setProfileCvText] = useState(currentUser.cvText || '');
  const [isIdentitySaved, setIsIdentitySaved] = useState(false);

  // sound setting local state
  const [soundsEnabled, setSoundsEnabled] = useState(() => {
    return localStorage.getItem('portfolio_sounds_enabled') !== 'false';
  });

  // Projects editing state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState('Frontend');
  const [projDescEn, setProjDescEn] = useState('');
  const [projDescId, setProjDescId] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projImage, setProjImage] = useState('');
  const [projDemo, setProjDemo] = useState('');
  const [projGithub, setProjGithub] = useState('');
  const [projStars, setProjStars] = useState(0);
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Skills editing state
  const [editingSkillName, setEditingSkillName] = useState<string | null>(null);
  const [skillNameInput, setSkillNameInput] = useState('');
  const [skillLevelInput, setSkillLevelInput] = useState(80);
  const [skillCategoryInput, setSkillCategoryInput] = useState<'frontend' | 'backend' | 'devops' | 'aiml'>('frontend');
  const [skillIconInput, setSkillIconInput] = useState('Code');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // Login handler
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    playClickSound();
    
    if (username.trim() === 'firdy' && password === 'firdy123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('portfolio_authenticated', 'true');
      setLoginError('');
      onAddNotification(
        'success',
        lang === 'en' ? 'Access Granted' : 'Akses Diberikan',
        lang === 'en' ? 'Welcome back, Admin firdy.' : 'Selamat datang kembali, Admin firdy.'
      );
      playToastSound();
    } else {
      setLoginError(lang === 'en' ? 'Invalid credentials' : 'Kredensial tidak valid');
      onAddNotification(
        'warning',
        lang === 'en' ? 'Access Denied' : 'Akses Ditolak',
        lang === 'en' ? 'Incorrect developer credentials' : 'Kredensial pengembang salah'
      );
    }
  };

  // Logout handler
  const handleLogout = () => {
    playClickSound();
    setIsAuthenticated(false);
    sessionStorage.removeItem('portfolio_authenticated');
    setUsername('');
    setPassword('');
  };

  // Profile Identity Save
  const handleIdentitySubmit = (e: FormEvent) => {
    playClickSound();
    e.preventDefault();
    onUserUpdate({
      name: profileName,
      role: profileRole,
      avatar: profileAvatar,
      cvUrl: profileCvUrl,
      cvText: profileCvText
    });
    setIsIdentitySaved(true);
    onAddNotification(
      'success',
      lang === 'en' ? 'Identity Updated' : 'Identitas Diperbarui',
      lang === 'en' ? 'Workspace profile was successfully re-aligned' : 'Profil workspace berhasil diselaraskan kembali'
    );
    setTimeout(() => setIsIdentitySaved(false), 2500);
  };

  // Add / Edit Project handler
  const saveProject = (e: FormEvent) => {
    playClickSound();
    e.preventDefault();
    
    const technologiesArray = projTech.split(',').map(t => t.trim()).filter(Boolean);

    if (editingProjectId) {
      // Edit mode
      const updated = projects.map(p => {
        if (p.id === editingProjectId) {
          return {
            ...p,
            title: projTitle,
            category: projCategory,
            description: { en: projDescEn, id: projDescId },
            technologies: technologiesArray,
            image: projImage || 'https://picsum.photos/seed/placeholder/800/600',
            demoUrl: projDemo || '#',
            githubUrl: projGithub || '#',
            stats: { stars: projStars, forks: Math.round(projStars * 0.15) }
          };
        }
        return p;
      });
      onProjectsChange(updated);
      setEditingProjectId(null);
      onAddNotification('success', 'Project Updated', `Modified: ${projTitle}`);
    } else {
      // Add mode
      const newProj: Project = {
        id: `p-${Date.now()}`,
        title: projTitle,
        category: projCategory,
        description: { en: projDescEn, id: projDescId },
        technologies: technologiesArray,
        image: projImage || 'https://picsum.photos/seed/newproj/800/600',
        demoUrl: projDemo || '#',
        githubUrl: projGithub || '#',
        featured: false,
        stats: { stars: projStars || 0, forks: Math.round((projStars || 0) * 0.15) }
      };
      onProjectsChange([newProj, ...projects]);
      setIsAddingProject(false);
      onAddNotification('success', 'Project Created', `Added: ${projTitle}`);
    }

    // Reset project inputs
    setProjTitle('');
    setProjDescEn('');
    setProjDescId('');
    setProjTech('');
    setProjImage('');
    setProjDemo('');
    setProjGithub('');
    setProjStars(0);
  };

  // Delete Project handler
  const deleteProject = (id: string, title: string) => {
    playClickSound();
    if (confirm(lang === 'en' ? `Are you sure you want to delete "${title}"?` : `Apakah Anda yakin ingin menghapus "${title}"?`)) {
      onProjectsChange(projects.filter(p => p.id !== id));
      onAddNotification('warning', 'Project Deleted', `Removed: ${title}`);
    }
  };

  // Add / Edit Skill handler
  const saveSkill = (e: FormEvent) => {
    playClickSound();
    e.preventDefault();

    if (editingSkillName) {
      // Edit mode
      const updated = skills.map(s => {
        if (s.name === editingSkillName) {
          return {
            ...s,
            name: skillNameInput,
            level: skillLevelInput,
            category: skillCategoryInput,
            icon: skillIconInput
          };
        }
        return s;
      });
      onSkillsChange(updated);
      setEditingSkillName(null);
      onAddNotification('success', 'Skill Updated', `Modified: ${skillNameInput}`);
    } else {
      // Add mode
      if (skills.some(s => s.name.toLowerCase() === skillNameInput.toLowerCase())) {
        alert('Skill with this name already exists.');
        return;
      }
      const newSkill: Skill = {
        name: skillNameInput,
        level: skillLevelInput,
        category: skillCategoryInput,
        icon: skillIconInput
      };
      onSkillsChange([...skills, newSkill]);
      setIsAddingSkill(false);
      onAddNotification('success', 'Skill Added', `Created: ${skillNameInput}`);
    }

    // Reset skill inputs
    setSkillNameInput('');
    setSkillLevelInput(80);
    setSkillIconInput('Code');
  };

  // Delete Skill handler
  const deleteSkill = (name: string) => {
    playClickSound();
    if (confirm(lang === 'en' ? `Delete skill "${name}"?` : `Hapus keahlian "${name}"?`)) {
      onSkillsChange(skills.filter(s => s.name !== name));
      onAddNotification('warning', 'Skill Removed', `Removed: ${name}`);
    }
  };

  // Render Login Terminal
  if (!isAuthenticated) {
    return (
      <div id={id} className="w-full max-w-md mx-auto bg-neutral-950 border-2 border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl font-mono text-xs text-neutral-300">
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-neutral-800">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <span className="text-neutral-500 text-[10px] ml-auto uppercase tracking-widest">AUTHENTICATION REQUIRED</span>
        </div>

        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <Lock size={32} className="text-neutral-600 animate-pulse" />
          <h2 className="font-bold text-sm text-white tracking-widest uppercase mt-2">SECURE PORTAL</h2>
          <p className="text-[10px] text-neutral-500 leading-normal max-w-[280px]">
            {lang === 'en' 
              ? 'Access limited to authorized operators. Verify identity to initialize customization suite.' 
              : 'Akses terbatas untuk operator resmi. Verifikasi identitas untuk menginisialisasi suite kustomisasi.'}
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-neutral-500 text-[10px] uppercase tracking-wider mb-1.5">$ whoami</label>
            <input
              id="login-username"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-700 focus:outline-none focus:border-neutral-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-500 text-[10px] uppercase tracking-wider mb-1.5">$ authenticate --token</label>
            <input
              id="login-password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-700 focus:outline-none focus:border-neutral-500 transition-colors"
              required
            />
          </div>

          {loginError && (
            <div className="p-2.5 rounded-xl border border-red-950 bg-red-950/20 text-red-400 text-[10px] uppercase tracking-wide leading-relaxed text-center">
              ⚠️ {loginError}
            </div>
          )}

          <button
            id="login-submit-btn"
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-neutral-950 font-bold uppercase hover:bg-neutral-200 transition-all cursor-pointer shadow-lg mt-4 text-[10.5px]"
          >
            Execute Authorization
          </button>
        </form>

        <div className="mt-6 pt-3 border-t border-neutral-900 text-center text-[9px] text-neutral-600">
          DEFAULTS: firdy / firdy123
        </div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div id={id} className="w-full max-w-5xl mx-auto bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/70 dark:border-neutral-800/80 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[580px]">
      
      {/* Sidebar with settings sub-tabs */}
      <div className="w-full md:w-64 bg-neutral-50 dark:bg-neutral-950/40 border-b md:border-b-0 md:border-r border-neutral-100 dark:border-neutral-800/80 p-5 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-200/50 dark:border-neutral-800/80">
            <Settings size={18} className="text-neutral-700 dark:text-neutral-300" />
            <div className="flex flex-col">
              <span className="font-display font-bold text-neutral-900 dark:text-white text-sm">Dashboard Admin</span>
              <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest font-extrabold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                ONLINE (firdy)
              </span>
            </div>
          </div>

          {/* Sub-tabs List */}
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {[
              { id: 'preferences', label: lang === 'en' ? 'Workspace Core' : 'Inti Workspace', icon: <Sparkles size={14} /> },
              { id: 'identity', label: lang === 'en' ? 'Account & CV' : 'Akun & CV', icon: <User size={14} /> },
              { id: 'projects', label: lang === 'en' ? 'Projects Ledger' : 'Buku Proyek', icon: <Layers size={14} /> },
              { id: 'skills', label: lang === 'en' ? 'Skills Directory' : 'Direktori Skill', icon: <Code size={14} /> }
            ].map(tab => (
              <button
                key={tab.id}
                id={`setting-tab-btn-${tab.id}`}
                onClick={() => {
                  playClickSound();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <button
          id="logout-btn"
          onClick={handleLogout}
          className="mt-6 md:mt-0 w-full px-3 py-2 border border-red-200 dark:border-red-950/40 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-xl text-[10.5px] font-bold font-mono uppercase tracking-wider transition-all"
        >
          {lang === 'en' ? 'Revoke Session' : 'Keluar Sesi'}
        </button>
      </div>

      {/* Main Settings Panel Viewport */}
      <div className="flex-1 p-6 md:p-8 bg-white dark:bg-neutral-900 overflow-y-auto max-h-[640px]">
        
        {/* PREFERENCES TAB */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-bold text-neutral-900 dark:text-white text-lg">
                {lang === 'en' ? 'Workspace Core Settings' : 'Pengaturan Inti Workspace'}
              </h3>
              <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">
                Configure look, language and tactical synthesizer sound effects.
              </p>
            </div>

            {/* Language selection block */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                {lang === 'en' ? 'SYSTEM TRANSLATION' : 'TERJEMAHAN SISTEM'}
              </span>
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  id="lang-pref-en"
                  onClick={() => {
                    playClickSound();
                    onLanguageChange('en');
                    onAddNotification('success', 'Language Modified', 'Now translating workspace to English');
                  }}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    currentLang === 'en'
                      ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950 text-neutral-500'
                  }`}
                >
                  🇺🇸 ENGLISH WORKSPACE
                </button>
                <button
                  id="lang-pref-id"
                  onClick={() => {
                    playClickSound();
                    onLanguageChange('id');
                    onAddNotification('success', 'Bahasa Diubah', 'Sekarang menerjemahkan workspace ke Bahasa Indonesia');
                  }}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    currentLang === 'id'
                      ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950 text-neutral-500'
                  }`}
                >
                  🇮🇩 INDONESIA WORKSPACE
                </button>
              </div>
            </div>

            {/* Theme selection block */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                {lang === 'en' ? 'CANVAS OVERLAY THEME' : 'TEMA OVERLAY KANVAS'}
              </span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: 'system', label: t.systemTheme, icon: <Monitor size={14} /> },
                  { val: 'light', label: t.lightTheme, icon: <Sun size={14} /> },
                  { val: 'dark', label: t.darkTheme, icon: <Moon size={14} /> }
                ].map(opt => (
                  <button
                    key={opt.val}
                    id={`theme-opt-db-${opt.val}`}
                    onClick={() => {
                      playClickSound();
                      onThemePreferenceChange(opt.val as any);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-2 border transition-all ${
                      themePreference === opt.val
                        ? 'border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white ring-1 ring-neutral-950 dark:ring-white'
                        : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950 text-neutral-500'
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.label.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Effects Toggles */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850 flex items-center justify-between">
              <div className="flex-1 pr-4">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                  {soundsEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  {t.soundEffectsLabel}
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block mt-1 leading-normal">
                  {t.soundEffectsDesc}
                </span>
              </div>
              
              <button
                id="sounds-db-toggle"
                onClick={() => {
                  const nextVal = !soundsEnabled;
                  setSoundsEnabled(nextVal);
                  localStorage.setItem('portfolio_sounds_enabled', String(nextVal));
                  playClickSound();
                  if (nextVal) {
                    setTimeout(() => playToastSound(), 100);
                  }
                  onAddNotification('success', 'Sound Preferences', nextVal ? 'Tactile sounds active' : 'Sound effects muted');
                }}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 ${
                  soundsEnabled ? 'bg-neutral-950 dark:bg-white' : 'bg-neutral-200 dark:bg-neutral-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white dark:bg-neutral-950 shadow-md transform transition-transform duration-300 ${
                    soundsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* IDENTITY TAB */}
        {activeTab === 'identity' && (
          <form onSubmit={handleIdentitySubmit} className="space-y-5">
            <div>
              <h3 className="font-display font-bold text-neutral-900 dark:text-white text-lg">
                {lang === 'en' ? 'Profile & CV customizer' : 'Kustomisasi Profil & CV'}
              </h3>
              <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">
                Customize your name, professional title, avatar picture URL and CV resume.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 font-mono uppercase mb-1.5">FULL DISPLAY NAME</label>
                <input
                  id="id-name-input"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 font-mono uppercase mb-1.5">PROFESSIONAL TITLE / ROLE</label>
                <input
                  id="id-role-input"
                  type="text"
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 font-mono uppercase mb-1.5 flex items-center gap-1">
                <Image size={11} />
                PORTRAIT IMAGE URL (AVATAR)
              </label>
              <input
                id="id-avatar-input"
                type="url"
                value={profileAvatar}
                onChange={(e) => setProfileAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                required
              />
              <span className="text-[9px] text-neutral-400 block mt-1">Provide a high-quality online picture URL. Will update the 3D home avatar instantly.</span>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 font-mono uppercase mb-1.5 flex items-center gap-1">
                <FileText size={11} />
                CV DOWNLOAD URL (RESUME)
              </label>
              <input
                id="id-cvurl-input"
                type="text"
                value={profileCvUrl}
                onChange={(e) => setProfileCvUrl(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 font-mono uppercase mb-1.5">CV BIO SUMMARY / PARAGRAPH</label>
              <textarea
                id="id-cvtext-input"
                value={profileCvText}
                onChange={(e) => setProfileCvText(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 focus:outline-none resize-none"
                required
              />
            </div>

            <button
              id="id-save-btn"
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {isIdentitySaved ? <Check size={14} /> : <RefreshCw size={14} />}
              {isIdentitySaved ? 'Profile Updated' : 'Save Profile Changes'}
            </button>
          </form>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div>
                <h3 className="font-display font-bold text-neutral-900 dark:text-white text-lg">
                  {lang === 'en' ? 'Manage Custom Projects' : 'Kelola Proyek Kustom'}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  View, add, edit, or delete items inside your portfolio database.
                </p>
              </div>

              {!isAddingProject && !editingProjectId && (
                <button
                  id="add-proj-btn"
                  onClick={() => {
                    playClickSound();
                    setIsAddingProject(true);
                  }}
                  className="px-3.5 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus size={11} />
                  CREATE NEW
                </button>
              )}
            </div>

            {/* Inline Project Add/Edit Form */}
            {(isAddingProject || editingProjectId) && (
              <form onSubmit={saveProject} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/80 space-y-4">
                <h4 className="text-xs font-bold uppercase text-neutral-800 dark:text-neutral-100 tracking-wider">
                  {editingProjectId ? 'Modify Selected Project' : 'Add New Portfolio Entry'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">PROJECT TITLE</label>
                    <input
                      id="proj-form-title"
                      type="text"
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">CATEGORY</label>
                    <select
                      id="proj-form-category"
                      value={projCategory}
                      onChange={(e) => setProjCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="DevOps">DevOps</option>
                      <option value="AI / ML">AI / ML</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">DESCRIPTION (ENGLISH)</label>
                    <textarea
                      id="proj-form-desc-en"
                      value={projDescEn}
                      onChange={(e) => setProjDescEn(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">DESCRIPTION (INDONESIAN)</label>
                    <textarea
                      id="proj-form-desc-id"
                      value={projDescId}
                      onChange={(e) => setProjDescId(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">TECHNOLOGIES (COMMA SEPARATED)</label>
                    <input
                      id="proj-form-tech"
                      type="text"
                      value={projTech}
                      placeholder="React, TypeScript, Go, Docker"
                      onChange={(e) => setProjTech(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">COVER IMAGE URL</label>
                    <input
                      id="proj-form-image"
                      type="url"
                      value={projImage}
                      placeholder="https://images.unsplash.com/..."
                      onChange={(e) => setProjImage(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">LIVE DEMO URL</label>
                    <input
                      id="proj-form-demo"
                      type="text"
                      value={projDemo}
                      onChange={(e) => setProjDemo(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">GITHUB REPO URL</label>
                    <input
                      id="proj-form-github"
                      type="text"
                      value={projGithub}
                      onChange={(e) => setProjGithub(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">MOCK STARS</label>
                    <input
                      id="proj-form-stars"
                      type="number"
                      value={projStars}
                      onChange={(e) => setProjStars(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    id="cancel-proj-form-btn"
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setIsAddingProject(false);
                      setEditingProjectId(null);
                    }}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-800 rounded-xl text-[10px] font-bold uppercase transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    id="submit-proj-form-btn"
                    type="submit"
                    className="px-5 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-[10px] font-bold uppercase transition-transform active:scale-95"
                  >
                    {editingProjectId ? 'Save Changes' : 'Initialize Project'}
                  </button>
                </div>
              </form>
            )}

            {/* Existing Projects List */}
            <div className="space-y-2.5">
              {projects.map(p => (
                <div key={p.id} className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-800/50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800">
                      <img src={p.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-neutral-800 dark:text-neutral-100 text-xs block truncate">{p.title}</span>
                      <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">{p.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`edit-proj-${p.id}`}
                      onClick={() => {
                        playClickSound();
                        setEditingProjectId(p.id);
                        setProjTitle(p.title);
                        setProjCategory(p.category);
                        setProjDescEn(p.description.en);
                        setProjDescId(p.description.id);
                        setProjTech(p.technologies.join(', '));
                        setProjImage(p.image);
                        setProjDemo(p.demoUrl || '');
                        setProjGithub(p.githubUrl || '');
                        setProjStars(p.stats?.stars || 0);
                        setIsAddingProject(false);
                      }}
                      className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Sparkle size={13} />
                    </button>
                    <button
                      id={`delete-proj-${p.id}`}
                      onClick={() => deleteProject(p.id, p.title)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div>
                <h3 className="font-display font-bold text-neutral-900 dark:text-white text-lg">
                  {lang === 'en' ? 'Skills Directory' : 'Direktori Keahlian'}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Update levels, categories, or register new credentials.
                </p>
              </div>

              {!isAddingSkill && !editingSkillName && (
                <button
                  id="add-skill-btn"
                  onClick={() => {
                    playClickSound();
                    setIsAddingSkill(true);
                  }}
                  className="px-3.5 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus size={11} />
                  ADD NEW SKILL
                </button>
              )}
            </div>

            {/* Inline Skill Add/Edit Form */}
            {(isAddingSkill || editingSkillName) && (
              <form onSubmit={saveSkill} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/80 space-y-4">
                <h4 className="text-xs font-bold uppercase text-neutral-800 dark:text-neutral-100 tracking-wider">
                  {editingSkillName ? 'Modify Selected Skill' : 'Create Skill Node'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">SKILL NAME</label>
                    <input
                      id="skill-form-name"
                      type="text"
                      value={skillNameInput}
                      onChange={(e) => setSkillNameInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">PROFICIENCY LEVEL (%)</label>
                    <input
                      id="skill-form-level"
                      type="number"
                      min="1"
                      max="100"
                      value={skillLevelInput}
                      onChange={(e) => setSkillLevelInput(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">SYSTEM CATEGORY</label>
                    <select
                      id="skill-form-category"
                      value={skillCategoryInput}
                      onChange={(e) => setSkillCategoryInput(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="devops">DevOps & Cloud</option>
                      <option value="aiml">AI / ML / Analytics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">LUCIDE ICON MAPPER ID</label>
                    <select
                      id="skill-form-icon"
                      value={skillIconInput}
                      onChange={(e) => setSkillIconInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                    >
                      <option value="Code">Code</option>
                      <option value="ReactIcon">React Icon</option>
                      <option value="TypeScriptIcon">TypeScript Icon</option>
                      <option value="Server">Server</option>
                      <option value="Cpu">CPU</option>
                      <option value="Database">Database</option>
                      <option value="GitMerge">GitMerge</option>
                      <option value="Box">Box Container</option>
                      <option value="Layers">Layers Stack</option>
                      <option value="GitBranch">GitBranch</option>
                      <option value="Cloud">Cloud Server</option>
                      <option value="Brain">AI Brain</option>
                      <option value="Sparkles">Sparkles</option>
                      <option value="Activity">Pulse Activity</option>
                      <option value="LineChart">LineChart</option>
                      <option value="BarChart3">BarChart</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    id="cancel-skill-form-btn"
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setIsAddingSkill(false);
                      setEditingSkillName(null);
                    }}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-800 rounded-xl text-[10px] font-bold uppercase transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    id="submit-skill-form-btn"
                    type="submit"
                    className="px-5 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-[10px] font-bold uppercase transition-transform active:scale-95"
                  >
                    Save Skill Node
                  </button>
                </div>
              </form>
            )}

            {/* Existing Skills List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skills.map(s => (
                <div key={s.name} className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-800/50 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-bold text-neutral-800 dark:text-neutral-100 text-xs block">{s.name}</span>
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest mt-0.5 block">{s.category} • {s.level}% LEVEL</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      id={`edit-skill-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => {
                        playClickSound();
                        setEditingSkillName(s.name);
                        setSkillNameInput(s.name);
                        setSkillLevelInput(s.level);
                        setSkillCategoryInput(s.category);
                        setSkillIconInput(s.icon);
                        setIsAddingSkill(false);
                      }}
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-all"
                    >
                      <Sparkle size={13} />
                    </button>
                    <button
                      id={`delete-skill-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => deleteSkill(s.name)}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
