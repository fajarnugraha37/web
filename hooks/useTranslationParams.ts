import { useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export const SUPPORTED_LANGUAGES = [
  { code: 'ind_Latn', label: 'Indonesian' },
  { code: 'eng_Latn', label: 'English' },
  { code: 'zho_Hans', label: 'Chinese (Simplified)' },
  { code: 'spa_Latn', label: 'Spanish' },
  { code: 'arb_Arab', label: 'Arabic' },
  { code: 'zsm_Latn', label: 'Malay' },
  { code: 'jpn_Jpan', label: 'Japanese' },
  { code: 'kor_Hang', label: 'Korean' },
  { code: 'deu_Latn', label: 'German' },
  { code: 'nld_Latn', label: 'Dutch' },
  { code: 'rus_Cyrl', label: 'Russian' },
];

export function useTranslationParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const src = searchParams.get('src') || 'eng_Latn';
  const tgt = searchParams.get('tgt') || 'ind_Latn';

  const updateParams = useCallback((newSrc: string, newTgt: string) => {
    let finalSrc = newSrc;
    let finalTgt = newTgt;

    if (finalSrc === finalTgt) {
      // Find an alternative language for the target if they are identical
      const fallback = SUPPORTED_LANGUAGES.find(l => l.code !== finalSrc);
      if (newSrc !== src) {
        // User changed source, so we change target to fallback
        finalTgt = fallback ? fallback.code : finalTgt;
      } else {
        // User changed target, so we change source to fallback
        finalSrc = fallback ? fallback.code : finalSrc;
      }
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('src', finalSrc);
    params.set('tgt', finalTgt);
    // Use replace to avoid filling up browser history for every selection
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams, src]);

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
