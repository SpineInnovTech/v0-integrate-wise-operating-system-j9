# IntegrateWise OS - Quick Start Guide

## 🚀 What's Been Implemented

Your IntegrateWise OS now has a complete **auth-first, zero-dependency architecture** with:

✅ **Role-Based Access Control** (6 roles, granular capabilities)  
✅ **5 Zero-Dependency Pages** (work without any server setup)  
✅ **Middleware Route Gating** (secure access control)  
✅ **Optional Calendar Integration** (Google/Microsoft/Apple)  
✅ **Optional Memory Insights** (AI-powered task extraction)  
✅ **Content Migration Tools** (Notion/Box → Obsidian)  
✅ **GitHub Vault Sync** (automated content versioning)  
✅ **Client-Side Templates** (no DB required initially)

## 📋 Immediate Next Steps

### 1. Test the Zero-Dependency Pages

Start your dev server and test all pages immediately (no configuration needed):

```bash
npm run dev
```

Visit these URLs:
- http://localhost:3000/overview - Dashboard with integration cards
- http://localhost:3000/tasks - Task management with filters
- http://localhost:3000/insights - Local AI-like text analysis
- http://localhost:3000/normalize - Data normalization preview
- http://localhost:3000/os - Operating system overview
- http://localhost:3000/onboarding - Template selector

**All pages work client-side only - no backend required!**

### 2. Configure Authentication (When Ready)

The middleware is ready for your auth provider. Mock setup for testing:

```typescript
// In your browser console on any page:
document.cookie = "role=super_admin; path=/";
document.cookie = "caps=view.overview,view.tasks,view.ai_insights,view.normalize,view.os_pages,integrations.calendar.read,integrations.memory.read; path=/";

// Then refresh the page - you'll have full access
```

For production, integrate with:
- **Clerk**: https://clerk.com
- **Auth0**: https://auth0.com
- **Stack Auth**: https://stack-auth.com

### 3. Test Content Migration (Optional)

Migrate your Notion/Box content to Obsidian vault:

```bash
# Create test directories
mkdir -p test_notion test_box test_vault

# Add some test markdown files
echo "# Meeting Notes" > test_notion/meeting-notes.md
echo "# Client Proposal" > test_box/proposal.md

# Run migration
python tools/migrate_content.py \
  --notion-export test_notion \
  --box-dir test_box \
  --vault test_vault \
  --mapping-json mapping.json

# Check results
ls -R test_vault/Knowledge/IntegrateWise/
```

### 4. Test GitHub Vault Sync (Optional)

Sync your Obsidian vault to GitHub:

```bash
# Set your GitHub token (get from https://github.com/settings/tokens)
export GITHUB_TOKEN=your_github_personal_access_token

# Test initialization
GIT_REPO=https://github.com/your-org/knowledge.git \
VAULT_PATH=test_vault \
node tools/vault_sync.ts init

# Make a change
echo "# New Note" > test_vault/test.md

# Sync to GitHub
VAULT_PATH=test_vault node tools/vault_sync.ts sync

# Check status
VAULT_PATH=test_vault node tools/vault_sync.ts status
```

## 🎯 Understanding the Architecture

### Role-Based Access

6 roles with different capabilities:

| Role | Access Level |
|------|-------------|
| `super_admin` | Full access to everything |
| `org_admin` | Org management, all views |
| `billing_admin` | Overview + OS pages only |
| `ops_manager` | Overview + Tasks + OS pages |
| `member` | Overview + Tasks + AI Insights |
| `viewer` | Overview only (read-only) |

### Page Capabilities

Each page requires specific capabilities:

- `/overview` → `view.overview`
- `/tasks` → `view.tasks`
- `/insights` → `view.ai_insights`
- `/normalize` → `view.normalize`
- `/os` → `view.os_pages`

### Optional Integrations

Both require explicit user consent:

1. **Calendar** (`integrations.calendar.read`)
   - Add `<CalendarReader />` to any page
   - Client-side OAuth flow
   - No server keys required

2. **Memory** (`integrations.memory.read`)
   - Add `<MemoryInsights />` to any page
   - AI-powered task extraction
   - On-demand processing

## 🔧 Customization Guide

### Add a New Page

1. Create the page file:

```typescript
// app/custom-page/page.tsx
"use client";

export default function CustomPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Custom Page</h1>
      <p>Your content here</p>
    </div>
  );
}
```

2. Add capability to `lib/feature/capabilities.ts`:

