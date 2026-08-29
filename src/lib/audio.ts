"use client";

// Safely play a subtle synthesized bell chime
export function playChime() {
  if (typeof window === "undefined") return;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Bell-like frequencies
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.5);

    // Fade out volume to create a "chime" envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05); // quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5); // long release

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.6);
  } catch (e) {
    console.error("Audio synthesis failed:", e);
  }
}
