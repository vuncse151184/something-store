// app/sso-callback/page.tsx
"use client"

import { useEffect } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk()
  const router = useRouter()

  useEffect(() => {
    handleRedirectCallback({
      redirectUrl: window.location.href,
    })
  }, [handleRedirectCallback])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className='text-white'>Completing sign in...</div>
    </div>
  )
}