'use client';

import { createContext, type ReactNode, use, useCallback, useMemo, useState } from 'react';

import { Toast, type ToastTone } from './Toast';

const TOAST_DURATION_MS = 5000;
const TOAST_FADE_MS = 200;

type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
  isLeaving: boolean;
};

type ShowToast = (message: string, tone?: ToastTone) => void;

const ToastContext = createContext<ShowToast | null>(null);

let nextToastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<readonly ToastItem[]>([]);

  // O aviso esmaece antes de sair da lista.
  const dismiss = useCallback((id: number) => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, isLeaving: true } : toast)),
    );
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, TOAST_FADE_MS);
  }, []);

  const show = useCallback<ShowToast>(
    (message, tone = 'info') => {
      const id = nextToastId++;
      setToasts((current) => [...current, { id, message, tone, isLeaving: false }]);
      setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  const value = useMemo(() => show, [show]);

  return (
    <ToastContext value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:left-auto sm:w-96"
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            tone={toast.tone}
            isLeaving={toast.isLeaving}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </ToastContext>
  );
}

export function useToast(): ShowToast {
  const show = use(ToastContext);
  if (!show) throw new Error('useToast must be used inside ToastProvider');
  return show;
}
