"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import TextPlugin from 'gsap/TextPlugin';

import { lora } from '@/fonts/font';
import './index.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

export default function HomePage() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const t = useTranslations('HomePage');

  // Handle image load to trigger animation
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  useEffect(() => {
    if (!isImageLoaded) return;

    // Animate titles and scroll indicators
    gsap.fromTo('.scroll-fade-1', { x: -10, opacity: 0 }, { x: 40, opacity: 1, duration: 2, ease: 'power2.out' });
    gsap.fromTo('.scroll-fade-2', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: 'power2.out' });
    gsap.fromTo('.scroll-fade-3', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: 'power2.out' });

    // Animate subtitle
    if (textRef.current) {
      gsap.to(textRef.current, {
        text: t('sub-title'),
        duration: 4,
        ease: 'none',
        delay: 0.5,
        opacity: 1
      });
    }

    // Flip background effect
    gsap.to('.effect-flip', {
      rotationY: 180,
      duration: 1.5,
      ease: 'power2.out'
    });

    // Scroll snap from screen1 to screen2
    ScrollTrigger.create({
      trigger: '#screen1',
      start: 'top top',
      end: 'bottom top',
      onLeave: () => {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: '#screen2', offsetY: 0 },
          ease: 'power2.inOut'
        });
      },
      onEnterBack: () => {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: '#screen1', offsetY: 0 },
          ease: 'power2.inOut'
        });
      }
    });

    // Animate images in screen 2
    const images = gsap.utils.toArray('[id^="image-screen2-"]');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#screen2',
        start: 'top 80%',
        end: 'bottom top',
        toggleActions: 'play none none none',
        markers: true
      }
    });

    images.forEach((image) => {
      tl.fromTo(image as Element, {
        y: 800,
        opacity: 0
      }, {
        y: 0,
        opacity: 0.8,
        duration: 2.5,
        ease: 'power2.out'
      });
    });

  }, [isImageLoaded, t]);

  return (
    <div className="flex flex-col w-screen h-auto min-h-screen" id="smooth-content" ref={containerRef}>

      {/* Screen 1 */}
      <div className="w-screen h-screen relative" id="screen1">
        <img
          src="/images/bg-1.jpg"
          alt="background"
          className={`absolute effect-flip w-full h-full object-cover object-center -z-10 transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
        />
        {isImageLoaded && (
          <div className="absolute w-full h-full bg-black/50 -z-5"></div>
        )}

        {/* Title 1 */}
        <div className="absolute mt-[150px] ml-10">
          <p className={`${lora.className} opacity-0 w-[450px] text-white text-4xl scroll-fade-1`}>
            {t('title-banner-1')}
          </p>
          <p ref={textRef} className={`${lora.className} opacity-100 w-[30rem] text-white text-md ml-[40px]`}></p>
        </div>

        {/* Title 2 (Responsive & Centered) */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center px-4">
          <p className={`${lora.className} scroll-fade-2 opacity-0 text-white text-center text-3xl md:text-4xl max-w-[90%] md:max-w-[40rem]`}>
            {t('title-banner-2')}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="flex w-full justify-center items-center absolute bottom-2 scroll-fade-3">
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
            </svg>
            <span className={`${lora.className} text-white`}>{t('scroll-down')}</span>
          </div>
        </div>
      </div>

      {/* Screen 2 */}
      <div className="w-screen h-screen overflow-hidden relative" id="screen2">
        <img
          src="/images/bg-2.jpg"
          alt="background"
          className={`absolute effect-flip w-auto h-screen object-cover object-center -z-10 transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
        />
        <div className="absolute w-full h-screen bg-black/50 -z-5"></div>
        <div className="grid grid-cols-4 relative h-screen w-screen">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="col-span-1 w-auto h-full border-1 border-black">
              <img
                src="/images/bg-2.jpg"
                alt={`background-${index}`}
                className="w-full h-full object-cover object-center"
                id={`image-screen2-${index}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
