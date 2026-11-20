'use client';

import { useEffect, useState } from 'react';

import { FirstProjectLink } from '@/components/dashboard/FirstProjectLink';
import { createClient } from '@/lib/supabase/client';

// A página continua estática: a sessão é conferida só no navegador, e o painel valida de novo.
export function TeamShortcut() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    let isActive = true;
    createClient()
      .auth.getClaims()
      .then(({ data }) => {
        if (isActive) setIsSignedIn(Boolean(data?.claims));
      });
    return () => {
      isActive = false;
    };
  }, []);

  if (!isSignedIn) return null;
  return <FirstProjectLink variant="secondary" />;
}
