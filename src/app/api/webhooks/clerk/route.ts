import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/utils/supabase/server'

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
    console.log('Received webhook request',WEBHOOK_SECRET)
    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local')
    }

    // Get the headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
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
        return new Response('Error occured', {
            status: 400,
        })
    }

    const eventType = evt.type



    // const { id } = evt.data
    // const eventType = evt.type
    // const supabase = createClient()
    // if (eventType === 'user.created') {
    //     console.log("Creating user in supabase", payload.data.bio);
    //     const { data, error } = await supabase.from('user').insert({
    //         user_name: payload.data.username,
    //         image_url: payload.data.image_url,
    //         external_user_id: payload.data.id,
    //         bio: payload.data.bio,
    //     }).select()
    //     if (error) {
    //         console.error("Error inserting user:", error);
    //     } else {
    //         console.log("Successfully inserted user:", data);
    //     }
    // }
    if (eventType === 'user.created' || eventType === 'user.updated') {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data
        console.log('Syncing user to Supabase:', {
            id,
            email: email_addresses[0]?.email_address,
            first_name,
            last_name,
            image_url,
        })
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

    return new Response('', { status: 200 })
}