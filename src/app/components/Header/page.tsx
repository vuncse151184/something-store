'use client'
import React, { useState, useEffect } from 'react'
import { Montserrat } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
const montserrat = Montserrat({
    weight: '800',
    style: 'italic',
    subsets: ['vietnamese', 'latin']

})
interface NavigationItem {
    path: string;
    name: string;
}

interface NavigationBar {
    categories: NavigationItem;
    whatsNew: NavigationItem;
    deals: NavigationItem;
    delivery: NavigationItem;
}
export default function Header({ locale }: { locale: string }) {
    const getLocale = locale;
    console.log("getLocale", getLocale);
    const [visible, setVisible] = useState(true);
    const [lastScrollTop, setLastScrollTop] = useState(0); // Track the last scroll position
    const t = useTranslations('Header');
    const navigationsBar: NavigationBar = {
        'categories': {
            'path': '/categories',
            'name': t('categories')
        },
        'deals': {
            'path': '/deals',
            'name': t('deals')
        },
        'whatsNew': {
            'path': '/whatsNew',
            'name': t('whatsNew')
        },
        'delivery': {
            'path': '/delivery',
            'name': t('delivery')
        }
    };
    const listenToScroll = () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Hide the header when scrolling down, show when scrolling up
        if (currentScrollTop > lastScrollTop) {
            setVisible(false); // Scroll down -> Hide the navbar
        } else {
            setVisible(true); // Scroll up -> Show the navbar 
        }

        // Update last scroll position for next scroll event
        setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop); // Prevent negative scroll position
    };

    useEffect(() => {
        window.addEventListener("scroll", listenToScroll);
        return () => {
            window.removeEventListener("scroll", listenToScroll);
        };
    }, [lastScrollTop]); // Re-run effect when lastScrollTop changes

    return (
        visible && (
            // Top side header
            <div className="w-full h-[150px] fixed top-0 z-50 bg-none bg-opacity-0" id="hide">
                <div className={`flex justify-between items-center px-10  bg-[#4E6813] w-full h-[50px]`}>
                    <div className='flex space-x-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>

                        <span className='font-mono text-white text-sm'>+84 338010426</span>
                    </div>
                    <div>
                        <span className='font-mono text-white text-sm'>{t('title')}</span>

                    </div>
                    <div className='flex items-center  hover:cursor-pointer rounded-md'>
                        <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                        </svg>:
                        <span className='font-mono uppercase text-white'>{locale}</span>
                    </div>

                </div>
                {/* Bottom side header */}
                <div className="flex w-full items-center px-10 h-[100px] justify-evenly">
                    <div className="flex items-center">
                        <h1 className={`font-[${montserrat.className}] text-center text-2xl text-[#4E6813]`}>Daily Delights</h1>
                    </div>
                    <div className='flex space-x-10'>
                        {Object.keys(navigationsBar).map((key) => {
                            const navKey = key as keyof NavigationBar;
                            return (
                                <Link href={navigationsBar[navKey].path} className='font-[600]' key={key}>
                                    {navigationsBar[navKey].name}
                                </Link>
                            );
                        })}
                    </div>


                    <div className="flex items-center space-x-10">
                        <div className="grid  max-w-md items-center gap-1.5">
                            <div className="relative">
                                <Input className={cn('px-5 py-2 rounded-lg border  border-gray-300 bg-[#f5f7f9] focus:border-blue-500 focus:ring focus:ring-blue-200')} />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <Image src="/icons/search.png" width={30} height={30} alt="Search" />
                                </div>
                            </div>


                        </div>

                        <div className="shopingcart-button flex items-center space-x-2 hover:bg-slate-300 hover:cursor-pointer rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={30} height={30} strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                            <span className="font-bold p-0  ">
                                {t('cart')}
                            </span>
                        </div>

                        <div className="divider flex items-center">
                            <span className="font-bold p-0 m-auto">|</span>
                        </div>

                        <div className="flex items-center ml-6">
                            <p className="font-sans text-xl hover:cursor-pointer">Login</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}
