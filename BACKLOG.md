# HDC Compass — Working Backlog

Items deferred from the current build. Each is real work to schedule once the primary build is shipped.

## Advocacy / Dashboard

- [ ] Full People directory page (`/people` route + list + filters)
- [ ] Standalone Touchpoints activity feed (`/touchpoints`) — currently we only render inline timelines on Circle and Person drawers
- [ ] Pipeline kanban view of advocacy targets (Cold → Warm → Engaged → Champion columns with drag-and-drop stage transitions)
- [ ] Dashboard sharing — Dana can invite a viewer to her dashboard with a read-only or contribute role

## Per-persona cockpit deepening

All seven persona cockpits exist as shells with flagship widgets running on inline mock data. Next round, each widget gets its own API/hook layer so the data flows end-to-end:

- [ ] **CFO (Sam) — Financials API**: replace `FinancialSnapshot` inline data with `src/api/financials.js` + `useFinancials` hook. Add monthly close task list with CRUD.
- [ ] **Real Estate (Kim) — Projects API**: replace `DevelopmentPipeline` inline data with `src/api/projects.js` + drag-to-advance-phase. Add critical-path editor.
- [ ] **Property Mgmt (Jaime) — Properties API**: lift `PropertiesMap` mock data into `src/api/properties.js`. Add real ticket counts (replace synthetic). Map pin click should also surface from-the-property linked workplans, not just priorities. Mobile map pass.
- [ ] **HR (Michele) — Positions + People Ops API**: replace `HiringBoard` inline data with `src/api/positions.js` + `src/api/headcount.js`. Add "Create job posting" flow (drawer panel similar to EditPriorityPanel).
- [ ] **Impact (Meg) — Fundraising API**: replace `FundraisingPipeline` inline data with `src/api/donors.js` + `src/api/proposals.js`. Add proposal creation flow with grant deadlines pushed onto Compass Calendar automatically.
- [ ] **Resident Services (Michael) — Referrals API**: replace `ReferralQueue` inline data with `src/api/referrals.js` + `src/api/rscs.js`. Add needs-assessment intake form. PII still locked to the assigned RSC.

## User switcher / auth

- [ ] Hide the persona switcher behind a dev flag once real auth lands. In production this becomes a profile menu (sign out, settings).
- [ ] Profile photos for each persona (currently initials-only).
- [ ] Persona-specific accent color appears on UserSwitcher avatar already; consider also tinting the TopBar gradient subtly per persona.

## Backend / Persistence

- [ ] Supabase persistence — replace all `src/api/*.js` in-memory stores with real Supabase reads/writes
- [ ] Real auth: replace stubbed `useAuth` with Microsoft Entra ID / MSAL flow (per the original brief §15)
- [ ] Server-side filtering (today's date ranges, period scopes) — currently filtered in-memory
- [ ] Real-time subscriptions for collaborative editing (Supabase Realtime channels)

## Compass Calendar

- [ ] AddToCalendar buttons on Initiative and Huddle pages (seed helpers already exist in `utils/calendarSeeds.js`)
- [ ] Recurring calendar items (RFC 5545 / RRULE) — currently each item is a single occurrence
- [ ] Drag-and-drop reschedule on month/week views
- [ ] `/calendar` full-page route (currently lives only as a dashboard section)
- [ ] Approve/Reject inline from the Pending Approval popover (currently routes through the Details drawer)

## Priorities

- [ ] Graph tab in priority expand (heatmap exists; graph tab is currently disabled)
- [ ] Drag-and-drop priority reorder (`@dnd-kit/sortable`)
- [ ] Bulk "Update Priority Values" modal per brief §5.2
- [ ] "Copy Previous Priorities" quarterly carry-forward per brief §5.2
- [ ] Child / nested priorities — the brief calls for recursive expansion; we currently render only flat rows

## Build / Infra

- [ ] Code-split the bundle — vite warns at ~830 KB. Candidates: lazy-load route components, vendor chunk for MUI + Framer
- [ ] Catch the MUI v9 icon rename pattern systematically — every `*Outline` import we add needs the trailing `d`. Consider a lint rule
- [ ] PWA service worker for offline shell caching (manifest is in; service worker is not)
- [ ] Mobile polish pass (per brief §13) — most views work on `xs` but the dashboard cockpit needs a focused mobile reflow

## Other modules still on placeholders

- [ ] Huddles module (HuddlePage agenda, monthly targets, members panel, etc.)
- [ ] Stucks module (Manage Stucks page + Add Stuck modal)
- [ ] Action Items module (list, optimistic complete, due-date chips)
- [ ] Metrics / Data Table module
- [ ] Admin module (users, teams, integrations)

## Tracked design decisions

- Subtype/category for calendar items: subtypes (Waypoint/Marker/Commitment/Touchpoint) replaced the "category" field. Backend keeps generic `CalendarItem`; UI surfaces friendly labels.
- Approval workflow: personal items submitted to org calendar are visible to ELT only as ghosted entries; approval flips scope to `org`; rejection keeps on personal with a "Returned" note.
- Calendar always lives as a *section* of `/dashboard/me` so the dashboard composition can shift per user without losing the calendar.
- Touchpoint subtype on the Calendar is distinct from the new `Touchpoint` entity in the advocacy model. The calendar subtype is a label; the advocacy Touchpoint is its own first-class record with type / outcome / linked people.
