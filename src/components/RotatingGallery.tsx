import { useState, useEffect, useRef, MouseEvent, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Language, Translation } from '../types';
import { ArrowLeft, ArrowRight, ExternalLink, Github, Star, Layers, RefreshCw, Code } from 'lucide-react';

interface RotatingGalleryProps {
  projects: Project[];
  lang: Language;
  t: Translation;
  onAddNotification: (type: 'success' | 'info' | 'warning', title: string, desc: string) => void;
  id?: string;
}

export default function RotatingGallery({
  projects,
  lang,
  t,
  onAddNotification,
  id
}: RotatingGalleryProps) {
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const currentRotationRef = useRef(0);

  // Card view mode: 'preview' or 'code'
  const [cardModes, setCardModes] = useState<Record<string, 'preview' | 'code'>>({});

  // Mock code snippets for IDE view
  const getProjectMockCode = (proj: Project) => {
    if (proj.id === 'p1') {
      return [
        { num: 1, text: "import { TensorFlow, Gemini } from 'ai';", color: "text-purple-400 dark:text-purple-300" },
        { num: 2, text: "", color: "" },
        { num: 3, text: "// Create smart visual neural net", color: "text-neutral-400 italic" },
        { num: 4, text: "const model = tf.sequential();", color: "text-blue-500 dark:text-blue-300" },
        { num: 5, text: "model.add(tf.layers.dense({", color: "text-blue-500 dark:text-blue-300" },
        { num: 6, text: "  units: 16, activation: 'relu'", color: "text-amber-600 dark:text-amber-300" },
        { num: 7, text: "}));", color: "text-blue-500 dark:text-blue-300" },
        { num: 8, text: "", color: "" },
        { num: 9, text: "const output = await Gemini.analyze({", color: "text-pink-500" },
        { num: 10, text: "  prompt: 'Optimize training curve'", color: "text-amber-600 dark:text-amber-300" },
        { num: 11, text: "});", color: "text-pink-500" }
      ];
    }
    if (proj.id === 'p2') {
      return [
        { num: 1, text: "apiVersion: apps/v1", color: "text-purple-400 dark:text-purple-300" },
        { num: 2, text: "kind: Deployment", color: "text-purple-400 dark:text-purple-300" },
        { num: 3, text: "metadata:", color: "text-blue-500 dark:text-blue-300" },
        { num: 4, text: "  name: apex-cloud-orchestrator", color: "text-amber-600 dark:text-amber-300" },
        { num: 5, text: "spec:", color: "text-blue-500 dark:text-blue-300" },
        { num: 6, text: "  replicas: 5", color: "text-emerald-500" },
        { num: 7, text: "  selector:", color: "text-blue-500 dark:text-blue-300" },
        { num: 8, text: "    matchLabels:", color: "text-blue-500 dark:text-blue-300" },
        { num: 9, text: "      app: orchestrator-mesh", color: "text-amber-600 dark:text-amber-300" }
      ];
    }
    if (proj.id === 'p3') {
      return [
        { num: 1, text: "use chronos_db::TimeSeries;", color: "text-purple-400 dark:text-purple-300" },
        { num: 2, text: "", color: "" },
        { num: 3, text: "fn main() -> Result<(), Error> {", color: "text-blue-500 dark:text-blue-300" },
        { num: 4, text: "    let mut ts = TimeSeries::open()?;", color: "text-blue-500 dark:text-blue-300" },
        { num: 5, text: "    ts.insert(", color: "text-pink-500" },
        { num: 6, text: "        \"metrics.sensor.latency\",", color: "text-amber-600 dark:text-amber-300" },
        { num: 7, text: "        24.5", color: "text-emerald-500" },
        { num: 8, text: "    )?;", color: "text-blue-500 dark:text-blue-300" },
        { num: 9, text: "    println!(\"Buffer flushed!\");", color: "text-amber-600 dark:text-amber-300" },
        { num: 10, text: "    Ok(())", color: "text-purple-400 dark:text-purple-300" },
        { num: 11, text: "}", color: "text-blue-500 dark:text-blue-300" }
      ];
    }

    const cleanTitle = proj.title.replace(/[^a-zA-Z0-9]/g, '');
    const techStrings = proj.technologies.slice(0, 2).map(t => `'${t}'`).join(', ');
    return [
      { num: 1, text: `// Module: ${proj.title}`, color: "text-neutral-400 italic" },
      { num: 2, text: `import { Core } from 'framework-sdk';`, color: "text-purple-400 dark:text-purple-300" },
      { num: 3, text: "", color: "" },
      { num: 4, text: `export function init${cleanTitle}() {`, color: "text-blue-500 dark:text-blue-300" },
      { num: 5, text: `  const sys = Core.launch({`, color: "text-blue-500 dark:text-blue-300" },
      { num: 6, text: `    category: '${proj.category}',`, color: "text-amber-600 dark:text-amber-300" },
      { num: 7, text: `    tech: [${techStrings}]`, color: "text-emerald-500" },
      { num: 8, text: `  });`, color: "text-blue-500 dark:text-blue-300" },
      { num: 9, text: `  return sys.isActive;`, color: "text-pink-500" },
      { num: 10, text: `}`, color: "text-blue-500 dark:text-blue-300" }
    ];
  };

  // Filter projects
  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const totalProjects = filteredProjects.length;
  const angleStep = totalProjects > 0 ? 360 / totalProjects : 0;

  // Sync active index based on rotation
  useEffect(() => {
    if (totalProjects === 0) return;
    // Normalize rotation to positive 0-360 range
    let normRot = (-rotation) % 360;
    if (normRot < 0) normRot += 360;
    
    // Find closest index
    const index = Math.round(normRot / angleStep) % totalProjects;
    setActiveIndex(index);
  }, [rotation, totalProjects, angleStep]);

  // Handle category change, reset rotation
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setRotation(0);
    setActiveIndex(0);
    onAddNotification(
      'info',
      lang === 'en' ? 'Category Filter' : 'Filter Kategori',
      lang === 'en' ? `Viewing ${category} systems` : `Melihat sistem ${category}`
    );
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev + angleStep);
    onAddNotification(
      'info',
      lang === 'en' ? 'Gallery Spun' : 'Galeri Diputar',
      lang === 'en' ? 'Slightly rotated to the left' : 'Diputar sedikit ke kiri'
    );
  };

  const handleRotateRight = () => {
    setRotation(prev => prev - angleStep);
    onAddNotification(
      'info',
      lang === 'en' ? 'Gallery Spun' : 'Galeri Diputar',
      lang === 'en' ? 'Slightly rotated to the right' : 'Diputar sedikit ke kanan'
    );
  };

  // Drag handlers to spin the gallery
  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    currentRotationRef.current = rotation;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    // Scale drag movement to rotation degrees
    const rotationChange = (deltaX / 3) % 360;
    setRotation(currentRotationRef.current + rotationChange);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Snapping to nearest project angle step
    if (totalProjects > 0) {
      const snapTo = Math.round(rotation / angleStep) * angleStep;
      setRotation(snapTo);
    }
  };

  // Touch triggers
  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    currentRotationRef.current = rotation;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - dragStartX.current;
    const rotationChange = (deltaX / 3) % 360;
    setRotation(currentRotationRef.current + rotationChange);
  };

  // Get categories list
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  // Dynamically set radius based on window size
  const [radius, setRadius] = useState(300);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRadius(180); // Closer for small mobile screens
      } else if (window.innerWidth < 1024) {
        setRadius(240);
      } else {
        setRadius(340);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeProject = filteredProjects[activeIndex];

  return (
    <div id={id} className="w-full flex flex-col items-center">
      {/* Category selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-10 w-full max-w-2xl px-4 z-10">
        {categories.map(cat => (
          <button
            key={cat}
            id={`cat-btn-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium font-display transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md scale-105'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
            }`}
          >
            {cat === 'All' ? t.allCategories : cat}
          </button>
        ))}
      </div>

      {/* 3D Rotating Stage */}
      <div 
        className="w-full h-[360px] md:h-[440px] flex items-center justify-center overflow-hidden perspective-1000 relative select-none cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div 
          className="w-full h-full absolute flex items-center justify-center preserve-3d transition-transform duration-500 ease-out"
          style={{ transform: `rotateY(${rotation}deg)` }}
        >
          {filteredProjects.map((proj, idx) => {
            const cardAngle = idx * angleStep;
            // Calculate how aligned this card is to the front (0 rotation modulo 360)
            const cardRot = (cardAngle + rotation) % 360;
            // Keep rot within -180 to 180
            const normalizedRot = ((cardRot + 540) % 360) - 180;
            const isFront = Math.abs(normalizedRot) < (angleStep / 2);

            return (
              <div
                key={proj.id}
                className="absolute w-[220px] h-[280px] sm:w-[260px] sm:h-[320px] md:w-[280px] md:h-[350px] preserve-3d transition-all duration-300 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60 overflow-hidden bg-white dark:bg-neutral-900 shadow-xl flex flex-col justify-between"
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  opacity: Math.abs(normalizedRot) > 90 ? 0.15 : 1, // Dim back cards
                  pointerEvents: isFront ? 'auto' : 'none',
                  zIndex: isFront ? 50 : 10,
                }}
              >
                {/* Floating Preview/Code Mode Toggle Tab */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCardModes(prev => ({
                      ...prev,
                      [proj.id]: prev[proj.id] === 'code' ? 'preview' : 'code'
                    }));
                  }}
                  className="absolute top-2.5 left-2.5 z-30 px-2.5 py-1 rounded-lg bg-neutral-900/90 text-[9px] font-mono font-bold text-white dark:bg-white/90 dark:text-neutral-900 flex items-center gap-1 hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  <Code size={10} />
                  {cardModes[proj.id] === 'code' ? 'PREVIEW' : 'CODE'}
                </button>

                {/* Card Top Block (Changes with mode) */}
                <div className="w-full h-1/2 relative overflow-hidden">
                  {cardModes[proj.id] === 'code' ? (
                    // IDE IDE Editor View inside card!
                    <div className="w-full h-full bg-neutral-950 dark:bg-neutral-950 text-[10px] font-mono p-3 text-neutral-300 flex flex-col justify-between select-text overflow-hidden">
                      {/* VS Code Window bar header */}
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 mb-1.5 flex-shrink-0">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                          <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        </div>
                        <span className="text-neutral-500 text-[8px] font-mono uppercase tracking-widest">
                          {proj.id === 'p1' ? 'neural_flow.ts' : proj.id === 'p2' ? 'apex_config.yaml' : proj.id === 'p3' ? 'chronos.rs' : 'module.ts'}
                        </span>
                      </div>

                      {/* Code Lines with line numbers */}
                      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
                        {getProjectMockCode(proj).slice(0, 7).map((line) => (
                          <div key={line.num} className="flex gap-2.5 items-start">
                            <span className="text-neutral-600 text-[8px] select-none w-3 text-right">{line.num}</span>
                            <span className={`leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis ${line.color}`}>
                              {line.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Default Visual Cover Preview
                    <div className="w-full h-full relative bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 pointer-events-none"
                      />
                      <div className="absolute top-2.5 right-2.5 bg-neutral-900/80 text-white dark:bg-white/80 dark:text-neutral-900 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-tight flex items-center gap-1">
                        <Layers size={10} />
                        {proj.category}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 h-1/2 bg-white dark:bg-neutral-900 flex flex-col justify-between border-t border-neutral-100 dark:border-neutral-800/80">
                  <div>
                    <h3 className="font-display font-semibold text-neutral-800 dark:text-neutral-100 text-sm sm:text-base tracking-tight mb-1 line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                      {lang === 'en' ? proj.description.en : proj.description.id}
                    </p>
                  </div>

                  {/* Footer / Stats */}
                  <div className="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                    <div className="flex gap-2 text-[10px] text-neutral-400 font-mono">
                      {proj.stats && (
                        <span className="flex items-center gap-0.5">
                          <Star size={10} className="fill-yellow-400 stroke-yellow-500" />
                          {proj.stats.stars}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                      {idx === activeIndex ? 'ACTIVE' : 'SELECT'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Rotary Controls */}
      <div className="flex items-center gap-5 mt-4 z-10 px-4">
        <button
          id="prev-gallery-btn"
          onClick={handleRotateLeft}
          className="p-3.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-md hover:scale-105 active:scale-95 transition-all"
          title="Rotate Left"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-display text-neutral-500 dark:text-neutral-400">
            {activeIndex + 1} / {totalProjects}
          </span>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5 text-center hidden sm:block">
            {t.rotateInstructions}
          </p>
        </div>

        <button
          id="next-gallery-btn"
          onClick={handleRotateRight}
          className="p-3.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-md hover:scale-105 active:scale-95 transition-all"
          title="Rotate Right"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Fine-grain Rotary Dial Slider */}
      <div className="w-full max-w-md px-6 mt-6 z-10 flex items-center gap-3">
        <span className="text-[10px] text-neutral-400 font-mono">-180°</span>
        <input
          id="rotary-slider"
          type="range"
          min="-360"
          max="360"
          value={Math.round(rotation)}
          onChange={(e) => setRotation(Number(e.target.value))}
          className="flex-1 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-neutral-100"
        />
        <span className="text-[10px] text-neutral-400 font-mono">+180°</span>
        <button
          id="reset-rot-btn"
          onClick={() => {
            setRotation(0);
            onAddNotification('success', lang === 'en' ? 'Reset Spun' : 'Sinyal Direset', lang === 'en' ? 'Aligned rotation to default orientation' : 'Menyelaraskan putaran ke orientasi standar');
          }}
          className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 transition-all"
          title="Reset Alignment"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Active Project Details Card */}
      <AnimatePresence mode="wait">
        {activeProject && (
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-4xl bg-neutral-50/50 dark:bg-neutral-950/40 rounded-3xl p-6 md:p-8 mt-12 border border-neutral-200/50 dark:border-neutral-800/50 flex flex-col md:flex-row gap-6 md:gap-8 items-center"
          >
            {/* Visual preview */}
            <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-2xl relative shadow-md bg-neutral-100 dark:bg-neutral-800">
              <img
                src={activeProject.image}
                alt={activeProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                <span className="text-white text-xs font-mono px-2.5 py-1 rounded bg-black/40 backdrop-blur-sm">
                  {activeProject.category}
                </span>
              </div>
            </div>

            {/* Explanatory texts and triggers */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-display font-bold text-neutral-900 dark:text-white text-xl md:text-2xl tracking-tight">
                    {activeProject.title}
                  </h4>
                  {activeProject.stats && (
                    <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 text-[10px] font-bold font-mono">
                      <Star size={10} className="fill-yellow-500 stroke-yellow-500" />
                      {activeProject.stats.stars}
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5">
                  {lang === 'en' ? activeProject.description.en : activeProject.description.id}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {activeProject.technologies.map(tech => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md text-[10px] font-mono font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-300 border border-neutral-200/40 dark:border-neutral-700/40"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <a
                  id={`demo-link-${activeProject.id}`}
                  href={activeProject.demoUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    onAddNotification('success', lang === 'en' ? 'Accessing Demo' : 'Mengakses Demo', lang === 'en' ? `Opening live sandbox of ${activeProject.title}` : `Membuka sandbox langsung dari ${activeProject.title}`);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-md"
                >
                  <ExternalLink size={14} />
                  {t.viewDemo}
                </a>
                <a
                  id={`github-link-${activeProject.id}`}
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onAddNotification('info', lang === 'en' ? 'GitHub Visited' : 'GitHub Dikunjungi', lang === 'en' ? `Navigating to repo of ${activeProject.title}` : `Membuka repositori dari ${activeProject.title}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all shadow-sm"
                >
                  <Github size={14} />
                  {t.viewCode}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
