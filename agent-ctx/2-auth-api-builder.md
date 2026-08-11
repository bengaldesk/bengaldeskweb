# Task 2 - auth-api-builder

## Files Created

### Auth & Middleware
- `src/lib/auth.ts` - NextAuth configuration with CredentialsProvider, type extensions for Session/User/JWT, authOptions export, getNextAuthServerSession helper
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth route handler (GET + POST)
- `src/middleware.ts` - Protects /admin routes (except /admin/login) using JWT token

### Seed Script
- `scripts/seed.ts` - Seeds 2 users (admin/editor), 10 categories (Bengali), 4 site settings, 1 sample poll

### Admin API Routes
- `src/app/api/admin/stats/route.ts` - Dashboard stats (counts, recent posts, chart data)
- `src/app/api/admin/posts/route.ts` - List/create posts with pagination, search, filters
- `src/app/api/admin/posts/[id]/route.ts` - Get/update/delete single post
- `src/app/api/admin/categories/route.ts` - List/create categories
- `src/app/api/admin/categories/[id]/route.ts` - Get/update/delete category (prevents delete with posts)
- `src/app/api/admin/users/route.ts` - List/create users (passwords hashed)
- `src/app/api/admin/users/[id]/route.ts` - Get/update/delete user (prevents self-deletion)
- `src/app/api/admin/comments/route.ts` - List comments with post/author info, PATCH status
- `src/app/api/admin/media/route.ts` - List media, upload files to /public/uploads/
- `src/app/api/admin/media/[id]/route.ts` - Delete media (disk + DB)
- `src/app/api/admin/settings/route.ts` - Get all settings as key-value, PUT upsert
- `src/app/api/admin/polls/route.ts` - List polls with vote counts, create poll with options
- `src/app/api/admin/activity/route.ts` - Recent 50 activity logs, create log entry
- `src/app/api/admin/newsletter/route.ts` - List subscribers, delete subscriber

## Design Decisions
- All admin routes check auth via `getNextAuthServerSession()`, return 401 if not authenticated
- All mutating routes log activity via `ActivityLog`
- Posts API supports pagination, search, category filter, published filter
- Media upload uses uuid filenames to avoid conflicts
- Category deletion checks for existing posts first
- User deletion prevents self-deletion