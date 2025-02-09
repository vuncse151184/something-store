import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '../components/Header/page';
import LoadingLogo from '../components/LoadingPage/page';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: { locale: string };
}

export default async function LocaleLayout({ children, params }: Readonly<LocaleLayoutProps>) {
    const awaitedParams = await params; //  
    const { locale } = awaitedParams;
    const messages = await getMessages();
    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <div className="flex relative flex-col min-h-screen mx-auto overflow-x-hidden">
                        <Header locale={locale} />
                        {children}
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}