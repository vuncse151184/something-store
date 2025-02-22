"use client"

import React, { ChangeEvent, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { manrope } from '@/fonts/font'

const LocalSwitcher = () => {
    const [isPending, startTransition] = useTransition();
    const pathName = usePathname()
    const router = useRouter();
    const localeActive = useLocale(); 
    const onSelectionchange = (e: ChangeEvent<HTMLInputElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            router.replace(`/${nextLocale}`);
        });

    }

    return (
        <div className='flex items-center space-x-1'>
            <label className={`bg-transparen ${manrope.className} hover:cursor-pointer hover:text-white  ${pathName.startsWith('/en') ? "text-white underline" : "text-[#b9b9b9]"}`}>
                <input name="locale" type='radio' onChange={(e) => onSelectionchange(e)} checked={localeActive === 'en'} className='hidden' value="en" />
                en
            </label>
            <span className='text-white'>|</span>
            <label className={`bg-transparent ${manrope.className} hover:cursor-pointer hover:text-white  ${pathName.startsWith('/vi') ? "text-white underline" : "text-[#b9b9b9]"}`}  >
                <input name="locale" type='radio' onChange={(e) => onSelectionchange(e)} checked={localeActive === 'vi'} className='hidden' value="vi" />
                vi
            </label>
        </div >
    )
}

export default LocalSwitcher
