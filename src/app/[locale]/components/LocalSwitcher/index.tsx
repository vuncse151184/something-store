"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { usePathname } from "next/navigation"
import { manrope } from "@/fonts/font"
import { ChevronDown } from "lucide-react"
import Image from "next/image"

interface Locale {
    code: string
    name: string
    navigation: string
    countryCode: string
}

const locales: Locale[] = [
    {
        code: "us",
        name: "English",
        navigation: "en",
        countryCode: "US",
    },
    {
        code: "vn",
        name: "Tiếng Việt",
        navigation: "vi",
        countryCode: "VN",
    },
]

const LocaleSwitcher = () => {
    const [isPending, startTransition] = useTransition()
    const [isOpen, setIsOpen] = useState(false)
    const pathName = usePathname()
    const router = useRouter()
    const localeActive = useLocale()

    const currentLocale = locales.find((locale) => locale.navigation === localeActive) || locales[0]

    const handleLocaleChange = (nextLocale: string) => {
        if (nextLocale === localeActive) return

        setIsOpen(false)
        startTransition(() => {
            router.replace(`/${nextLocale}`)
        })
    }

    return (
        <div className="relative">
            {/* Dropdown Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className={`
          flex items-center space-x-2 px-3 py-2 rounded-md
          bg-transparent  hover:border-gray-400
          text-white hover:text-white transition-colors duration-200
          ${manrope.className} ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
            >
                <Image src={`https://flagcdn.com/w40/${currentLocale.code}.png`} alt={currentLocale.name} width={24} height={16}  />
                <span className="text-sm font-medium">{currentLocale.countryCode}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

                    {/* Dropdown Content */}
                    <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-20">
                        {locales.map((locale) => (
                            <button
                                key={locale.code}
                                onClick={() => handleLocaleChange(locale.navigation)}
                                className={`
                  w-full flex items-center space-x-3 px-4 py-3 text-left
                  hover:bg-gray-700 transition-colors duration-150
                  ${locale.code === localeActive ? "bg-gray-700 text-white" : "text-gray-300"}
                  ${manrope.className}
                `}
                            >
                                <Image src={`https://flagcdn.com/w40/${locale.code}.png`} alt={locale.name} width={24} height={16} className="mt-1" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{locale.name}</span>
                                </div>
                                {locale.code === localeActive && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default LocaleSwitcher
