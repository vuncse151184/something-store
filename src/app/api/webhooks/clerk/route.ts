import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { supabaseAdmin, isAdminConfigured } from '@/utils/supabase/server'

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
    
    if (!WEBHOOK_SECRET) {
        console.error('Missing CLERK_WEBHOOK_SECRET environment variable')
        return new Response('Webhook secret not configured', { status: 500 })
    }

    if (!isAdminConfigured()) {
        console.error('Supabase admin client not properly configured')
        return new Response('Database not configured', { status: 500 })
    }

    console.log('Received webhook request')

    // Get the headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occurred -- no svix headers', {
            status: 400,
        })
    }

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
        console.error('Error verifying webhook:', err)
        return new Response('Error occurred', {
            status: 400,
        })
    }

    const eventType = evt.type
    console.log('Processing webhook event:', eventType)
    
    if (eventType === 'user.created' || eventType === 'user.updated') {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data
        console.log('Syncing user to Supabase:', {
            id,
            email: email_addresses[0]?.email_address,
            first_name,
            last_name,
            image_url,
        })
        
        try {
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
            
            console.log('User synced successfully')
        } catch (error) {
            console.error('Database operation failed:', error)
            return new Response('Database operation failed', { status: 500 })
        }
    }

    if (eventType === 'user.deleted') {
        const { id } = evt.data
        console.log('Deleting user from Supabase:', id)

        try {
            const { error } = await supabaseAdmin
                .from('users')
                .delete()
                .eq('id', id)

            if (error) {
                console.error('Error deleting user from Supabase:', error)
                return new Response('Error deleting user', { status: 500 })
            }
            
            console.log('User deleted successfully')
        } catch (error) {
            console.error('Database operation failed:', error)
            return new Response('Database operation failed', { status: 500 })
        }
    }

    return new Response('', { status: 200 })
}