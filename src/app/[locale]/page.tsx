"use client";
import dynamic from "next/dynamic";

const HomePage = dynamic(() => import('@/app/components/Homepage/page'), { ssr: false });

export default function page() {
  return <HomePage />
}