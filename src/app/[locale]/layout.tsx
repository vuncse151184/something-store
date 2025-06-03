import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing'; 
// import GSAPSmoothWrapper from './components/GSAPSmoothWrapper';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  return (

    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}