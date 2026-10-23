# PantryPal — Smart Grocery Organizer

PantryPal is a responsive pantry and grocery organizer built with React, JavaScript, CSS, and Vite. It helps people see what they have at home, keep an eye on expiry dates, and plan their next shopping trip.

> This is a self-contained frontend project. It uses ordinary JavaScript logic and browser `localStorage`; it does not use AI services or require paid APIs. The included inventory is illustrative sample data.

## Features

- Dashboard overview with pantry count, estimated inventory value, items to use soon, and shopping-list summary.
- Create and edit pantry items with category, quantity, unit, expiry date, unit price, storage location, and a note.
- Delete items or mark an item as used from the expiry reminder list.
- Search inventory and filter by category, expiry status, or low stock.
- Add inventory items to a shopping list, add custom list entries, check off purchases, and remove entries.
- Estimate shopping cost from the entered prices.
- Insights by category and storage location.
- Export pantry inventory to CSV.
- Responsive layout for desktop and mobile.
- Data is saved in localStorage and remains after refreshing the browser on the same profile/device.

## Tech stack

- React (functional components and hooks)
- JavaScript (ES modules, array methods, dates, derived calculations)
- CSS (responsive grid/flex layouts, custom visual system, animations, reduced-motion support)
- Vite (development server and build tool)
- Lucide React (icons)
- Browser localStorage (local persistence)

## Run locally

Requirements: Node.js and npm installed.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

Create a production build with:

```bash
npm run build
npm run preview
```

If PowerShell blocks `npm.ps1` on Windows, use the Windows command shim:

```powershell
npm.cmd install
npm.cmd run dev
```

## Main folders

```text
pantrypal/
├── index.html
├── package.json
├── README.md
├── PROJECT_JOURNAL.md
├── INTERVIEW_PREP.md
└── src/
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```

## Data and privacy

PantryPal saves inventory and shopping-list entries in the browser's localStorage. There is no backend or account system. Data does not automatically sync to another device or browser. Use the “Restore sample data” button in the sidebar to reset the local demo data; this replaces the current saved demo data.

## Known limitations and next improvements

- Prices and inventory values are estimates entered by the user; no retailer prices are fetched.
- The app is a single-user frontend prototype; there is no login or cloud sync.
- Sample data is provided for demonstration and should be replaced with your own test entries before taking portfolio screenshots.
- Further improvements could include quantity decrement controls, confirmation/undo for deletion, unit-aware quantity math, browser notifications, automated tests, and a backend if multi-device sync is needed.

## Portfolio note

Personalize the content, test the interactions, take your own screenshots, and update this README with what you changed and learned before publishing. Avoid claiming features that have not been tested in your local environment.
