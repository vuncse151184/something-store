'use client';

import { use } from 'react';
import dynamic from 'next/dynamic';

const HomePage = dynamic(() => import('@/app/[locale]/components/Homepage'), {
  ssr: false,
});

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params); // ✅ unwrap Promise per Next.js 15+
  return <HomePage locale={locale} />; // 👈 truyền locale nếu cần
}
