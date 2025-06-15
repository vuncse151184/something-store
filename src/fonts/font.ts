import { Pacifico, Great_Vibes, Lora, Manrope, Playfair_Display } from "next/font/google";

export const manrope = Manrope({
    weight: '400',
    preload: true,
    subsets: ['latin']
});

export const playfairDisplay = Playfair_Display({
    weight: '400',
    style: 'italic',
    preload: true,
    subsets: ['latin', 'vietnamese']
});

export const pacifico = Pacifico({
    weight: '400',
    preload: true,
    subsets: ['latin', 'vietnamese']
});

export const greatVibes = Great_Vibes({
    weight: '400',
    preload: true,
    subsets: ['latin', 'vietnamese']
});

export const lora = Lora({
    weight: '400',
    style: 'italic',
    preload: true,
    subsets: ['latin', 'vietnamese']
}); 