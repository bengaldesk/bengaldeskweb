# Task R1: Layout & Login Rewrite

## Agent: layout-login-rewrite

## Changes Made

### FILE 1: `src/app/admin/login/page.tsx`
- Complete rewrite with split-screen design
- Left panel (hidden on mobile): Dark branded panel with Bengal Desk logo, tagline 'Professional News Management System', and 3 feature highlights (Content Management, Analytics Dashboard, Fast & Reliable) with icons
- Right panel: Login form card with email input, password input with show/hide toggle, Sign In button with loading spinner
- Below card: Demo Credentials info box with `admin@bengaldesk.com` / `admin123`
- Error display using Alert + AlertDescription
- All English labels for professional admin feel
- `bg-muted/40` background, responsive (mobile shows only form card)
- On success redirects to `/admin`

### FILE 2: `src/app/admin/(admin)/layout.tsx`
- Complete rewrite for maximum professionalism
- SessionProvider wrapping everything
- All required imports from react, next-auth/react, next/navigation, shadcn/ui, lucide-react
- Grouped navigation: Main (Dashboard, Posts, Categories, Media Library), Manage (Users, Comments, Polls, Newsletter), System (Settings)
- Desktop: Fixed left sidebar w-64, collapsible to w-16 with smooth transition
- Collapse state persisted in localStorage via useSyncExternalStore
- Active link: bg-accent with left border accent indicator
- Collapsed: icon-only with tooltips on hover
- Group labels: uppercase text-xs tracking-wider
- Desktop top bar: sidebar toggle + breadcrumb (Home > Current Page), Search button with ⌘K hint, Bell icon with pending count badge (3), theme toggle (sun/moon), user avatar dropdown
- User dropdown: name + email, Administrator role badge, Visit Site link, Sign Out (destructive)
- Mobile: Sheet/drawer sidebar + top bar with hamburger menu, brand icon + page title, user avatar dropdown
- Auth guard: useEffect redirect to /admin/login if unauthenticated
- Loading state: centered skeleton
- Content area: flex-1, p-4 md:p-6 lg:p-8, bg-muted/30, overflow-auto
- Brand: 'Bengal Desk' with Newspaper icon

## Lint Result
- `bun run lint` passed with zero errors
