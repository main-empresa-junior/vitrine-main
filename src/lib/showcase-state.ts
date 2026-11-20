export type ShowcaseState = 'empty' | 'populated';

export function getShowcaseState(projects: readonly { published: boolean }[]): ShowcaseState {
  return projects.some((project) => project.published) ? 'populated' : 'empty';
}
