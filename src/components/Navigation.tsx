import { Language, Translation } from '../types';
import { Home, Layers, Code, MessageSquare, Settings, Flame, Star, Menu, X, Terminal } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { playClickSound } from '../utils/audio';

interface NavigationProps {
  activePage: string;
  onPageChange: (page: string) => void;
  t: Translation;
  lang: Language;
  notificationsCount: number;
  currentUser: { name: string; role: string };
  id?: string;
}

export default function Navigation({
  activePage,
  onPageChange,
  t,
  lang,
  notificationsCount,
  currentUser,
  id
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.home, icon: <Home size={15} /> },
    { id: 'projects', label: t.projects, icon: <Layers size={15} /> },
    { id: 'skills', label: t.skills, icon: <Code size={15} /> },
    { id: 'guestbook', label: t.guestbook, icon: <MessageSquare size={15} /> },
    { id: 'settings', label: t.settings, icon: <Settings size={15} /> }
  ];

  return (
    <header id={id} className="sticky top-0 z-50 w-full bg-white/85 dark:bg-neutral-950/85 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-900/60 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_30px_-15px_rgba(255,255,255,0.02)] transition-colors">
      {/* Top micro decorative status line */}
      <div className="w-full h-1 bg-gradient-to-r from-neutral-200 via-neutral-900 to-neutral-400 dark:from-neutral-800 dark:via-white dark:to-neutral-700" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo with micro interaction - ONLY Name, styled sleekly with high-tech indicator */}
        <motion.div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => {
            playClickSound();
            onPageChange('home');
          }}
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {/* Futuristic online status tag combined with name */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="font-display font-black text-neutral-950 dark:text-white text-[13px] tracking-wider group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors font-mono">
                {currentUser.name.toUpperCase()}
              </span>
            </div>
            <span className="text-[8.5px] text-neutral-400 dark:text-neutral-500 font-mono tracking-widest uppercase flex items-center gap-1.5 pl-4">
              {currentUser.role}
            </span>
          </div>
        </motion.div>

        {/* Desktop Navigation Link Deck with sliding active state animation */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-neutral-100/50 dark:bg-neutral-900/40 border border-neutral-200/20 dark:border-neutral-800/20">
          {navItems.map(item => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => {
                  playClickSound();
                  onPageChange(item.id);
                }}
                className={`px-4 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-2 transition-colors relative ${
                  isActive
                    ? 'text-neutral-950 dark:text-white'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
                }`}
              >
                {/* Active back bubble slider */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 bg-white dark:bg-neutral-950 rounded-xl shadow-sm border border-neutral-200/50 dark:border-neutral-800/40"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                
                <span className="relative z-10 flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>

                {item.id === 'settings' && (
                  <span className="relative z-10 h-1 w-1 rounded-full bg-neutral-900 dark:bg-white" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right action indicators / Live telemetry widget */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200/40 dark:border-neutral-800/40 bg-neutral-50 dark:bg-neutral-950 font-mono text-[9px] text-neutral-500 dark:text-neutral-400">
            <Terminal size={11} className="text-neutral-400 animate-pulse" />
            <span className="text-emerald-500 font-extrabold">● SECURE</span>
            <span className="text-neutral-300 dark:text-neutral-800">|</span>
            <span className="flex items-center gap-1">
              <Flame size={10} className="text-amber-500" />
              <span>STABLE V2</span>
            </span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <motion.button
            id="mobile-nav-toggle"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              playClickSound();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <motion.div 
          id="mobile-nav-drawer" 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-b border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 py-3 px-4 flex flex-col gap-1.5 transition-all shadow-inner"
        >
          {navItems.map(item => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-mobile-${item.id}`}
                onClick={() => {
                  playClickSound();
                  onPageChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all min-h-[44px] ${
                  isActive
                    ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-900'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'settings' && (
                  <span className="ml-auto text-[9px] bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                    {lang === 'en' ? 'LANG' : 'BHS'}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>
      )}
    </header>
  );
}

