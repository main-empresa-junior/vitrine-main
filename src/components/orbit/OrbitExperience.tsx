'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import type { ShowcaseProject } from '@/features/projects/model';
import { useIsVisible } from '@/hooks/useIsVisible';
import { useLastValue } from '@/hooks/useLastValue';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSupportsWebGL } from '@/hooks/useSupportsWebGL';
import { fadeClasses, MOTION } from '@/lib/motion';
import { splitIntoOrbits } from '@/lib/orbits';
import { cn } from '@/lib/utils/cn';

import type { JourneyState, Travel } from './journey';
import { JourneyIntro } from './JourneyIntro';
import { OrbitSwitcher, projectCountLabel } from './OrbitSwitcher';
import { ProjectSheet } from './ProjectSheet';
import { StopTrail } from './StopTrail';
import { type Notice, TravelNotice } from './TravelNotice';
import { useJourneyScroll } from './useJourneyScroll';

const OrbitScene = dynamic(() => import('./OrbitScene').then((module) => module.OrbitScene), {
  ssr: false,
});

const VIEWPORTS_PER_STOP = 100;
const EXTRA_VIEWPORTS = 160;
const INTRO_FADE_SPEED = 2.5;
const INTRO_LIFT_PX = 60;
// A órbita fica ativa enquanto o fim da seção estiver abaixo de 60% da tela.
const ORBIT_ACTIVE_MARGIN = '-60% 0px 0px 0px';

type OrbitExperienceProps = {
  projects: readonly ShowcaseProject[];
};

