import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyClerkJWT } from "@/lib/clerk/verify"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    const clerkToken = authHeader?.replace("Bearer ", "") || req.cookies.get("__session")?.value

    if (clerkToken) {
      const clerkPayload = await verifyClerkJWT(clerkToken)
      if (clerkPayload) {
        await sql`
          UPDATE sessions
          SET revoked_at = now()
          WHERE jwt_id = ${clerkPayload.jti}
        `
      }
    }

    const response = NextResponse.json({
      ok: true,
      message: "Logged out successfully",
    })

    response.cookies.delete("__session")

    return response
  } catch (error) {
    console.error("[Auth Logout]", error)
    return NextResponse.json({ ok: false, code: "SERVER_500", message: "Internal server error" }, { status: 500 })
  }
}
