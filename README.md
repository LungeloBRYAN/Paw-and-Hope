# Paws \& Hope Animal Rescue — Website

## Project Title

**Paws \& Hope Animal Rescue** — a 5-page brochure website built for the Web
Development Portfolio of Evidence (PoE). This repository now covers **Part 1
(foundation \& HTML)** and **Part 2 (CSS styling \& responsive design)**.

## Student Information

|Field|Detail|
|-|-|
|Student name|Lungelo Mabindisa|
|Student number|ST10503170|
|Group|2|
|Subject|Web Development — WEDE5020|
|Institution|Rosebank College — International Braamfontein Campus|

## Project Overview

Paws \& Hope Animal Rescue is a (hypothetical, realistically researched)
Johannesburg-based non-profit organisation that rescues, fosters and
rehomes abandoned and at-risk companion animals. This repository contains
the static HTML/CSS website built for the organisation, developed against a
Website Project Proposal that was researched and approved before any code
was written (see the submitted proposal document for the full proposal,
including the second, non-selected proposal for a small business, Sunrise
Bakehouse).

The site was designed to serve three real audiences the organisation
depends on: **prospective adopters**, **volunteers and foster carers**, and
**donors/sponsors** — reflected directly in the site's structure and, in
particular, in the Enquiry form.

## Part 1 Feedback \& How It Was Addressed

Part 1 was marked at **96/100**, with the overall lecturer comment
*"Excellent work!!"*. No specific line-item corrections were noted in the
feedback beyond the mark itself, so no content or structural changes were
required going into Part 2. Part 2 work therefore proceeded directly to the
CSS styling and responsive design brief, building on the Part 1 HTML
unchanged apart from the layout markup adjustments described in the
Changelog below (needed to support the new CSS Grid/Flexbox layout).

## Website Goals and Objectives

|Goal|KPI|
|-|-|
|Increase adoption enquiries for animals in shelter/foster care|Completed adoption enquiries submitted per month|
|Recruit new volunteers and foster carers|Volunteer/foster sign-ups submitted per month|
|Grow individual and corporate donations/sponsorships|Click-through rate on donation CTAs; sponsor enquiries|
|Raise awareness of responsible pet ownership \& sterilisation|Page views/time on Services page; newsletter sign-ups|

## Key Features and Functionality

* **Home** (`index.html`) — hero introduction (with an art-directed
responsive image), impact statistics, a numbered "how adoption works"
list, and example animal profile cards.
* **About** (`about.html`) — organisation history, mission/vision, and team.
* **Services** (`services.html`) — adoption process, foster programme, and a
community outreach/sterilisation schedule (genuine tabular data).
* **Enquiry** (`enquiry.html`) — one form for all enquiries: adopt / foster
/ volunteer / sponsor, chosen via radio buttons, with a shared message box
for extra detail.
* **Contact** (`contact.html`) — two locations (main shelter and monthly
mobile adoption-day site), an opening-hours table, and a contact form.
* The same header navigation and footer appear on every page.
* **No JavaScript yet, on purpose.** JavaScript is planned for Part 3 of
this project. The `/js` folder exists (per the required file structure)
with a placeholder file, but nothing is wired up to the pages yet. This
means the forms don't submit anywhere yet — expected for now, not a bug.

## Part 2 Details — CSS Styling \& Responsive Design

Part 2 replaced the plain Part 1 styling with a full CSS system:

