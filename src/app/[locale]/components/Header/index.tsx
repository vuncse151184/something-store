'use client'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { lora, manrope } from '@/fonts/font'
import { Button } from '@/components/ui/button'
import LocalSwitcher from '../LocalSwitcher'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { useTransitionRouter } from 'next-view-transitions'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag } from "lucide-react"
import ShoppingCart from '../ShoppingCart'
import type { CartItem } from '@/app/types/shopping-cart.type'

interface NavigationItem {
    path: string;
    name: string;
}


const initialCartItems: CartItem[] = [
    {
        id: "1",
        name: "Rainbow Rose Bouquet",
        price: 45.99,
        quantity: 2,
        image: "/images/rose-1.jpg",
        category: "Bouquet",
        inStock: true,
    },
    {
        id: "2",
        name: "Sunflower Arrangement",
        price: 32.5,
        quantity: 1,
        image: "/images/rose-2.jpg",
        category: "Arrangement",
        inStock: true,
    },
    {
        id: "3",
        name: "Lavender Dream Bundle",
        price: 28.75,
        quantity: 3,
        image: "/images/rose-3.jpg",
        category: "Bundle",
        inStock: false,
    },
]


type NavigationBar = NavigationItem[];

export default function Header({ locale }: { locale: string }) {
    const t = useTranslations('Header');
    const pathName = usePathname();
    const router = useTransitionRouter(); 
    const badgeCount = 1;
    const [isOpen, setIsOpen] = useState(false)
    const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)


    const navigationsBar: NavigationBar = [
        {
            path: '',
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

    const pageAnimation = () => {
        console.log('🎬 Starting page animation');

        try {
            document.documentElement.animate([
                {
                    opacity: 1,
                    scale: 1,
                    transform: 'translateX(0px)',
                },
                {
                    opacity: 0.5,
                    scale: 0.9,
                    transform: 'translateX(-100px)',
                }
            ],
                {
                    duration: 500, // Reduced duration
                    easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
                    fill: 'forwards',
                    pseudoElement: '::view-transition-old(root)',
                }
            );

            document.documentElement.animate([
                {
                    transform: 'translateX(100%)',
                },
                {
                    transform: 'translateX(0)',
                }
            ],
                {
                    duration: 500, // Reduced duration
                    easing: 'cubic-bezier(0.4, 0, 0.24, 1)',
                    fill: 'forwards',
                    pseudoElement: '::view-transition-new(root)',
                }
            );

            console.log('✅ Animation setup complete');
        } catch (error) {
            console.error('❌ Animation setup failed:', error);
        }
    };

    const handleNavigation = async (fullPath: string, e: React.MouseEvent) => {
        e.preventDefault();

        console.log(`🚀 Navigating to: ${fullPath}`);
        console.log(`📍 Current path: ${pathName}`);

        try {
            // Add a small delay for /whatsNew to help with DOM readiness
            if (fullPath.includes('/whatsNew')) {
                console.log('⏳ Adding delay for whatsNew page');
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            const startTime = Date.now();

            await router.push(fullPath, {
                onTransitionReady: () => {
                    const readyTime = Date.now() - startTime;
                    console.log(`⚡ Transition ready in ${readyTime}ms for ${fullPath}`);
                    pageAnimation();
                }
            });

            const totalTime = Date.now() - startTime;
            console.log(`✅ Navigation completed in ${totalTime}ms`);

        } catch (error) {
            console.error('❌ Navigation failed:', error);
            console.log('🔄 Falling back to regular navigation');
            router.push(fullPath);
        }
    };

    const getBadgePositionClass = (count: Number) => {
        const digits = count.toString().length;
        if (digits === 1) return '-right-3';
        if (digits === 2) return '-right-4';
        return '-right-5'; // 3+ digits
    };

    return (
        <div className='min-w-screen bg-transparent absolute w-full top-0 z-50 flex justify-between items-center py-4 px-10'>
            <div className='flex justify-between items-center backdrop:blur-[10px]'>
                <Link
                    href={"/" + locale}
                    onClick={(e) => handleNavigation(`/${locale}`, e)}

                >
                    <span className={`${manrope.className} text-2xl text-white drop-shadow-md tracking-tight`}>Rose&More</span>
                </Link>
            </div>
            <div className='hidden lg:flex space-x-6 w-full justify-end items-start pr-32'>
                <NavigationMenu className="w-full content-center align-middle">
                    <NavigationMenuList className="flex gap-8 backdrop:blur-[10px] list-none px-4 rounded-sm py-2">
                        {navigationsBar.map((item, index) => {
                            const fullPath = `/${locale}${item.path}`;
                            return (
                                <NavigationMenuItem key={fullPath}>
                                    <Link
                                        href={fullPath}
                                        onClick={(e) => handleNavigation(fullPath, e)}
                                        className={cn(
                                            'text-sm tracking-tight hover:text-white transition-colors duration-300',
                                            pathName === fullPath ? 'text-white' : 'text-[#bdbdbd]',
                                            lora.className
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                </NavigationMenuItem>
                            );
                        })}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            {/*  
            <div className='flex space-x-6 items-center h-[30px]'>
                <LocalSwitcher />
                <Button variant='white' size='sm' className='hidden lg:block px-6 rounded-3xl'>
                    {t('buyButton')}
                </Button>
            </div> */}

            <Button
                onClick={() => setIsOpen(true)}
                className=" relative bg-gradient-to-r from-purple-700 to-violet-500 hover:from-purple-700 hover:to-fuchsia-600 rounded-full p-3 shadow-lg z-50"
            >
                <ShoppingBag className="w-4 h-4" />
                {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {totalItems}
                    </Badge>
                )}
            </Button>
            {isOpen && (
                <ShoppingCart isOpen={isOpen} setIsOpen={setIsOpen} totalItems={totalItems} setCartItems={setCartItems} cartItems={cartItems} />
            )}
        </div>
    )
}