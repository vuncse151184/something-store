'use client'
import React, { useState, useEffect } from 'react'
import { Montserrat } from 'next/font/google'
import { useTranslations } from 'next-intl'
import { Merriweather } from 'next/font/google'
import { Roboto_Condensed } from 'next/font/google'
import { manrope } from '@/fonts/font'
import { Button } from '@/components/ui/button'
import LocalSwitcher from '../LocalSwitcher'

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

    return (


        <div className='bg-transparent absolute w-full h-[150px] top-0 z-50 bg-none bg-transparent-0 flex justify-between py-4 px-10'>
            <div className='flex justify-between items-center  bg-black/20  h-[30px] backdrop:blur-[10px]'>
                <span className={`${manrope.className} text-2xl text-white drop-shadow-md tracking-tight`}>Rose&More</span>
            </div>
            <div className='flex space-x-6 items-center  bg-transparent  h-[30px]'>
                <LocalSwitcher />
                <Button variant='white' size='sm' className='px-6 rounded-3xl'> {t('buyButton')} </Button>
            </div>
        </div>
    )

}
