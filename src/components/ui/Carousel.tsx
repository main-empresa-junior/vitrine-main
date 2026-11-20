'use client';

import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

import { Button } from './Button';
import { Icon } from './Icon';

export type CarouselItem = {
  key: string;
  content: ReactNode;
};

type CarouselProps = {
  label: string;
  items: readonly CarouselItem[];
};

type Position = {
  first: number;
  perView: number;
  canGoBack: boolean;
  canGoForward: boolean;
  fitsAll: boolean;
};

const EDGE_TOLERANCE_PX = 2;
const INITIAL_POSITION: Position = {
  first: 0,
  perView: 1,
  canGoBack: false,
  canGoForward: false,
  fitsAll: true,
};

function measure(track: HTMLElement): Position {
  const itemWidth =
    (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? track.clientWidth;
  const step = Math.max(1, itemWidth);
  return {
    first: Math.round(track.scrollLeft / step),
    perView: Math.max(1, Math.floor((track.clientWidth + EDGE_TOLERANCE_PX) / step)),
    canGoBack: track.scrollLeft > EDGE_TOLERANCE_PX,
    canGoForward: track.scrollLeft + track.clientWidth < track.scrollWidth - EDGE_TOLERANCE_PX,
    fitsAll: track.scrollWidth <= track.clientWidth + EDGE_TOLERANCE_PX,
  };
}

// Faixa horizontal com encaixe por item: 1 e um pedaço no celular, 3 no tablet e 4 no desktop.
export function Carousel({ label, items }: CarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState<Position>(INITIAL_POSITION);
  const reducedMotion = useReducedMotion();
  const itemKeys = items.map((item) => item.key).join('|');

  const update = useCallback(() => {
    if (trackRef.current) setPosition(measure(trackRef.current));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = 0;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => observer.disconnect();
  }, [itemKeys, update]);

  function scrollByItems(count: number) {
    const track = trackRef.current;
    const itemWidth = (track?.firstElementChild as HTMLElement | null)?.offsetWidth;
    if (!track || !itemWidth) return;
    track.scrollBy({ left: count * itemWidth, behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowRight') scrollByItems(1);
    else if (event.key === 'ArrowLeft') scrollByItems(-1);
    else return;
    event.preventDefault();
  }

  const last = Math.min(items.length, position.first + position.perView);

  return (
    <section aria-roledescription="carrossel" aria-label={label} className="flex flex-col gap-4">
      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label={`${label}: use as setas para rolar`}
        onScroll={update}
        onKeyDown={handleKeyDown}
        className="-mx-2 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-card pb-2"
      >
        {items.map((item, index) => (
          <li
            key={item.key}
            role="group"
            aria-roledescription="item"
            aria-label={`${index + 1} de ${items.length}`}
            className="shrink-0 basis-5/6 snap-start px-2 sm:basis-1/2 md:basis-1/3 xl:basis-1/4"
          >
            {item.content}
          </li>
        ))}
      </ul>
      {!position.fitsAll && (
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="px-0"
              disabled={!position.canGoBack}
              onClick={() => scrollByItems(-position.perView)}
              aria-label="Anteriores"
            >
              <Icon name="arrowLeft" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="px-0"
              disabled={!position.canGoForward}
              onClick={() => scrollByItems(position.perView)}
              aria-label="Próximos"
            >
              <Icon name="arrowRight" />
            </Button>
          </div>
          <p aria-live="polite" className="text-small font-semibold text-muted">
            {position.first + 1} a {last} de {items.length}
          </p>
        </div>
      )}
    </section>
  );
}
