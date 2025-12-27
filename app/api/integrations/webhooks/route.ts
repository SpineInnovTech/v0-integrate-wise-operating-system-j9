import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyClerkJWT } from "@/lib/clerk/verify"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest) {
  try {
    const clerkToken = req.cookies.get("__session")?.value
    if (!clerkToken) {
      return NextResponse.json({ ok: false, code: "AUTH_401", message: "Unauthorized" }, { status: 401 })
    }

    const clerkPayload = await verifyClerkJWT(clerkToken)
    if (!clerkPayload) {
      return NextResponse.json({ ok: false, code: "AUTH_401", message: "Invalid token" }, { status: 401 })
    }

    const [identity] = await sql`
      SELECT u.org_id FROM identities i
      JOIN users u ON i.user_id = u.id
      WHERE i.provider = 'clerk' AND i.provider_user_id = ${clerkPayload.sub}
    `

    if (!identity) {
      return NextResponse.json({ ok: false, code: "AUTH_401", message: "User not found" }, { status: 401 })
    }

    const webhooks = await sql`
      SELECT id, provider, event_type, event_id, signature_valid, created_at
      FROM webhooks
      WHERE org_id = ${identity.org_id}
      ORDER BY created_at DESC
      LIMIT 50
    `

    return NextResponse.json({ ok: true, webhooks })
  } catch (error) {
    console.error("[Integrations Webhooks]", error)
    return NextResponse.json({ ok: false, code: "SERVER_500", message: "Internal server error" }, { status: 500 })
  }
}