* **External stylesheet:** a single `css/style.css`, linked from every page.
* **Base style \& reset:** a small deliberate CSS reset (box-sizing, margin/
padding zeroing) plus a base font, colour and line-height set on `body`.
* **Typography:** a type scale using `rem` (a 1.25 ratio across `h1`–`h3`
and body text), with explicit `font-family`, `font-weight`, `line-height`
and `letter-spacing` on headings.
* **Layout — Flexbox:** the header/nav row and the hero's two-column layout
use `display: flex`, `justify-content`, `align-items` and `flex-wrap`. The
same nav rule switches from a row to a column on small screens by changing
only `flex-direction` inside a media query — the cascade doing the work
rather than writing new rules from scratch.
* **Layout — CSS Grid:** the animal/service/team card rows, the stats strip,
the About/Services/Contact "content + sidebar" layout, and the footer (via
named `grid-template-areas`: `about`, `links`, `contact`) all use CSS
Grid, with the column count changing per breakpoint.
* **Visual styles \& interactive states:** `box-shadow`, `border-radius` and
colour throughout, plus `:hover`, `:focus-visible` and `:active`
pseudo-classes on links, buttons and form fields (e.g. buttons lift and
darken on hover, inputs get a visible focus ring for keyboard users).
* **Responsive breakpoints:** two media queries — tablet (`max-width: 56.25em` / 900px) and mobile (`max-width: 37.5em` / 600px) — adjusting
grid column counts, nav direction, and the hero's stacking.
* **Relative units:** `rem` for all font sizes and most spacing, `%`/`fr`
for grid/flex widths, so the layout scales with the user's own browser
font-size setting rather than being fixed to pixels.
* **Responsive images:** the homepage hero uses `<picture>` with a
`media`-conditioned `<source>` — a tighter-cropped illustration
(`hero-art-mobile.svg`) loads on narrow screens instead of the wide
desktop version, so less space is wasted on small screens (genuine art
direction, not just a resize). The animal cards use `srcset`/`sizes` to
declare how much viewport width each image occupies at each breakpoint.

## Timeline and Milestones

|Stage|Target Window|Milestone|
|-|-|-|
|Part 1|Weeks 1–4|Proposal approval; content research; sitemap; file/folder structure; five HTML pages with semantic structure pushed to GitHub — **96/100**|
|Part 2|Weeks 5–8|CSS styling, Grid/Flexbox layout, responsive breakpoints, responsive images *(this submission)*|
|Part 3|Weeks 9–12|JavaScript enhancement, accessibility pass, final testing, debugging, deployment|

## Sitemap

!\[Sitemap showing Homepage linking to About, Services, Enquiry and Contact, with Services expanding into Adopt, Foster and Volunteer](docs/sitemap.png)

```
Homepage (index.html)
├── About (about.html)
├── Services (services.html)
│   ├── Adoption process
│   ├── Foster programme
│   └── Community outreach
├── Enquiry (enquiry.html)
└── Contact (contact.html)
```

All five pages share the same persistent header navigation menu and footer,
so every page is reachable from every other page in a single click.

## File and Folder Structure

```
paws-and-hope-website/
├── index.html
├── about.html
├── services.html
├── enquiry.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── script.js            (placeholder — Part 3)
├── images/
│   ├── logo-mark.svg, favicon.svg
│   ├── hero-art.svg, hero-art-mobile.svg, paw-solo.svg
│   ├── icon-adopt.svg, icon-foster.svg, icon-volunteer.svg, icon-outreach.svg
│   └── avatar-dog.svg, avatar-cat.svg, avatar-rabbit.svg
├── docs/
│   ├── sitemap.png
│   └── screenshots/          (add your desktop/tablet/mobile evidence here)
└── README.md
```

## Changelog

All notable changes to this project are recorded below, newest first, and
correspond to the commit history in this repository.

### \[0.2.0] — Part 2: CSS styling \& responsive design

