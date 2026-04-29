import { useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export const SUPPORTED_LANGUAGES = [
  { code: 'ind_Latn', label: 'Indonesian' },
  { code: 'eng_Latn', label: 'English' },
  { code: 'zho_Hans', label: 'Chinese (Simplified)' },
  { code: 'spa_Latn', label: 'Spanish' },
  { code: 'ara_Arab', label: 'Arabic' },
];

export function useTranslationParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const src = searchParams.get('src') || 'eng_Latn';
  const tgt = searchParams.get('tgt') || 'ind_Latn';

  const updateParams = useCallback((newSrc: string, newTgt: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('src', newSrc);
    params.set('tgt', newTgt);
    // Use replace to avoid filling up browser history for every selection
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const setSrc = useCallback((newSrc: string) => {
    updateParams(newSrc, tgt);
  }, [updateParams, tgt]);

  const setTgt = useCallback((newTgt: string) => {
    updateParams(src, newTgt);
  }, [updateParams, src]);

  const swap = useCallback(() => {
    updateParams(tgt, src);
  }, [updateParams, src, tgt]);

  const isRtl = tgt.includes('_Arab');

  return {
    src,
    tgt,
    setSrc,
    setTgt,
    swap,
    isRtl
  };
}
