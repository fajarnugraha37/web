"use client";

import dynamic from 'next/dynamic';

const TranslateLabContent = dynamic(
  () => import('@/components/organisms/TranslateLabContent').then(mod => mod.TranslateLabContent),
  { ssr: false }
);

/**
 * Translation Playground Page
 * Features a WASM-based neural machine translation model running client-side.
 */
export default function TranslateLab() {
  return <TranslateLabContent />;
}
