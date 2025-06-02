"use client";
import dynamic from "next/dynamic";

// Trì hoãn render và tắt SSR cho HomePage (vì LocomotiveScroll dùng window/document)
const HomePage = dynamic(() => import('@/app/[locale]/components/Homepage'), {
  ssr: false,
});

export default function page() {
  return <HomePage />;
}
