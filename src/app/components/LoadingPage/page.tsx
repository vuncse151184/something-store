import Image from 'next/image'
import React from 'react'
export default function LoadingLogo() {
    return (
        <div className='relative w-full z-1000 h-full flex justify-center items-center'>
            <div className='bg-[url(/icons/Ripple.gif)] z-10 bg-center bg-cover w-[200px] top-40 h-[200px] absolute flex justify-center items-center'>
            </div>

        </div>

    )
}
