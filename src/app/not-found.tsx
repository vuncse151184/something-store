import Link from "next/link"
import { Button } from "@/components/ui/button"
import { manrope } from "@/fonts/font"
import { useTranslations } from "next-intl"

export default function NotFoundPage({locale}: {locale: string}) {
    const t = useTranslations('ErrorPage')
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('/images/errorrpage.jpg')]"

            />

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/10" />

            {/* Navigation Header */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6">

                {/* Logo */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <h1 className={`text-white text-xl ${manrope.className} italic`}>Rose&Moré</h1>
                </div>

            </nav>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
                {/* 404 Text */}
                <div className="text-center mb-8">
                    <h1 className="text-[12rem] md:text-[16rem] lg:text-[14rem]  font-bold text-rose-400 leading-none tracking-tight">
                        404
                    </h1>
                </div>

                {/* Error Message */}
                <p className={`${manrope.className} text-white text-lg md:text-xl mb-12 text-center max-w-md`}>
                    {t('404-Title')}
                </p>

                {/* Go Back Button */}
                <Button
                    asChild
                    className="bg-[#8094c4] hover:bg-[#48546f] tracking-widest text-white px-8 py-3 rounded-full text-sm font-medium   transition-colors"
                >
                    <Link href="/">GO BACK</Link>
                </Button>
            </div>

        </div>
    )
}
