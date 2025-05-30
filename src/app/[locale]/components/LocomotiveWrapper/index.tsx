"use client";

import { ReactNode, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./index.css"
gsap.registerPlugin(ScrollTrigger);

interface LocomotiveWrapperProps {
    children: ReactNode;
}

export default function LocomotiveWrapper({ children }: LocomotiveWrapperProps) {
    const scrollRef = useRef<HTMLDivElement>(null); // Container reference
    const pathname = usePathname(); // Detect route changes

    useEffect(() => {
        if (!scrollRef.current) return;

        const scrollEl = scrollRef.current; // Locomotive Scroll container

        // ✅ Set GSAP to use Locomotive Scroll as scroller
        ScrollTrigger.scrollerProxy(scrollEl, {
            scrollTop(value) {
                return arguments.length
                    ? scrollEl.scrollTo({ top: value ?? 0, behavior: "smooth" }) // Fix scrollTo
                    : scrollEl.scrollTop;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            pinType: scrollEl.style.transform ? "transform" : "fixed",
        });

        // ✅ Refresh GSAP ScrollTrigger when Locomotive Scroll updates
        const onScroll = () => ScrollTrigger.update();
        scrollEl.addEventListener("scroll", onScroll);

        ScrollTrigger.refresh();

        return () => {
            scrollEl.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <LocomotiveScrollProvider
            options={{
                smooth: true,
                smartphone: { smooth: false },
                tablet: { smooth: false },
            }}
            watch={[pathname]}  
            containerRef={scrollRef}
        >
            <div ref={scrollRef} data-scroll-container className="relative flex flex-col min-h-screen mx-auto overflow-x-hidden">
                {children}
            </div>
        </LocomotiveScrollProvider>
    );
}