```typescript
export type Capability =
  | "view.overview"
  | "view.tasks"
  | "view.ai_insights"
  | "view.normalize"
  | "view.os_pages"
  | "view.custom_page"  // Add this
  | "integrations.calendar.read"
  | "integrations.memory.read";
```

3. Add route mapping to `middleware.ts`:

```typescript
function getRequiredCapability(pathname: string): string | null {
  if (pathname.startsWith("/overview")) return "view.overview";
  if (pathname.startsWith("/tasks")) return "view.tasks";
  if (pathname.startsWith("/custom-page")) return "view.custom_page";  // Add this
  // ...
}
```

### Add Calendar to a Page

```typescript
import CalendarReader from "@/components/integrations/CalendarReader";

export default function MyPage() {
  return (
    <div className="p-6 space-y-6">
      <h1>My Page</h1>
      <CalendarReader />
    </div>
  );
}
```

### Add Memory Insights to a Page

```typescript
import MemoryInsights from "@/components/integrations/MemoryInsights";

export default function MyPage() {
  return (
    <div className="p-6 space-y-6">
      <h1>My Page</h1>
      <MemoryInsights />
    </div>
  );
}
```

## 📚 File Structure Reference

```
/workspace
├── app/
│   ├── overview/page.tsx          ← Zero-dep dashboard
│   ├── tasks/page.tsx              ← Task management
│   ├── insights/page.tsx           ← AI insights
│   ├── normalize/page.tsx          ← Data normalization
│   ├── os/page.tsx                 ← OS overview
│   └── onboarding/page.tsx         ← Template selector
│
├── components/
│   └── integrations/
│       ├── CalendarReader.tsx      ← Calendar widget
│       └── MemoryInsights.tsx      ← Memory widget
│
├── lib/
│   ├── feature/
│   │   └── capabilities.ts         ← RBAC definitions
│   └── templates/
│       ├── client-template.ts      ← Client template mgmt
│       └── industry-templates.ts   ← 8 pre-built templates
│
├── middleware.ts                   ← Route gating
│
├── tools/
│   ├── migrate_content.py          ← Notion/Box migration
│   └── vault_sync.ts               ← GitHub sync
│
├── README_IMPLEMENTATION.md        ← Full implementation docs
└── QUICK_START.md                  ← This file
```

## 🎨 Styling & Theming

All pages use Tailwind CSS with:
- Dark mode support (`dark:` classes)
- Responsive layouts (`md:grid-cols-3`)
- Muted colors for readability
- Accessible color contrast

Customize in `app/globals.css` or via Tailwind config.

## 🔐 Security Best Practices

1. **Never commit secrets**: Use `.env.local` for tokens
2. **Client-side OAuth only**: No server keys for Calendar
3. **Consent-based features**: User must enable integrations
4. **Defense in depth**: Check capabilities client AND server
5. **Fail closed**: Missing permissions deny access

## 🐛 Troubleshooting

### Pages show "Access Denied"

Set mock cookies for testing:
```javascript
document.cookie = "role=super_admin; path=/";
document.cookie = "caps=view.overview,view.tasks,view.ai_insights,view.normalize,view.os_pages; path=/";
location.reload();
```

### Proxy redirects to login

The proxy expects authentication. For testing:
- Add `role` and `caps` cookies (see above)
- Demo mode: The root route auto-sets `demo_session=true` cookie
- For more details, see `PROXY_MIGRATION.md`

### Migration script fails

Check:
- Python 3.7+ installed
- Source directories exist
- Write permissions to vault directory

### Vault sync fails

Check:
- `GITHUB_TOKEN` is set
- Token has `repo` permissions
- Repository exists and is accessible
- Git is installed

## 📖 Further Reading

- **Full Implementation Docs**: See `README_IMPLEMENTATION.md`
- **RBAC System**: See `lib/feature/capabilities.ts`
- **Templates**: See `lib/templates/industry-templates.ts`
- **Migration**: See comments in `tools/migrate_content.py`
- **Vault Sync**: See comments in `tools/vault_sync.ts`

## 🎉 You're Ready!

Your IntegrateWise OS is now set up with:
- ✅ Working zero-dependency pages
- ✅ Role-based access control
- ✅ Optional integrations ready
- ✅ Content migration tools
- ✅ GitHub sync capability

**Start the dev server and explore:**
```bash
npm run dev
```

Then visit http://localhost:3000/overview to begin!
