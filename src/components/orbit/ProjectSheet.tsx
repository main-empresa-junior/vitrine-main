import { buttonClasses } from '@/components/ui/button-styles';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PROJECT_TYPE_LABELS } from '@/features/projects/constants';
import type { ShowcaseProject } from '@/features/projects/model';
import { readableTextColor } from '@/lib/color';
import { cn } from '@/lib/utils/cn';

type ProjectSheetProps = {
  project: Pick<
    ShowcaseProject,
    'slug' | 'name' | 'type' | 'year' | 'summary' | 'client' | 'technologies' | 'palette'
  >;
  isLinkEnabled?: boolean;
  className?: string;
};

export function ProjectSheet({ project, isLinkEnabled = true, className }: ProjectSheetProps) {
  const actionStyle = {
    backgroundColor: project.palette.primary,
    color: readableTextColor(project.palette.primary),
  };
  const actionClass = 'mt-6 hover:brightness-110';

  return (
    <article
      className={cn(
        'rounded-card border border-border bg-surface p-7 text-foreground backdrop-blur-md',
        className,
      )}
    >
      <p className="flex items-center gap-2.5 text-small font-semibold text-muted">
        <span
          aria-hidden="true"
          className="size-2.5 rounded-full"
          style={{ backgroundColor: project.palette.primary }}
        />
        {PROJECT_TYPE_LABELS[project.type]} · {project.year}
      </p>
      <h2 className="mt-3 font-display text-title break-words">{project.name || 'Sem nome'}</h2>
      <p className="mt-3 text-lead text-muted">{project.summary}</p>
      <dl className="mt-5 flex flex-col gap-2 text-small">
        {project.client && (
          <div className="flex gap-4">
            <dt className="w-20 shrink-0 text-muted">Cliente</dt>
            <dd className="font-semibold">{project.client}</dd>
          </div>
        )}
        {project.technologies.length > 0 && (
          <div className="flex gap-4">
            <dt className="w-20 shrink-0 text-muted">Feito com</dt>
            <dd className="font-semibold">{project.technologies.join(', ')}</dd>
          </div>
        )}
      </dl>
      {isLinkEnabled ? (
        <ButtonLink
          href={`/projects/${project.slug}`}
          variant="ghost"
          className={actionClass}
          style={actionStyle}
        >
          Ver projeto<span className="sr-only"> {project.name}</span>
        </ButtonLink>
      ) : (
        <span
          className={buttonClasses({ variant: 'ghost', className: actionClass })}
          style={actionStyle}
        >
          Ver projeto
        </span>
      )}
    </article>
  );
}
