'use client'
import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Merriweather } from 'next/font/google'
import { greatVibes, lora, manrope } from '@/fonts/font'
import { Button } from '@/components/ui/button'
import LocalSwitcher from '../LocalSwitcher'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

interface NavigationItem {
    path: string;
    name: string;
}

type NavigationBar = NavigationItem[];

export default function Header({ locale }: { locale: string }) {
    const getLocale = locale;
    const t = useTranslations('Header');
    const pathName = usePathname();
    const navigationsBar: NavigationBar = [
        {
            path: `/${getLocale}`,
            name: t('home')
        },
        {
            path: '/about',
            name: t('about')
        },
        {
            path: '/whatsNew',
            name: t('whatsNew')
        },
    ];

    return (


        <div className='bg-transparent absolute w-full h-[150px] top-0 z-50 bg-none bg-transparent-0 flex justify-between py-4 px-10'>
            <div className='flex justify-between items-center  bg-black/20  h-[30px] backdrop:blur-[10px]'>
                <span className={`${manrope.className} text-2xl text-white drop-shadow-md tracking-tight`}>Rose&Lové</span>
            </div>
            <div className='hidden lg:flex space-x-6 w-full justify-end items-start pr-32  '>
                {/* <NavigationMenu className="w-full content-center align-middle">
                    <NavigationMenuList className="flex gap-8 backdrop:blur-[10px] list-none px-4 rounded-sm py-2">
                        {navigationsBar.map((item, index) => (
                            <NavigationMenuItem key={item.path + `${index}`} className="list-none">
                                <Link
                                    href={item.path}
                                    className={cn('text-sm tracking-tight hover:text-white transition-colors duration-300', pathName === item.path ? 'text-white' : 'text-[#bdbdbd]', lora.className)}
                                >
                                    {item.name}
                                </Link>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu> */}

            </div>
            <div className='flex space-x-6 items-center  bg-transparent  h-[30px]'>
                <LocalSwitcher />
                <Button variant='white' size='sm' className='hidden lg:block px-6  rounded-3xl'> {t('buyButton')} </Button>
            </div>
        </div>
    )

}
