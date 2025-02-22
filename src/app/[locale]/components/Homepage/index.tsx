"use client"

import { useTranslations } from 'next-intl';
import React, { useState, useRef, useEffect } from 'react';
import './index.css'
import { routing } from '@/i18n/routing';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import TextPlugin from 'gsap/TextPlugin';
import { lora } from '@/fonts/font';
// import { useLocomotiveScroll } from "react-locomotive-scroll";

gsap.registerPlugin(ScrollTrigger, TextPlugin);



export default function HomePage() {

    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const textRef = useRef(null);
    // const { scroll } = useLocomotiveScroll();
    // Trigger the animation after image load
    useEffect(() => {
        if (isImageLoaded) {
            // Animate the text from the bottom to its final position when the image is loaded
            gsap.fromTo(
                '.scroll-fade-1',
                { x: -10, opacity: 0 }, // Start position
                { x: 40, opacity: 1, duration: 2, ease: 'power2.out' } // End position
            );
            gsap.fromTo(
                '.scroll-fade-2',
                { x: window.innerWidth, opacity: 0 }, // Start position
                { x: window.innerWidth - 600, opacity: 1, duration: 2, ease: 'power2.out' } // End position
            );
            gsap.fromTo(
                '.scroll-fade-3',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 2, ease: 'power2.out' }
            );
            if (textRef.current) {
                gsap.to(textRef.current, {
                    text: t('sub-title'),
                    duration: 4,
                    ease: "none",
                    delay: 0.5,
                    opacity: 1,
                });
            }
            gsap.to(".effect-flip", {
                rotationY: 180,
                duration: 1.5,
                ease: "power2.out"
            }
            );
            let sections = gsap.utils.toArray(".screen");

            gsap.to(sections, {
                yPercent: -100 * (sections.length - 1), // Moves up as user scrolls
                ease: "none",
                scrollTrigger: {
                    trigger: ".container",
                    start: "top top",
                    end: "+=200%", // Controls scroll length
                    scrub: 2, // Increases scroll speed effect
                    pin: true,
                },
            });

            // const tl = gsap.timeline()
            // tl.to()
        }
    }, [isImageLoaded]);
    const handleImageLoad = () => {
        setIsImageLoaded(true);
    }
    const t = useTranslations('HomePage');
    return (
        <div className="flex flex-col h-auto relative min-h-screen scroll" id='smooth-content'>
            {/* screen 1 */}
            <div className='w-[100vw] h-[100vh] relative' id="screen1">
                {/* Background Image */}
                <img src="/images/bg-1.jpg"
                    alt="background"
                    className={`absolute effect-flip w-full h-full object-cover object-center -z-10 transition-opacity
                         duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={handleImageLoad}
                />

                {/* Overlay Layer */}
                {isImageLoaded && (
                    <div className="absolute w-full h-full bg-black/50 -z-5"></div>
                )}

                {/* Title 1 */}
                <div className="absolute mt-[150px]">
                    <p className={`${lora.className} opacity-0 w-[450px] text-white text-4xl scroll-fade-1`}>
                        {t('title-banner-1')}
                    </p>
                    <p
                        ref={textRef}
                        className={`${lora.className} opacity-100 w-[30rem] text-white text-md ml-[40px]`}
                    ></p>
                </div>

                {/* Title 2 */}
                <div className="absolute bottom-20 right-[40rem]">
                    <p className={`${lora.className} w-[30rem] opacity-0 text-white text-4xl scroll-fade-2 `}>
                        {t('title-banner-2')}
                    </p>
                </div>
                {/* Scroll Indicator */}
                <a className="flex w-full justify-center items-center absolute bottom-2" href="#screen2">
                    <div className="flex flex-col items-center scroll-fade-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                        </svg>
                        <span className={`${lora.className} text-white`}>{t('scroll-down')}</span>
                    </div>
                </a>
            </div>
            {/* end screen 1 */}

            {/* screen 2 */}
            <div className='w-[100vw] h-[100vh] relative' id="screen2">
                <img src="/images/bg-2.jpg"
                    alt="background"
                    className={`absolute effect-flip w-full h-full object-cover object-center -z-10 transition-opacity
                         duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={handleImageLoad}
                />
                <div className="absolute w-full h-full bg-black/50 -z-5"></div>
                <div className='grid grid-cols-12 relative h-full w-screen'>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="col-span-3 w-full h-full border-2 border-black">
                            {/* <img src="/images/bg-2.jpg"
                                alt="background"
                                className={`w-full h-full object-cover object-center`}
                                id={`image-screen2-${index}`}
                            /> */}
                        </div>
                    ))}
                </div>
            </div>
            {/* Screen 3 (End of Page) */}
            {/* <div className="w-[100vw] h-[100vh] relative" id="end"></div> */}
        </div>
    );
}