import { Icon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';
import { DEVELOPER_LINK_LABELS, developerLinkKind } from '@/features/projects/developer-link';
import type { ProjectDetails } from '@/features/projects/model';

type DeveloperListProps = {
  developers: ProjectDetails['developers'];
};

export function DeveloperList({ developers }: DeveloperListProps) {
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {developers.map(({ name, url }) => {
        if (!url) {
          return (
            <li key={name}>
              <Tag>{name}</Tag>
            </li>
          );
        }
        const kind = developerLinkKind(url);
        const destination =
          kind === 'other'
            ? `Site de ${name}`
            : `Perfil de ${name} no ${DEVELOPER_LINK_LABELS[kind]}`;
        return (
          <li key={name}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${destination} (abre em nova aba)`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface-strong px-4 text-small font-semibold text-foreground underline-offset-4 hover:underline"
            >
              <Icon name={kind === 'other' ? 'link' : kind} className="size-4" />
              {name}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
