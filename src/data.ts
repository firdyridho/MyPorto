import { Project, Skill, GuestbookEntry, Translation } from './types';

export const projectsData: Project[] = [
  {
    id: 'p1',
    title: 'NeuralFlow AI Sandbox',
    category: 'AI / ML',
    description: {
      en: 'A visual web application to configure, train, and inspect shallow neural networks in real-time right in the browser, with integrated Gemini API model chats.',
      id: 'Aplikasi web visual untuk mengonfigurasi, melatih, dan memeriksa jaringan saraf tiruan secara real-time langsung di browser, dengan chat model Gemini API terintegrasi.'
    },
    technologies: ['React', 'TensorFlow.js', 'Vite', 'TailwindCSS', 'Framer Motion'],
    image: 'https://picsum.photos/seed/neural/800/600',
    demoUrl: '#',
    githubUrl: 'https://github.com/example/neuralflow',
    featured: true,
    stats: { stars: 342, forks: 45 }
  },
  {
    id: 'p2',
    title: 'Apex Cloud Orchestrator',
    category: 'DevOps',
    description: {
      en: 'A modern visual container and Kubernetes dashboard mapping server load, pods, network routes, and microservice topologies in an interactive 3D canvas.',
      id: 'Dasbor kontainer dan Kubernetes visual modern yang memetakan beban server, pod, rute jaringan, dan topologi mikroservis dalam kanvas 3D interaktif.'
    },
    technologies: ['Three.js', 'React', 'Node.js', 'Kubernetes', 'D3.js'],
    image: 'https://picsum.photos/seed/apex/800/600',
    demoUrl: '#',
    githubUrl: 'https://github.com/example/apex-orch',
    featured: true,
    stats: { stars: 512, forks: 82 }
  },
  {
    id: 'p3',
    title: 'Chronos Time-Series DB',
    category: 'Backend',
    description: {
      en: 'An ultra-fast, lightweight time-series database written in Rust with dynamic memory compression, optimized for high-throughput IoT telemetries.',
      id: 'Database deret waktu ultra-cepat dan ringan yang ditulis dalam Rust dengan kompresi memori dinamis, dioptimalkan untuk telemetri IoT ber-throughput tinggi.'
    },
    technologies: ['Rust', 'WebAssembly', 'gRPC', 'Docker', 'React'],
    image: 'https://picsum.photos/seed/chronos/800/600',
    demoUrl: '#',
    githubUrl: 'https://github.com/example/chronos-db',
    featured: true,
    stats: { stars: 1250, forks: 110 }
  },
  {
    id: 'p4',
    title: 'Veloce Reactive Framework',
    category: 'Frontend',
    description: {
      en: 'A declarative and compile-time optimized UI framework for server-first environments, reducing client bundle size by over 80%.',
      id: 'Kerangka kerja UI deklaratif dan optimal pada masa kompilasi untuk lingkungan berorientasi server, mengurangi ukuran bundel klien hingga lebih dari 80%.'
    },
    technologies: ['TypeScript', 'Vite', 'Rollup', 'Web Components', 'CSS Grid'],
    image: 'https://picsum.photos/seed/veloce/800/600',
    demoUrl: '#',
    githubUrl: 'https://github.com/example/veloce',
    featured: false,
    stats: { stars: 184, forks: 12 }
  },
  {
    id: 'p5',
    title: 'Helius Smart Grid Energy',
    category: 'AI / ML',
    description: {
      en: 'An enterprise dashboard leveraging predictive machine learning models to forecast solar energy generation and optimize grid distribution lines.',
      id: 'Dasbor perusahaan yang memanfaatkan model pembelajaran mesin prediktif untuk meramalkan pembangkitan energi surya dan mengoptimalkan jalur distribusi jaringan.'
    },
    technologies: ['Python', 'FastAPI', 'Scikit-learn', 'Recharts', 'TailwindCSS'],
    image: 'https://picsum.photos/seed/helius/800/600',
    demoUrl: '#',
    githubUrl: 'https://github.com/example/helius',
    featured: false,
    stats: { stars: 96, forks: 8 }
  }
];

