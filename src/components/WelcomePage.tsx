import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Cpu, RefreshCw, ChevronRight } from 'lucide-react';

interface WelcomePageProps {
  onEnter: () => void;
  developerName: string;
  developerRole: string;
}

export default function WelcomePage({ onEnter, developerName, developerRole }: WelcomePageProps) {
  const [stage, setStage] = useState<'booting' | 'authorized' | 'ready'>('booting');
  const [logs, setLogs] = useState<string[]>([]);
  const [typedWelcome, setTypedWelcome] = useState('');
  const [progress, setProgress] = useState(0);

  // Retro sci-fi audio synth for tactile workspace hums
  const playBeep = (freq: number, duration: number, type: 'sine' | 'square' | 'triangle' | 'sawtooth' = 'sine') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context may be blocked initially, which is fine
    }
  };

  // Boot up process
  useEffect(() => {
    const diagnosticMessages = [
      '⚡ CONNECTING TO PORT 3000 CONSOLE MATRIX...',
      '🔒 ENGAGING END-TO-END CRYPTO HANDSHAKE...',
      '🧠 FETCHING ADVANCED ARCHITECTURE METADATA...',
      '📊 SYNCHRONIZING REAL-TIME PORTFOLIO STORES...',
      '🎨 MOUNTING HIGH-CONTRAST NEURAL WORKSPACE...',
      '🎯 STABILIZING FLUID GYROSCOPES AND 3D GRAPHICS...',
      '✅ PROTOCOL VERIFIED. QUANTUM SIGNALS FULLY LOCKED.'
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < diagnosticMessages.length) {
        setLogs(prev => [...prev, diagnosticMessages[logIndex]]);
        playBeep(440 + logIndex * 80, 0.08, 'sine');
        logIndex++;
        setProgress((logIndex / diagnosticMessages.length) * 100);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setStage('authorized');
          playBeep(880, 0.15, 'triangle');
          setTimeout(() => {
            playBeep(1200, 0.25, 'sine');
          }, 80);
        }, 600);
      }
    }, 380);

    return () => clearInterval(interval);
  }, []);

  // Text-typing effect for authorization welcome message
  useEffect(() => {
    if (stage !== 'authorized') return;

    const message = `WELCOME TO THE CREATIVE LAB OF MUHAMMAD SYUBAN. ALL SYSTEM CORE MODULES ARE ONLINE. DIRECT PROTOCOL GRANTED.`;
    let charIdx = 0;
    const typingInterval = setInterval(() => {
      if (charIdx < message.length) {
        setTypedWelcome(prev => prev + message.charAt(charIdx));
        if (charIdx % 3 === 0) {
          playBeep(600, 0.03, 'square');
        }
        charIdx++;
      } else {
        clearInterval(typingInterval);
        setStage('ready');
      }
    }, 20);

    return () => clearInterval(typingInterval);
  }, [stage]);

  const handleEnterClick = () => {
    // Play sweet access granted audio chord
    try {
      playBeep(523.25, 0.12, 'sine'); // C5
      setTimeout(() => playBeep(659.25, 0.12, 'sine'), 80); // E5
      setTimeout(() => playBeep(783.99, 0.12, 'sine'), 160); // G5
      setTimeout(() => playBeep(1046.50, 0.35, 'sine'), 240); // C6
    } catch (e) {}
    onEnter();
  };

  return (
    <div className="fixed inset-0 z-[1000] w-screen h-screen overflow-hidden bg-neutral-950 flex flex-col justify-between p-6 sm:p-12 font-mono text-neutral-300 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Absolute Tech Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,rgba(0,0,0,0)_80%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* High-tech sweeping scanner laser line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-[bounce_8s_infinite_linear] pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center z-10 border-b border-neutral-900 pb-4">
        <div className="flex items-center gap-2.5">
          <Shield className="text-emerald-500 animate-pulse" size={18} />
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">SECURE SHELL CONSOLE v4.2</span>
        </div>
        <div className="text-[10px] text-neutral-500 uppercase tracking-widest flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          SYSTEM_PORT: 3000
        </div>
      </div>

      {/* Main Console Box (Luxurious Dark Terminal Glass) */}
      <div className="flex-1 my-8 max-w-4xl mx-auto w-full bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md flex flex-col justify-between overflow-hidden z-10 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 flex-shrink-0">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-xs text-neutral-500 font-mono flex items-center gap-2">
            <Cpu size={12} className="text-neutral-500" />
            SYS_DIAGNOSTICS_HOST
          </span>
        </div>

        {/* Live log compiler screen */}
        <div className="flex-1 overflow-y-auto space-y-2.5 font-mono text-xs sm:text-sm pr-2 text-neutral-300 leading-relaxed scrollbar-thin scrollbar-thumb-neutral-800">
          {logs.map((log, i) => {
            const isLast = i === logs.length - 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={`flex items-start gap-2 ${isLast && stage === 'booting' ? 'text-emerald-400 font-bold' : ''}`}
              >
                <span className="text-neutral-600 select-none">[{100 + i * 14}]</span>
                <span>{log}</span>
              </motion.div>
            );
          })}

          {/* Typing active authorized content */}
          {stage !== 'booting' && (
            <div className="mt-6 pt-6 border-t border-neutral-800/60 text-emerald-400 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold tracking-wider">
                <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  SYSTEM STATUS: AUTHORIZED
                </span>
              </div>
              <p className="text-neutral-200 leading-relaxed font-sans text-sm sm:text-base md:text-lg tracking-wide max-w-2xl">
                {typedWelcome}
                <span className="inline-block w-2.5 h-4 bg-emerald-400 ml-1 animate-[ping_1.2s_infinite]" />
              </p>
            </div>
          )}
        </div>

        {/* Progress bar / Action Row */}
        <div className="pt-4 border-t border-neutral-800/40 flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0">
          {stage === 'booting' ? (
            <div className="w-full">
              <div className="flex justify-between text-[10px] text-neutral-500 mb-1.5 uppercase tracking-wider">
                <span>Analyzing Environment Security</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800/30">
                <motion.div 
                  className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col sm:flex-row justify-between items-center gap-4"
            >
              <div className="text-[11px] text-neutral-500 flex flex-col">
                <span className="uppercase tracking-widest text-neutral-400 font-bold">Muhammad Syuban</span>
                <span>{developerRole}</span>
              </div>

              <motion.button
                id="enter-workspace-btn"
                onClick={handleEnterClick}
                disabled={stage !== 'ready'}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all ${
                  stage === 'ready' 
                    ? 'bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400 shadow-emerald-500/20 ring-2 ring-emerald-400/40' 
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
              >
                <span>Initialize Interface</span>
                <ChevronRight size={14} className="animate-[bounce_1.5s_infinite_horizontal]" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer / Copyright / Metadata */}
      <div className="flex flex-col sm:flex-row justify-between text-[9px] text-neutral-600 border-t border-neutral-900 pt-4 gap-2 z-10">
        <div>COGNITIVE PLATFORM ACCESS // WORKSPACE SECURE</div>
        <div className="font-mono flex items-center gap-1">
          <span>LATENCY: 0.14ms</span>
          <span className="text-neutral-700">|</span>
          <span>© 2026</span>
        </div>
      </div>
    </div>
  );
}
