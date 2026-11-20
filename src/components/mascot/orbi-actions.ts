export const ORBI_ACTIONS = ['jump', 'nuzzle', 'fly', 'sit', 'peek', 'spin'] as const;

export type OrbiAction = (typeof ORBI_ACTIONS)[number];

export function pickNextAction(
  previous: OrbiAction | null,
  random: () => number = Math.random,
): OrbiAction {
  const options = ORBI_ACTIONS.filter((action) => action !== previous);
  return options[Math.min(options.length - 1, Math.floor(random() * options.length))];
}
