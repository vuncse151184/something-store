// src/app/webhooks/api/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { supabaseAdmin, isAdminConfigured } from '@/utils/supabase/server'

// Add a GET handler for testing
export async function GET() {
    console.log('🔗 GET request to webhook endpoint')
    return new Response(JSON.stringify({ 
        message: 'Webhook endpoint is working!', 
        timestamp: new Date().toISOString(),
        path: '/webhooks/api/clerk'
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    })
}

export async function POST(req: Request) {
    // Add comprehensive logging
    console.log('🔗 Webhook endpoint hit at:', new Date().toISOString())
    console.log('🔗 Request URL:', req.url)
    console.log('🔗 Request method:', req.method)

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        console.error('❌ Missing CLERK_WEBHOOK_SECRET environment variable')
        return new Response('Webhook secret not configured', { status: 500 })
    }

    if (!isAdminConfigured()) {
        console.error('❌ Supabase admin client not properly configured')
        return new Response('Database not configured', { status: 500 })
    }

    console.log('✅ Initial checks passed')

    try {
        // Get the headers
        const headerPayload = await headers()
        const svix_id = headerPayload.get('svix-id')
        const svix_timestamp = headerPayload.get('svix-timestamp')
        const svix_signature = headerPayload.get('svix-signature')

        console.log('📋 Headers received:', {
            'svix-id': svix_id ? 'present' : 'missing',
            'svix-timestamp': svix_timestamp ? 'present' : 'missing',
            'svix-signature': svix_signature ? 'present' : 'missing',
        })

        // Log all headers for debugging
        console.log('📋 All headers:', Object.fromEntries(headerPayload.entries()))

        if (!svix_id || !svix_timestamp || !svix_signature) {
            console.error('❌ Missing required svix headers')
            return new Response('Error occurred -- no svix headers', {
                status: 400,
            })
        }

        // Get and log the payload
        const payload = await req.json()
        console.log('📦 Raw payload received:', JSON.stringify(payload, null, 2))
        
        const body = JSON.stringify(payload)
        console.log('📦 Stringified body length:', body.length)

        const wh = new Webhook(WEBHOOK_SECRET)
        console.log('🔐 Webhook instance created')

        let evt: WebhookEvent

        try {
            evt = wh.verify(body, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            }) as WebhookEvent
            console.log('✅ Webhook verification successful')
        } catch (err) {
            console.error('❌ Error verifying webhook:', err)
            console.error('❌ Webhook secret used:', WEBHOOK_SECRET?.substring(0, 10) + '...')
            return new Response('Error occurred', {
                status: 400,
            })
        }

        const eventType = evt.type
        console.log('🎯 Processing webhook event:', eventType)
        console.log('🎯 Event data:', JSON.stringify(evt.data, null, 2))

        if (eventType === 'user.created' || eventType === 'user.updated') {
            console.log("👤 User event detected:", eventType)
            
            const { id, email_addresses, first_name, last_name, image_url } = evt.data
            
            // More detailed logging
            console.log('👤 User data extracted:', {
                id,
                email_addresses: email_addresses?.map(e => e.email_address),
                first_name,
                last_name,
                image_url,
            })

            // Check if email_addresses exists and has content
            if (!email_addresses || email_addresses.length === 0) {
                console.warn('⚠️ No email addresses found in user data')
                return new Response('No email addresses found', { status: 400 })
            }

            const primaryEmail = email_addresses[0]?.email_address
            if (!primaryEmail) {
                console.warn('⚠️ Primary email address is missing')
                return new Response('Primary email address missing', { status: 400 })
            }

            console.log('💾 Attempting to sync user to Supabase...')
            
            try {
                const { data, error } = await supabaseAdmin
                    .from('users')
                    .upsert({
                        id,
                        email: primaryEmail,
                        first_name,
                        last_name,
                        image_url,
                        updated_at: new Date().toISOString(),
                    })
                    .select() // Add select to see what was inserted/updated

                if (error) {
                    console.error('❌ Error syncing user to Supabase:', error)
                    console.error('❌ Error details:', JSON.stringify(error, null, 2))
                    return new Response('Error syncing user', { status: 500 })
                }

                console.log('✅ User synced successfully:', data)
            } catch (error) {
                console.error('❌ Database operation failed:', error)
                return new Response('Database operation failed', { status: 500 })
            }
        }

        if (eventType === 'user.deleted') {
            const { id } = evt.data
            console.log('🗑️ Deleting user from Supabase:', id)

            try {
                const { data, error } = await supabaseAdmin
                    .from('users')
                    .delete()
                    .eq('id', id)
                    .select() // Add select to see what was deleted

                if (error) {
                    console.error('❌ Error deleting user from Supabase:', error)
                    return new Response('Error deleting user', { status: 500 })
                }

                console.log('✅ User deleted successfully:', data)
            } catch (error) {
                console.error('❌ Database operation failed:', error)
                return new Response('Database operation failed', { status: 500 })
            }
        }

        console.log('✅ Webhook processed successfully')
        return new Response('OK', { status: 200 })

    } catch (error) {
        console.error('❌ Unexpected error in webhook handler:', error)
        return new Response('Internal server error', { status: 500 })
    }
}