import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export const useSmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical' as const,
      gestureDirection: 'vertical' as const,
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // RAF loop for Lenis
    let requestId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      requestId = requestAnimationFrame(raf);
    };

    requestId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(requestId);
      lenis.destroy();
    };
  }, []);

  return lenisRef.current;
};
