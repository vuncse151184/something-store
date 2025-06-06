"use client"


import React from 'react'
import { HTMLMotionProps, motion } from 'framer-motion';


const PageWrapper = (props: HTMLMotionProps<'div'>) => {
    return (
        <div >
            <motion.div {...props}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
        </div>
    )
}

export default PageWrapper