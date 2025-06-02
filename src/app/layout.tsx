import '../app/globals.css'

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />  
            </head>  
            <title>Rose&More</title>
            <body>
                <div className="flex flex-col min-h-screen max-w-screen mx-auto overflow-x-hidden">
                    {children}
                </div>
            </body>
        </html>

    )
}
