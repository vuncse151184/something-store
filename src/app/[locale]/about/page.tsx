import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { pacifico } from "@/fonts/font"

export default function AboutPage() {
    const t = useTranslations("AboutUs")
    return (
        <div className={`${pacifico.className} min-w-screen relative overflow-hidden`}>
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('/images/errorrpage.jpg')]"
            />

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gray-400/10" />

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto pt-20">
                    {/* Page Title */}
                    <div className="text-center mb-16">
                        <h1 className={` text-rose-400 text-5xl md:text-6xl font-bold mb-6`}>{t('title')}</h1>
                        <p className="text-white text-xl italic">{t('slogan')}</p>
                    </div>

                    {/* About Content */}
                    <div className="bg-black/50 backdrop-blur-sm p-8 md:p-12 rounded-lg mb-16">
                        <h2 className="text-rose-400 text-3xl font-semibold mb-6">{t('story-title')}</h2>
                        <p className="text-white mb-6 leading-relaxed">
                            {t('story-description')}
                        </p>

                    </div>

                    {/* Values Section */}
                    <div className=" backdrop-blur-sm p-8 md:p-12 rounded-lg mb-16">
                        <h2 className="text-rose-400 text-3xl font-semibold mb-6 text-center">{t('why-choose-us')}</h2>
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="bg-black/50 backdrop-blur-sm p-6 rounded-lg text-center">
                                    <h3 className="text-rose-400 text-xl font-semibold mb-4">{t(`WCU-${index + 1}`)}</h3>
                                    <Image
                                        src={`/icons/WCU-${index + 1}.png`}
                                        alt={`Icon ${index + 1}`}
                                        className="w-16 h-16 mx-auto mb-4"
                                        width={64}
                                        height={64}
                                        priority
                                    />
                                    <p className="text-white">
                                        {t(`WCU-des-${index + 1}`)}
                                    </p>
                                </div>
                            ))}

                        </div>
                    </div>


                    {/* Team Section */}
                    <div className="bg-black/50 backdrop-blur-sm p-8 md:p-12 rounded-lg mb-16">
                        <h2 className="text-rose-400 text-3xl font-semibold mb-8 text-center">Our Team</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="text-center">
                                    <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto  mb-4">
                                        <Image
                                            src={`/images/programer.jpg`}
                                            alt={`Team Member ${i}`}
                                            className="w-full h-full object-cover rounded-full"
                                            width={128}
                                            height={128}
                                        />
                                    </div>
                                    <h3 className="text-white text-lg font-medium">Vu Nguyen</h3>
                                    <p className="text-rose-400 text-sm">Web Designer</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-white text-2xl md:text-3xl mb-6">Join us on our journey</h2>
                        <Button className="bg-rose-400 hover:bg-rose-500 text-white px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-colors">
                            <Link href="/contact">Get in Touch</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 border-t border-white/20 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-white/60 text-xs mb-4 md:mb-0">Copyright © 2025 Rose&Moré. All rights reserved.</p>
                        <div className="flex space-x-6">
                            <Link href="#" className="text-white/60 hover:text-white text-xs">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-white/60 hover:text-white text-xs">
                                Terms of Service
                            </Link>
                            <Link href="#" className="text-white/60 hover:text-white text-xs">
                                Sustainability
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
