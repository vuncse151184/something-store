"use client"

import { motion } from "framer-motion"

interface FlowerPetalProps {
  color: string
  size: number
  top: string
  left: string
  delay: number
}

export default function FlowerPetal({ color, size, top, left, delay }: FlowerPetalProps) {
  const randomDuration = 10 + Math.random() * 15

  return (
    <motion.div
      className="absolute"
      style={{
        top,
        left,
        width: size,
        height: size * 1.5,
        backgroundColor: color,
        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0.8],
        rotate: [0, 45, 90, 180],
        y: [0, 50, 100, 150],
        x: [0, 20, -20, 0],
      }}
      transition={{
        duration: randomDuration,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: Math.random() * 2,
        ease: "easeInOut",
      }}
    />
  )
}