export function OrbitExperience({ projects }: OrbitExperienceProps) {
  const orbits = useMemo(() => splitIntoOrbits(projects), [projects]);
  const [orbitIndex, setOrbitIndex] = useState(0);
  const [activeStop, setActiveStop] = useState<number | null>(0);
  const [travel, setTravel] = useState<Travel | null>(null);
  const journeyRef = useRef<JourneyState>({
    orbitIndex: 0,
    progressTarget: 0,
    exitProgress: 0,
    travel: null,
  });
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const isPointerFocusRef = useRef(false);
  // Única fonte de verdade: a cena e toda a interface da órbita aparecem e somem juntas.
  const isOrbitActive = useIsVisible(sectionRef, ORBIT_ACTIVE_MARGIN);
  const reducedMotion = useReducedMotion();
  const hasWebGL = useSupportsWebGL();

  const orbit = orbits[orbitIndex] ?? [];
  const activeProject = activeStop !== null && activeStop > 0 ? orbit[activeStop - 1] : undefined;
  const sheetProject = useLastValue(activeProject, (project) => project.id);
  const lastStop = orbit.length;
  // Escurece a cena aos poucos enquanto a seção sai da tela.
  const handleExitChange = useCallback((exitProgress: number) => {
    if (dimRef.current) dimRef.current.style.opacity = String(exitProgress * MOTION.exitDim);
  }, []);
  const handleVeilChange = useCallback((opacity: number) => {
    if (veilRef.current) veilRef.current.style.opacity = String(opacity);
  }, []);
  const scrollToStop = useJourneyScroll(
    sectionRef,
    journeyRef,
    lastStop,
    reducedMotion,
    handleExitChange,
  );

  useEffect(() => {
    if (!travel) return;
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = '';
    };
  }, [travel]);

  const handleProgress = useCallback((progress: number) => {
    const intro = introRef.current;
    if (!intro) return;
    const isFirstOrbit = journeyRef.current.orbitIndex === 0;
    intro.style.opacity = isFirstOrbit ? String(Math.max(0, 1 - progress * INTRO_FADE_SPEED)) : '0';
    intro.style.transform = `translateY(${-progress * INTRO_LIFT_PX}px)`;
  }, []);

  const handleTravelEnd = useCallback(
    (destination: number) => {
      setOrbitIndex(destination);
      setTravel(null);
      setActiveStop(0);
      scrollToStop(0, true);
    },
    [scrollToStop],
  );

  // Chegando pelo teclado com a órbita só em parte na tela, a página volta à parada atual.
  // Só para foco de teclado: no clique, rolar antes do mouseup faria o clique se perder.
  function showStageOnFocus() {
    const section = sectionRef.current;
    const isFromPointer = isPointerFocusRef.current;
    isPointerFocusRef.current = false;
    if (!section || isFromPointer) return;
    const box = section.getBoundingClientRect();
    if (box.top <= 0 && box.bottom >= window.innerHeight) return;
    scrollToStop(
      Math.min(lastStop, Math.max(0, Math.round(journeyRef.current.progressTarget))),
      true,
    );
  }

  function startTravel(destination: number) {
    if (journeyRef.current.travel || destination < 0 || destination >= orbits.length) return;
    // Encaixa a parada atual inteira na tela antes de travar a rolagem, para a viagem ser vista.
    const currentStop = Math.round(journeyRef.current.progressTarget);
    scrollToStop(Math.min(lastStop, Math.max(0, currentStop)), true);
    const next = { from: orbitIndex, to: destination };
    journeyRef.current.travel = next;
    setTravel(next);
    setActiveStop(null);
  }

  if (!hasWebGL) {
    return (
      <section className="px-5 pt-40 pb-6 sm:px-12 lg:px-24">
        <div className="relative">
          <h1 className="font-display text-display">Projetos em órbita</h1>
          <p className="mt-5 max-w-prose text-lead text-muted">
            Seu navegador não conseguiu mostrar a cena 3D. Os projetos estão na lista abaixo.
          </p>
        </div>
      </section>
    );
  }

  const notice: Notice | null = travel
    ? {
        title: reducedMotion
          ? `Chegando à órbita ${travel.to + 1}`
          : `${travel.to < travel.from ? 'Voltando à' : 'Rumo à'} órbita ${travel.to + 1}`,
        text: `${projectCountLabel(orbits[travel.to].length)} ${travel.to < travel.from ? 'por lá' : 'para conhecer'}`,
      }
    : orbitIndex > 0 && activeStop === 0
      ? { title: `Órbita ${orbitIndex + 1}`, text: 'Role para visitar os planetas' }
      : null;

  return (
    <section
      ref={sectionRef}
      aria-label="Viagem pela órbita de projetos"
      className="relative"
      style={{ height: `${lastStop * VIEWPORTS_PER_STOP + EXTRA_VIEWPORTS}vh` }}
    >
      <OrbitScene
        orbits={orbits}
        journeyRef={journeyRef}
        isSceneVisible={isOrbitActive}
        onProgress={handleProgress}
        onStopChange={setActiveStop}
        onTravelEnd={handleTravelEnd}
        onVeilChange={handleVeilChange}
      />
      <div
        ref={dimRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-1 bg-space-950 opacity-0"
      />
      <div
        ref={veilRef}
        data-scene-veil
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-1 bg-space-950 opacity-0"
      />
      <div className="sticky top-0 h-dvh overflow-hidden">
        <JourneyIntro ref={introRef} />
        <div
          inert={!isOrbitActive}
          onPointerDown={() => {
            isPointerFocusRef.current = true;
          }}
          onPointerUp={() => {
            isPointerFocusRef.current = false;
          }}
          onFocus={showStageOnFocus}
          className={cn('absolute inset-0', fadeClasses(isOrbitActive, 'none'))}
        >
          <p aria-live="polite" className="sr-only">
            {activeProject
              ? `Em destaque: ${activeProject.name}, planeta ${activeStop} de ${lastStop} da órbita ${orbitIndex + 1}.`
              : ''}
          </p>
          <div
            inert={!activeProject}
            className={cn(
              'absolute inset-x-4 bottom-24 sm:right-auto sm:left-12 sm:w-md md:top-1/2 md:bottom-auto md:-translate-y-1/2 lg:left-24',
              fadeClasses(Boolean(activeProject)),
            )}
          >
            {sheetProject && (
              <ProjectSheet
                key={sheetProject.id}
                project={sheetProject}
                className="animate-appear bg-space-950/60"
              />
            )}
          </div>
          <TravelNotice notice={notice} />
          <StopTrail
            labels={['Visão da órbita', ...orbit.map((project) => project.name)]}
            activeStop={activeStop}
            onSelect={(stop) => scrollToStop(stop)}
          />
          <OrbitSwitcher
            orbitIndex={orbitIndex}
            orbitSizes={orbits.map((item) => item.length)}
            isTraveling={travel !== null}
            isAtLastStop={activeStop === lastStop}
            onTravel={startTravel}
          />
        </div>
      </div>
    </section>
  );
}
