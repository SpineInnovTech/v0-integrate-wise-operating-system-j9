import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyClerkJWT } from "@/lib/clerk/verify"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    const clerkToken = authHeader?.replace("Bearer ", "") || req.cookies.get("__session")?.value

    if (!clerkToken) {
      return NextResponse.json({ ok: false, code: "AUTH_401", message: "Unauthorized" }, { status: 401 })
    }

    const clerkPayload = await verifyClerkJWT(clerkToken)
    if (!clerkPayload) {
      return NextResponse.json({ ok: false, code: "AUTH_401", message: "Invalid token" }, { status: 401 })
    }

    const [identity] = await sql`
      SELECT user_id FROM identities
      WHERE provider = 'clerk' AND provider_user_id = ${clerkPayload.sub}
    `

    if (!identity) {
      return NextResponse.json({ ok: false, code: "AUTH_401", message: "User not found" }, { status: 401 })
    }

    const [user] = await sql`
      SELECT 
        u.id, 
        u.email, 
        u.name, 
        u.org_id,
        COALESCE(
          json_agg(
            json_build_object(
              'id', r.id,
              'name', r.name,
              'description', r.description
            )
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = ${identity.user_id}
        AND u.soft_deleted_at IS NULL
      GROUP BY u.id, u.email, u.name, u.org_id
    `

    if (!user) {
      return NextResponse.json({ ok: false, code: "AUTH_401", message: "User not found" }, { status: 401 })
    }

    return NextResponse.json({
      ok: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.name,
          org_id: user.org_id,
        },
        roles: user.roles,
      },
    })
  } catch (error) {
    console.error("[Auth Me]", error)
    return NextResponse.json({ ok: false, code: "SERVER_500", message: "Internal server error" }, { status: 500 })
  }
}
