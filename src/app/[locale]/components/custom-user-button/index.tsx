"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { User, Settings, LogOut, ShoppingBag, Heart, Flower2, Crown, Sparkles } from "lucide-react"

export function CustomUserButton() {
    const { user, isLoaded } = useUser()
    const { signOut, openUserProfile } = useClerk()

    if (!isLoaded) {
        return (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-800/50 to-pink-800/50 animate-pulse border border-purple-500/30" />
        )
    }

    if (!user) {
        return null
    }

    const userInitials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
    const isVIP = user.publicMetadata?.vip === true // Example VIP status

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-12 w-12 rounded-full border-2 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm group"
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src={user.imageUrl || "/placeholder.svg"}
                            alt={user.fullName || "User avatar"}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-semibold border border-purple-400/30">
                            {userInitials || <Flower2 className="h-4 w-4" />}
                        </AvatarFallback>
                    </Avatar>

                    {/* Glowing ring effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" />

                    {/* VIP Crown */}
                    {isVIP && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center border border-gray-800">
                            <Crown className="h-3 w-3 text-gray-900" />
                        </div>
                    )}

                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-gray-800" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-72 p-0 bg-gray-900/95 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/10 rounded-xl overflow-hidden"
                align="end"
                forceMount
            >
                {/* Header with gradient background */}
                <DropdownMenuLabel className="p-0 border-0">
                    <div className="relative p-4 bg-gradient-to-r from-purple-600 to-pink-600   overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" />
                        </div>

                        <div className="relative flex items-center gap-3">
                            <div className="relative">
                                <Avatar className="h-14 w-14 border-3 border-white/20 shadow-lg">
                                    <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={user.fullName || "User"} />
                                    <AvatarFallback className="bg-gradient-to-br from-purple-700 to-pink-700 text-white text-lg font-bold">
                                        {userInitials || <Flower2 className="h-6 w-6" />}
                                    </AvatarFallback>
                                </Avatar>
                                {/* Sparkle effect */}
                                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-pulse" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-white font-bold text-base truncate">{user.fullName || "Flower Lover"}</p>
                                    {isVIP && (
                                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs font-bold border-0 px-2 py-0.5">
                                            <Crown className="h-3 w-3 mr-1" />
                                            VIP
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-purple-100 text-sm truncate opacity-90">{user.primaryEmailAddress?.emailAddress}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <div className="h-2 w-2 rounded-full bg-green-400" />
                                    <span className="text-purple-100 text-xs">Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </DropdownMenuLabel>

                {/* Menu Items */}
                <div className="p-2 space-y-1">
                    <DropdownMenuItem
                        onClick={() => openUserProfile()}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-80/100 cursor-pointer transition-all duration-200 text-gray-100 hover:text-black group"
                    >
                        <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-200">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <span className="text-sm font-medium">Manage Account</span>
                            <p className="text-xs text-gray-400 hover:text-black">Update your profile settings</p>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-80/100 cursor-pointer transition-all duration-200 text-gray-100 hover:text-black group">
                        <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-200">
                            <ShoppingBag className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <span className="text-sm font-medium">My Orders</span>
                            <p className="text-xs text-gray-400 hover:text-black">Track your flower deliveries</p>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-80/100 cursor-pointer transition-all duration-200 text-gray-100 hover:text-black group">
                        <div className="p-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 group-hover:from-pink-500 group-hover:to-rose-500 transition-all duration-200">
                            <Heart className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <span className="text-sm font-medium">Wishlist</span>
                            <p className="text-xs text-gray-400 hover:text-black">Your saved bouquets</p>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-80/100 cursor-pointer transition-all duration-200 text-gray-100 hover:text-black group">
                        <div className="p-1.5 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 group-hover:from-gray-500 group-hover:to-gray-600 transition-all duration-200">
                            <Settings className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <span className="text-sm font-medium">Preferences</span>
                            <p className="text-xs text-gray-400 hover:text-black">Customize your experience</p>
                        </div>
                    </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="my-2 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

                {/* Sign Out */}
                <div className="p-2">
                    <DropdownMenuItem
                        onClick={() => signOut({ redirectUrl: `/vi` })}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-red-800/50 hover:to-red-700/10 cursor-pointer transition-all duration-200 text-gray-100 hover:text-black group"
                    >
                        <div className="p-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 group-hover:from-red-500 group-hover:to-red-600 hover:!text-black transition-all duration-200">
                            <LogOut className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <span className="text-sm font-medium">Sign Out</span> 
                        </div>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
