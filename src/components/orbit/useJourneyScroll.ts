'use client';

import { type RefObject, useCallback, useEffect } from 'react';

import type { JourneyState } from './journey';

// A saída vai de 0 (fim da seção no rodapé da tela) a 1 (fim da seção a 60% da altura), quando a cena some.
const EXIT_DISTANCE = 0.4;

function scrollableHeight(section: HTMLElement): number {
  return Math.max(1, section.offsetHeight - window.innerHeight);
}

function sectionTop(section: HTMLElement): number {
  return section.getBoundingClientRect().top + window.scrollY;
}

export function useJourneyScroll(
  sectionRef: RefObject<HTMLElement | null>,
  journeyRef: RefObject<JourneyState>,
  lastStop: number,
  reducedMotion: boolean,
  onExitChange?: (exitProgress: number) => void,
) {
  useEffect(() => {
    function readScroll() {
      const section = sectionRef.current;
      if (!section || journeyRef.current.travel) return;
      const box = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      journeyRef.current.exitProgress = Math.min(
        1,
        Math.max(0, (viewport - box.bottom) / (viewport * EXIT_DISTANCE)),
      );
      onExitChange?.(journeyRef.current.exitProgress);
      const scrolled = -box.top / scrollableHeight(section);
      journeyRef.current.progressTarget = Math.min(1, Math.max(0, scrolled)) * lastStop;
    }
    readScroll();
    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', readScroll);
    return () => {
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', readScroll);
    };
  }, [sectionRef, journeyRef, lastStop, onExitChange]);

  const scrollToStop = useCallback(
    (stop: number, instant = false) => {
      const section = sectionRef.current;
      if (!section) return;
      const fraction = lastStop === 0 ? 0 : stop / lastStop;
      window.scrollTo({
        top: sectionTop(section) + scrollableHeight(section) * fraction,
        behavior: instant || reducedMotion ? 'auto' : 'smooth',
      });
    },
    [sectionRef, lastStop, reducedMotion],
  );

  return scrollToStop;
}
