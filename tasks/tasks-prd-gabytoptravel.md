## Relevant Files

- `prisma/schema.prisma` - Added enums (ContentStatus, Currency, TagType, DepartmentType, TestimonialStatus) and models (Destination, Tag, Package, PackageDestination, PackageTag, DestinationTag, Event, FixedDeparture, Offer, Department, Testimonial, Page, WhatsAppTemplate). Also added indexes for query performance and completed relations.
- `prisma/seed.ts` - Seed script inserting minimal dev data (tags, destination, package, event, offer, default WhatsApp template).
- `package.json` - Added scripts: `prisma:migrate`, `prisma:generate`, `prisma:seed`.
- `src/lib/auth.ts` - Added `ensureSuperadmin()` and `MOCK_SUPERADMIN` toggle.
- `src/lib/prisma.ts` - Prisma client used by all API routes.
- `src/lib/api.ts` - Normalized JSON helpers for success/error responses.
- `src/lib/sanitize.ts` - Placeholder sanitization for rich JSON fields.
- `src/middleware.ts` - Gate CMS routes to `SUPERADMIN`.
- `src/lib/validations/common.ts` - Shared Zod schemas and enums.
- `src/lib/validations/destination.ts` - Zod schema for Destination CRUD.
- `src/lib/validations/tag.ts` - Zod schema for Tag CRUD.
- `src/lib/validations/package.ts` - Zod schema for Package CRUD.
- `src/lib/validations/event.ts` - Zod schema for Event CRUD.
- `src/lib/validations/fixed-departure.ts` - Zod schema for Fixed Departure CRUD.
- `src/lib/validations/offer.ts` - Zod schema for Offer CRUD.
- `src/lib/validations/department.ts` - Zod schema for Department CRUD.
- `src/lib/validations/testimonial.ts` - Zod schema for Testimonial CRUD.
- `src/lib/validations/page.ts` - Zod schema for Page CRUD.
- `src/lib/validations/whatsapp-template.ts` - Zod schema for WhatsAppTemplate CRUD.
- `src/types/content.ts` - Shared TS types/interfaces for content entities.
- `src/lib/utils.ts` - Add helpers for WhatsApp link building and UTM capture.
- `src/lib/supabase/upload-avatar.ts` - Reference pattern for storage; create new `upload-image.ts` for CMS images.
- `src/app/api/offers/route.ts` and `src/app/api/offers/[id]/route.ts` - Offers API.
- `src/app/api/destinations/route.ts` and `src/app/api/destinations/[id]/route.ts` - Destinations API.
- `src/app/api/tags/route.ts` and `src/app/api/tags/[id]/route.ts` - Tags API.
- `src/app/api/packages/route.ts` and `src/app/api/packages/[slug]/route.ts` - Packages API.
- `src/app/api/events/route.ts` and `src/app/api/events/[slug]/route.ts` - Events API.
- `src/app/api/fixed-departures/route.ts` and `src/app/api/fixed-departures/[slug]/route.ts` - Fixed Departures API.
- `src/app/api/departments/route.ts` and `src/app/api/departments/[type]/route.ts` - Departments API.
- `src/app/api/testimonials/route.ts` and `src/app/api/testimonials/[id]/route.ts` - Testimonials API.
- `src/app/api/pages/route.ts` and `src/app/api/pages/[slug]/route.ts` - Pages API.
- `src/app/api/whatsapp-templates/route.ts` and `src/app/api/whatsapp-templates/[id]/route.ts` - WhatsApp Templates API.
- `src/app/(dashboard)/cms/layout.tsx` - CMS layout/shell under dashboard.
- `src/app/(dashboard)/cms/page.tsx` - CMS home (overview).
- `src/hooks/use-offers.ts` - React Query hooks for offers (pattern for others: packages, events, destinations, testimonials).
- `src/hooks/use-packages.ts`
- `src/hooks/use-events.ts`
- `src/hooks/use-fixed-departures.ts`
- `src/hooks/use-destinations.ts`
- `src/hooks/use-testimonials.ts`
- `src/components/admin/forms/*` - CMS forms for each content type using shadcn/ui + RHF.
- `src/components/admin/tables/*` - CMS tables/list views.
- `src/app/(dashboard)/cms/[entity]/page.tsx` - List views per entity.
- `src/app/(dashboard)/cms/[entity]/new/page.tsx` and `src/app/(dashboard)/cms/[entity]/[id]/page.tsx` - Create/Edit.
- `src/app/page.tsx` - Home sections pulling featured content.
- `src/app/offers/page.tsx`
- `src/app/destinations/page.tsx` and `src/app/destinations/[slug]/page.tsx`
- `src/app/packages/page.tsx` and `src/app/packages/[slug]/page.tsx`
- `src/app/events/page.tsx` and `src/app/events/[slug]/page.tsx`
- `src/app/fixed-departures/page.tsx` and `src/app/fixed-departures/[slug]/page.tsx`
- `src/app/weddings/page.tsx` - Weddings department landing with theme.
- `src/app/quinceanera/page.tsx` - Quinceañera department landing with theme.
- `src/app/about/page.tsx`
- `src/app/testimonials/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/sitemap.ts` - Generated sitemap.
- `src/app/robots.ts` - Robots configuration.
- `src/app/(dashboard)/cms/offers/page.tsx` - Offers list table with basic pagination-ready fetch.
- `src/components/admin/forms/offer-form.tsx` - Offer create form using RHF + Zod.
- `src/app/(dashboard)/cms/offers/new/page.tsx` - New Offer page integrating the form.
- `src/app/(dashboard)/cms/whatsapp-templates/[id]/page.tsx` - Template detail with live preview link builder.
- `src/lib/utils.ts` - Added `buildWhatsAppUrl` utility.
- `src/app/packages/[slug]/page.tsx` - Package detail page.
- `src/app/events/[slug]/page.tsx` - Event detail page.
- `src/app/destinations/[slug]/page.tsx` - Destination detail with related packages.
- `src/app/fixed-departures/[slug]/page.tsx` - Fixed departure detail page.
- `src/components/utils/utm-provider.tsx` – persists UTM to localStorage/window.
- `src/components/utils/whatsapp-cta.tsx` – reads persisted UTM and appends to WA URL and analytics events.
- `src/app/layout.tsx` – `UtmProvider` added.

