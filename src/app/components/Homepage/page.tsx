
import { useTranslations } from 'next-intl';
import React, { useState, useRef, useEffect } from 'react';
import './index.css'
import { routing } from '@/i18n/routing';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import TextPlugin from 'gsap/TextPlugin';
import { pacifico, greatVibes, lora } from '@/fonts/font';


gsap.registerPlugin(ScrollTrigger, TextPlugin);

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}


export default function HomePage() {

    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const textRef = useRef(null);

    useEffect(() => {
        if (textRef.current) {
            gsap.to(textRef.current, {
                text: t('sub-title'),
                duration: 4,
                ease: "none",
                delay: 0.5,
                opacity: 1,
            });
        }
    }, []);
    // Trigger the animation after image load
    useEffect(() => {
        if (isImageLoaded) {
            // Animate the text from the bottom to its final position when the image is loaded
            gsap.fromTo(
                '.scroll-fade-1',
                { x: -10, opacity: 0 }, // Start position
                { x: 40, opacity: 1, duration: 2, ease: 'power3.out' } // End position
            );
            gsap.fromTo(
                '.scroll-fade-2',
                //start position at the right end of the screen
                { x: window.innerWidth, opacity: 0 }, // Start position
                { x: window.innerWidth - 800, opacity: 1, duration: 2, ease: 'power3.out' } // End position
            );

            gsap.fromTo(
                '.scroll-fade-3',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 2, ease: 'power3.out' }
            );
        }
    }, [isImageLoaded]);;
    console.log(isImageLoaded);
    const handleImageLoad = () => {
        setIsImageLoaded(true);
    }
    const t = useTranslations('HomePage');
    return (
        <div className="flex flex-col relative min-h-screen scroll" id='smooth-content'>
            <div className='w-[100vw] h-[100vh] relative'>
                {/* Background Image */}
                <img src="/images/bg-1.jpg"
                    alt="background"
                    className={`absolute w-full h-full object-cover object-center -z-10 transition-opacity duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={handleImageLoad}
                />

                {/* Overlay Layer */}
                <div className="absolute w-full h-full bg-black/50 -z-5"></div>

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
                <div className="absolute bottom-20 right-[35rem]">
                    <p className={`${lora.className} w-[30rem] opacity-0 text-white text-4xl scroll-fade-2 `}>
                        {t('title-banner-2')}
                    </p>
                </div>
                <div className='flex w-full justify-center items-center absolute bottom-2'>
                    <div className='flex flex-col items-center scroll-fade-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                        </svg>

                        <span className={`${lora.className} text-white`}>{t('scroll-down')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}