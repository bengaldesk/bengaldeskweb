# R3 - posts-pages-rewrite

## Task
Professional post management list, new post, and edit post pages with bulk actions, responsive design, and English labels.

## Files Modified

### 1. `/src/app/admin/(admin)/posts/page.tsx`
Complete rewrite of the posts management list page:
- **Page Header**: "Posts" title with count badge and "New Post" primary button
- **Bulk Actions Bar**: Appears when items selected via checkboxes - shows count, "Publish Selected", "Delete Selected" buttons, "Cancel" link
- **Filter Row**: Search input with Search icon, Category dropdown (fetched from API), Status dropdown (All/Published/Draft), Filter icon button
- **Desktop Table** (md+): Checkbox column | Title (bold, truncate max-w-[350px], link to edit) | Category (badge) | Status (green Published / amber Draft) | Featured (star badge) | Breaking (red badge) | Author | Date | Views | Actions (3-dot DropdownMenu: Edit, Toggle Publish, Delete)
- **Mobile Cards** (below md): Card list with checkbox, title, badges row, author+date, action buttons
- **Pagination**: "Showing X-Y of Z results" text, Previous/Next buttons with page numbers
- **Loading**: Full skeleton table matching the real layout (desktop + mobile)
- **Empty State**: Inbox icon, "No posts found", "Create your first post" button
- **Fetch**: GET /api/admin/posts with page, limit=12, search, category, published params
- **Toggle Publish**: PUT /api/admin/posts/[id] with { published: !current }
- **Bulk Delete**: DELETE /api/admin/posts/[id] for each selected
- **All English labels** throughout

### 2. `/src/app/admin/(admin)/posts/new/page.tsx`
Simple wrapper page with:
- Breadcrumb: Home > Posts > New Post
- PostForm component in max-w-4xl container
- 'use client' directive
- All English labels

### 3. `/src/app/admin/(admin)/posts/edit/[id]/page.tsx`
Simple wrapper page with:
- Breadcrumb: Home > Posts > Edit Post
- React.use() to get params.id (React 19 style)
- PostForm component with postId={id} in max-w-4xl container
- All English labels

## API Integration
- GET /api/admin/posts (list with pagination, search, category, status filters)
- PUT /api/admin/posts/[id] (partial updates - toggle published)
- DELETE /api/admin/posts/[id] (single and bulk delete)
- GET /api/admin/categories (for filter dropdown)

## Notes
- Lint passes with zero errors
- All Bangla labels replaced with English equivalents
- TooltipProvider wraps entire page for tooltip support
- Selection state cleared on data re-fetch
