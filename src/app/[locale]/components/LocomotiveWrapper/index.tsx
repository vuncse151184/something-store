"use client";

import { ReactNode, useRef } from "react";
import { usePathname } from "next/navigation";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";

interface LocomotiveWrapperProps {
    children: ReactNode;
}

export default function LocomotiveWrapper({ children }: LocomotiveWrapperProps) {
    const scrollRef = useRef(null); // Container reference
    const pathname = usePathname(); // Detect route changes

    return (
        <LocomotiveScrollProvider
            options={{
                smooth: true,
                smartphone: { smooth: false },
                tablet: { smooth: false },
            }}
            watch={[pathname]} // Re-initialize on route change
            containerRef={scrollRef}
        >
            <div ref={scrollRef} data-scroll-container className="relative flex flex-col min-h-screen mx-auto overflow-x-hidden">
                {children}
            </div>
        </LocomotiveScrollProvider>
    );
}
