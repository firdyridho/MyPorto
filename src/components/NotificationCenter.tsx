import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Notification, Language, Translation } from '../types';
import { Bell, BellOff, X, Check, Trash2, Shield, Info, AlertTriangle, MessageSquare } from 'lucide-react';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onDismiss: (id: string) => void;
  lang: Language;
  t: Translation;
  id?: string;
}

export default function NotificationCenter({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClearAll,
  onDismiss,
  lang,
  t,
  id
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check size={14} className="text-emerald-500" />;
      case 'warning':
        return <AlertTriangle size={14} className="text-amber-500" />;
      case 'message':
        return <MessageSquare size={14} className="text-blue-500" />;
      default:
        return <Info size={14} className="text-neutral-500 dark:text-neutral-400" />;
    }
  };

  const getBg = (type: Notification['type'], read: boolean) => {
    if (read) return 'bg-neutral-50 dark:bg-neutral-900/60 opacity-70';
    switch (type) {
      case 'success':
        return 'bg-emerald-500/5 dark:bg-emerald-500/10 border-l-2 border-emerald-500';
      case 'warning':
        return 'bg-amber-500/5 dark:bg-amber-500/10 border-l-2 border-amber-500';
      case 'message':
        return 'bg-blue-500/5 dark:bg-blue-500/10 border-l-2 border-blue-500';
      default:
        return 'bg-neutral-100/50 dark:bg-neutral-800/40 border-l-2 border-neutral-400';
    }
  };

  return (
    <div id={id} className="relative z-[90]">
      {/* Trigger Bell Button */}
      <button
        id="noti-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 shadow-sm transition-all duration-300"
      >
        <Bell size={18} className={unreadCount > 0 ? 'animate-bounce' : ''} />
        {unreadCount > 0 && (
          <span 
            id="noti-badge"
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white dark:bg-white dark:text-neutral-950 ring-2 ring-white dark:ring-neutral-950"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Center Drawer / Box */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing */}
            <div 
              id="noti-backdrop"
              className="fixed inset-0 bg-transparent"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              id="noti-drawer"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 mt-3 w-80 sm:w-96 max-h-[480px] bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/40">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-neutral-600 dark:text-neutral-400" />
                  <span className="font-display font-semibold text-neutral-900 dark:text-white text-sm">
                    {t.notificationCenter}
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {unreadCount} NEW
                    </span>
                  )}
                </div>
                <button
                  id="noti-close-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Utility actions */}
              {notifications.length > 0 && (
                <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex justify-between items-center text-[10px] font-mono">
                  <button
                    id="noti-mark-all-btn"
                    onClick={onMarkAllRead}
                    className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Check size={10} />
                    {t.markAllRead}
                  </button>
                  <button
                    id="noti-clear-all-btn"
                    onClick={onClearAll}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={10} />
                    {t.clearAll}
                  </button>
                </div>
              )}

              {/* List body */}
              <div className="overflow-y-auto flex-1 divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {notifications.length === 0 ? (
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <BellOff size={24} className="text-neutral-300 dark:text-neutral-700 mb-2" />
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                      {t.noNotifications}
                    </p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {notifications.map(n => (
                      <motion.div
                        key={n.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-3.5 flex gap-3 transition-colors relative group ${getBg(n.type, n.read)}`}
                      >
                        {/* Type Icon */}
                        <div className="mt-0.5 flex-shrink-0">
                          {getIcon(n.type)}
                        </div>

                        {/* Text Detail */}
                        <div className="flex-1 min-w-0" onClick={() => onMarkRead(n.id)}>
                          <div className="flex items-baseline justify-between gap-2">
                            <p className={`text-xs font-semibold text-neutral-900 dark:text-white truncate ${n.read ? 'font-normal opacity-70' : ''}`}>
                              {n.title}
                            </p>
                            <span className="text-[9px] font-mono text-neutral-400 whitespace-nowrap">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed break-words">
                            {n.description}
                          </p>
                        </div>

                        {/* Dismiss button */}
                        <button
                          id={`dismiss-noti-${n.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDismiss(n.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 absolute top-3.5 right-3 p-0.5 rounded bg-neutral-200/50 dark:bg-neutral-800/50 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white transition-all"
                        >
                          <X size={10} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
