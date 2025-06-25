"use client"

import type React from "react"
import { use } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"

interface SignInError {
  code: string
  message: string
}

export default function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { signIn, isLoaded } = useSignIn()
  const router = useRouter()

  const handleSocialSignIn = async (provider: "google") => {
    if (!isLoaded || !signIn) return

    try {
      setIsLoading(true)
      setError(null)
      
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: '/sso-callback',
        redirectUrlComplete: `/${locale || 'en'}`,
      })
    } catch (err: any) {
      console.error('OAuth Error:', err)
      setError('Failed to sign in with Google. Please try again.')
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !signIn) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      })

      if (result.status === "complete") {
        router.push(`/${locale || 'en'}`)
      } else {
        // Handle incomplete sign-in (2FA, verification, etc.)
        setError('Sign-in requires additional verification.')
      }
    } catch (err: any) {
      console.error('Sign-in error:', err)
      
      // Handle specific error cases
      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0] as SignInError
        switch (firstError.code) {
          case 'form_identifier_not_found':
            setError('No account found with this email address.')
            break
          case 'form_password_incorrect':
            setError('Incorrect password. Please try again.')
            break
          case 'too_many_requests':
            setError('Too many failed attempts. Please try again later.')
            break
          default:
            setError(firstError.message || 'An error occurred during sign-in.')
        }
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-2/4 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {/* Social Sign In */}
            <Button
              variant="outline"
              onClick={() => handleSocialSignIn("google")}
              className="w-full h-11 border-gray-200 hover:bg-gray-50"
              disabled={isLoading}
            >
              <FcGoogle className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link 
                  href={`/${locale}/forgot-password`} 
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium disabled:opacity-50"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 ">
            <div className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link 
                href={`/sign-up`} 
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign up
              </Link>
            </div>

            <div className="text-center text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <Link href={`/${locale}/terms`} className="underline hover:text-gray-700">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href={`/${locale}/privacy`} className="underline hover:text-gray-700">
                Privacy Policy
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}