* **Added:** Full rewrite of `css/style.css` — CSS reset, custom-property
design tokens (colour palette, type scale, spacing scale), typography,
Flexbox layout (header/nav, hero), CSS Grid layout (card grids, stats,
content+sidebar, footer with named grid areas), visual styling with
`:hover`/`:focus-visible`/`:active` states, and two responsive breakpoints
(tablet 900px, mobile 600px) using relative (`rem`/`%`/`fr`) units.
* **Added:** `images/hero-art-mobile.svg` — a tighter-cropped variant of the
hero illustration, served via `<picture>` on narrow screens for genuine
art-directed responsive imagery.
* **Added:** `srcset`/`sizes` attributes on the homepage animal cards to
declare rendered image width per breakpoint.
* **Changed:** Updated markup on all five pages to match the new CSS
structure (nav wrapped in `<nav class="primary-nav">`, card rows wrapped
in `.card-grid`, About/Services/Contact content wrapped in
`.content-layout` + `.sidebar`, footer wrapped in `.footer-grid` with
named areas). Page content and copy are unchanged from Part 1.
* **Noted:** Part 1 was marked 96/100 with no specific corrections
requested (see "Part 1 Feedback" above), so no content changes were
needed before starting Part 2's styling work.

### \[0.1.1] — Simplified to match Part 1 scope

* **Removed:** Mobile menu toggle button and all JavaScript-driven
interactivity, deferred to Part 3.
* **Changed:** Header and navigation used simple `inline-block` elements
instead of Flexbox at this stage, matching material covered so far.
* **Removed:** The `@media` responsive breakpoint, since it existed only to
support the JavaScript menu toggle at the time.
* **Changed:** Footer copyright year set as static text instead of via
JavaScript.

### \[0.1.0] — Part 1 submission

* **Added:** Global stylesheet (`css/style.css`) with the site's colour
palette and typography and basic layout rules.
* **Added:** Original SVG artwork — logo/favicon, hero illustration, four
service icons, and three example-animal avatar illustrations — created
in-house to avoid any third-party licensing risk.
* **Added:** `index.html`, `about.html`, `services.html`, `enquiry.html`,
`contact.html` — five semantic HTML5 pages with real written content.
* **Fixed:** A CSS selector bug where `.stats div` was accidentally
matching the page's `.container` wrapper as well as the four stat boxes,
causing them to overlap instead of sitting side by side. Fixed by giving
the stat boxes their own class instead of relying on the bare `div`
selector.
* **Added:** Content research package (submitted separately as a ZIP) and
this README.

## References

References for the general web-development standards and licensing
information used throughout this project (organisation-specific references
for Paws \& Hope and Sunrise Bakehouse appear at the end of each proposal in
the Website Project Proposal document):

CIPC (n.d.) *Domain Name Registration*. Available at: https://www.cipc.co.za/?page\_id=4565 (Accessed: 14 August 2026).

Creative Commons (n.d.) *About CC Licenses*. Available at: https://creativecommons.org/share-your-work/cclicenses/ (Accessed: 14 August 2026).

Department of Social Development (n.d.) *About Us — Register of Nonprofit Organisations in South Africa*. Available at: https://www.dsd.gov.za/index.php/npo/about-us (Accessed: 14 August 2026).

Mozilla Developer Network (n.d.) *Basic concepts of flexbox*. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS\_flexible\_box\_layout/Basic\_concepts\_of\_flexbox (Accessed: 18 September 2026).

Mozilla Developer Network (n.d.) *CSS grid layout*. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS\_grid\_layout (Accessed: 18 September 2026).

Mozilla Developer Network (n.d.) *HTML elements reference*. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements (Accessed: 14 August 2026).

Mozilla Developer Network (n.d.) *<picture>: The Picture element*. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture (Accessed: 18 September 2026).

Mozilla Developer Network (n.d.) *Media query*. Available at: https://developer.mozilla.org/en-US/docs/Glossary/Media\_query (Accessed: 18 September 2026).

South African Government (n.d.) *Register a nonprofit organisation*. Available at: https://www.gov.za/services/register-nonprofit-organisation (Accessed: 14 August 2026).

World Wide Web Consortium (W3C) (n.d.) *WCAG 2 at a Glance*. Web Accessibility Initiative (WAI). Available at: https://www.w3.org/WAI/standards-guidelines/wcag/glance/ (Accessed: 14 August 2026).

