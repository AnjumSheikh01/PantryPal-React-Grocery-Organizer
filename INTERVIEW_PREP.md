# PantryPal — Interview Preparation

Use these as study prompts. Practice answering in your own words and refer to the code when needed; don't memorize a script that doesn't reflect your understanding.

## Project explanation (60–90 seconds)

“PantryPal is a responsive pantry inventory and grocery-list application I built with React, JavaScript, and CSS. It helps users track ingredients, note best-before dates, see items that need to be used soon, and manage a shopping list. I implemented create, edit, delete, search, and category/status filters, alongside derived inventory and shopping cost estimates. Data is persisted in localStorage, so it remains after a refresh on the same browser. One design decision was to keep the project API-free and focus on reliable client-side interactions. Its current limitation is that data is not synced between devices because there is no backend.”

Adapt this after you've run, tested, and personalized the project.

## Technical questions and key points

### 1. Why did you choose React?
React lets the UI respond to changes in state and encourages reusable components. Cards and repeated lists can be rendered from data rather than manually changing DOM nodes.

### 2. What is the difference between props and state?
Props are inputs passed from a parent component. State is data owned by a component and can change over time, triggering a render.

### 3. Why is `useState` used here?
Inventory records, shopping-list records, filters, navigation, and form values change based on user actions. State allows React to render the current values.

### 4. What does `useEffect` do in this project?
Effects persist item and list state to localStorage when those values change. The lazy initializer reads stored data during the initial state setup.

### 5. Why use localStorage instead of sessionStorage?
localStorage normally remains after a tab or browser is closed. sessionStorage is scoped to a tab session. Neither is a secure database or cloud sync system.

### 6. Why use JSON.stringify and JSON.parse?
localStorage stores strings. `JSON.stringify` serializes arrays/objects into a string, and `JSON.parse` restores the structured value.

### 7. Explain CRUD in PantryPal.
Create adds a new inventory record, read displays records, update maps the array and replaces the matching ID, and delete filters out the matching ID.

### 8. Why does each item have an ID?
A stable unique ID identifies a record for React list keys and for update/delete actions. An array index can change when rows are inserted or removed.

### 9. How does the expiry reminder work?
The helper compares the local calendar date with the item's best-before date and returns the difference in days. Records from today through three days ahead are considered upcoming; negative differences are overdue. Missing dates must be handled separately.

### 10. What is a derived value? Give examples.
A value computed from existing state rather than stored separately. Inventory value, expiring items, filtered results, and shopping totals are derived from the underlying arrays. This avoids stale duplicated state.

### 11. What is the purpose of `useMemo`?
It memoizes a calculation between renders while dependencies have not changed. It can help avoid repeating work for derived lists, but should be used when useful—not as a requirement for every calculation.

### 12. How does filtering work?
The app checks the search text, selected category, and status predicate for each item and returns only records that satisfy the selected conditions.

### 13. How does CSV export work?
Rows are converted into strings, fields are quoted, embedded quote characters are escaped, and a Blob URL is created to trigger a browser download.

### 14. What responsive techniques are used?
CSS Grid and Flexbox organize panels and cards; media queries adjust columns, spacing, navigation, and forms at smaller widths.

### 15. How would you test this app?
Test form validation, CRUD flows, expiry boundaries (yesterday, today, and three days ahead), search/filter combinations, persisted data after refresh, CSV output, and mobile layouts. Add automated unit tests around pure date and calculation helpers.

### 16. What are the current limitations?
Data is local to one browser, there is no login or backend, prices are user-entered estimates, and mixed quantity units limit what inventory-value calculations can mean.

### 17. How would you add cloud sync?
Create an API and database, add authentication and user-scoped records, validate input on the server, handle errors and loading states, and define conflict behavior for edits across devices.

### 18. What security considerations matter?
Do not store passwords or secret API keys in frontend code or localStorage. Validate user input where relevant and avoid rendering user-provided strings as raw HTML. A backend would need authorization checks and validation for each record.

### 19. Why shouldn't every value be kept in state?
Derived totals can become inconsistent if updated separately from source data. Computing them from the inventory/list state gives one source of truth.

### 20. What would you improve first?
A credible answer might be test coverage for expiry boundaries, a quantity decrement action, delete confirmation/undo, or clearer unit-price semantics. Choose a real improvement you actually implement.

## Behavioral and non-technical questions

### Why did you choose this project?
Use a truthful answer about a real everyday problem you wanted to explore, such as forgetting items or duplicating grocery purchases.

### What was a challenge?
Talk about a specific bug or design trade-off you actually encountered, the evidence you used to diagnose it, what you changed, and how you tested the fix.

### What did you personally implement?
Be accurate about your use of references or mentoring. Be ready to explain the code you modified and the decisions you made.

### How did you prioritize features in a one-day build?
Explain how you chose the smallest end-to-end set of features first, then kept stretch goals separate.

### What would you do differently with more time?
Give a concrete, prioritized next step and explain its benefit.

## Prepare before an interview

- Run the app and demonstrate one add/edit/delete flow.
- Explain one expiry-date edge case.
- Show where state is saved to localStorage.
- Explain the limitations of localStorage.
- Inspect an exported CSV.
- Be ready to discuss what you personally changed and tested.
