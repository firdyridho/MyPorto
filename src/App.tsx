import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Skill, GuestbookEntry, Notification, Language, Translation } from './types';
import { projectsData, skillsData, initialGuestbookEntries, translations } from './data';
import Navigation from './components/Navigation';
import RotatingGallery from './components/RotatingGallery';
import ThreeDCard from './components/ThreeDCard';
import SettingsPanel from './components/SettingsPanel';
import NotificationCenter from './components/NotificationCenter';
import WelcomePage from './components/WelcomePage';
import { playClickSound, playTransitionSound, playToastSound } from './utils/audio';

// Import icons for layout
import {
  Brain, Server, Cpu, Database, GitMerge, Box, Layers, GitBranch, Cloud,
  Sparkles, Activity, LineChart, BarChart3, HelpCircle, Mail, MapPin, 
  Send, ShieldCheck, Download, Code, UserCheck, Heart, Terminal, AlertCircle, X, CheckCircle,
  MessageSquare, Info
} from 'lucide-react';

export default function App() {
  // Page Routing State ('home' | 'projects' | 'skills' | 'guestbook' | 'settings')
  const [activePage, setActivePage] = useState<string>('home');

  // Session-based state to show/hide the luxury IT welcome splash screen
  const [hasEntered, setHasEntered] = useState<boolean>(() => {
    return sessionStorage.getItem('portfolio_welcome_entered') === 'true';
  });

  // Multi-Language state
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('portfolio_lang');
    return (saved === 'en' || saved === 'id') ? saved : 'en';
  });

  const t = translations[lang];

  // Theme preference state ('system' | 'light' | 'dark')
  const [themePreference, setThemePreference] = useState<'system' | 'light' | 'dark'>(() => {
    const saved = localStorage.getItem('portfolio_theme');
    return (saved === 'system' || saved === 'light' || saved === 'dark') ? saved : 'system';
  });

  // Telemetry simulation engine state
  const [simsEnabled, setSimsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('portfolio_sims_enabled');
    return saved !== 'false'; // default to true
  });

  // Current user custom identity with dynamic avatar and CV
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('portfolio_user');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || 'Muhammad Syuban',
          role: parsed.role || 'Full-Stack Cloud Architect',
          avatar: parsed.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          cvUrl: parsed.cvUrl || '#',
          cvText: parsed.cvText || 'Experienced Full-Stack Engineer and Cloud Solutions Architect specialized in scalable microservices, low-latency applications, and gorgeous tactile UI components.'
        };
      } catch (e) { /* ignore */ }
    }
    return { 
      name: 'Muhammad Syuban', 
      role: 'Full-Stack Cloud Architect',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      cvUrl: '#',
      cvText: 'Experienced Full-Stack Engineer and Cloud Solutions Architect specialized in scalable microservices, low-latency applications, and gorgeous tactile UI components.'
    };
  });

  // Stateful projects & skills databases
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('portfolio_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return projectsData;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('portfolio_skills');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return skillsData;
  });

  // Notifications State (Kept in background for compatibility, but hidden from user)
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Live Toast State (Toasts appearing real-time)
  const [toasts, setToasts] = useState<Notification[]>([]);

  // Guestbook Entries state
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>(() => {
    const saved = localStorage.getItem('portfolio_guestbook');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialGuestbookEntries;
  });

  // Guestbook input fields
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Auto-typing text logic for Hero
  const [typingText, setTypingText] = useState('');
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const sentences = [
    'Designing highly secure cloud infrastructure.',
    'Building ultra-fast distributed backends.',
    'Polishing responsive and visually stunning interfaces.',
    'Integrating state-of-the-art AI Models and agents.'
  ];
  const typingSpeed = 70;
  const deletingSpeed = 40;
  const sentenceDelay = 1800;

  useEffect(() => {
    let timer: any;
    const currentSentence = sentences[sentenceIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypingText(currentSentence.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setTypingText(currentSentence.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, typingSpeed);
    }

    if (!isDeleting && charIndex === currentSentence.length) {
      timer = setTimeout(() => setIsDeleting(true), sentenceDelay);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setSentenceIndex(prev => (prev + 1) % sentences.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, sentenceIndex]);

  // Handle system dark mode adjustments
  useEffect(() => {
    const handleThemeChange = () => {
      if (themePreference === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', isDark);
      }
    };

    if (themePreference === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (themePreference === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // system
      handleThemeChange();
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener('change', handleThemeChange);
      return () => media.removeEventListener('change', handleThemeChange);
    }
  }, [themePreference]);

  // Persist configurations
  useEffect(() => {
    localStorage.setItem('portfolio_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('portfolio_theme', themePreference);
  }, [themePreference]);

  useEffect(() => {
    localStorage.setItem('portfolio_sims_enabled', String(simsEnabled));
  }, [simsEnabled]);

  useEffect(() => {
    // Only play transition sounds after the initial component mounting
    const hasMounted = sessionStorage.getItem('portfolio_has_mounted');
    if (!hasMounted) {
      sessionStorage.setItem('portfolio_has_mounted', 'true');
      return;
    }
    playTransitionSound();
  }, [activePage]);

  useEffect(() => {
    localStorage.setItem('portfolio_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('portfolio_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('portfolio_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('portfolio_guestbook', JSON.stringify(guestbookEntries));
  }, [guestbookEntries]);

  // Global helper to push a silent log/notification (No longer triggers loud sounds or visible popups)
  const addNotification = (type: Notification['type'], title: string, description: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
    const newNoti: Notification = {
      id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      title,
      description,
      time: timeStr,
      read: false
    };

    // Keep state representation, but NO sound and NO toast trigger!
    setNotifications(prev => [newNoti, ...prev].slice(0, 40));
  };

  // Automated notification simulation engine
  useEffect(() => {
    if (!simsEnabled) return;

    const mockAlerts = [
      { type: 'info' as const, title: 'System Heartbeat', desc: 'Container health check status: 100% online & optimized.' },
      { type: 'success' as const, title: 'GitHub Repository Starred', desc: 'User "tech_wizard99" starred project "NeuralFlow AI Sandbox".' },
      { type: 'success' as const, title: 'Client Inquiry Received', desc: 'Lead architect from TechCorp requested standard project brochure.' },
      { type: 'message' as const, title: 'Anonymous Greeting Posted', desc: 'A new guest wrote: "Outstanding rotatable 3D gallery!"' },
      { type: 'warning' as const, title: 'Server Scaling Event', desc: 'Simulated server auto-scaling trigger: Node load reached threshold, provisioned idle cluster.' }
    ];

    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * mockAlerts.length);
      const alert = mockAlerts[idx];
      addNotification(alert.type, alert.title, alert.desc);
    }, 40000); // Trigger every 40s

    return () => clearInterval(interval);
  }, [simsEnabled]);

  // Notification handlers
  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addNotification('success', lang === 'en' ? 'Acknowledged All' : 'Semua Diakui', lang === 'en' ? 'All signals set to read' : 'Semua sinyal ditandai telah dibaca');
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDismissNoti = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Contact form submission
  const handleGuestbookSubmit = (e: FormEvent) => {
    playClickSound();
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) return;

    setFormSubmitting(true);

    setTimeout(() => {
      const newEntry: GuestbookEntry = {
        id: `g-${Date.now()}`,
        name: formName,
        role: formRole || (lang === 'en' ? 'Visitor / Tech enthusiast' : 'Pengunjung / Pemerhati Teknologi'),
        message: formMessage,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      setGuestbookEntries(prev => [newEntry, ...prev]);
      
      // Trigger dynamic notification and toast!
      addNotification(
        'message',
        lang === 'en' ? `Message from ${formName}` : `Pesan dari ${formName}`,
        formMessage
      );

      // Reset inputs
      setFormName('');
      setFormRole('');
      setFormMessage('');
      setFormSubmitting(false);
    }, 1000);
  };

  // Helper to resolve icon elements for skills mapping
  const getSkillIconElement = (iconName: string) => {
    switch (iconName) {
      case 'ReactIcon': return <Cpu size={18} className="text-blue-500" />;
      case 'TypeScriptIcon': return <Code size={18} className="text-blue-600" />;
      case 'Sparkles': return <Sparkles size={18} className="text-amber-500" />;
      case 'Activity': return <Activity size={18} className="text-fuchsia-500" />;
      case 'Server': return <Server size={18} className="text-emerald-500" />;
      case 'Cpu': return <Cpu size={18} className="text-purple-500" />;
      case 'Database': return <Database size={18} className="text-indigo-500" />;
      case 'GitMerge': return <GitMerge size={18} className="text-pink-500" />;
      case 'Box': return <Box size={18} className="text-sky-500" />;
      case 'Layers': return <Layers size={18} className="text-cyan-500" />;
      case 'GitBranch': return <GitBranch size={18} className="text-teal-500" />;
      case 'Cloud': return <Cloud size={18} className="text-violet-500" />;
      case 'Brain': return <Brain size={18} className="text-orange-500 animate-pulse" />;
      case 'LineChart': return <LineChart size={18} className="text-red-500" />;
      case 'BarChart3': return <BarChart3 size={18} className="text-yellow-500" />;
      default: return <HelpCircle size={18} className="text-neutral-500" />;
    }
  };

  // Render proper page container based on routing state with smooth page motion
  const renderPage = () => {
    switch (activePage) {
      case 'projects':
        return (
          <motion.section
            id="projects-section"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full py-10 flex flex-col items-center"
          >
            <div className="text-center max-w-3xl px-4 mb-16">
              <span className="text-[10px] font-mono tracking-widest font-bold text-neutral-400 dark:text-neutral-500 uppercase block mb-2">
                01 / {lang === 'en' ? 'REVOLVING SHOWCASE' : 'SHOWCASE BERPUTAR'}
              </span>
              <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-neutral-900 dark:text-white mb-4">
                {t.projectsTitle}
              </h1>
              <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {t.projectsSubtitle}
              </p>
            </div>

            {/* Rotatable Project Deck */}
            <RotatingGallery
              projects={projects}
              lang={lang}
              t={t}
              onAddNotification={addNotification}
            />
          </motion.section>
        );

      case 'skills':
        return (
          <motion.section
            id="skills-section"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full py-10 max-w-6xl mx-auto px-4"
          >
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[10px] font-mono tracking-widest font-bold text-neutral-400 dark:text-neutral-500 uppercase block mb-2">
                02 / {lang === 'en' ? 'TECH METRICS' : 'MATRIKS TEKNOLOGI'}
              </span>
              <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-neutral-900 dark:text-white mb-4">
                {t.skillsTitle}
              </h1>
              <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {t.skillsSubtitle}
              </p>
            </div>

            {/* Skills categorization columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { cat: 'frontend', title: lang === 'en' ? 'Interactive Frontend' : 'Interaksi Frontend' },
                { cat: 'backend', title: lang === 'en' ? 'Distributed Backend Systems' : 'Sistem Backend Terdistribusi' },
                { cat: 'devops', title: lang === 'en' ? 'Cloud Architecture & DevOps' : 'Arsitektur Cloud & DevOps' },
                { cat: 'aiml', title: lang === 'en' ? 'AI Integrations & Analytics' : 'Integrasi AI & Analitis' }
              ].map(group => {
                const groupSkills = skills.filter(s => s.category === group.cat);
                return (
                  <ThreeDCard
                    key={group.cat}
                    id={`skill-cat-${group.cat}`}
                    className="p-6 md:p-8 bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/80 rounded-3xl"
                    maxTilt={5}
                    scale={1.01}
                  >
                    <h3 className="font-display font-bold text-neutral-900 dark:text-white text-lg mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-2 flex items-center justify-between">
                      <span>{group.title}</span>
                      <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">
                        {groupSkills.length} SKILLS
                      </span>
                    </h3>

                    <div className="space-y-5">
                      {groupSkills.map(skill => (
                        <div 
                          key={skill.name} 
                          id={`skill-bar-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                          className="space-y-1.5 group cursor-help"
                          onClick={() => addNotification('info', skill.name, `${t.skillLevel}: ${skill.level}%`)}
                        >
                          <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2 font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                              {getSkillIconElement(skill.icon)}
                              {skill.name}
                            </div>
                            <span className="font-mono text-neutral-400 font-medium">
                              {skill.level}%
                            </span>
                          </div>

                          {/* Skill bar slider */}
                          <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                              className="h-full bg-neutral-900 dark:bg-white rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ThreeDCard>
                );
              })}
            </div>
          </motion.section>
        );

      case 'guestbook':
        return (
          <motion.section
            id="guestbook-section"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full py-10 max-w-6xl mx-auto px-4"
          >
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[10px] font-mono tracking-widest font-bold text-neutral-400 dark:text-neutral-500 uppercase block mb-2">
                03 / {lang === 'en' ? 'GUESTBOOK BROADCAST' : 'SIARAN BUKU TAMU'}
              </span>
              <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-neutral-900 dark:text-white mb-4">
                {t.guestbookTitle}
              </h1>
              <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {t.guestbookSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form submission */}
              <div className="lg:col-span-5">
                <ThreeDCard
                  id="guestbook-form-card"
                  className="p-6 md:p-8 bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/80 rounded-3xl"
                  maxTilt={3}
                  scale={1.01}
                >
                  <h3 className="font-display font-bold text-neutral-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                    <Send size={16} className="text-neutral-700 dark:text-neutral-300" />
                    {lang === 'en' ? 'Post a Greeting' : 'Kirim Sapaan'}
                  </h3>

                  <form onSubmit={handleGuestbookSubmit} className="space-y-4">
                    <div>
                      <input
                        id="guest-name-input"
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder={t.guestbookNamePlaceholder}
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        required
                      />
                    </div>
                    <div>
                      <input
                        id="guest-role-input"
                        type="text"
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        placeholder={t.guestbookRolePlaceholder}
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                      />
                    </div>
                    <div>
                      <textarea
                        id="guest-msg-input"
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        placeholder={t.guestbookMessagePlaceholder}
                        rows={4}
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 resize-none"
                        required
                      />
                    </div>

                    <button
                      id="guestbook-submit-btn"
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer shadow-md"
                    >
                      {formSubmitting ? (
                        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white dark:border-neutral-900 border-t-transparent" />
                      ) : (
                        <Send size={12} />
                      )}
                      {t.guestbookSubmit}
                    </button>
                  </form>
                </ThreeDCard>
              </div>

              {/* Right Column: Ledger entries */}
              <div className="lg:col-span-7 space-y-4 max-h-[500px] overflow-y-auto pr-2">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <h3 className="font-display font-bold text-neutral-900 dark:text-white text-base">
                    {t.guestbookGreeting}
                  </h3>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {guestbookEntries.length} SIGNALS
                  </span>
                </div>

                <AnimatePresence initial={false}>
                  {guestbookEntries.map(entry => (
                    <motion.div
                      key={entry.id}
                      id={`guest-entry-${entry.id}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-5 rounded-2xl bg-neutral-50/70 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800/80"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-100 block">
                            {entry.name}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mt-0.5">
                            {entry.role}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-neutral-400">
                          {entry.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mt-3 whitespace-pre-line">
                        {entry.message}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.section>
        );

      case 'settings':
        return (
          <motion.section
            id="settings-section"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full py-10 px-4"
          >
            <SettingsPanel
              currentLang={lang}
              onLanguageChange={setLang}
              themePreference={themePreference}
              onThemePreferenceChange={setThemePreference}
              currentUser={currentUser}
              onUserUpdate={(userData) => setCurrentUser(userData)}
              projects={projects}
              onProjectsChange={setProjects}
              skills={skills}
              onSkillsChange={setSkills}
              t={t}
              lang={lang}
              onAddNotification={addNotification}
            />
          </motion.section>
        );

      default:
        // 'home'
        return (
          <motion.section
            id="home-section"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-6xl mx-auto px-4 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left: Info details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 border border-neutral-200/50 dark:border-neutral-800/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  {lang === 'en' ? 'Available for Remote Contracts' : 'Tersedia untuk Kontrak Remote'}
                </span>

                <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-neutral-900 dark:text-white leading-none">
                  {t.heroTitle}
                </h1>
              </div>

              {/* Dynamic Subtitle & Auto Typist */}
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {t.heroSubtitle}
                </p>

                {/* Auto typing sandbox console */}
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/60 dark:bg-neutral-950 dark:border-neutral-800/80 font-mono text-xs flex items-center gap-2">
                  <Terminal size={14} className="text-neutral-400" />
                  <span className="text-neutral-400">~/specialization:</span>
                  <span className="text-neutral-900 dark:text-white font-semibold">
                    {typingText}
                  </span>
                  <span className="animate-pulse h-3.5 w-1 bg-neutral-900 dark:bg-white" />
                </div>
              </div>

              {/* CTA Triggers */}
              <div className="flex flex-wrap gap-3.5">
                <button
                  id="cta-projects-btn"
                  onClick={() => {
                    setActivePage('projects');
                    addNotification('info', lang === 'en' ? 'Navigating to Gallery' : 'Membuka Galeri', lang === 'en' ? 'Opening rotatable project card carousel' : 'Membuka korsel kartu proyek 3D');
                  }}
                  className="px-5 py-3 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer shadow-lg flex items-center gap-2"
                >
                  {t.heroCTA}
                </button>
                <button
                  id="cta-cv-btn"
                  onClick={() => {
                    if (currentUser.cvUrl && currentUser.cvUrl !== '#') {
                      window.open(currentUser.cvUrl, '_blank');
                    } else {
                      // Generate dynamic CV text document based on settings state!
                      const element = document.createElement("a");
                      const file = new Blob([
                        `==================================================\n`,
                        `CURRICULUM VITAE - ${currentUser.name.toUpperCase()}\n`,
                        `Role: ${currentUser.role}\n`,
                        `==================================================\n\n`,
                        `${currentUser.cvText || 'Full-Stack Cloud Architect and Developer.'}\n\n`,
                        `--------------------------------------------------\n`,
                        `Generated dynamically from personal admin portfolio console.\n`
                      ], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = `${currentUser.name.replace(/\s+/g, '_')}_CV.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }
                    addNotification(
                      'success',
                      lang === 'en' ? 'CV Downloaded' : 'CV Diunduh',
                      lang === 'en' ? 'Curriculum Vitae document processed successfully.' : 'Dokumen Curriculum Vitae berhasil diunduh.'
                    );
                  }}
                  className="px-5 py-3 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <Download size={14} />
                  {t.heroCTA === 'Explore Projects' ? 'Download Resume' : 'Unduh CV'}
                </button>
              </div>
 
              {/* Bento Grid Stats Card Deck */}
              <div className="grid grid-cols-3 gap-3.5 pt-6 border-t border-neutral-100 dark:border-neutral-900">
                {[
                  { val: '5+', label: t.yearsOfExperience },
                  { val: '20+', label: t.completedProjects },
                  { val: '100%', label: t.happyClients }
                ].map(stat => (
                  <div key={stat.label} className="p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/30 dark:border-neutral-800/40 text-center">
                    <span className="font-display font-extrabold text-2xl md:text-3xl text-neutral-900 dark:text-white block">
                      {stat.val}
                    </span>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium block mt-1 uppercase tracking-wide">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Right: Awesome 3D tilting card containing Portrait/Avatar */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <ThreeDCard
                id="hero-avatar-3d-card"
                className="w-72 h-96 sm:w-80 sm:h-[420px] rounded-3xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200/50 dark:border-neutral-700/50 p-3.5 flex flex-col justify-between overflow-hidden cursor-pointer"
                maxTilt={16}
                scale={1.04}
              >
                {/* Embedded dynamic image overlay */}
                <div className="w-full h-[78%] rounded-2xl overflow-hidden relative shadow-inner bg-neutral-200 dark:bg-neutral-800">
                  <img
                    src={currentUser.avatar}
                    alt={`${currentUser.name} Avatar`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                  {/* Subtle dynamic overlay tag */}
                  <div className="absolute bottom-3 left-3 bg-neutral-900/80 dark:bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-bold text-white dark:text-neutral-950 font-mono tracking-wider flex items-center gap-1 uppercase">
                    <UserCheck size={10} />
                    {currentUser.role.split(' ')[0] || 'ENGINEER'}
                  </div>
                </div>
 
                {/* Lower Card label with depth effects */}
                <div className="h-[18%] flex flex-col justify-center px-2">
                  <span className="font-display font-extrabold text-neutral-900 dark:text-white text-base tracking-tight block">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 font-medium tracking-wide block mt-0.5">
                    {currentUser.role}
                  </span>
                </div>
              </ThreeDCard>
            </div>
          </motion.section>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors duration-300 relative selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            key="welcome-splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[1000]"
          >
            <WelcomePage
              developerName={currentUser.name}
              developerRole={currentUser.role}
              onEnter={() => {
                sessionStorage.setItem('portfolio_welcome_entered', 'true');
                setHasEntered(true);
                playTransitionSound();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global upper grid mesh lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Primary Header Navigation Bar */}
      <Navigation
        activePage={activePage}
        onPageChange={setActivePage}
        t={t}
        lang={lang}
        notificationsCount={0}
        currentUser={currentUser}
      />

      {/* Main viewport with clean routing container */}
      <main className="flex-1 flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>

      {/* Footer Branding Area */}
      <footer className="py-8 border-t border-neutral-100 dark:border-neutral-900/60 z-10 transition-all">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-neutral-400">
          <div className="flex items-center gap-1">
            <Heart size={10} className="text-red-500 fill-red-500" />
            <span>© 2026 {currentUser.name}. Built with React, Vite & Tailwind.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-600 dark:hover:text-neutral-200 cursor-help" onClick={() => addNotification('info', 'System core version', 'Build stable v2.4.12')}>V2.4.12</span>
            <span>SYSTEM PREFERENCE: {themePreference.toUpperCase()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
