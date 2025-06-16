import { createClient } from '@supabase/supabase-js'

declare global {
    interface Window {
        Clerk?: any;
    }
}

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
console.log("SUPABASE_URL:", process.env.SUPABASE_URL)
console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)

if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Client-side Supabase client with Clerk JWT
export const createClerkSupabaseClient = () => {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            // Get the custom Supabase token from Clerk
            fetch: async (url, options = {}) => {
                // Check if we're in the browser and Clerk is available
                if (typeof window === 'undefined' || !window.Clerk?.session) {
                    return fetch(url, options)
                }

                try {
                    const clerkToken = await window.Clerk.session.getToken({
                        template: 'supabase'
                    })

                    // Insert the Clerk Supabase token into the headers
                    const headers = new Headers(options?.headers)
                    if (clerkToken) {
                        headers.set('Authorization', `Bearer ${clerkToken}`)
                    }

                    // Call the default fetch
                    return fetch(url, {
                        ...options,
                        headers,
                    })
                } catch (error) {
                    console.error('Error getting Clerk token:', error)
                    return fetch(url, options)
                }
            },
        },
    })
}

// Regular client-side Supabase client (without Clerk integration)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase admin client
export const supabaseAdmin = (() => {
    if (!supabaseServiceRoleKey) {
        console.warn('SUPABASE_SERVICE_ROLE_KEY not found. Admin operations will not work.')
        // Return a dummy client for build-time, but log warnings
        return createClient(supabaseUrl, supabaseAnonKey)
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
})()

// Helper function to check if admin client is properly configured
export const isAdminConfigured = () => {
    return !!supabaseServiceRoleKey
}