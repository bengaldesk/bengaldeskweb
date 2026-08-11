# Task R4: Professional English Rewrite of 7 Admin Pages

## Agent: remaining-pages-rewrite

## Files Modified

1. **src/app/admin/(admin)/categories/page.tsx** — Category Management
   - English labels throughout (header: 'Categories' + count badge + 'New Category' button)
   - Responsive card grid (1 col mobile, 2 md, 3 lg)
   - Each card: name, slug in mono font, post count badge, color swatch circle, active/inactive status, edit/delete
   - Create/Edit Dialog: Name (required), Slug (auto-gen, editable), Description textarea, Color input with preview swatch, Order number, Active switch
   - Delete with AlertDialog confirmation
   - Loading skeletons, empty state, toast notifications
   - Fetch/POST/PUT/DELETE to /api/admin/categories

2. **src/app/admin/(admin)/users/page.tsx** — User Management
   - English labels, header with count + 'Add User' button
   - Desktop table / mobile cards responsive layout
   - Role badges: Admin=red, Editor=blue, Viewer=gray
   - Create/Edit Dialog: Name, Email, Role (Select), Password (required new, optional edit), Active switch
   - Self-delete prevention via session check
   - Loading skeletons, empty state, toast

3. **src/app/admin/(admin)/comments/page.tsx** — Comments Moderation
   - Header with 'Comments' + pending count badge (red)
   - Tabs: All | Pending | Approved | Rejected
   - Desktop table with Author, Comment (truncated), Post link, Status badge, Date, Approve/Reject buttons
   - Mobile card list with same actions
   - PATCH /api/admin/comments for moderation
   - Loading, empty state, toast

4. **src/app/admin/(admin)/media/page.tsx** — Media Library
   - Header with 'Media Library' + count + 'Upload' button
   - Drag-and-drop upload zone with dashed border, icon, text
   - Grid: 2 cols mobile, 3 md, 4 lg
   - Thumbnails (aspect-video, object-cover, rounded-lg), filename, size, date
   - Delete button overlay on hover
   - POST FormData upload, delete with confirmation, loading/empty/toast

5. **src/app/admin/(admin)/polls/page.tsx** — Poll Management
   - Header with 'Polls' + 'Create Poll' button
   - Cards: question, active/inactive badge, total votes, options count, date
   - Create Dialog: question, dynamic options (min 2, add/remove), numbered list
   - POST /api/admin/polls, delete from local state
   - Loading, empty state, toast

6. **src/app/admin/(admin)/newsletter/page.tsx** — Newsletter Subscribers
   - Header with 'Newsletter' + subscriber count + 'Export' button (toast 'Coming soon')
   - Desktop table / mobile cards: Email, Status badge, Subscribed date, Delete
   - Pagination with Previous/Next buttons
   - DELETE /api/admin/newsletter?id=X
   - Loading, empty state, toast

7. **src/app/admin/(admin)/settings/page.tsx** — Site Settings
   - Header with 'Settings' + sticky 'Save Changes' button on scroll
   - Three Card sections with CardHeader + CardTitle: General, Social Media, Contact
   - Uses react-hook-form for form management
   - GET /api/admin/settings on mount, PUT with array of {key, value}
   - Logo URL preview, all inputs with Labels
   - Loading skeletons, toast on save

## Lint Results
- Initial lint: 1 parsing error in settings/page.tsx (ternary inside form confused ESLint parser)
- Fixed by splitting ternary into two separate Fragment-wrapped blocks
- Final lint: **0 errors, 0 warnings** — clean pass

## Notes
- All pages use `sonner` toast for notifications
- All pages use `@/components/ui/*` import paths
- Consistent patterns: loading skeletons, empty states with icons, responsive design
- Breadcrumbs handled by layout, not needed in individual pages
