"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useGSAPScroll } from './../GSAPSmoothWrapper';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import TextPlugin from 'gsap/TextPlugin';
import Image from 'next/image';
import { lora } from '@/fonts/font';
import './index.css';
import Header from '../Header';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function HomePage({ locale }: { locale: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const t = useTranslations('HomePage');
  const c = useTranslations('Header');
  const { scrollTo } = useGSAPScroll();

  const [isBgLoaded, setIsBgLoaded] = useState(false);
  // Add state to store ScrollTrigger instances
  const [scrollTriggers, setScrollTriggers] = useState<ScrollTrigger[]>([]);

  // Only run animations after images are loaded and browser is idle
  useEffect(() => {
    if (!isBgLoaded) return;
    const runAnimations = () => {
      animateIntroContent();
      setupScrollAnimations();
    };
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(runAnimations);
    } else {
      setTimeout(runAnimations, 100);
    }
  }, [isBgLoaded, t]);

  const animateIntroContent = useCallback(() => {
    const tl = gsap.timeline();
    tl.fromTo('.scroll-fade-1', { x: -10, opacity: 0 }, { x: 40, opacity: 1, duration: 1.2, ease: 'power2.out' })
      .fromTo('.scroll-fade-2', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=1')
      .fromTo('.scroll-fade-3', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=1');
    if (textRef.current) {
      gsap.to(textRef.current, {
        text: t('sub-title'),
        duration: 2,
        ease: 'none',
        delay: 0.2,
        opacity: 1,
      });
    }
    gsap.to('.effect-flip', {
      rotationY: 180,
      duration: 1,
      ease: 'power2.out',
    });
  }, [t]);

  const setupScrollAnimations = useCallback(() => {
    const sections = containerRef.current?.querySelectorAll('.screenAnimate');

    if (!sections || sections.length === 0) return;

    const triggers: ScrollTrigger[] = [];

    sections.forEach((section, index) => {
      const next = sections[index + 1] as HTMLElement | undefined;
      const prev = sections[index - 1] as HTMLElement | undefined;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        fastScrollEnd: true,
        preventOverlaps: true,
        onLeave: () => {
          if (next) {
            gsap.to(window, {
              duration: 0.6,
              scrollTo: { y: next.offsetTop, autoKill: false },
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        },
        onEnterBack: () => {
          if (prev) {
            gsap.to(window, {
              duration: 0.6,
              scrollTo: { y: prev.offsetTop, autoKill: false },
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        },
        snap: {
          snapTo: 1,
          duration: { min: 0.2, max: 0.6 },
          delay: 0.1
        },
      });

      triggers.push(trigger);
    });

    // Screen2 animation trigger
    const screen2 = containerRef.current?.querySelector('#screen2');
    if (screen2) {
      const screen2Trigger = ScrollTrigger.create({
        trigger: screen2,
        start: 'top 80%',
        once: true,
        fastScrollEnd: true,
        onEnter: animateScreen2Images,
      });
      triggers.push(screen2Trigger);
    }

    setScrollTriggers(triggers);
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      scrollTriggers.forEach(trigger => trigger.kill());
    };
  }, [scrollTriggers]);

  const animateScreen2Images = useCallback(() => {
    const images = gsap.utils.toArray('[id^="image-screen2-"]');
    if (!images.length) return;
    gsap.set(images, { y: 200, opacity: 0, scale: 0.97 });
    gsap.to(images, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power2.out',
      stagger: 0.2,
      force3D: true,
    });
  }, []);

  // Smooth scroll handler
  const handleSmoothScroll = useCallback((targetId: string) => {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: targetId, autoKill: false },
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }, []);

  return (
    <div className="flex flex-col w-screen h-auto min-h-screen" id="smooth-content" ref={containerRef}>
      <Header locale={locale} />
      {/* Screen 1 */}
      <div className="screenAnimate w-screen h-screen relative" id="screen1">
        <Image
          src="/images/bg-1.jpg"
          alt="background"
          sizes='100vw'
          className={`absolute effect-flip w-full h-full object-cover object-center -z-10 transition-opacity duration-300 will-change-transform will-change-opacity ${isBgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsBgLoaded(true)}
          fill
        />
        {isBgLoaded && <div className="absolute w-full h-full bg-black/50 -z-5" />}

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
            onClick={() => handleSmoothScroll('#screen2')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
            </svg>
            <span className={`${lora.className} text-white`}>{t('scroll-down')}</span>
          </div>
        </div>
      </div>

      {/* Screen 2 */}
      <div className="screenAnimate w-screen h-screen overflow-hidden relative" id="screen2">
        <Image
          src="/images/bg-2.jpg"
          alt="background"
          sizes='100vw'
          fill
          className="absolute effect-flip w-auto h-screen object-cover object-center -z-10 transition-opacity duration-300 will-change-transform will-change-opacity"

        />
        <div className="absolute w-full h-screen bg-black/50 -z-5" />

        <div className="grid grid-cols-4 relative h-screen w-screen">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="col-span-1 w-auto h-full border overflow-hidden border-black relative" id={`image-screen2-${index}`}>
              <Image
                src={`/images/template/template${index + 1}.jpg`}
                alt={`background-${index}`}
                className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-300"
                priority
                width={400}
                height={600}
              />
              <div className="flex items-center px-2 max-w-[70%] w-fit bg-black/30 top-12 justify-center absolute">
                <p className={`${lora.className} text-white text-2xl italic uppercase`}>
                  {t(`template-${index + 1}`)}
                </p>
              </div>
              <div className="flex items-center bg-black/20 bottom-12 px-10 py-2 max-h-20 w-full justify-center absolute">
                <p className={`${lora.className} text-white text-sm line-clamp-3`}>
                  {t(`template-${index + 1}-description`)}
                </p>
              </div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <Button variant='white' size='sm' className='px-6 rounded-3xl'>
                  {c('buyButton')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}