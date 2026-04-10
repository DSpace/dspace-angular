# Bhasha Sanchika — Custom DSpace Theme Documentation

> **Project:** CIIL Bhasha Sanchika Repository
> **Base Platform:** DSpace Angular 9.2
> **Theme Name:** `custom`
> **Theme Location:** `src/themes/custom/`

---

## Overview

This document describes the custom UI theme built on top of the default DSpace Angular 9.2 installation for the Bhasha Sanchika digital repository. All changes are confined to the `src/themes/custom/` folder and do not alter any base DSpace application files.

The theme uses a consistent **navy blue (`#1A365D`) and gold (`#D69E2E`)** color scheme with the Poppins font throughout. Every redesigned page follows a shared layout: a navy hero banner at the top, with a white content card that visually overlaps the bottom of the hero.

---

## How to Start the Dev Server

```bash
cd /home/dspace/angular
npm install       # first time only
npm start         # starts dev server at http://localhost:4000
```

After editing HTML or SCSS files, the browser refreshes automatically.
After editing TypeScript (`.ts`) files, restart the dev server.

---

## Pages & Components Changed

---

### 1. Header (Navigation Bar)
- Replaced the default DSpace navbar with a custom dark-themed navigation bar
- Added the Bhasha Sanchika logo on the left
- Navigation links: Browse, Section, Stats, About, Log In, Language switcher
- Added a hover underline animation on nav links

---

### 2. Footer
- Replaced the default DSpace footer with a custom dark-gradient footer
- Four-column layout: quick links, policy links, contact address, social media icons
- Added a black copyright bar at the bottom

---

### 3. Home Page
- Complete redesign of the landing page
- Added a hero section with a background image, main heading, and a search bar
- Added a statistics bar showing total items, communities, and downloads
- Added a feature cards section ("Explore Our Collection")
- Added a Bhasha Mandakini highlight section
- Added an associated organisations logo strip

---

### 4. Community Page
- Redesigned the community detail page (`/communities/{uuid}`)
- Added a hero section with the community name
- Added a stats bar (item count, sub-communities, collections)
- Added browse filter tab buttons (All, Audio, Video, Text, Image, etc.)
- Collections displayed in a responsive card grid with thumbnails

---

### 5. Item Simple View (Publication & Untyped Items)
- Redesigned the item detail page (`/items/{uuid}`) for all item types
- Added a hero section with the item title as subtitle
- Added a left sidebar with:
  - **Contents navigation** — clicking Overview / Who / What / When smoothly scrolls to the respective section on the page
  - **Utility buttons** — Download, Cite, Share
  - **Share button** — expands to show Facebook, LinkedIn, and X (Twitter) sharing buttons that open in a popup window
- Main content divided into four named sections: Overview, Who (authors), What (subjects/type/language), When (dates)
- Added a "Date Created" field to the When section

---

### 6. Full Item Record Page
- Redesigned the full metadata view (`/items/{uuid}/full`)
- Added a hero section with "Item Record" heading
- Added a top bar with a "Simple View" back button and the DSpace edit menu
- Displayed all metadata in a styled table with navy header row and monospace field names
- Files, Collections, and Versions sections retained and restyled

---

### 7. Search Results Page
- Redesigned the global search page (`/search?query=...`)
- Added a hero section with "Search Results" heading
- The DSpace search component (filters sidebar + results) is wrapped inside a white card
- Sidebar background filled to the full card height using a CSS gradient technique
- Search form and filter headings restyled to match the navy/gold theme

---

### 8. Browse Pages
- Redesigned the Browse by Metadata page (browse by author, subject, etc.)
- Redesigned the Browse by Title page
- Both pages have a hero section and a white content card matching the overall theme

---

### 9. About Page
- Redesigned the About page (`/info/about`)
- Added a hero section
- Content organized into four tabs: SPPEL, Bhasha Mandakini, Bharatavani, CIIL Publications
- Each tab shows a brief description of that project/initiative

---

### 10. Contributors Page
- Redesigned the Contributors page (`/info/contributors`)
- Added a hero section
- Added three feature cards describing the nature of contributions (Community, Technology, Scholarship)
- Contributor groups displayed in an accordion (click to expand/collapse each section)

---

### 11. Other Info Pages
- Help, Privacy Policy, End User Agreement, Feedback pages all redesigned with the consistent hero + white card layout

---

### 12. Statistics Page
- Site statistics page redesigned with the hero + card layout

---

## Sharing This Theme

To use this theme on another DSpace Angular 9.2 installation:

1. Copy the `src/themes/custom/` folder into the target installation
2. In `src/environments/environment.ts`, add `{ name: 'custom' }` as the first entry in the `themes` array
3. Run `npm install` then `npm run build` (or `npm start` for development)

The custom theme falls back to the default DSpace theme for any page it does not override, so no default functionality is broken.
