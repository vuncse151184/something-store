import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@clerk/nextjs'

declare global {
    interface Window {
        Clerk?: any;
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client with Clerk JWT
export const createClerkSupabaseClient = () => {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            // Get the custom Supabase token from Clerk
            fetch: async (url, options = {}) => {
                const clerkToken = await window.Clerk?.session?.getToken({
                    template: 'supabase'
                })

                // Insert the Clerk Supabase token into the headers
                const headers = new Headers(options?.headers)
                headers.set('Authorization', `Bearer ${clerkToken}`)

                // Call the default fetch
                return fetch(url, {
                    ...options,
                    headers,
                })
            },
        },
    })
}

// Server-side Supabase client
export const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)