export const skillsData: Skill[] = [
  // Frontend
  { name: 'React / Next.js', level: 95, category: 'frontend', icon: 'ReactIcon' },
  { name: 'TypeScript', level: 92, category: 'frontend', icon: 'TypeScriptIcon' },
  { name: 'Tailwind CSS', level: 98, category: 'frontend', icon: 'Sparkles' },
  { name: 'Framer Motion (Animations)', level: 88, category: 'frontend', icon: 'Activity' },
  
  // Backend
  { name: 'Node.js / Express', level: 90, category: 'backend', icon: 'Server' },
  { name: 'Go / Rust', level: 78, category: 'backend', icon: 'Cpu' },
  { name: 'PostgreSQL / Firestore', level: 86, category: 'backend', icon: 'Database' },
  { name: 'GraphQL / gRPC', level: 80, category: 'backend', icon: 'GitMerge' },
  
  // DevOps & Cloud
  { name: 'Docker / Containers', level: 85, category: 'devops', icon: 'Box' },
  { name: 'Kubernetes', level: 75, category: 'devops', icon: 'Layers' },
  { name: 'CI/CD Pipelines (Github Actions)', level: 88, category: 'devops', icon: 'GitBranch' },
  { name: 'Google Cloud Platform (GCP)', level: 82, category: 'devops', icon: 'Cloud' },

  // AI & Analytics
  { name: 'Gemini API & LLM Agent Integration', level: 90, category: 'aiml', icon: 'Brain' },
  { name: 'TensorFlow.js / ML models', level: 70, category: 'aiml', icon: 'LineChart' },
  { name: 'Data Visualization (D3 / Recharts)', level: 86, category: 'aiml', icon: 'BarChart3' }
];

export const initialGuestbookEntries: GuestbookEntry[] = [
  {
    id: 'g1',
    name: 'Sarah Jenkins',
    role: 'Lead Architect @ TechVanguard',
    message: 'Working with this engineer was an absolute dream. The level of UI polish combined with rigorous back-end safety is extremely rare to find!',
    timestamp: '2026-06-25 14:32'
  },
  {
    id: 'g2',
    name: 'Budi Hartono',
    role: 'CTO @ NusaDigital',
    message: 'Portofolio yang luar biasa! Detail animasinya sangat halus dan kinerjanya sangat cepat. Sangat merekomendasikan untuk proyek skala besar.',
    timestamp: '2026-06-28 09:15'
  },
  {
    id: 'g3',
    name: 'Alex Rivera',
    role: 'Product Manager @ CloudSync',
    message: 'Incredibly innovative approach to data visualization. That rotatable project gallery is absolutely dazzling. Keep up the high caliber work!',
    timestamp: '2026-06-30 18:45'
  }
];

