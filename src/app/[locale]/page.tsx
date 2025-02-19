"use client";
import dynamic from "next/dynamic";

const HomePage = dynamic(() => import('@/app/[locale]/components/Homepage'), { ssr: false });

export default function page() {
  return <HomePage />
}