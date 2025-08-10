# GABYTOPTRAVEL – Product Requirements Document (MVP)

## 1) Overview

GABYTOPTRAVEL is a web application for a travel agency with a CMS backend. A superadmin manages content (offers, packages, events, departments, destinations, testimonials, and company info) that powers a marketing website. All leads are driven to WhatsApp via prefilled message templates.

- Stack alignment: Next.js App Router, React, TailwindCSS, shadcn/ui, Prisma (PostgreSQL), Supabase Auth, Resend, React Query.
- CMS users manage content; public users browse and click CTAs that open WhatsApp.

## 2) Goals

- Enable a single `superadmin` to manage all homepage and section content from a CMS.
- Publish and feature monthly updates (offers, packages, events) without developer involvement.
- Drive all inquiries to WhatsApp with prefilled context-rich messages.
- Showcase company credibility (Vision, Mission, About, Testimonials) and key differentiators.
- Deliver fast, SEO-ready pages with excellent UX.

## 3) Target Users

- Public visitors seeking concerts/events, quinceañera tours, destination weddings, top/exotic destinations, and fixed departures.
- CMS administrators (superadmin; optional editor/viewer in future).

## 4) Key Differentiators (Reflected in UX and Content)

- Specialized departments: Concerts & Events, Quinceañera Tours, Destination Weddings, Top/Exotic Destinations.
- National presence with physical offices in Santa Cruz, Cochabamba, La Paz.
- Emphasis on safety, logistics expertise, and premium, personalized experiences.

## 5) Scope

### In Scope (MVP)

- Marketing website with sections for Offers, Destinations, Packages, Events, Departments (Weddings, Quinceañera), Testimonials, About, Contact/WhatsApp.
- CMS to manage content types listed below.
- WhatsApp lead flow with dynamic templates including page/source context.
- Monthly content updates via CMS (manual publish), draft/publish status.
- SEO basic

### Out of Scope (MVP)

- Online payments, booking engines, live inventory/pricing.
- Real-time pricing or availability integrations.
- Complex editorial workflow beyond draft/publish (e.g., approval chains).
- Multitenancy, multi-brand theming beyond two department themes.

## 6) Assumptions & Proposed MVP Choices (to confirm)

- 1. MVP scope: A) Marketing website + Admin CMS (no payments; WhatsApp leads only).
- 2. Roles: A) `superadmin` only. (Future: `editor`, `viewer`.)
- 3. Auth: C) Email/password + magic link via Supabase Auth.
- 4. CMS types: A) Offers, Pre-built packages, Custom daily packages, Events/Concerts, Destinations, Categories/Tags, Departments (Weddings, Quinceañera), Testimonials, Pages (About/Mission/Vision).
- 5. Packages: C) Both; D1) Show "from" static price on pre-built; hide price for custom (request quote).
- 6. Taxonomy: A) Countries + Cities + Tags (e.g., South America, Top destinations).
- 8. Homepage: B) Hero Offers, Top destinations, Departments, Testimonials, Company info, Featured Events, Fixed departures module.
- 9. WhatsApp: A + C + D) All CTAs open WhatsApp with prefilled message including UTM/source; templates managed in CMS.
- 10. Languages & currency: A) Spanish; BOB primary and USD secundary; show optional USD "from" per content item as text.
- 11. Updates: A + C) Manual monthly; draft/preview required; scheduling optional (later).
- 12. SEO/perf: A + B + C + D) SEO basics, structured data for packages/events, GA4/UTM, Core Web Vitals target.
- 13. Media: A) Supabase Storage with responsive sizes; video links only (non-MVP for uploads).
- 14. Testimonials: A + C) Curated with approval status.
- 15. Fixed departures & events: C) Separate entities with date ranges and locations; display only.
- 16. Analytics: C) GA4/UTM; track outbound WhatsApp clicks client-side; export later.
- 17. Legal: C) Terms, Privacy, Cookie notice + cookie consent banner.
- 18. Branding: C) We propose simple global style
- 19. Sitemap: B) Home, Destinations, Packages, Events, Weddings, Quinceañera, Offers, About, Testimonials, Contact/WhatsApp, Fixed Departures.
- 20. Acceptance: A) CMS manageability, WhatsApp with templates, SEO basics, Lighthouse ≥ 90/90/90/100 desktop.
- 21. Timeline: A) 4–6 weeks MVP.

