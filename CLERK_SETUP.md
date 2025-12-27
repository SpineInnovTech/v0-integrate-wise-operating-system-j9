# Clerk Authentication Setup

IntegrateWise OS uses **Clerk** for authentication with custom RBAC stored in Postgres.

## Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
```

## Database Schema

Run script `029_clerk_auth_schema.sql` to create:
- `orgs` - Multi-tenant organization data
- `users` - User profiles linked to Clerk IDs
- `identities` - OAuth provider mappings (Clerk, Google, etc.)
- `roles` - Admin, Manager, Analyst, Viewer
- `user_roles` - User-to-role assignments
- `sessions` - JWT session tracking with revocation
- `auth_audit_log` - Login/logout/permission change audit trail

## Webhooks

Configure Clerk webhook at `https://yourdomain.com/api/webhooks/clerk`:

**Events to subscribe:**
- `user.created` - Auto-create user in DB
- `user.updated` - Sync name/email changes
- `user.deleted` - Soft-delete user
- `session.created` - Track active sessions

**Signing Secret:** Add `CLERK_WEBHOOK_SECRET` to env vars

## Testing

1. Visit `/auth/login` - Redirects to Clerk SignIn
2. Sign up with email - Creates user in DB via webhook
3. Check `/api/auth/me` - Returns user + roles
4. Logout at `/api/auth/logout` - Revokes session

## RBAC Capabilities

Roles defined in `lib/feature/capabilities.ts`:
- **super_admin** - Full access to all features
- **ops_manager** - Manage team, no billing/integrations
- **member** - View/edit own data, no admin
- **viewer** - Read-only access

Middleware (`proxy.ts`) enforces capabilities per route.
