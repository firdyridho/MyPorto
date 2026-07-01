// Dynamic Web Audio API synthesizer for tactile UI interactions
// Prevents slow loads or missing assets by generating pure audio nodes in real time

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playClickSound() {
  const isEnabled = localStorage.getItem('portfolio_sounds_enabled') !== 'false';
  if (!isEnabled) return;

  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Fast decay woodblock-like click
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.warn('Audio context click play failed:', e);
  }
}

export function playTransitionSound() {
  const isEnabled = localStorage.getItem('portfolio_sounds_enabled') !== 'false';
  if (!isEnabled) return;

  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // Gentle upward pitch sweep
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {
    console.warn('Audio context transition play failed:', e);
  }
}

export function playToastSound() {
  const isEnabled = localStorage.getItem('portfolio_sounds_enabled') !== 'false';
  if (!isEnabled) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Play two beautiful harmonizing notes (chime effect)
    const playNote = (freq: number, startDelay: number, duration: number, volume: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + startDelay);
      
      gain.gain.setValueAtTime(0, now + startDelay);
      gain.gain.linearRampToValueAtTime(volume, now + startDelay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + startDelay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + startDelay);
      osc.stop(now + startDelay + duration);
    };

    // Beautiful major third chime (C6 to E6)
    playNote(1046.50, 0, 0.35, 0.05); // C6
    playNote(1318.51, 0.08, 0.4, 0.04); // E6
  } catch (e) {
    console.warn('Audio context toast play failed:', e);
  }
}
