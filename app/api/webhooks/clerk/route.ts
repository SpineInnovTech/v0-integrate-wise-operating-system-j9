import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyClerkWebhook } from "@/lib/clerk/verify"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text()
    const headers = req.headers

    // Verify webhook signature
    if (!verifyClerkWebhook(payload, headers)) {
      return NextResponse.json({ ok: false, code: "WEBHOOK_INVALID", message: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(payload)
    const eventId = event.id
    const eventType = event.type

    console.log(`[Clerk Webhook] Processing ${eventType} (${eventId})`)

    // Handle events
    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const userData = event.data
        const clerkUserId = userData.id
        const email = userData.email_addresses?.[0]?.email_address
        const firstName = userData.first_name || ""
        const lastName = userData.last_name || ""
        const name = `${firstName} ${lastName}`.trim()

        if (!email) {
          return NextResponse.json({ ok: true, message: "No email found" })
        }

        // Upsert user
        const [user] = await sql`
          INSERT INTO users (org_id, email, name, is_active, updated_at)
          VALUES (
            'default-org-id'::UUID, -- Replace with actual org resolution logic
            ${email},
            ${name},
            true,
            now()
          )
          ON CONFLICT (email) DO UPDATE
          SET name = EXCLUDED.name,
              is_active = EXCLUDED.is_active,
              updated_at = now()
          RETURNING id
        `

        // Upsert identity
        await sql`
          INSERT INTO identities (user_id, provider, provider_user_id, email)
          VALUES (${user.id}, 'clerk', ${clerkUserId}, ${email})
          ON CONFLICT (provider, provider_user_id) DO UPDATE
          SET email = EXCLUDED.email
        `

        console.log(`[Clerk Webhook] Synced user ${email}`)
        break
      }

      case "session.created": {
        const sessionData = event.data
        const clerkUserId = sessionData.user_id
        const sessionId = sessionData.id

        // Find user by Clerk ID
        const [identity] = await sql`
          SELECT user_id FROM identities
          WHERE provider = 'clerk' AND provider_user_id = ${clerkUserId}
        `

        if (identity) {
          await sql`
            INSERT INTO sessions (user_id, jwt_id, issued_at, expires_at)
            VALUES (
              ${identity.user_id},
              ${sessionId},
              to_timestamp(${sessionData.created_at}),
              to_timestamp(${sessionData.expire_at})
            )
            ON CONFLICT (jwt_id) DO NOTHING
          `
          console.log(`[Clerk Webhook] Session created for user ${identity.user_id}`)
        }
        break
      }

      case "session.ended":
      case "session.removed":
      case "session.revoked": {
        const sessionData = event.data
        const sessionId = sessionData.id

        await sql`
          UPDATE sessions
          SET revoked_at = now()
          WHERE jwt_id = ${sessionId}
        `
        console.log(`[Clerk Webhook] Session revoked: ${sessionId}`)
        break
      }

      default:
        console.log(`[Clerk Webhook] Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ ok: true, message: "Webhook processed" })
  } catch (error) {
    console.error("[Clerk Webhook] Error:", error)
    return NextResponse.json({ ok: false, code: "WEBHOOK_ERROR", message: "Processing failed" }, { status: 500 })
  }
}
