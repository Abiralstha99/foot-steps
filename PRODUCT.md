# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Travelers — college students, backpackers, casual photographers — who reach for Footprint during or immediately after a trip, when they have a fresh camera roll and want to turn it into something worth sharing. The impulse is "I just got back from Japan; let me make this feel like a real story." Secondary audience: families receiving a shared album link (no account required).

## Product Purpose

Footprint is an AI-powered travel journal that automatically transforms your photos into interactive trip stories. Using GPS metadata and AI landmark recognition, it organizes memories into timelines and maps that are easy to relive and share. Unlike Google Photos or iCloud, Footprint is designed around the journey — not just storing your pictures.

## Positioning

The mechanism no neighboring product can truthfully copy: upload a folder of photos and immediately get a named trip with a chronological timeline, a live map with every geotagged photo pinned to its exact location, and AI-generated landmark tags — with a shareable link that works for anyone, no account required.

## Operating Context

- User dumps photos from a phone or camera after returning from a trip
- Photos already carry EXIF data (date, GPS coordinates when camera location was on)
- The whole "organize this trip" job needs to feel done in under 3 minutes
- Sharing happens via a single link — the recipient is often a family member or friend on a different platform
- Desktop-primary use (responsive to tablet); mobile upload is a future concern

## Capabilities and Constraints

- Trip container: title, date range, location, cover photo
- Bulk photo upload with per-file progress; EXIF date and GPS extracted on backend
- Three views per trip: Photo Grid, Timeline (grouped by day), Map (Leaflet, geotagged photos only)
- AI tags: landmark, scene, object categories (keyword heuristics + optional AI API)
- Share-by-link: public token, read-only view, no account required for recipient
- Auth: Clerk (email/social login); all owned trips are private by default
- Storage: AWS S3 (presigned URLs); database: PostgreSQL via Prisma
- Upload limit: 100 photos/trip, 10 MB/file
- Photos missing GPS fall back to timeline-only (no map pin)
- Dashboard: stats, on-this-day, upcoming trips, recent activity

## Brand Commitments

- **Name:** Footprint
- **Aesthetic direction (binding):** Grounded Light-SaaS Modernism with alpine-inspired deep greens. Crisp typography on subtle off-white canvases. Primary accent: #15803D (deep forest green). Gradient CTA: green-600 → emerald-700 → green-900. Subtle badge background: #DCFCE7 (green-100) with green-800 text. Base canvas: #F8FAFC to #FFFFFF. Dark neutral for headings/obsidian buttons: #0F172A.
- **Anti-patterns (binding):** No dark heavy card borders. No pitch-black photo backgrounds. No neon/oversaturated greens. No backend tech stack on the marketing page.
- **Fonts:** Fraunces (display/serif, headings) + Inter (sans, body/UI)

## Evidence on Hand

- Full working application: all sprints complete (Sprint 0–4)
- Real routes: LandingPage, HomePage, TripsPage, TripDetailPage, ExplorePage, ShareAlbumPage
- No real user testimonials, press, or case studies — must not be fabricated
- No production traffic data or conversion metrics

## Product Principles

1. **Journey over gallery.** Every interaction is framed around a trip story, not a file browser.
2. **Automatic over manual.** EXIF extraction, AI tagging, and map pinning happen without user configuration.
3. **Shareable by default.** Any trip can become a public link; the recipient experience is as considered as the owner's.
4. **Depth through engineering, simplicity through UI.** The technical complexity (EXIF, Leaflet, S3, Prisma) should be invisible; the surface should feel effortless.
5. **Portfolio-grade craft.** The design and code quality should demonstrate senior engineering judgment — not just that it works, but that it was built with intention.

## Accessibility & Inclusion

Responsive layout required (desktop + tablet). No specific WCAG target declared; contrast ratios must be maintained for the alpine green palette (deep tones only — #15803D or darker for text).
