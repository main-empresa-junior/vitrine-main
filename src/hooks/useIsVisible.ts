'use client';

import { type RefObject, useEffect, useState } from 'react';

export function useIsVisible(ref: RefObject<Element | null>, rootMargin = '0px'): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      rootMargin,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return isVisible;
}
