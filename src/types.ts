export interface Project {
  id: string;
  title: string;
  category: string;
  description: {
    en: string;
    id: string;
  };
  technologies: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  stats?: {
    stars: number;
    forks: number;
  };
}

export interface Skill {
  name: string;
  level: number; // percentage (e.g. 90 for 90%)
  category: 'frontend' | 'backend' | 'devops' | 'aiml';
  icon: string; // Lucide icon name
}

export interface GuestbookEntry {
  id: string;
  name: string;
  role: string;
  message: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'message';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export type Language = 'en' | 'id';

export interface Translation {
  // Navigation
  home: string;
  projects: string;
  skills: string;
  guestbook: string;
  settings: string;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroCTA: string;
  heroResume: string;
  yearsOfExperience: string;
  completedProjects: string;
  happyClients: string;

  // Projects Section
  projectsTitle: string;
  projectsSubtitle: string;
  rotateInstructions: string;
  allCategories: string;
  viewDemo: string;
  viewCode: string;

  // Skills Section
  skillsTitle: string;
  skillsSubtitle: string;
  skillLevel: string;

  // Guestbook / Contact Section
  guestbookTitle: string;
  guestbookSubtitle: string;
  guestbookNamePlaceholder: string;
  guestbookRolePlaceholder: string;
  guestbookMessagePlaceholder: string;
  guestbookSubmit: string;
  guestbookGreeting: string;

  // Settings Section
  settingsTitle: string;
  settingsSubtitle: string;
  languageSelect: string;
  systemTheme: string;
  lightTheme: string;
  darkTheme: string;
  themePreference: string;
  notificationToggles: string;
  simulationLabel: string;
  simulationDesc: string;
  soundEffectsLabel: string;
  soundEffectsDesc: string;
  saveButton: string;

  // Notification Banner & Toasts
  notificationCenter: string;
  noNotifications: string;
  clearAll: string;
  markAllRead: string;
}
