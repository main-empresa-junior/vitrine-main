'use client';

import { useTransition } from 'react';

import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/ToastProvider';
import { updateRequestStatus } from '@/features/project-requests/actions';
import {
  REQUEST_STATUS_LABELS,
  REQUEST_STATUSES,
  type RequestStatus,
} from '@/features/project-requests/schema';

const STATUS_OPTIONS = REQUEST_STATUSES.map((value) => ({
  value,
  label: REQUEST_STATUS_LABELS[value],
}));

type RequestStatusControlProps = {
  id: string;
  status: RequestStatus;
};

export function RequestStatusControl({ id, status }: RequestStatusControlProps) {
  const showToast = useToast();
  const [isPending, startTransition] = useTransition();

  function changeStatus(next: string) {
    startTransition(async () => {
      const result = await updateRequestStatus(id, next);
      showToast(
        result.ok ? 'Status do pedido atualizado.' : 'Não foi possível mudar o status.',
        result.ok ? 'success' : 'error',
      );
    });
  }

  return (
    <div className="max-w-xs">
      <Select
        id={`status-${id}`}
        label="Status do pedido"
        options={STATUS_OPTIONS}
        defaultValue={status}
        aria-busy={isPending || undefined}
        onChange={(event) => changeStatus(event.target.value)}
      />
    </div>
  );
}