## 7) User Stories

- As a visitor, I can filter destinations by country/city/tags to discover packages.
- As a visitor, I can view pre-built packages with itinerary, inclusions, gallery, and a visible "from" price.
- As a visitor, I can view custom daily packages where pricing is by request via WhatsApp.
- As a visitor, I can browse concerts/events and fixed departures by date/location.
- As a visitor, I can navigate dedicated Wedding and Quinceañera sections with tailored visuals and content.
- As a visitor, any CTA opens WhatsApp with a prefilled message containing the item name and page URL.
- As superadmin, I can create, edit, draft, and publish content for all content types listed.
- As superadmin, I can set homepage modules (hero offers, featured events, top destinations) via CMS.
- As superadmin, I can manage WhatsApp message templates and test prefilled links.

## 8) Sitemap & Navigation

- Home
- Destinations (Browse by country, city, tags)
- Packages (Pre-built, Custom)
- Events & Concerts
- Fixed Departures
- Weddings (Department landing)
- Quinceañera (Department landing)
- Offers (Hero offers and archive)
- About (Vision, Mission, Company Info)
- Testimonials
- Contact / WhatsApp

## 9) Information Architecture / Content Types

1. Offer
   - title, subtitle, bannerImage, linkTo (package or external), isFeatured, startAt, endAt, status
2. Destination
   - country, city, description, heroImage, tags[] (e.g., South America, Top), isFeatured
3. Category/Tag
   - name, slug, type ("region" | "theme" | "department"), description
4. Package (base)
   - slug, title, summary, heroImage, gallery[], itinerary (rich text), inclusions[], exclusions[], durationDays, fromPrice (numeric, optional), currency ("BOB" | "USD"), isCustom (boolean), status (draft/published), relatedDestinations[], categories[]
5. Event/Concert
   - slug, title, artistOrEvent, location (country/city/venue), dateRange (start/end), details, gallery[], fromPrice (optional), status
6. FixedDeparture
   - slug, title, destination, dateRange, details, seatsInfo (text only), status
7. Department
   - type ("weddings" | "quinceanera"), title, intro, heroImage, theme (color, imagery guidelines), featuredItems[]
8. Testimonial
   - authorName, location, content, rating (1–5), status (pending/approved/published)
9. Page (About/Mission/Vision)
   - slug, title, sections[] (rich blocks), status
10. WhatsAppTemplate

- name, templateBody (variables: {itemTitle}, {url}, {utmSource}, {utmCampaign}), isDefault

## 10) Data Model (Prisma – conceptual)

Note: exact schema to be refined during implementation.

- Destination(id, country, city, description, heroImageUrl, tags[])
- Tag(id, name, slug, type)
- Package(id, slug, title, summary, heroImageUrl, gallery[], itineraryJson, inclusions[], exclusions[], durationDays, fromPrice, currency, isCustom, status, createdAt, updatedAt)
- PackageDestination(packageId, destinationId)
- PackageTag(packageId, tagId)
- Event(id, slug, title, artistOrEvent, locationCity, locationCountry, venue, startDate, endDate, detailsJson, gallery[], fromPrice, currency, status)
- FixedDeparture(id, slug, title, destinationId, startDate, endDate, detailsJson, seatsInfo, status)
- Offer(id, title, subtitle, bannerImageUrl, linkType, linkTargetId, isFeatured, startAt, endAt, status)
- Department(id, type, title, intro, heroImageUrl, themeJson, featuredItemRefs[])
- Testimonial(id, authorName, location, rating, content, status)
- Page(id, slug, title, sectionsJson, status)
- WhatsAppTemplate(id, name, templateBody, isDefault)
- User(id, email, role: "superadmin") via Supabase Auth user linkage

