import { cn } from '@/lib/utils/cn';

export type Notice = {
  title: string;
  text: string;
};

type TravelNoticeProps = {
  notice: Notice | null;
};

export function TravelNotice({ notice }: TravelNoticeProps) {
  return (
    <div
      aria-live="polite"
      className={cn(
        'pointer-events-none absolute inset-x-5 top-32 text-center transition duration-400 ease-out-soft',
        notice ? 'opacity-100' : 'translate-y-3 opacity-0',
      )}
    >
      {notice && (
        <>
          <p className="font-display text-title text-shadow-lg">{notice.title}</p>
          <p className="mt-2 text-lead text-muted">{notice.text}</p>
        </>
      )}
    </div>
  );
}
