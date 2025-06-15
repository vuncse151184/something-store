 
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from './components/Header';
import { ViewTransitions } from 'next-view-transitions'
import PageWrapper from './components/PageWrapper';
import ChatInterface from './components/chat-interface';
import FloatingChatButton from './components/floating-chat-button';
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
  const toogleChat = () => { }
  return (
    <PageWrapper>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      
      </NextIntlClientProvider>
    </PageWrapper>
  );
}