## 11) CMS Features

- Authentication via Supabase (email/password + magic link) for `superadmin`.
- CRUD with draft/publish for all content types.
- Media upload to Supabase Storage with automatic responsive sizes.
- Homepage configuration: select featured offers, events, top destinations.
- Department landings: theme tokens (colors/images), featured items.
- WhatsApp templates management with preview and test.
- Basic preview mode (draft view) and publish toggle.

## 12) Public Website Features

- Homepage with hero offers, featured events, top destinations, departments highlight, testimonials, and company info.
- Listing pages: packages, events, destinations, fixed departures with filters (country, city, tags).
- Detail pages: packages (pre-built/custom), events, destinations, fixed departures.
- Department landings (Weddings, Quinceañera) with differentiated theme.
- CTA buttons opening WhatsApp with prefilled message and UTM parameters.

## 13) WhatsApp Lead Flow

- All CTAs generate `wa.me` links with prefilled text from the selected template.
- Prefill variables: {itemTitle}, {url}, {utmSource}, {utmCampaign}, {category}.
- Track outbound click events (GA4). Optionally store local counters per page view.

## 14) API (Next.js API Routes – outline)

- `/api/offers` (GET list, POST create)
- `/api/offers/[id]` (GET, PATCH, DELETE)
- `/api/packages` (GET with filters, POST)
- `/api/packages/[id]` (GET, PATCH, DELETE)
- `/api/events` (GET, POST); `/api/events/[id]`
- `/api/fixed-departures` (GET, POST); `/api/fixed-departures/[id]`
- `/api/destinations` (GET, POST); `/api/destinations/[id]`
- `/api/departments` (GET, POST); `/api/departments/[id]`
- `/api/testimonials` (GET, POST); `/api/testimonials/[id]`
- `/api/pages` (GET, POST); `/api/pages/[id]`
- `/api/whatsapp-templates` (GET, POST); `/api/whatsapp-templates/[id]`
- All POST/PATCH/DELETE protected by server-side auth and role check.

## 15) Validation & Security

- Zod-based validation on API inputs; sanitize rich text blocks.
- Role-based guard (superadmin) for mutations.
- Rate limit public endpoints if needed; avoid sensitive details in errors.
- Store only static "from" prices; no PII beyond contact via WhatsApp.

## 16) SEO & Performance

- Per-page meta fields from CMS; OpenGraph images from hero/banners.
- Structured data (JSON-LD) for packages/events (name, description, location, dates, offers where applicable).
- Sitemap and robots.txt.
- Optimize images; lazy loading; prefetch critical routes.
- Core Web Vitals: target LCP < 2.5s (4G), CLS < 0.1, TBT < 200ms.

## 17) Internationalization & Currency

- Spanish content; show BOB as default currency.
- Optionally add USD "from" as secondary text where provided.

## 18) Analytics & Reporting

- GA4 with UTM capture; track outbound WhatsApp clicks and key CTA events.
- Future: simple admin dashboard for top-clicked items and CSV export (non-MVP).

## 19) Legal & Compliance

- Pages: Terms, Privacy, Cookie Notice.
- Cookie consent banner.

## 20) Non-Functional Requirements

- Accessibility: semantic HTML, keyboard navigation, ARIA for interactive elements.
- Reliability: graceful error states for missing content.
- Observability: basic server logs on API errors.
- Maintainability: typed APIs, Prisma only for DB operations, React Query for data fetching.

## 21) Acceptance Criteria (MVP)

- All content types are manageable in the CMS and reflect on the website without code changes.
- Homepage modules are configurable (hero offers, featured events, top destinations).
- All CTAs open WhatsApp with correct prefilled messages and UTM parameters.
- SEO basics implemented; sitemap and robots available; structured data for packages/events.
- Lighthouse (desktop) ≥ 90 Performance, 90 Accessibility, 90 Best Practices, 100 SEO.
