'use client';

import { useEffect, useRef } from 'react';

type Splat = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  life: number;
  maxLife: number;
  weight: number;
};

export default function InkCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const splatsRef = useRef<Splat[]>([]);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetWidth = window.innerWidth;
    let targetHeight = window.innerHeight;

    const setSize = () => {
      targetWidth = window.innerWidth;
      targetHeight = window.innerHeight;
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    };

    setSize();
    window.addEventListener('resize', setSize);

    const STAMP_RED_RGB = '211, 47, 47'; // #d32f2f
    
    // Splatter generator
    const createSplatter = (x: number, y: number) => {
      // Main blob
      const splats: Splat[] = [];
      const numDrops = Math.floor(Math.random() * 3) + 2; // 2 to 4 drops

      for (let i = 0; i < numDrops; i++) {
        const isMain = i === 0;
        const radius = isMain 
          ? Math.random() * 4 + 4 // 4 to 8px main
          : Math.random() * 2 + 1; // 1 to 3px scatter

        const offsetX = isMain ? 0 : (Math.random() - 0.5) * 15;
        const offsetY = isMain ? 0 : (Math.random() - 0.5) * 15;
        
        splats.push({
          x: x + offsetX,
          y: y + offsetY,
          radius,
          opacity: Math.random() * 0.5 + 0.3, // Initial opacity 0.3 to 0.8
          life: 0,
          maxLife: Math.random() * 50 + 50, // 50 to 100 frames (~1-2 seconds)
          weight: Math.random() * 0.3 + 0.1, // Gravity multiplier
        });
      }
      return splats;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = { x: e.clientX, y: e.clientY };
      if (!lastMousePos.current) {
        lastMousePos.current = currentPos;
        return;
      }

      const dx = currentPos.x - lastMousePos.current.x;
      const dy = currentPos.y - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only stamp every 30-50 pixels to make discrete trails
      const threshold = Math.random() * 20 + 30; 
      
      if (distance > threshold) {
        const newSplats = createSplatter(currentPos.x, currentPos.y);
        splatsRef.current.push(...newSplats);
        lastMousePos.current = currentPos;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // clear every frame for clean alphablend

      const splats = splatsRef.current;
      for (let i = splats.length - 1; i >= 0; i--) {
        const splat = splats[i];
        splat.life++;

        // Calculate current alpha based on life
        const progress = splat.life / splat.maxLife;
        const currentOpacity = splat.opacity * (1 - Math.pow(progress, 2)); // Ease out quad

        if (progress >= 1) {
          splats.splice(i, 1);
          continue;
        }

        // Apply slight gravity drip
        splat.y += splat.weight;

        // Draw
        ctx.beginPath();
        ctx.arc(splat.x, splat.y, splat.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${STAMP_RED_RGB}, ${currentOpacity})`;
        ctx.fill();
        
        ctx.shadowColor = `rgba(${STAMP_RED_RGB}, ${currentOpacity * 0.5})`;
        ctx.shadowBlur = 4;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      aria-hidden="true"
    />
  );
}
