# Paws \& Hope Animal Rescue — Website

## Project Title

**Paws \& Hope Animal Rescue** — a 5-page brochure website built for Part 1 of
the Web Development Portfolio of Evidence (PoE).

## Student Information

|Field|Detail|
|-|-|
|Student name|Lungelo Mabindisa |
|Student number|ST10503170|
|Group|2|
|Subject|Web Development \[WEDE5020]|
|Institution|Rosebank International Braamfontein|

## 

## 

## Project Overview

Paws \& Hope Animal Rescue is a (hypothetical, realistically researched)
Johannesburg-based non-profit organisation that rescues, fosters and
rehomes abandoned and at-risk companion animals. This repository contains
the static HTML/CSS/JavaScript website built for the organisation, developed
against a Website Project Proposal that was researched and approved before
any code was written (see `/docs` and the submitted proposal document for
the full proposal, including the second, non-selected proposal for a small
business, Sunrise Bakehouse).

The site was designed to serve three real audiences the organisation
depends on: **prospective adopters**, **volunteers and foster carers**, and
**donors/sponsors** — reflected directly in the site's structure and,
in particular, in the adaptive Enquiry form.





## Website Goals and Objectives

|Goal|KPI|
|-|-|
|Increase adoption enquiries for animals in shelter/foster care|Completed adoption enquiries submitted per month|
|Recruit new volunteers and foster carers|Volunteer/foster sign-ups submitted per month|
|Grow individual and corporate donations/sponsorships|Click-through rate on donation CTAs; sponsor enquiries|
|Raise awareness of responsible pet ownership \& sterilisation|Page views/time on Services page; newsletter sign-ups|

## 

## 

## Key Features and Functionality

* **Home** (`index.html`) — hero introduction, impact statistics, a
four-step "how adoption works" list, and example animal profile cards.
* **About** (`about.html`) — organisation history, mission/vision, and team.
* **Services** (`services.html`) — adoption process, foster programme,
and a community outreach/sterilisation schedule (genuine tabular data).
* **Enquiry** (`enquiry.html`) — one form for all enquiries. Visitors pick
what they're interested in (adopt / foster / volunteer / sponsor) using
radio buttons, then use a single message box to add relevant details —
built to satisfy the brief's non-profit-specific requirement that
visitors can register interest as a volunteer or sponsor, not only as
an adopter.
* **Contact** (`contact.html`) — two locations (main shelter and monthly
mobile adoption-day site), an opening-hours table, and a contact form.
* The same header navigation and footer appear on every page, built with
semantic HTML5 and basic CSS (colours, fonts, spacing, simple
`inline-block` layout — no CSS Grid or Flexbox yet).
* **No JavaScript yet, on purpose.** This project's brief covers HTML in
Part 1, with CSS refined and JavaScript added in Parts 2 and 3. The
`/js` folder exists (per the required file structure) with a placeholder
file, but nothing is wired up to the pages yet. This also means the
forms don't submit anywhere yet, and the nav menu doesn't collapse on
small screens yet — both are expected next steps, not bugs.



## Timeline and Milestones

|Stage|Target Window|Milestone|
|-|-|-|
|Part 1|Weeks 1–4|Proposal approval; content research; sitemap; file/folder structure; five HTML pages with semantic structure pushed to GitHub *(this submission)*|
|Part 2|Weeks 5–8|CSS styling refinement, responsive polish, cross-browser testing|
|Part 3|Weeks 9–12|JavaScript enhancement, accessibility pass, final testing, debugging, deployment|

## 

## Part 1 Details

Part 1 focused on foundation and planning. Deliverables completed in this
submission:

* Two full website project proposals researched and drafted (this
organisation, Paws \& Hope, and an alternative small-business proposal,
Sunrise Bakehouse), submitted as a separate Word document for lecturer
approval.
* Content research and sourcing, organised in `/content-research` (submitted
separately as a ZIP per the brief) — organisation fact sheet, page-by-page
draft copy, and an image-sourcing log documenting the licence status of
every visual asset.
* A sitemap (see below) and a logical file/folder structure (see below).
* Five semantic HTML5 pages, cross-linked with a working navigation menu,
styled with CSS and enhanced with vanilla JavaScript, fully commented.

