"use client";

import { ReactNode, useRef, useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface GSAPSmoothScrollContextType {
  scrollTo: (target: string | number, options?: any) => void;
  currentScroll: number;
}

const GSAPSmoothScrollContext = createContext<GSAPSmoothScrollContextType>({
  scrollTo: () => {},
  currentScroll: 0
});

export const useGSAPScroll = () => useContext(GSAPSmoothScrollContext);

interface GSAPSmoothWrapperProps {
    children: ReactNode;
}

export default function GSAPSmoothWrapper({ children }: GSAPSmoothWrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const scrollDataRef = useRef({ current: 0, target: 0 });
    const pathname = usePathname();

    useEffect(() => {
        if (!containerRef.current || !contentRef.current) return;

        const container = containerRef.current;
        const content = contentRef.current;
        const scrollData = scrollDataRef.current;
        
        let rafId: number;
        const ease = 0.1; // Adjust for smoothness (lower = smoother)

        // Set body height for native scrollbar
        const setBodyHeight = () => {
            document.body.style.height = content.scrollHeight + 'px';
        };

        // Handle native scroll
        const handleScroll = () => {
            scrollData.target = window.pageYOffset;
        };

        // Smooth animation loop
        const animate = () => {
            scrollData.current += (scrollData.target - scrollData.current) * ease;
            
            // Apply transform
            gsap.set(content, {
                y: -scrollData.current,
                force3D: true
            });

            // Update ScrollTrigger
            ScrollTrigger.update();

            rafId = requestAnimationFrame(animate);
        };

        // Initialize
        const init = () => {
            setBodyHeight();
            
            // Style container
            gsap.set(container, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            });

            // Add event listeners
            window.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('resize', setBodyHeight);
            
            // Start animation
            animate();
        };

        // Cleanup function
        const cleanup = () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', setBodyHeight);
            document.body.style.height = 'auto';
            ScrollTrigger.killAll();
        };

        // Initialize after a small delay
        const timer = setTimeout(init, 100);

        return () => {
            clearTimeout(timer);
            cleanup();
        };
    }, []);

    // Clean up on route change
    useEffect(() => {
        ScrollTrigger.killAll();
        scrollDataRef.current = { current: 0, target: 0 };
        window.scrollTo(0, 0);
    }, [pathname]);

    // Context methods
    const scrollTo = (target: string | number, options: any = {}) => {
        const defaultOptions = {
            duration: 1.5,
            ease: "power2.inOut",
            ...options
        };

        gsap.to(window, {
            scrollTo: { y: target, offsetY: 0 },
            ...defaultOptions
        });
    };

    const contextValue = {
        scrollTo,
        currentScroll: scrollDataRef.current.current
    };

    return (
        <GSAPSmoothScrollContext.Provider value={contextValue}>
            <div ref={containerRef} className="gsap-smooth-container">
                <div 
                    ref={contentRef} 
                    className="gsap-smooth-content relative flex flex-col min-h-screen mx-auto overflow-x-hidden"
                >
                    {children}
                </div>
            </div>
        </GSAPSmoothScrollContext.Provider>
    );
}