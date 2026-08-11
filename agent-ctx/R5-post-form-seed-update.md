# R5 - post-form-seed-update

## Task ID: R5

### Work Log

#### TASK A: Post Form Rewrite
- Overwrote `/src/components/admin/post-form.tsx` with a professional English-labeled version
- All imports matched spec: useState/useEffect/useCallback, useRouter, Link, useForm/Controller, z/zodResolver, toast, all shadcn/ui components (Button, Input, Textarea, Label, Switch, Skeleton, Card/CardContent/CardHeader/CardTitle, Select/SelectContent/SelectItem/SelectTrigger/SelectValue, Collapsible/CollapsibleContent/CollapsibleTrigger, Breadcrumb/BreadcrumbItem/BreadcrumbLink/BreadcrumbList/BreadcrumbPage/BreadcrumbSeparator), lucide icons (ChevronDown, ChevronRight, Loader2, ImageIcon, Eye, Save, Send, X)
- Form fields: Title (required, zod min 1 'Title is required'), Category (Select from API), Summary (3 rows), Content (12 rows, placeholder 'Write your post content here...'), Image URL (with live preview), Source URL + Source Name (two-column responsive grid), SEO Section (Collapsible, default closed) with Meta Title, Meta Description (2 rows), Meta Keywords (comma placeholder)
- Toggles Card: Published, Featured, Breaking - each with label + description
- Actions: Save as Draft (outline+Save icon), Publish (primary+Send icon), Cancel (ghost+X icon, Link to /admin/posts)
- Max-w-4xl container, breadcrumb navigation, loading skeleton, responsive layout
- Fixed JSX comment syntax (missing closing `}`) caught by ESLint

#### TASK B: Seed Script Update
- Updated `site_name` from `'বার্তা'` to `'Bengal Desk'`
- Updated `site_description` to `'Bengal Desk - Professional News Management System'`
- Also updated admin/editor emails from `@barta.com` to `@bengaldesk.com` to match login page demo credentials
- Ran `bun run scripts/seed.ts` successfully - all settings applied

#### TASK C: Login & Auth Verification
- Login page already displays `admin@bengaldesk.com / admin123` - no change needed
- `auth.ts` already has `pages: { signIn: '/admin/login' }` - no change needed
- Ran `bun run lint` - 0 errors, 0 warnings

### Stage Summary
- Post form fully rewritten with professional English labels and all specified features
- Seed updated with Bengal Desk branding and matching email domains
- Login credentials and auth config verified correct
- ESLint passes clean
