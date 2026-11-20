import {
  type Group,
  type LineBasicMaterial,
  type LineSegments,
  Object3D,
  type PerspectiveCamera,
  Quaternion,
  Vector3,
} from 'three';

import {
  type CameraPose,
  overviewPose,
  quadraticBezier,
  smoothstep,
  systemCenter,
} from '@/lib/orbits';

import { SPEED_LINES_DEPTH } from './SpeedLines';

const FORWARD_DURATION_MS = 5200;
const RETURN_DURATION_MS = 6200;
const REDUCED_DURATION_MS = 900;
// Na volta, os primeiros 22% são a meia-volta do foguete, parado no lugar.
const TURN_FRACTION = 0.22;
const BASE_FOV = 45;
const WARP_FOV = 22;
const UP = new Vector3(0, 1, 0);

export type TravelPlan = {
  isReturn: boolean;
  durationMs: number;
  startedAt: number;
  leaveFrom: Vector3;
  leaveLookAt: Vector3;
  arrival: CameraPose;
  start: Vector3;
  control: Vector3;
  end: Vector3;
  initialAim: Vector3;
};

export type TravelRig = {
  camera: PerspectiveCamera;
  lookAt: Vector3;
  rocket: Group;
  rocketBody: Group;
  flame: Group;
  speedLines: LineSegments;
  speedLinesMaterial: LineBasicMaterial;
};

const toVector = (v: readonly [number, number, number]) => new Vector3(...v);

export function planTravel(
  from: number,
  to: number,
  rig: TravelRig,
  now: number,
  isNarrow: boolean,
  reducedMotion: boolean,
): TravelPlan {
  const isReturn = to < from;
  const arrival = overviewPose(systemCenter(to), isNarrow);
  const leaveFrom = rig.camera.position.clone();
  const leaveLookAt = rig.lookAt.clone();
  const forward = leaveLookAt.clone().sub(leaveFrom).normalize();
  const start = leaveFrom
    .clone()
    .addScaledVector(forward, 9)
    .add(new Vector3(0, -1.5, 0));
  const end = toVector(arrival.position).add(new Vector3(0, -6, -18));
  const control = start
    .clone()
    .lerp(end, 0.5)
    .add(new Vector3(0, 60, 0));
  const heading = end.clone().sub(start).normalize();
  return {
    isReturn,
    durationMs: reducedMotion
      ? REDUCED_DURATION_MS
      : isReturn
        ? RETURN_DURATION_MS
        : FORWARD_DURATION_MS,
    startedAt: now,
    leaveFrom,
    leaveLookAt,
    arrival,
    start,
    control,
    end,
    // Na volta o nariz começa apontando para longe da rota e faz a curva antes de acelerar.
    initialAim: isReturn ? start.clone().sub(heading) : start.clone().add(heading),
  };
}

const helper = new Object3D();
const initialRotation = new Quaternion();
const headingRotation = new Quaternion();

function bezier(plan: TravelPlan, t: number): Vector3 {
  return toVector(
    quadraticBezier(plan.start.toArray(), plan.control.toArray(), plan.end.toArray(), t),
  );
}

// Retorna true quando a viagem terminou.
export function animateTravel(
  plan: TravelPlan,
  rig: TravelRig,
  now: number,
  elapsedSeconds: number,
  delta: number,
  reducedMotion: boolean,
): boolean {
  const fraction = Math.min(1, (now - plan.startedAt) / plan.durationMs);
  const turn = plan.isReturn ? TURN_FRACTION : 0;
  const pathT = smoothstep((fraction - turn - 0.04) / (0.9 - turn));
  const rocketPosition = bezier(plan, pathT);
  const ahead = bezier(plan, Math.min(1, pathT + 0.01));

  rig.rocket.position.copy(rocketPosition);
  helper.position.copy(rocketPosition);
  helper.lookAt(plan.initialAim.clone().sub(plan.start).add(rocketPosition));
  initialRotation.copy(helper.quaternion);
  helper.lookAt(ahead);
  headingRotation.copy(helper.quaternion);
  const turnProgress = plan.isReturn ? smoothstep(fraction / turn) : 1;
  rig.rocket.quaternion.copy(initialRotation).slerp(headingRotation, turnProgress);
  rig.rocket.visible = fraction < 0.97;
  if (!reducedMotion) rig.rocketBody.rotation.y += delta * 1.2;
  const thrust = fraction < turn ? 0.35 : 1 + (1 - Math.abs(pathT - 0.5) * 2) * 1.6;
  const pulse = 0.85 + Math.sin(elapsedSeconds * 40) * 0.15;
  rig.flame.scale.set(pulse, thrust, pulse);

  const direction = ahead.clone().sub(rocketPosition).normalize();
  if (direction.lengthSq() < 1e-6) direction.copy(plan.end).sub(plan.start).normalize();
  const side = new Vector3().crossVectors(direction, UP).normalize();
  // Na volta a câmera fica do outro lado: o foguete cruza a tela no sentido contrário.
  const chase = rocketPosition
    .clone()
    .addScaledVector(direction, -6.5)
    .addScaledVector(side, plan.isReturn ? -3.2 : 3.2)
    .add(new Vector3(0, 2.2, 0));
  const enter = smoothstep(fraction / 0.14);
  const leave = smoothstep((fraction - 0.86) / 0.14);
  rig.camera.position
    .copy(plan.leaveFrom)
    .lerp(chase, enter)
    .lerp(toVector(plan.arrival.position), leave);
  rig.lookAt
    .copy(plan.leaveLookAt)
    .lerp(rocketPosition.clone().addScaledVector(direction, 6), enter)
    .lerp(toVector(plan.arrival.lookAt), leave);
  rig.camera.lookAt(rig.lookAt);

  const warp = reducedMotion
    ? 0
    : Math.max(
        0,
        Math.sin(Math.min(1, Math.max(0, (fraction - turn - 0.08) / (0.8 - turn))) * Math.PI),
      );
  rig.camera.fov = BASE_FOV + warp * WARP_FOV;
  rig.speedLinesMaterial.opacity = warp * 0.7;
  rig.speedLines.position.copy(rig.camera.position);
  rig.speedLines.quaternion.copy(rig.camera.quaternion);
  rig.speedLines.translateZ((elapsedSeconds * 140) % SPEED_LINES_DEPTH);

  return fraction >= 1;
}

export function hideTravelProps(rig: TravelRig): void {
  rig.rocket.visible = false;
  rig.speedLinesMaterial.opacity = 0;
}
