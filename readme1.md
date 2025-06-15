# Clerk + Supabase + Next.js TypeScript Authentication Setup

Complete guide to integrate Clerk authentication with Supabase database in a Next.js TypeScript application.

## Prerequisites

- Next.js 13+ with App Router
- TypeScript configured
- Clerk account and application
- Supabase project

## 1. Install Dependencies

```bash
npm install @clerk/nextjs @supabase/supabase-js
```

Or with Yarn:
```bash
yarn add @clerk/nextjs @supabase/supabase-js
```

## 2. Environment Variables

Create `.env.local` in your project root:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Webhook Secret (for user sync)
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 3. App Layout Configuration

Update `app/layout.tsx` to wrap your application with ClerkProvider:

```tsx
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

## 4. Supabase Client Setup

Create `lib/supabase.ts`:

```tsx
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server-side Supabase client (bypasses RLS)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

Create `hooks/useSupabase.ts` for client-side usage:

```tsx
import { useAuth } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import { useMemo } from 'react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function useSupabase() {
  const { getToken } = useAuth()

  const supabase = useMemo(() => {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await getToken({ template: 'supabase' })
          
          const headers = new Headers(options?.headers)
          headers.set('Authorization', `Bearer ${clerkToken}`)

          return fetch(url, {
            ...options,
            headers,
          })
        },
      },
    })
  }, [getToken])

  return supabase
}
```

## 5. Database Schema

Create the users table in Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- Clerk user ID
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for authenticated users
CREATE POLICY "Users can manage their own data"
ON "public"."users"
AS PERMISSIVE
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'user_id' = id)
WITH CHECK (auth.jwt() ->> 'user_id' = id);
```

## 6. Clerk JWT Template Configuration

In your Clerk Dashboard:

1. Navigate to **Configure** → **JWT Templates**
2. Click **New template**
3. Name it `supabase`
4. Use this minimal configuration:

```json
{
  "aud": "authenticated",
  "user_id": "{{user.id}}",
  "role": "authenticated"
}
```

**Important Notes:**
- Keep JWT minimal to reduce network overhead
- Don't include reserved claims like `iss`, `sub`, `nbf`
- Additional user data should be fetched from database when needed

## 7. Authentication Pages

Create `app/sign-in/[[...sign-in]]/page.tsx`:

```tsx
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  )
}
```

Create `app/sign-up/[[...sign-up]]/page.tsx`:

```tsx
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp />
    </div>
  )
}
```

## 8. User Data Synchronization

Create `app/api/webhooks/clerk/route.ts` to sync user data between Clerk and Supabase:

```tsx
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET environment variable')
  }

  // Get headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  // Verify webhook
  const payload = await req.json()
  const body = JSON.stringify(payload)
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new Response('Webhook verification failed', { status: 400 })
  }

  // Handle events
  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    const { error } = await supabaseAdmin
      .from('users')
      .upsert({
        id,
        email: email_addresses[0]?.email_address,
        first_name,
        last_name,
        image_url,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error syncing user to Supabase:', error)
      return new Response('Error syncing user', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting user from Supabase:', error)
      return new Response('Error deleting user', { status: 500 })
    }
  }

  return new Response('Success', { status: 200 })
}
```

## 9. Route Protection Middleware

Create `middleware.ts` in your project root:

```tsx
import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/'],
  ignoredRoutes: ['/api/webhooks/clerk']
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

## 10. Example Components

### User Profile Component

Create `components/UserProfile.tsx`:

```tsx
'use client'

import { useUser } from '@clerk/nextjs'
import { useSupabase } from '@/hooks/useSupabase'
import { useEffect, useState } from 'react'

interface UserData {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
}

export default function UserProfile() {
  const { user, isLoaded } = useUser()
  const supabase = useSupabase()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user data:', error)
      } else {
        setUserData(data)
      }
      setLoading(false)
    }

    if (isLoaded && user) {
      fetchUserData()
    }
  }, [user, isLoaded, supabase])

  if (!isLoaded || loading) {
    return <div className="p-4">Loading...</div>
  }

  if (!userData) {
    return <div className="p-4">No user data found</div>
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="space-y-2">
        <p><span className="font-semibold">Email:</span> {userData.email}</p>
        <p><span className="font-semibold">Name:</span> {userData.first_name} {userData.last_name}</p>
        <p><span className="font-semibold">Member since:</span> {new Date(userData.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  )
}
```

### Dashboard Page

Create `app/dashboard/page.tsx`:

```tsx
import { auth } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import UserProfile from '@/components/UserProfile'

export default function Dashboard() {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <UserProfile />
        </div>
      </main>
    </div>
  )
}
```

## 11. Webhook Configuration

In your Clerk Dashboard:

1. Go to **Configure** → **Webhooks**
2. Click **Add Endpoint**  
3. Enter your endpoint URL: `https://your-domain.com/api/webhooks/clerk`
4. Select events: `user.created`, `user.updated`, `user.deleted`
5. Copy the webhook secret to your `.env.local`

## 12. Testing the Setup

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test the flow:**
   - Visit `/sign-up` to create an account
   - Check Supabase to see if user data was synced
   - Visit `/dashboard` to see the protected content
   - Sign out and try accessing protected routes

## Key Benefits

- **Clerk handles authentication UI/UX** - Professional sign-in/up flows
- **Supabase manages data** - Powerful database with real-time features  
- **Automatic user sync** - Webhooks keep data in sync
- **Row Level Security** - Users can only access their own data
- **Type safety** - Full TypeScript support throughout

## Security Considerations

- JWT tokens are automatically handled by Clerk
- RLS policies ensure data isolation
- Service role key is only used server-side
- Webhook signatures are verified for security
- All user data is scoped to individual users

## Troubleshooting

**Common Issues:**

1. **RLS Policy Errors:** Ensure your JWT template uses `user_id` claim
2. **Webhook Failures:** Check that the webhook secret matches your environment
3. **Type Mismatches:** Ensure your `id` column is TEXT type for Clerk user IDs
4. **Token Issues:** Verify JWT template is named exactly `supabase`

This setup provides a production-ready authentication system combining Clerk's excellent user management with Supabase's powerful database capabilities.