export const translations: Record<string, Translation> = {
  en: {
    home: 'Home',
    projects: 'Projects',
    skills: 'Skills',
    guestbook: 'Guestbook',
    settings: 'Settings',

    heroTitle: 'Crafting Modern IT Architectures with Exceptional Polish',
    heroSubtitle: 'Hi, I’m Firdy Ridho Fillah I’m a Juniar Full-Stack IT Architect & UI Engineer specializing in fast, reactive, and visually stunning applications that turn complex systems into effortless software.',
    heroCTA: 'Explore Projects',
    heroResume: 'Download CV',
    yearsOfExperience: 'Years Experience',
    completedProjects: 'Completed Projects',
    happyClients: 'Happy Clients',

    projectsTitle: 'Featured Projects',
    projectsSubtitle: 'An interactive showcase of systems, frameworks, and web architectures I have built. Hover on a card to see 3D tilts, or grab and spin the gallery deck!',
    rotateInstructions: 'Use the slider or mouse wheel/drag to spin the project deck. Click on a card to inspect it.',
    allCategories: 'All Systems',
    viewDemo: 'Live Preview',
    viewCode: 'Source Code',

    skillsTitle: 'Expertise & Tech Stack',
    skillsSubtitle: 'A granular mapping of my architectural capability. Hover on any category to view specialized toolkits and current masteries.',
    skillLevel: 'Skill Level',

    guestbookTitle: 'Guestbook & Inquiries',
    guestbookSubtitle: 'Leave a persistent greeting, feedback, or a partnership inquiry. Your message will trigger a live simulation broadcast instantly!',
    guestbookNamePlaceholder: 'Your Name (e.g., Sarah Jenkins)',
    guestbookRolePlaceholder: 'Your Role / Company (e.g., Senior Recruiter @ TechCorp)',
    guestbookMessagePlaceholder: 'Type your message or inquiry here...',
    guestbookSubmit: 'Send Public Broadcast',
    guestbookGreeting: 'Visitor Guestbook',

    settingsTitle: 'Workspace Customizer',
    settingsSubtitle: 'Tailor your interaction layout, localized tongue, dark visual override parameters, and toggle the simulation triggers.',
    languageSelect: 'Interface Language',
    systemTheme: 'System Standard',
    lightTheme: 'Elegant Pearl (Light)',
    darkTheme: 'Cosmic Onyx (Dark)',
    themePreference: 'Visual Canvas Mode',
    notificationToggles: 'Interactive Toast Signals',
    simulationLabel: 'Telemetry Stimulation Engine',
    simulationDesc: 'Toggle random dynamic simulation alerts (e.g., mock job inquiries, GitHub stars, server ping indicators) every 40s.',
    soundEffectsLabel: 'Tacile Audio Feedback',
    soundEffectsDesc: 'Synthesize real-time audio chimes, click ticks, and transition sweeps using the browser Web Audio API.',
    saveButton: 'Apply Settings',

    notificationCenter: 'Signal Broadcasts',
    noNotifications: 'Signals clear. Sitting idle.',
    clearAll: 'Flush Log',
    markAllRead: 'Acknowledge All'
  },
  id: {
    home: 'Beranda',
    projects: 'Proyek',
    skills: 'Keahlian',
    guestbook: 'Buku Tamu',
    settings: 'Pengaturan',

    heroTitle: 'Merancang Arsitektur IT Modern dengan Sentuhan Sempurna',
    heroSubtitle: 'Halo, saya Arsitek IT Full-Stack & UI Engineer yang berspesialisasi dalam membangun aplikasi cepat, reaktif, dan memukau, mengubah sistem rumit menjadi software yang intuitif.',
    heroCTA: 'Lihat Portofolio',
    heroResume: 'Unduh CV',
    yearsOfExperience: 'Tahun Pengalaman',
    completedProjects: 'Proyek Selesai',
    happyClients: 'Klien Puas',

    projectsTitle: 'Proyek Pilihan',
    projectsSubtitle: 'Showcase interaktif dari sistem, kerangka kerja, dan arsitektur web yang telah saya bangun. Arahkan kursor untuk efek miring 3D, atau putar galeri proyek!',
    rotateInstructions: 'Gunakan slider, mouse wheel, atau seret kartu untuk memutar galeri. Klik kartu untuk melihat detail.',
    allCategories: 'Semua Sistem',
    viewDemo: 'Demo Langsung',
    viewCode: 'Kode Sumber',

    skillsTitle: 'Keahlian & Teknologi',
    skillsSubtitle: 'Pemetaan mendalam dari kapabilitas teknis saya. Arahkan kursor ke kategori mana pun untuk melihat alat khusus dan penguasaan saat ini.',
    skillLevel: 'Tingkat Keahlian',

    guestbookTitle: 'Buku Tamu & Diskusi',
    guestbookSubtitle: 'Tinggalkan pesan sapaan, umpan balik, atau tawaran kerja sama. Pesan Anda akan langsung memicu siaran sinyal notifikasi real-time!',
    guestbookNamePlaceholder: 'Nama Anda (misal, Budi Hartono)',
    guestbookRolePlaceholder: 'Jabatan / Perusahaan (misal, CTO @ NusaDigital)',
    guestbookMessagePlaceholder: 'Tulis pesan atau tawaran kerja sama Anda di sini...',
    guestbookSubmit: 'Kirim Pesan Publik',
    guestbookGreeting: 'Buku Tamu Pengunjung',

    settingsTitle: 'Kustomisasi Workspace',
    settingsSubtitle: 'Atur tata letak interaksi, lokalisasi bahasa, pengaturan visual mode gelap, dan nyalakan stimulasi simulasi.',
    languageSelect: 'Bahasa Antarmuka',
    systemTheme: 'Standar Sistem',
    lightTheme: 'Elegant Pearl (Terang)',
    darkTheme: 'Cosmic Onyx (Gelap)',
    themePreference: 'Mode Kanvas Visual',
    notificationToggles: 'Sinyal Toast Interaktif',
    simulationLabel: 'Mesin Stimulasi Telemetri',
    simulationDesc: 'Nyalakan peringatan simulasi dinamis acak (misal, tawaran kerja, bintang GitHub baru, indikator ping server) setiap 40 detik.',
    soundEffectsLabel: 'Umpan Balik Audio Taktil',
    soundEffectsDesc: 'Sintesis nada audio real-time, klik, dan transisi menggunakan Web Audio API browser secara instan.',
    saveButton: 'Terapkan Pengaturan',

    notificationCenter: 'Siaran Sinyal',
    noNotifications: 'Tidak ada sinyal aktif. Menunggu pesan.',
    clearAll: 'Bersihkan Log',
    markAllRead: 'Tandai Dibaca Semua'
  }
};
