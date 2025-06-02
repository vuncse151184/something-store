import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import React from 'react'
export default function LoadingLogo() {
    return (
        <div className='relative bg-transparent flex justify-center items-center'>
            <div className=' z-10  w-[200px] top-40 h-[200px] absolute flex justify-center items-center'>
                <DotLottieReact
                    src="/icons/Loading.lottie"
                    loop
                    autoplay
                />
            </div>

        </div>

    )
}
