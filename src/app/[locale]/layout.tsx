import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from './components/Header';
import LocomotiveWrapper from "./components/LocomotiveWrapper";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Readonly<LocaleLayoutProps>) {
    const { locale } = await params;
    const messages = await getMessages();

    // Ensure locale is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <Header locale={locale} />
            {/* <div className="relative flex flex-col min-h-screen mx-auto overflow-x-hidden"> */}
                <LocomotiveWrapper>
                {children}
                </LocomotiveWrapper>
            {/* </div> */}
        </NextIntlClientProvider>
    );
}