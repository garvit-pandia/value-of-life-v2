'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useGame } from "@/lib/GameContext";
import { useAudio } from "@/lib/AudioProvider";
import { useScramble } from "@/lib/useScramble";
import { useTypewriter } from "@/lib/useTypewriter";

export default function Home() {
  const { resetGame } = useGame();
  const { unlockAudio, playHover, playMechanicalClick } = useAudio();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Phase 1: Cryptographic Scramble of the Main Title
  const { displayText: titleText, isFinished: scrambleDone } = useScramble("A LIFE, REDUCED\nTO A NUMBER.", 1500, 200);

  // Phase 2: Teletype Subtext (Starts exactly when Scramble finishes)
  const [startTypewriter, setStartTypewriter] = useState(false);
  const { displayText: subText, isFinished: typewriterDone } = useTypewriter(
    "Estimate the legal settlement of actual court cases.\nDiscover the systemic biases in human valuation.", 
    15, // Ultra fast typing
    0,
    startTypewriter
  );

  // Phase 3: Button Mount
  const [showButton, setShowButton] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (scrambleDone) {
      // Small pause after the title locks in before the subtitle starts typing
      const timeout = setTimeout(() => setStartTypewriter(true), 400);
      return () => clearTimeout(timeout);
    }
  }, [scrambleDone]);

  useEffect(() => {
    if (typewriterDone) {
      // Small pause after typing finishes before the button violently mounts
      const timeout = setTimeout(() => setShowButton(true), 500);
      return () => clearTimeout(timeout);
    }
  }, [typewriterDone]);

  const handleStart = () => {
    playMechanicalClick();
    unlockAudio();
    resetGame();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <main 
      onMouseMove={handleMouseMove}
      className="flex flex-col items-center justify-center min-h-screen bg-[#050505] px-4 text-center select-none relative overflow-hidden"
    >
      {/* Background Masked Chaos Layer (Flashlight Effect) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40 transition-opacity duration-300 flex flex-wrap content-start p-12 overflow-hidden"
        style={{
          maskImage: `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 80%)`
        }}
      >
        <div className="text-stamp-red font-mono font-bold text-4xl -rotate-12 opacity-50 absolute top-24 left-24">[TOP SECRET]</div>
        <div className="text-parchment/30 font-mono text-xs w-64 absolute top-12 right-12 whitespace-pre-wrap">{"0x8F92 0x1A2B 0xCC44\n0x9921 0x00A1 0xFF22\n".repeat(10)}</div>
        <div className="text-stamp-red font-serif italic text-6xl mt-48 absolute right-32 opacity-40 border-4 border-stamp-red p-2 uppercase">Classified</div>
        <div className="absolute bottom-32 left-32 text-parchment/20 font-mono text-xl tracking-widest leading-loose">{"∀x(Px \u2192 Qx) \n \u2227 \n \u2203y(Ry \u2228 Sy) \n \u2211(n=1 \u2192 \u221E) : X"}</div>
      </div>

      {/* CRT Scanline Overlay */}
      <div className="crt-overlay"></div>

      <div className={`border border-parchment/30 p-1 md:p-2 w-full max-w-2xl relative z-10 transition-opacity duration-1000 ${scrambleDone ? 'opacity-100' : 'opacity-80'}`}>
        <div className="border border-parchment/50 p-6 md:p-10 flex flex-col items-center min-h-[380px] bg-[#050505] relative overflow-hidden">
          
          {/* Header Metadata */}
          <div className="w-full flex justify-between items-start text-[10px] md:text-xs font-mono text-parchment/50 uppercase tracking-widest border-b border-parchment/30 pb-3">
            <span>[Dept of Actuarial Ethics]</span>
            <span>File: Vol-II-9A</span>
          </div>

          <div className="flex flex-col gap-6 py-6 flex-grow justify-center w-full">
            {/* Phase 1: Scramble Title */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold italic tracking-tight text-parchment whitespace-pre-line leading-tight">
              {mounted ? titleText : "A LIFE, REDUCED\nTO A NUMBER."}
            </h1>
            
            {/* Phase 2: Teletype Subtext Container */}
            <div className="h-12 md:h-16 flex items-center justify-center w-full">
              {startTypewriter && (
                <p className="font-mono text-parchment text-xs md:text-sm leading-relaxed bg-parchment/10 inline-block px-4 py-2 mx-auto uppercase tracking-wider whitespace-pre-line text-left max-w-lg">
                  {subText}
                  {!typewriterDone && <span className="animate-pulse bg-parchment w-2 h-4 inline-block ml-1 align-middle"></span>}
                </p>
              )}
            </div>
          </div>
          
          {/* Phase 3: Fast Violence Mount Button */}
          <div className="mt-4 w-full flex justify-center border-t border-parchment/30 pt-8 relative h-24">
            {showButton && (
              <Link 
                href="/play" 
                onClick={handleStart}
                onMouseEnter={playHover}
                onMouseDown={playMechanicalClick}
                className="animate-violent-mount group relative inline-flex h-14 items-center justify-center border-2 border-stamp-red bg-transparent text-stamp-red px-12 font-mono font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-stamp-red hover:text-[#050505]"
              >
                <span>Access Archive &rarr;</span>
              </Link>
            )}
          </div>
          
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-[10px] font-mono text-parchment/40 tracking-widest uppercase text-center animate-reveal" style={{ animationDelay: '0.5s' }}>
        CLASSIFIED: EXPERIMENT IN PROGRESS
      </div>
    </main>
  );
}
