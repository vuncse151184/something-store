"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { manrope, pacifico } from "@/fonts/font"
import Header from "../components/Header"
import { use, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params)
    const t = useTranslations("AboutUs")

    // Refs for animated elements
    const titleRef = useRef<HTMLDivElement>(null)
    const storyRef = useRef<HTMLDivElement>(null)
    const valuesRef = useRef<HTMLDivElement>(null)
    const valuesGridRef = useRef<HTMLDivElement>(null)
    const teamRef = useRef<HTMLDivElement>(null)
    const teamGridRef = useRef<HTMLDivElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)
    const footerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title animation - fade in and slide up
            gsap.fromTo(titleRef.current,
                {
                    opacity: 0,
                    y: 100,
                    scale: 0.8
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            )

            // Story section animation
            gsap.fromTo(storyRef.current,
                {
                    opacity: 0,
                    y: 80,
                    rotationX: 15
                },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: storyRef.current,
                        start: "top 75%",
                        end: "bottom 25%",
                        toggleActions: "play none none reverse"
                    }
                }
            )

            // Values section title
            const valuesTitle = valuesRef.current?.querySelector('h2')
            if (valuesTitle) {
                gsap.fromTo(valuesTitle,
                    {
                        opacity: 0,
                        y: 50
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: valuesRef.current,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                )
            }

            // Values grid stagger animation
            if (valuesGridRef.current?.children) {
                gsap.fromTo(
                    Array.from(valuesGridRef.current.children),
                    {
                        opacity: 0,
                        y: 60,
                        scale: 0.8,
                        rotationY: 15
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotationY: 0,
                        duration: 0.8,
                        ease: "back.out(1.7)",
                        stagger: 0.2,
                        scrollTrigger: {
                            trigger: valuesGridRef.current,
                            start: "top 75%",
                            toggleActions: "play none none reverse"
                        }
                    }
                )
            }

            // Team section title
            const teamTitle = teamRef.current?.querySelector('h2')
            if (teamTitle) {
                gsap.fromTo(teamTitle,
                    {
                        opacity: 0,
                        y: 50
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: teamRef.current,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                )
            }

            // Team members stagger animation
            const teamMembers = teamGridRef.current?.children
            if (teamMembers) {
                gsap.fromTo(teamMembers,
                    {
                        opacity: 0,
                        y: 80,
                        scale: 0.7
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1,
                        ease: "elastic.out(1, 0.5)",
                        stagger: 0.15,
                        scrollTrigger: {
                            trigger: teamGridRef.current,
                            start: "top 75%",
                            toggleActions: "play none none reverse"
                        }
                    }
                )
            }

            // CTA section animation
            gsap.fromTo(ctaRef.current,
                {
                    opacity: 0,
                    y: 100,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ctaRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            )

            // Footer animation
            gsap.fromTo(footerRef.current,
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            )

            // Parallax effect for background
            // gsap.to(".bg-parallax", {
            //     yPercent: -50,
            //     ease: "none",
            //     scrollTrigger: {
            //         trigger: ".bg-parallax",
            //         start: "top bottom",
            //         end: "bottom top",
            //         scrub: true
            //     }
            // })

            // Smooth reveal animation for content boxes
            gsap.utils.toArray('.content-box').forEach((box: any) => {
                gsap.fromTo(box,
                    {
                        opacity: 0,
                        y: 50,
                        backdropFilter: "blur(0px)"
                    },
                    {
                        opacity: 1,
                        y: 0,
                        backdropFilter: "blur(8px)",
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: box,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                )
            })

        })

        return () => ctx.revert() // Cleanup
    }, [])

    return (
        <div className={`min-w-screen relative overflow-hidden`}>
            {/* Background Image with parallax */}
            <Header locale={locale} />
            <div
                className="bg-parallax absolute inset-0 bg-cover bg-center bg-repeat-y bg-[url('/images/errorrpage.jpg')] scale-110"
            />

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gray-400/10" />

            {/* Main Content */}
            <div className={`${pacifico.className} relative z-10 container mx-auto px-4 py-16`}>
                <div className="max-w-4xl mx-auto pt-20">
                    {/* Page Title */}
                    <div ref={titleRef} className="text-center mb-16">
                        <h1 className={`text-rose-400 text-5xl md:text-6xl font-bold mb-6`}>{t('title')}</h1>
                        <p className="text-white text-xl italic">{t('slogan')}</p>
                    </div>

                    {/* About Content */}
                    <div ref={storyRef} className="content-box bg-black/50 backdrop-blur-sm p-8 md:p-12 rounded-lg mb-16">
                        <h2 className="text-rose-400 text-3xl font-semibold mb-6">{t('story-title')}</h2>
                        <p className="text-white mb-6 leading-loose">
                            {t('story-description')}
                        </p>
                    </div>

                    {/* Values Section */}
                    <div ref={valuesRef} className="content-box backdrop-blur-sm p-8 md:p-12 rounded-lg mb-16">
                        <h2 className="text-rose-400 text-3xl font-semibold mb-6 text-center">{t('why-choose-us')}</h2>
                        <div ref={valuesGridRef} className="grid md:grid-cols-3 gap-8 mb-16">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="bg-black/50 backdrop-blur-sm p-6 rounded-lg text-center transform-gpu">
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
                    <div ref={teamRef} className="content-box bg-black/50 backdrop-blur-sm p-8 md:p-12 rounded-lg mb-16">
                        <h2 className="text-rose-400 text-3xl font-semibold mb-8 text-center">Our Team</h2>
                        <div ref={teamGridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                            <div className="text-center transform-gpu">
                                <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 overflow-hidden">
                                    <Image
                                        src={`/images/programer.jpg`}
                                        alt={`Team Member`}
                                        className="w-full h-full object-cover rounded-full transition-transform duration-300 hover:scale-110"
                                        width={128}
                                        height={128}
                                    />
                                </div>
                                <h3 className="text-white text-lg font-medium">Vu Nguyen</h3>
                                <p className="text-rose-400 text-sm">Web Designer</p>
                            </div>

                            <div className="text-center transform-gpu">
                                <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 overflow-hidden">
                                    <Image
                                        src={`/images/programer.jpg`}
                                        alt={`Team Member`}
                                        className="w-full h-full object-cover rounded-full transition-transform duration-300 hover:scale-110"
                                        width={128}
                                        height={128}
                                    />
                                </div>
                                <h3 className="text-white text-lg font-medium">Vu Nguyen</h3>
                                <p className="text-rose-400 text-sm">Fullstack Web Developer</p>
                            </div>

                            <div className="text-center transform-gpu">
                                <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 overflow-hidden">
                                    <Image
                                        src={`/images/programer.jpg`}
                                        alt={`Team Member`}
                                        className="w-full h-full object-cover rounded-full transition-transform duration-300 hover:scale-110"
                                        width={128}
                                        height={128}
                                    />
                                </div>
                                <h3 className="text-white text-lg font-medium">Vu Nguyen</h3>
                                <p className="text-rose-400 text-sm">Researcher</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div ref={ctaRef} className="text-center mb-16">
                        <h2 className="text-white text-2xl md:text-3xl mb-6">Join us on our journey</h2>
                        <Button className="bg-rose-400 hover:bg-rose-500 text-white px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-rose-400/25">
                            <Link href="/contact">Get in Touch</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div ref={footerRef} className="relative z-10 border-t bg-white border-white/20 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-white/60 text-xs mb-4 md:mb-0">Copyright © 2025 Rose&Moré. All rights reserved.</p>
                        <div className="flex space-x-6">
                            <Link href="#" className="text-white/60 hover:text-white text-xs transition-colors duration-300">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-white/60 hover:text-white text-xs transition-colors duration-300">
                                Terms of Service
                            </Link>
                            <Link href="#" className="text-white/60 hover:text-white text-xs transition-colors duration-300">
                                Sustainability
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
