'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Icon } from '@/components/ui/Icon';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { projectImageUrl } from '@/features/projects/images';
import type { ProjectDetails } from '@/features/projects/model';

type ProjectGalleryProps = {
  images: ProjectDetails['images'];
  projectName: string;
};

export function ProjectGallery({ images, projectName }: ProjectGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (images.length === 0) return null;
  const current = openIndex === null ? undefined : images[openIndex];

  function step(offset: number) {
    setOpenIndex((index) =>
      index === null ? null : (index + offset + images.length) % images.length,
    );
  }

  return (
    <section aria-labelledby="gallery-title">
      <SectionTitle id="gallery-title">Telas</SectionTitle>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <li key={image.path}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Ampliar: ${image.alt}`}
              className="block w-full overflow-hidden rounded-card border border-border transition duration-200 hover:border-focus"
            >
              <Image
                src={projectImageUrl(image.path)}
                alt={image.alt}
                width={640}
                height={400}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-video w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
      <Dialog
        open={current !== undefined}
        onClose={() => setOpenIndex(null)}
        title={`${projectName}: tela ${(openIndex ?? 0) + 1} de ${images.length}`}
        size="lg"
        actions={
          images.length > 1 && (
            <>
              <Button variant="secondary" onClick={() => step(-1)}>
                <Icon name="arrowLeft" />
                Anterior
              </Button>
              <Button variant="secondary" onClick={() => step(1)}>
                Próxima
                <Icon name="arrowRight" />
              </Button>
            </>
          )
        }
      >
        {current && (
          <figure className="flex flex-col gap-3">
            <Image
              src={projectImageUrl(current.path)}
              alt={current.alt}
              width={1600}
              height={1000}
              sizes="90vw"
              className="max-h-svh w-full rounded-field object-contain"
            />
            <figcaption className="text-muted">{current.alt}</figcaption>
          </figure>
        )}
      </Dialog>
    </section>
  );
}
