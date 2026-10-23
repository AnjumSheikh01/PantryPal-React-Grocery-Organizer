# PantryPal — Project Journal

## 1. Project summary

PantryPal is a pantry inventory and grocery-list web app. The main idea is to give a household one place to see its ingredients, remember best-before dates, and avoid buying duplicates. The app is built as a client-side React application using ordinary JavaScript and browser storage. It has no AI integration and no paid API dependency.

## 2. Problem statement

Food items are often forgotten at the back of a fridge or cupboard. People may buy something they already have, forget its expiry date, or arrive at the store without a consistent shopping list. A small inventory tool can reduce that friction by making pantry information easier to see and update.

## 3. Goals

- Add, edit, and remove pantry items.
- Record category, quantity, unit, location, price, and best-before date.
- Show reminders for items expiring today or within the next three days, as well as overdue items.
- Search and filter the inventory.
- Build and check off a shopping list.
- Calculate approximate inventory and shopping-list values.
- Preserve changes when the page is refreshed.
- Keep the interface clear and usable on smaller screens.

## 4. Intended users

Students living away from home, roommates, busy households, and anyone who wants a lightweight way to organize ingredients and shopping.

## 5. Stack and why it was chosen

- **React:** reusable UI and state-driven rendering.
- **JavaScript:** date calculations, filtering, derived totals, CSV generation, and event handling.
- **CSS:** custom responsive visual layout, category color system, hover states, and reduced-motion handling.
- **Vite:** fast local development and production build tooling.
- **localStorage:** simple same-browser persistence without a backend.
- **Lucide React:** consistent interface icons.

## 6. Feature and implementation notes

### Pantry data model

Each inventory object stores `id`, `name`, `category`, `quantity`, `unit`, `expiry`, `price`, `location`, `emoji`, and `note`. A stable ID allows React to identify each record and makes edit/delete operations straightforward.

### CRUD operations

- **Create:** the add-item form validates the item name and normalizes numeric fields before appending a record.
- **Read:** inventory cards, overview summaries, reminders, and insights are derived from the same `items` state.
- **Update:** editing replaces the matching object while retaining its ID.
- **Delete:** deletion filters the matching ID out of the array.

### Expiry date handling

The `daysUntil` helper normalizes the comparison to calendar dates and computes the difference in days. This powers the “Use these next” panel and expiry filters. An item with no expiry date should not be treated as expiring.

### Derived calculations

- Inventory value = sum of quantity × user-entered unit price.
- Shopping estimate = sum of prices for unchecked shopping-list entries.
- Category distribution counts items by category.
- Expiring inventory is computed from the actual date at runtime, so seed dates remain relative to the day the sample is created.

These estimates depend on the meaning of the entered unit price and quantity. Mixed units such as grams and pieces cannot be economically compared without more detailed unit modeling; this is a prototype calculation, not an accounting result.

### Persistence

The app saves pantry items and shopping-list entries in two localStorage keys. The app reads the saved data on startup and writes state changes back. localStorage is local to the current browser profile and is not a database or cross-device sync solution.

### CSV export

The export action serializes the inventory into CSV with quoted values and escapes embedded quote characters before downloading the file.

## 7. Testing checklist

- [ ] Add a new item with a name, category, quantity, date, and price.
- [ ] Edit that item and check that it does not create a duplicate.
- [ ] Delete the item and confirm it disappears from totals and cards.
- [ ] Search by item name and filter by category.
- [ ] Verify “Expiring soon” shows only dates from today through three days ahead.
- [ ] Verify expired items are shown separately from upcoming expiry items.
- [ ] Check and uncheck a shopping-list row.
- [ ] Add a custom shopping-list entry, then remove it.
- [ ] Export CSV and inspect the downloaded file.
- [ ] Refresh the page and check that changes remain.
- [ ] Check desktop, tablet, and narrow mobile widths.
- [ ] Verify the layout and controls can be reached by keyboard.

## 8. Limitations

- No authentication, shared pantry, cloud sync, or backend.
- No retailer integration or automatic pricing.
- Browser storage may be cleared by the user or browser.
- Seed/demo data is illustrative and should not be mistaken for real household inventory.
- Date handling is based on local calendar dates; more complex time zones and time-of-day expiry are out of scope.
- Unit conversions and quantity-aware pricing require a more explicit product/unit model.

## 9. Potential future work

1. Add controls to consume/decrement stock.
2. Add confirmation and undo for destructive actions.
3. Add meal ideas based strictly on user-selected available ingredients (rule-based, not AI).
4. Add tests for expiry-date boundaries and inventory calculations.
5. Add optional import from and export to JSON for backup/restore.
6. Add a small backend and authentication only if cross-device use becomes a real requirement.

## 10. What I learned / should be able to explain

- Controlled forms and event handlers in React.
- Keeping a single source of truth in state.
- Deriving totals with `reduce` instead of maintaining duplicate totals.
- Filtering data with `filter` and matching categories with `includes`/string normalization.
- Why IDs are more reliable than array indexes for edit/delete actions.
- How to store and restore structured data using JSON and localStorage.
- The difference between UI state, persistent browser data, and backend storage.
- How to calculate date-based reminders and handle missing dates safely.
- How responsive CSS layouts change across viewport sizes.
