'use client';

import { type RefObject, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, LineBasicMaterial, LineSegments, PerspectiveCamera } from 'three';
import { Vector3 } from 'three';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  type CameraPose,
  NARROW_SCREEN_WIDTH,
  nearestStop,
  overviewPose,
  planetLocalPosition,
  planetPose,
  planetRadius,
  poseBetween,
  systemCenter,
} from '@/lib/orbits';

import type { JourneyCallbacks, JourneyState, Orbit } from './journey';
import { Rocket } from './Rocket';
import { SpeedLines } from './SpeedLines';
import {
  animateTravel,
  hideTravelProps,
  planTravel,
  type TravelPlan,
  type TravelRig,
} from './travel';

const BASE_FOV = 45;
const STOP_FOV_BUMP = 14;
const SCROLL_EASING = 4.5;
const MAX_FRAME_DELTA = 0.05;

type CameraRigProps = JourneyCallbacks & {
  orbits: readonly Orbit[];
  journeyRef: RefObject<JourneyState>;
};

function stopPose(
  orbit: Orbit,
  orbitIndex: number,
  stop: number,
  time: number,
  isNarrow: boolean,
): CameraPose {
  const center = systemCenter(orbitIndex);
  const project = orbit[stop - 1];
  if (stop === 0 || !project) return overviewPose(center, isNarrow);
  const local = planetLocalPosition(stop - 1, time);
  const world = [center[0] + local[0], center[1] + local[1], center[2] + local[2]] as const;
  return planetPose(
    center,
    world,
    planetRadius(project.texture, project.seed),
    project.hasRing,
    isNarrow,
  );
}

export function CameraRig({
  orbits,
  journeyRef,
  onProgress,
  onStopChange,
  onTravelEnd,
}: CameraRigProps) {
  const reducedMotion = useReducedMotion();
  const rocketRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const flameRef = useRef<Group>(null);
  const linesRef = useRef<LineSegments>(null);
  const linesMaterialRef = useRef<LineBasicMaterial>(null);
  const progressRef = useRef(0);
  const lookAtRef = useRef(new Vector3());
  const lastStopRef = useRef<number | null>(null);
  const planRef = useRef<TravelPlan | null>(null);

  useFrame(({ clock, camera: frameCamera, size }, rawDelta) => {
    const camera = frameCamera as PerspectiveCamera;
    const width = size.width;
    const state = journeyRef.current;
    const rocket = rocketRef.current;
    const rocketBody = bodyRef.current;
    const flame = flameRef.current;
    const speedLines = linesRef.current;
    const speedLinesMaterial = linesMaterialRef.current;
    if (!rocket || !rocketBody || !flame || !speedLines || !speedLinesMaterial) return;
    const rig: TravelRig = {
      camera,
      lookAt: lookAtRef.current,
      rocket,
      rocketBody,
      flame,
      speedLines,
      speedLinesMaterial,
    };
    const delta = Math.min(MAX_FRAME_DELTA, rawDelta);
    const isNarrow = width < NARROW_SCREEN_WIDTH;
    const time = reducedMotion ? 0 : clock.elapsedTime;
    const now = performance.now();

    if (state.travel) {
      planRef.current ??= planTravel(
        state.travel.from,
        state.travel.to,
        rig,
        now,
        isNarrow,
        reducedMotion,
      );
      const hasArrived = animateTravel(
        planRef.current,
        rig,
        now,
        clock.elapsedTime,
        delta,
        reducedMotion,
      );
      camera.updateProjectionMatrix();
      if (hasArrived) {
        const destination = state.travel.to;
        planRef.current = null;
        hideTravelProps(rig);
        state.travel = null;
        state.orbitIndex = destination;
        state.progressTarget = 0;
        progressRef.current = 0;
        onTravelEnd(destination);
      }
      return;
    }

    const orbit = orbits[state.orbitIndex] ?? [];
    const lastIndex = orbit.length;
    progressRef.current += reducedMotion
      ? state.progressTarget - progressRef.current
      : (state.progressTarget - progressRef.current) * Math.min(1, delta * SCROLL_EASING);
    const current = Math.min(lastIndex, Math.max(0, progressRef.current));
    const stop = Math.min(lastIndex, Math.floor(current));
    const nextStop = Math.min(lastIndex, stop + 1);
    const fraction = current - stop;
    const pose = poseBetween(
      systemCenter(state.orbitIndex),
      stopPose(orbit, state.orbitIndex, stop, time, isNarrow),
      stopPose(orbit, state.orbitIndex, nextStop, time, isNarrow),
      fraction,
    );
    camera.position.set(...pose.position);
    lookAtRef.current.set(...pose.lookAt);
    camera.lookAt(lookAtRef.current);
    camera.fov = BASE_FOV + (reducedMotion ? 0 : Math.sin(fraction * Math.PI) * STOP_FOV_BUMP);
    camera.updateProjectionMatrix();
    hideTravelProps(rig);

    onProgress(current);
    const near = nearestStop(current);
    if (near !== lastStopRef.current) {
      lastStopRef.current = near;
      onStopChange(near);
    }
  });

  return (
    <>
      <Rocket ref={rocketRef} bodyRef={bodyRef} flameRef={flameRef} />
      <SpeedLines ref={linesRef} materialRef={linesMaterialRef} />
    </>
  );
}
