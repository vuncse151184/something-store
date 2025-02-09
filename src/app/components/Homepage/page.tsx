
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/routing';
import './index.css'
import { routing } from '@/i18n/routing';
import { Pacifico } from 'next/font/google';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';
import { useEffect } from 'react';
import LoadingLogo from '../LoadingPage/page'; 
gsap.registerPlugin(ScrollTrigger);

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
const pacifico = Pacifico({
    weight: '400',
    preload: true,
    subsets: ['latin', 'vietnamese']
})

export default function HomePage() {

    const [isImageLoaded, setIsImageLoaded] = useState(false)
    // Initialize Locomotive Scroll
    useEffect(() => {
        let scroll: any;
        if (typeof window !== 'undefined') {
            scroll = new LocomotiveScroll();
        }
    }, [])//
    // Trigger the animation after image load
    useEffect(() => {
        if (isImageLoaded) {
            // Animate the text from the bottom to its final position when the image is loaded
            gsap.fromTo(
                '.scroll-fade',
                { y: 400, opacity: 0 }, // Start position
                { y: 0, opacity: 1, duration: 2, ease: 'power3.out' } // End position
            );
        }
    }, [isImageLoaded]);;
    console.log(isImageLoaded);
    const handleImageLoad = () => {
        setIsImageLoaded(true);
    }
    const t = useTranslations('HomePage');
    return (
        <div className="flex flex-col relative min-h-screen " id='smooth-content'>
            <div className='w-[100vw] h-[100vh] flex flex-col items-center justify-center relative'>
                {/* <img src="/images/background.jpg"
                    alt="background"
                    className={`absolute w-full h-full object-cover -z-10 transition-opacity duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={handleImageLoad}
                /> */}
                
                <div className='flex flex-col items-center justify-center gap-y-10'>
                    <span className={`${pacifico.className} opacity-0 text-4xl scroll-fade`}>{t('title-banner-1')} </span>
                    <span className={`${pacifico.className} opacity-0 text-4xl scroll-fade`}>{t('title-banner-2')}</span>
                </div>
            </div>
            <div className='flex flex-col items-center justify-center w-[100vw] h-[100vh] bg-none bg-opacity-0'>

            </div>
            <div>

            </div>


        </div >
    );
}