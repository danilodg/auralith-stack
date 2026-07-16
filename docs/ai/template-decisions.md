# Template Decision Guide

Use this guide to choose the correct Auralith Stack template.

## Quick Decision

Choose `landing` if the product is mostly public content.

Choose `dashboard` if the product is mostly authenticated app functionality.

## Landing Template

Use `landing` for:

- Marketing homepage
- SaaS landing page
- Product launch page
- Portfolio
- Agency page
- Event page
- Lead capture page
- Public documentation or teaser site

Expected UI patterns:

- Hero section
- Feature sections
- CTA sections
- Contact form
- Theme switch
- Language switch when needed
- Footer links
- Public navigation

Recommended Auralith UI components:

- `Navbar`
- `SiteBackground`
- `GlassPanel`
- `Card`
- `SectionHeader`
- `SectionLabel`
- `Button`
- `Input`
- `Textarea`
- `Toast`

Avoid in landing unless there is a clear need:

- `SideRail`
- complex `DataTable`
- dense dashboard-only controls

## Dashboard Template

Use `dashboard` for:

- Admin app
- Internal tool
- User portal
- Analytics dashboard
- CRM-like workspace
- Content manager
- CRUD interface
- Data-heavy product

Expected UI patterns:

- App shell
- Persistent navigation
- Summary cards
- Data table/list
- Filters/search
- User/profile menu
- Settings actions
- Toast feedback

Recommended Auralith UI components:

- `SideRail`
- `Card`
- `DataTable`
- `TableToolbar`
- `SearchInput`
- `Pagination`
- `DropdownMenu`
- `Avatar`
- `Badge`
- `Modal`
- `AlertDialog`
- `Toast`

Avoid in dashboard unless needed:

- oversized marketing hero sections
- content-only landing sections
- custom nav systems when `SideRail` fits

## Existing Project Rule

If a project already exists, do not scaffold a new Auralith Stack app unless the user asks for a new app.

For existing React apps, install and use `auralith-ui` directly.

## Mixed Apps

If an app needs both marketing and dashboard areas:

- Start with `dashboard` if authenticated features are the core product.
- Start with `landing` if public conversion is the first milestone.
- Add the missing area manually using Auralith UI components.