*(Parts 2 and 3 will extend this same repository in later submissions —
see the Changelog for a running record of all changes.)*

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


All five pages share the same persistent header navigation menu and footer,
so every page is reachable from every other page in a single click.

## 

## File and Folder Structure


paws-and-hope-website/
├── index.html
├── about.html
├── services.html
├── enquiry.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   ├── logo-mark.svg, favicon.svg
│   ├── hero-art.svg, paw-solo.svg
│   ├── icon-adopt.svg, icon-foster.svg, icon-volunteer.svg, icon-outreach.svg
│   └── avatar-dog.svg, avatar-cat.svg, avatar-rabbit.svg
├── docs/
│   └── sitemap.png
└── README.md


## Changelog

All notable changes to this project are recorded below, newest first, and
correspond to the commit history in this repository.

### \[0.1.1] — Simplified to match Part 1 scope

* **Removed:** Mobile menu toggle button and all JavaScript-driven
interactivity. This project's own timeline (see the Website Project
Proposal) puts JavaScript in Parts 2 and 3, so `js/script.js` is now a
placeholder file with a comment explaining what's planned, and no page
currently links to it.
* **Changed:** Header and navigation now use simple `inline-block`
elements instead of Flexbox, so the CSS matches material covered so far.
* **Removed:** The `@media` responsive breakpoint, since it existed only
to support the JavaScript menu toggle. On a narrow screen the nav links
and stat boxes now simply wrap onto more than one line — expected
default browser behaviour, not a bug.
* **Changed:** Footer copyright year is now static text instead of being
set by JavaScript.

### \[0.1.0] — Part 1 submission

* **Added:** Global stylesheet (`css/style.css`) with the site's colour
palette and typography and basic layout rules.
* **Added:** Original SVG artwork — logo/favicon, hero illustration, four
service icons, and three example-animal avatar illustrations — created
in-house to avoid any third-party licensing risk.
* **Added:** `index.html` — homepage with hero, impact stats, a numbered
"how adoption works" list, and example animal cards.
* **Added:** `about.html` — history, mission/vision and team.
* **Added:** `services.html` — adoption process, foster programme and a
genuine data table of community outreach dates.
* **Added:** `enquiry.html` — one form covering adopt / foster / volunteer
/ sponsor enquiries, using radio buttons plus a shared message field.
* **Added:** `contact.html` — two locations, opening-hours table, and a
contact form.
* **Fixed:** A CSS selector bug where `.stats div` was accidentally
matching the page's `.container` wrapper as well as the four stat boxes,
causing them to overlap instead of sitting side by side. Fixed by giving
the stat boxes their own class (`.stat-box`) instead of relying on the
bare `div` selector.
* **Added:** Content research package (`/content-research`, submitted as a
separate ZIP) and this README.

## 

## References

References for the general web-development standards and licensing
information used throughout this project (organisation-specific references
for Paws \& Hope and Sunrise Bakehouse appear at the end of each proposal in
the Website Project Proposal document):

CIPC (n.d.) *Domain Name Registration*. Available at: https://www.cipc.co.za/?page\_id=4565 (Accessed: 14 August 2026).

Creative Commons (n.d.) *About CC Licenses*. Available at: https://creativecommons.org/share-your-work/cclicenses/ (Accessed: 14 August 2026).

Department of Social Development (n.d.) *About Us — Register of Nonprofit Organisations in South Africa*. Available at: https://www.dsd.gov.za/index.php/npo/about-us (Accessed: 14 August 2026).

Mozilla Developer Network (n.d.) *HTML elements reference*. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements (Accessed: 14 August 2026).

South African Government (n.d.) *Register a nonprofit organisation*. Available at: https://www.gov.za/services/register-nonprofit-organisation (Accessed: 14 August 2026).

World Wide Web Consortium (W3C) (n.d.) *WCAG 2 at a Glance*. Web Accessibility Initiative (WAI). Available at: https://www.w3.org/WAI/standards-guidelines/wcag/glance/ (Accessed: 14 August 2026).

