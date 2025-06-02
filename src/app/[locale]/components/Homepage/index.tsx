"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useGSAPScroll } from './../GSAPSmoothWrapper'; // Adjust path
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import TextPlugin from 'gsap/TextPlugin';

import { lora } from '@/fonts/font';
import './index.css';
import Header from '../Header';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function HomePage({ locale }: { locale: string }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const t = useTranslations('HomePage');
  const { scrollTo } = useGSAPScroll();

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [screen2ImagesReady, setScreen2ImagesReady] = useState(false);

  // Handle image load
  const handleImageLoad = () => setIsImageLoaded(true);

  // Setup animations after images load
  useEffect(() => {
    if (!isImageLoaded) return;

    const timer = setTimeout(() => {
      animateIntroContent();
      setupScrollAnimations();
    }, 200);

    return () => clearTimeout(timer);
  }, [isImageLoaded, t]);

  // Check if screen2 images are ready
  useEffect(() => {
    const screen2 = document.getElementById('screen2');
    if (!screen2) return;

    const images = Array.from(screen2.querySelectorAll('img'));
    if (images.length === 0) {
      setScreen2ImagesReady(true);
      return;
    }

    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        setScreen2ImagesReady(true);
      }
    };

    images.forEach((img) => {
      if (img.complete) checkLoaded();
      else {
        img.addEventListener('load', checkLoaded);
        img.addEventListener('error', checkLoaded);
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', checkLoaded);
        img.removeEventListener('error', checkLoaded);
      });
    };
  }, []);

  const animateIntroContent = () => {
    gsap.fromTo('.scroll-fade-1', { x: -10, opacity: 0 }, { x: 40, opacity: 1, duration: 2, ease: 'power2.out' });
    gsap.fromTo('.scroll-fade-2', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: 'power2.out' });
    gsap.fromTo('.scroll-fade-3', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: 'power2.out' });

    if (textRef.current) {
      gsap.to(textRef.current, {
        text: t('sub-title'),
        duration: 4,
        ease: 'none',
        delay: 0.5,
        opacity: 1,
      });
    }

    gsap.to('.effect-flip', {
      rotationY: 180,
      duration: 1.5,
      ease: 'power2.out',
    });
  };

  const setupScrollAnimations = () => {
    const sections = document.querySelectorAll('.screen');
    console.log('Sections:', sections);
    sections.forEach((section, index) => {
      const next = sections[index + 1] as HTMLElement | undefined;
      const prev = sections[index - 1] as HTMLElement | undefined;

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        onLeave: () => {
          if (next) {
            gsap.to(window, {
              duration: 0.8,
              scrollTo: { y: next.offsetTop, autoKill: false },
              ease: 'power2.out'
            });
          }
        },
        onEnterBack: () => {
          if (prev) {
            gsap.to(window, {
              duration: 0.8,
              scrollTo: { y: prev.offsetTop, autoKill: false },
              ease: 'power2.out'
            });
          }
        },
        snap: 1,
      });
    });
  };


  // Setup screen2 animations when images are ready
  useEffect(() => {
    if (screen2ImagesReady && isImageLoaded) {
      ScrollTrigger.create({
        trigger: '#screen2',
        start: 'top 80%',
        once: true,
        onEnter: () => {
          animateScreen2Images();
        },
      });
    }
  }, [screen2ImagesReady, isImageLoaded]);

  const animateScreen2Images = () => {
    const images = gsap.utils.toArray('[id^="image-screen2-"]');
    if (!images.length) return;

    gsap.set(images, { y: 800, opacity: 0 });
    gsap.to(images, {
      y: 0,
      opacity: 1,
      duration: 2.5,
      ease: 'power2.out',
      stagger: 0.5,
    });
  };

  return (
    <div className="flex flex-col w-screen h-auto min-h-screen" id="smooth-content" ref={containerRef}>

      <Header locale={locale} />
      {/* Screen 1 */}
      <div className="screen w-screen h-screen relative" id="screen1">
        <img
          src="/images/bg-1.jpg"
          alt="background"
          className={`absolute effect-flip w-full space-x-reverse h-full object-cover object-center -z-10 transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
        />
        {isImageLoaded && <div className="absolute w-full h-full bg-black/50 -z-5" />}

        <div className="absolute mt-[150px] ml-10">
          <p className={`${lora.className} opacity-0 w-[450px] text-white text-4xl scroll-fade-1`}>
            {t('title-banner-1')}
          </p>
          <p ref={textRef} className={`${lora.className} opacity-100 w-[30rem] text-white text-md ml-[40px]`} />
        </div>

        <div className="absolute bottom-20 left-0 right-0 flex justify-center px-4">
          <p className={`${lora.className} scroll-fade-2 opacity-0 text-white text-center text-3xl md:text-4xl max-w-[90%] md:max-w-[40rem]`}>
            {t('title-banner-2')}
          </p>
        </div>

        <div className="flex w-full justify-center items-center absolute bottom-2 scroll-fade-3">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => {
              gsap.to(window, {
                duration: 1,
                scrollTo: { y: '#screen2', autoKill: false },
                ease: 'power2.out',
              });
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
            </svg>
            <span className={`${lora.className} text-white`}>{t('scroll-down')}</span>
          </div>
        </div>
      </div>

      {/* Screen 2 */}
      <div className="screen w-screen h-screen overflow-hidden relative" id="screen2">
        <img
          src="/images/bg-2.jpg"
          alt="background"
          className={`absolute effect-flip w-auto h-screen object-cover object-center -z-10 transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
        />
        <div className="absolute w-full h-screen bg-black/50 -z-5" />

        <div className="grid grid-cols-4 relative h-screen w-screen">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="col-span-1 w-auto h-full border border-black relative" id={`image-screen2-${index}`}>

              <img
                src={`/images/template/template${index + 1}.jpg`}
                alt={`background-${index}`}
                className="w-full h-full object-cover object-center"

              />
              <div className="flex items-center bg-black/30 top-12 justify-center absolute">
                <p className={`${lora.className} text-white text-2xl uppercase`}>{t(`template-${index + 1}`)}</p>
              </div>
              <div className="flex items-center bg-black/20 bottom-2 px-10 py-2 max-h-20 w-full justify-center absolute">
                <p
                  className={`${lora.className} text-white text-sm line-clamp-4`}
                >
                  {t(`template-${index + 1}-description`)}
                </p>
              </div>


            </div>
          ))}
        </div>
      </div>
    </div >
  );
}