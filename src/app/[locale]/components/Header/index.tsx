'use client'
import React, { useState, useEffect } from 'react'
import { Montserrat } from 'next/font/google'
import { useTranslations } from 'next-intl'
import { Merriweather } from 'next/font/google'
import { Roboto_Condensed } from 'next/font/google'
import { manrope } from '@/fonts/font'
import { Button } from '@/components/ui/button'

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

        // <div className="w-full h-[150px] fixed top-0 z-50 bg-none bg-opacity-0 " id="hide">
        //     <div className={`flex justify-between items-center px-10  bg-[#4E6813] w-full h-[30px]`}>

        <div className='bg-transparent w-full h-[150px] fixed top-0 z-50 bg-none bg-opacity-0 flex justify-between py-4 px-10'>
            <div className='flex justify-between items-center  bg-transparent w-full h-[30px]'>
                <span className={`${manrope.className} text-2xl text-white`}>Rose&More</span>
            </div>
            <div>
                <Button variant='white' size='sm' className='px-6 rounded-3xl'> {t('buyButton')} </Button>
            </div>
        </div>
    )

}