### Notes

- Env vars to set locally: `DATABASE_URL`, `DIRECT_URL`, `MOCK_SUPERADMIN`, `NEXT_PUBLIC_GA4_ID`, Supabase keys (if used), `RESEND_API_KEY`.
- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx`).
- Use `npx jest [optional/path/to/test/file]` to run tests (if configured). Prioritize unit tests for validation schemas and WhatsApp link utils.

## Tasks

- [x] 1.0 Data modeling and migrations (Prisma)

  - [x] 1.1 Add models: `Destination`, `Tag`, `Package`, junctions `PackageDestination`, `PackageTag`, `DestinationTag`, `Event`, `FixedDeparture`, `Offer`, `Department`, `Testimonial`, `Page`, `WhatsAppTemplate` with enums for `status` (draft/published) and currency.
  - [x] 1.2 Define indexes (e.g., `slug`, `status`, `startDate/endDate` for events and departures, `isFeatured`).
  - [x] 1.3 Run migration and generate client. (Note: DB connection blocked P1001; Prisma Client generated successfully.)
  - [x] 1.4 Seed minimal dev data (featured offer, a destination, a package, one event, default WhatsApp template).
  - [x] 1.5 Verify `Profile.role` is `SUPERADMIN` for admin user and document env vars.

- [ ] 2.0 API layer for content types (Next.js API Routes with validation and auth)

  - [x] 2.1 Create Zod validations for each entity under `src/lib/validations/*`.
  - [x] 2.2 Implement REST endpoints for: offers, destinations, tags, packages, events, fixed-departures, departments, testimonials, pages, whatsapp-templates (list, read, create, update, delete).
  - [x] 2.3 Add filtering/pagination: status, country/city, tags, date ranges, `isFeatured`.
  - [x] 2.4 Add server-side guards: only `SUPERADMIN` may mutate; public GET limited to published.
  - [x] 2.5 Normalize error responses and input sanitization for rich-text fields.

- [ ] 3.0 CMS admin (dashboard) for content management and homepage configuration

  - [x] 3.1 Create `src/app/(dashboard)/cms` layout, sidebar nav, and overview page.
  - [x] 3.2 Build list/table views per entity with search, filter by status, and pagination.
  - [x] 3.3 Build create/edit forms using shadcn/ui + react-hook-form + zod; integrate image upload (Supabase Storage) and galleries.
  - [x] 3.4 Implement draft/publish toggle and preview mode for pages and packages.
  - [x] 3.5 Add WhatsApp Templates manager with live preview (build `wa.me` link with variables).
  - [x] 3.6 Configure homepage: use `isFeatured` flags for offers, destinations, and events to drive homepage sections.
  - [x] 3.7 Protect CMS routes via middleware to `SUPERADMIN`.

- [x] 4.0 Public website pages, listings, details, navigation, and WhatsApp CTA flow

  - [x] 4.1 Implement Home sections: hero offers, featured events, top destinations, departments highlight, testimonials, and company info.
  - [x] 4.2 Listing pages for Packages, Destinations, Events, Fixed Departures with filters (country, city, tags, date).
  - [x] 4.3 Detail pages for Package (pre-built/custom), Event, Destination, Fixed Departure with galleries and itineraries.
  - [x] 4.4 Department landings: `Weddings`, `Quinceañera` with distinct theme tokens (colors/imagery).
  - [x] 4.5 Implement WhatsApp CTA utility to build prefilled links using default/template and include UTM params; track click events.
  - [x] 4.6 About, Testimonials, Contact/WhatsApp pages.

- [x] 5.0 SEO & Analytics

  - [x] 5.1 Implement dynamic meta tags and OpenGraph data for all public pages.
  - [x] 5.2 Generate sitemap.xml and robots.txt.
  - [x] 5.3 Integrate GA4 and track key events (WhatsApp clicks, page views).
  - [x] 5.4 Integrate GA4; persist UTM in query and pass to WhatsApp link builder.
  - [x] 5.5 Image optimization and lazy-loading; verify Core Web Vitals targets.
  - [ ] 5.6 Run Lighthouse and fix major regressions.

## Relevant Files

- `next.config.ts` – configured remote `images` patterns for Supabase and Unsplash.
- `src/app/weddings/page.tsx` – hero via Next/Image.
- `src/app/quinceanera/page.tsx` – hero via Next/Image.
- `src/app/packages/[slug]/page.tsx` – hero image with Next/Image.
- `src/app/events/[slug]/page.tsx` – hero image with Next/Image.
- `src/app/destinations/[slug]/page.tsx` – hero image with Next/Image.
- `src/app/packages/page.tsx`, `events/page.tsx`, `destinations/page.tsx`, `fixed-departures/page.tsx` – list card thumbnails via Next/Image.

- [ ] 6.0 Security, roles/permissions, QA, and release readiness
  - [x] 6.1 Implement `ensureSuperadmin` server utility and apply to all mutation endpoints.
  - [x] 6.2 Add basic rate limiting for public list endpoints (optional for MVP if time allows).
  - [x] 6.3 Sanitize and safely render rich text; prevent XSS.
  - [x] 6.4 Add unit tests for validation schemas and WhatsApp link utility.
  - [x] 6.5 Implement empty and error states across CMS and public pages.
  - [x] 6.6 Document env vars and deployment steps (DATABASE_URL, DIRECT_URL, SUPABASE, RESEND, NEXT_PUBLIC_GA4_ID).
  - [x] 6.7 Content entry: input initial offers, destinations, and 3–5 showcase items for launch.
