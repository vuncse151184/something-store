import '../app/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Rose&More',
    keywords: ['roses', 'flowers', 'bouquets', 'gifts', 'florist'],
    description: 'Your one-stop shop for roses and more',
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {


    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/favicon.ico" />
                <title>Rose&More</title>
            </head>
            <body>
                <div className="flex flex-col min-h-screen max-w-screen mx-auto overflow-x-hidden">
                    {/* Auth Buttons go inside the body */}

                    {children}
                </div>
            </body>
        </html>
    );
}
