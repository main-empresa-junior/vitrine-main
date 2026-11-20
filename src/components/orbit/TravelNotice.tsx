'use client';

import { useLastValue } from '@/hooks/useLastValue';
import { fadeClasses } from '@/lib/motion';
import { cn } from '@/lib/utils/cn';

export type Notice = {
  title: string;
  text: string;
};

type TravelNoticeProps = {
  notice: Notice | null;
};

const noticeKey = (notice: Notice) => `${notice.title}|${notice.text}`;

export function TravelNotice({ notice }: TravelNoticeProps) {
  const shown = useLastValue(notice, noticeKey);

  return (
    <div
      aria-live="polite"
      className={cn(
        'pointer-events-none absolute inset-x-5 top-32 text-center',
        fadeClasses(notice !== null),
      )}
    >
      {shown && (
        <>
          <p className="font-display text-title text-shadow-lg">{shown.title}</p>
          <p className="mt-2 text-lead text-muted">{shown.text}</p>
        </>
      )}
    </div>
  );
}
