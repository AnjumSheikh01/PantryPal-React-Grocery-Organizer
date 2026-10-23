import { useEffect, useMemo, useState } from 'react';
import {
  Apple, Archive, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, Check,
  CheckCheck, ChevronDown, CircleHelp, Clock3, CookingPot, Download, Edit3,
  Filter, LayoutDashboard, Leaf, ListChecks, Menu, MoreHorizontal, Plus,
  Search, ShoppingBasket, ShoppingCart, SlidersHorizontal, Sparkles, Trash2,
  TrendingDown, Wallet, Wheat, X, Package, Refrigerator, Carrot, Milk,
  Coffee, CircleCheck, AlertTriangle, Sprout, Minus, RotateCcw
} from 'lucide-react';

const STORAGE_KEY = 'pantrypal-items-v1';
const LIST_KEY = 'pantrypal-shopping-v1';
const CATEGORIES = ['Produce', 'Dairy', 'Pantry', 'Bakery', 'Protein', 'Snacks', 'Beverages', 'Frozen', 'Other'];
const CATEGORY_META = {
  Produce: { emoji: '🥑', color: 'green' }, Dairy: { emoji: '🥛', color: 'blue' }, Pantry: { emoji: '🌾', color: 'gold' },
  Bakery: { emoji: '🥖', color: 'orange' }, Protein: { emoji: '🥚', color: 'pink' }, Snacks: { emoji: '🍿', color: 'purple' },
  Beverages: { emoji: '🫖', color: 'blue' }, Frozen: { emoji: '🧊', color: 'cyan' }, Other: { emoji: '🧺', color: 'gold' }
};
const toISO = (d) => { const date = new Date(d); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return toISO(d); };
const daysUntil = (iso) => { if (!iso) return null; const today = new Date(); today.setHours(0,0,0,0); const target = new Date(`${iso}T00:00:00`); return Math.round((target - today) / 86400000); };
const formatDate = (iso) => iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'No date';
const money = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n) || 0);
const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const initialItems = [
  { id: 'p1', name: 'Avocado', category: 'Produce', quantity: 2, unit: 'pcs', expiry: addDays(1), price: 75, location: 'Fridge', emoji: '🥑', note: 'Perfect for toast' },
  { id: 'p2', name: 'Farm fresh eggs', category: 'Protein', quantity: 6, unit: 'pcs', expiry: addDays(4), price: 8, location: 'Fridge', emoji: '🥚', note: '' },
  { id: 'p3', name: 'Oat milk', category: 'Dairy', quantity: 1, unit: 'carton', expiry: addDays(7), price: 125, location: 'Fridge', emoji: '🥛', note: '' },
  { id: 'p4', name: 'Sourdough bread', category: 'Bakery', quantity: 1, unit: 'loaf', expiry: addDays(2), price: 90, location: 'Counter', emoji: '🍞', note: 'Freeze half if needed' },
  { id: 'p5', name: 'Basmati rice', category: 'Pantry', quantity: 2, unit: 'kg', expiry: addDays(180), price: 82, location: 'Cupboard', emoji: '🍚', note: '' },
  { id: 'p6', name: 'Baby spinach', category: 'Produce', quantity: 1, unit: 'pack', expiry: addDays(0), price: 45, location: 'Fridge', emoji: '🥬', note: 'Use today' },
  { id: 'p7', name: 'Greek yogurt', category: 'Dairy', quantity: 2, unit: 'cups', expiry: addDays(5), price: 35, location: 'Fridge', emoji: '🥣', note: '' },
  { id: 'p8', name: 'Cherry tomatoes', category: 'Produce', quantity: 1, unit: 'box', expiry: addDays(3), price: 60, location: 'Fridge', emoji: '🍅', note: '' },
  { id: 'p9', name: 'Chickpeas', category: 'Pantry', quantity: 3, unit: 'cans', expiry: addDays(240), price: 55, location: 'Cupboard', emoji: '🫘', note: '' },
  { id: 'p10', name: 'Coffee beans', category: 'Beverages', quantity: 250, unit: 'g', expiry: addDays(60), price: 280, location: 'Cupboard', emoji: '☕', note: '' },
  { id: 'p11', name: 'Frozen peas', category: 'Frozen', quantity: 1, unit: 'bag', expiry: addDays(90), price: 95, location: 'Freezer', emoji: '🫛', note: '' },
  { id: 'p12', name: 'Almonds', category: 'Snacks', quantity: 150, unit: 'g', expiry: addDays(30), price: 160, location: 'Cupboard', emoji: '🥜', note: '' }
];
const defaultList = [
  { id: 's1', name: 'Bananas', quantity: '6 pcs', done: false, category: 'Produce', price: 45 },
  { id: 's2', name: 'Paneer', quantity: '200 g', done: false, category: 'Dairy', price: 85 },
  { id: 's3', name: 'Whole wheat atta', quantity: '1 kg', done: true, category: 'Pantry', price: 55 },
  { id: 's4', name: 'Lemon', quantity: '4 pcs', done: false, category: 'Produce', price: 30 }
];
function load(key, fallback) { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }

function IconTile({ category, emoji, small = false }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.Other;
  return <div className={`food-tile ${meta.color} ${small ? 'small' : ''}`} aria-hidden="true">{emoji || meta.emoji}</div>;
}
function SectionTitle({ eyebrow, title, subtitle, right }) { return <div className="section-title"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{right && <div className="section-actions">{right}</div>}</div>; }
function App() {
  const [items, setItems] = useState(() => load(STORAGE_KEY, initialItems));
  const [shopping, setShopping] = useState(() => load(LIST_KEY, defaultList));
  const [page, setPage] = useState('Overview');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All categories');
  const [statusFilter, setStatusFilter] = useState('All items');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [shoppingInput, setShoppingInput] = useState('');
  const [shoppingQty, setShoppingQty] = useState('1');
  const [form, setForm] = useState({ name: '', category: 'Produce', quantity: '1', unit: 'pcs', expiry: addDays(7), price: '', location: 'Fridge', note: '' });
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem(LIST_KEY, JSON.stringify(shopping)); }, [shopping]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2600); return () => clearTimeout(t); }, [toast]);

  const expiring = useMemo(() => items.filter(i => daysUntil(i.expiry) !== null && daysUntil(i.expiry) >= 0 && daysUntil(i.expiry) <= 3).sort((a,b) => daysUntil(a.expiry) - daysUntil(b.expiry)), [items]);
  const expired = useMemo(() => items.filter(i => daysUntil(i.expiry) !== null && daysUntil(i.expiry) < 0), [items]);
  const inventoryValue = useMemo(() => items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0), [items]);
  const filteredItems = useMemo(() => items.filter(i => {
    const matchesQuery = `${i.name} ${i.category} ${i.location}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All categories' || i.category === category;
    const days = daysUntil(i.expiry);
    const matchesStatus = statusFilter === 'All items' || (statusFilter === 'Expiring soon' && days !== null && days >= 0 && days <= 3) || (statusFilter === 'Expired' && days !== null && days < 0) || (statusFilter === 'Low stock' && Number(i.quantity) <= 1);
    return matchesQuery && matchesCategory && matchesStatus;
  }), [items, query, category, statusFilter]);
  const checkedCount = shopping.filter(i => i.done).length;
  const listTotal = shopping.filter(i => !i.done).reduce((sum, i) => sum + Number(i.price || 0), 0);
  const categoryCounts = useMemo(() => CATEGORIES.map(name => ({ name, count: items.filter(i => i.category === name).length, value: items.filter(i => i.category === name).reduce((sum,i) => sum + Number(i.price || 0) * Number(i.quantity || 0), 0) })).filter(x => x.count).sort((a,b) => b.count-a.count), [items]);
  const showToast = (message) => setToast(message);
  const openAdd = () => { setEditing(null); setForm({ name: '', category: 'Produce', quantity: '1', unit: 'pcs', expiry: addDays(7), price: '', location: 'Fridge', note: '' }); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); setForm({ ...item, quantity: String(item.quantity), price: String(item.price), expiry: item.expiry || '' }); setModalOpen(true); };
  const submitItem = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const payload = { ...form, name: form.name.trim(), quantity: Math.max(0, Number(form.quantity) || 0), price: Math.max(0, Number(form.price) || 0), id: editing?.id || newId(), emoji: editing?.emoji || (CATEGORY_META[form.category]?.emoji || '🧺') };
    setItems(prev => editing ? prev.map(i => i.id === editing.id ? payload : i) : [payload, ...prev]);
    setModalOpen(false); showToast(editing ? 'Pantry item updated' : 'Added to your pantry');
  };
  const deleteItem = (id) => { setItems(prev => prev.filter(i => i.id !== id)); showToast('Item removed from pantry'); };
  const addToShopping = (item) => { setShopping(prev => prev.some(s => s.name.toLowerCase() === item.name.toLowerCase() && !s.done) ? prev : [{ id: newId(), name: item.name, quantity: `${item.quantity} ${item.unit}`, done: false, category: item.category, price: Number(item.price) * Number(item.quantity) }, ...prev]); showToast(`${item.name} added to shopping list`); };
  const addCustomShopping = (e) => { e.preventDefault(); if (!shoppingInput.trim()) return; setShopping(prev => [{ id: newId(), name: shoppingInput.trim(), quantity: `${shoppingQty || '1'} item${shoppingQty === '1' ? '' : 's'}`, done: false, category: 'Other', price: 0 }, ...prev]); setShoppingInput(''); setShoppingQty('1'); showToast('Added to shopping list'); };
  const toggleShopping = (id) => setShopping(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  const deleteShopping = (id) => setShopping(prev => prev.filter(i => i.id !== id));
  const resetSample = () => { if (window.confirm('Reset the pantry and shopping list to the sample data? Your current changes will be replaced.')) { setItems(initialItems); setShopping(defaultList); showToast('Sample data restored'); } };
  const exportCSV = () => { const header = ['Name','Category','Quantity','Unit','Expiry date','Unit price (INR)','Location','Note']; const rows = items.map(i => [i.name,i.category,i.quantity,i.unit,i.expiry,i.price,i.location,i.note]); const csv = [header,...rows].map(row => row.map(cell => `"${String(cell ?? '').replaceAll('"','""')}"`).join(',')).join('\r\n'); const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); const a = document.createElement('a'); a.href = url; a.download = 'pantrypal-inventory.csv'; a.click(); URL.revokeObjectURL(url); showToast('Inventory exported as CSV'); };

  const nav = [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'My pantry', icon: Refrigerator, count: items.length },
    { label: 'Shopping list', icon: ShoppingBasket, count: shopping.filter(i => !i.done).length }, { label: 'Insights', icon: Sprout }
  ];
  const pageTitle = page === 'Overview' ? 'Your kitchen, in good shape.' : page === 'My pantry' ? 'Everything in its place.' : page === 'Shopping list' ? 'Your next grocery run.' : 'Small habits, less waste.';
  const pageSubtitle = page === 'Overview' ? 'A little overview of what’s fresh, what’s running low, and what’s for dinner.' : page === 'My pantry' ? 'Keep tabs on your ingredients and use the good stuff before it goes.' : page === 'Shopping list' ? 'Everything you need, in one easy-to-check list.' : 'A clearer picture of the food you keep and the value you make of it.';

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="brand-row"><div className="brand-icon"><Leaf size={21} strokeWidth={2.4}/></div><div className="brand-text">pantry<span>pal</span><small>MAKE ROOM FOR GOOD FOOD</small></div><button className="icon-button mobile-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X size={18}/></button></div>
      <div className="home-label">YOUR SPACE</div>
      <nav className="nav-list" aria-label="Main navigation">{nav.map(({ label, icon: Icon, count }) => <button key={label} className={`nav-item ${page === label ? 'active' : ''}`} onClick={() => { setPage(label); setMobileMenuOpen(false); }}><Icon size={18}/><span>{label}</span>{count !== undefined && <span className="nav-count">{count}</span>}</button>)}</nav>
      <div className="sidebar-card"><div className="sidebar-card-art"><span>🥬</span><span>🍅</span><span>🥑</span></div><div className="sidebar-card-title">Love your leftovers</div><p>Use what's already in your kitchen before buying more.</p><button onClick={() => setPage('My pantry')}>Explore pantry <ArrowUpRight size={14}/></button></div>
      <div className="sidebar-bottom"><div className="avatar">A</div><div className="profile-copy"><strong>My kitchen</strong><span>Personal space</span></div><button className="icon-button" aria-label="Restore sample data" title="Restore sample data" onClick={resetSample}><RotateCcw size={16}/></button></div>
    </aside>
    {mobileMenuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)}/>}

    <main className="main-area">
      <header className="topbar"><div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{page}</strong></div><div className="topbar-right"><div className="today-pill"><CalendarDays size={15}/>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</div><button className="icon-button notification-button" aria-label={`${expiring.length} items expiring soon`} title={`${expiring.length} items expiring soon`} onClick={() => { setPage('My pantry'); setStatusFilter('Expiring soon'); }}><Bell size={18}/>{expiring.length > 0 && <span className="notification-dot"/>}</button><button className="mobile-menu-button icon-button" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation"><Menu size={20}/></button></div></header>

      <div className="page-content">
        <section className="welcome-row"><div><div className="eyebrow greeting"><Sparkles size={14}/> YOUR KITCHEN COMPANION</div><h1>{pageTitle}</h1><p>{pageSubtitle}</p></div><div className="welcome-actions"><button className="button button-quiet" onClick={exportCSV}><Download size={16}/> Export data</button><button className="button button-primary" onClick={openAdd}><Plus size={17}/> Add an item</button></div></section>

        {page === 'Overview' && <>
          <section className="stat-grid">
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Pantry items</span><span className="stat-icon icon-sage"><Archive size={18}/></span></div><div className="stat-value">{items.length}<span className="stat-unit"> items</span></div><div className="stat-foot"><span className="foot-dot green-dot"/>Across {new Set(items.map(i => i.category)).size} categories</div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Use soon</span><span className="stat-icon icon-apricot"><Clock3 size={18}/></span></div><div className="stat-value">{expiring.length + expired.length}<span className="stat-unit"> items</span></div><div className="stat-foot"><span className="foot-dot orange-dot"/>{expired.length ? `${expired.length} past date` : 'Expiring in the next 3 days'}</div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Pantry value</span><span className="stat-icon icon-blue"><Wallet size={18}/></span></div><div className="stat-value stat-money">{money(inventoryValue)}</div><div className="stat-foot"><span className="foot-dot blue-dot"/>Based on quantity × unit price</div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Shopping list</span><span className="stat-icon icon-lilac"><ShoppingBasket size={18}/></span></div><div className="stat-value">{shopping.filter(i => !i.done).length}<span className="stat-unit"> to get</span></div><div className="stat-foot"><span className="foot-dot lilac-dot"/>{money(listTotal)} estimated cost</div></article>
          </section>

          <section className="overview-grid">
            <article className="panel expiry-panel"><div className="panel-heading"><div><div className="panel-kicker">DON'T LET IT GO TO WASTE</div><h3>Use these next <span className="heading-leaf">✳</span></h3></div><button className="text-button" onClick={() => { setPage('My pantry'); setStatusFilter('Expiring soon'); }}>See all <ArrowUpRight size={15}/></button></div>
              {expiring.length === 0 && expired.length === 0 ? <div className="empty-inline"><div className="empty-illustration">🥦</div><strong>All looking fresh!</strong><span>Nothing is expiring in the next 3 days.</span></div> : <div className="expiry-list">{[...expired, ...expiring].slice(0,4).map(item => { const n = daysUntil(item.expiry); return <div className="expiry-row" key={item.id}><IconTile category={item.category} emoji={item.emoji} small/><div className="expiry-info"><strong>{item.name}</strong><span>{item.quantity} {item.unit} · {item.location}</span></div><span className={`expiry-badge ${n < 0 ? 'expired' : n === 0 ? 'today' : n === 1 ? 'tomorrow' : ''}`}>{n < 0 ? `${Math.abs(n)}d overdue` : n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : `${n} days`}</span><button className="mini-action" title="Mark as used" aria-label={`Mark ${item.name} as used`} onClick={() => { setItems(prev => prev.filter(i => i.id !== item.id)); showToast(`${item.name} marked as used`); }}><Check size={15}/></button></div>; })}</div>}
              <div className="panel-bottom-note"><Leaf size={15}/><span>Little reminders can make a big difference.</span></div>
            </article>
            <article className="panel list-panel"><div className="panel-heading"><div><div className="panel-kicker">READY WHEN YOU ARE</div><h3>Shopping list</h3></div><button className="round-add" onClick={() => setPage('Shopping list')} aria-label="Open shopping list"><ArrowUpRight size={17}/></button></div>
              <div className="shopping-progress"><div className="progress-copy"><span>{checkedCount} of {shopping.length} picked up</span><strong>{shopping.length ? Math.round(checkedCount/shopping.length*100) : 0}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${shopping.length ? checkedCount/shopping.length*100 : 0}%` }}/></div></div>
              <div className="preview-list">{shopping.slice(0,4).map(item => <button key={item.id} className={`preview-item ${item.done ? 'done' : ''}`} onClick={() => toggleShopping(item.id)}><span className={`custom-check ${item.done ? 'checked' : ''}`}>{item.done && <Check size={12}/>}</span><span className="preview-name">{item.name}</span><span className="preview-qty">{item.quantity}</span></button>)}{shopping.length === 0 && <div className="empty-small">Your shopping list is clear. Add something you need.</div>}</div>
              <button className="button button-outline full-button" onClick={() => setPage('Shopping list')}>Open shopping list <ArrowUpRight size={15}/></button>
            </article>
          </section>

          <section className="panel pantry-preview-panel"><div className="panel-heading"><div><div className="panel-kicker">A QUICK LOOK AROUND</div><h3>Recently added to your pantry</h3></div><button className="text-button" onClick={() => setPage('My pantry')}>View pantry <ArrowUpRight size={15}/></button></div><div className="recent-grid">{items.slice(0,4).map(item => <div className="recent-card" key={item.id}><IconTile category={item.category} emoji={item.emoji}/><div className="recent-card-info"><strong>{item.name}</strong><span>{item.quantity} {item.unit}</span><span className="recent-expiry">{daysUntil(item.expiry) < 0 ? 'Past date' : `Best by ${formatDate(item.expiry)}`}</span></div><button className="recent-more" aria-label={`Edit ${item.name}`} onClick={() => openEdit(item)}><Edit3 size={15}/></button></div>)}</div></section>
        </>}

        {page === 'My pantry' && <section className="panel full-panel"><div className="inventory-toolbar"><div className="search-box"><Search size={17}/><input aria-label="Search pantry" placeholder="Search your pantry..." value={query} onChange={e => setQuery(e.target.value)}/>{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={15}/></button>}</div><div className="filter-group"><SlidersHorizontal size={16}/><select aria-label="Filter by category" value={category} onChange={e => setCategory(e.target.value)}><option>All categories</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select><select aria-label="Filter by status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>All items</option><option>Expiring soon</option><option>Expired</option><option>Low stock</option></select></div></div><div className="inventory-summary"><span><strong>{filteredItems.length}</strong> items found</span><span>Pantry value <strong>{money(filteredItems.reduce((sum,i) => sum + Number(i.price)*Number(i.quantity),0))}</strong></span></div>
          {filteredItems.length === 0 ? <div className="empty-inline large-empty"><div className="empty-illustration">🧺</div><strong>Nothing found here</strong><span>Try a different search or add a new pantry item.</span><button className="button button-primary" onClick={openAdd}><Plus size={16}/> Add an item</button></div> : <div className="inventory-grid">{filteredItems.map(item => { const days = daysUntil(item.expiry); return <article className="inventory-card" key={item.id}><div className="inventory-card-top"><IconTile category={item.category} emoji={item.emoji}/><button className="icon-button card-menu" title="Edit item" onClick={() => openEdit(item)}><MoreHorizontal size={19}/></button></div><div className="inventory-card-main"><span className={`category-label ${CATEGORY_META[item.category]?.color || 'gold'}`}>{item.category}</span><h3>{item.name}</h3><div className="inventory-qty">{item.quantity} <span>{item.unit}</span></div></div><div className="inventory-card-meta"><span className={`date-status ${days < 0 ? 'status-expired' : days <= 3 ? 'status-soon' : ''}`}><Clock3 size={13}/>{days < 0 ? `Expired ${formatDate(item.expiry)}` : `Best by ${formatDate(item.expiry)}`}</span><span>{money(item.price)}<small> / unit</small></span></div><div className="inventory-card-bottom"><span className="location-label"><Package size={13}/>{item.location}</span><div className="card-actions"><button title="Add to shopping list" onClick={() => addToShopping(item)}><ShoppingCart size={15}/></button><button title="Edit item" onClick={() => openEdit(item)}><Edit3 size={15}/></button><button title="Delete item" onClick={() => deleteItem(item.id)}><Trash2 size={15}/></button></div></div></article>; })}</div>}
        </section>}

        {page === 'Shopping list' && <section className="shopping-page-grid"><article className="panel shopping-main-panel"><div className="panel-heading"><div><div className="panel-kicker">YOUR NEXT GROCERY RUN</div><h3>Shopping checklist</h3><p className="panel-subtitle">Tap an item when it’s in your basket.</p></div><span className="round-stat">{shopping.filter(i => !i.done).length} left</span></div><form className="quick-add-form" onSubmit={addCustomShopping}><div className="quick-add-input"><Plus size={16}/><input value={shoppingInput} onChange={e => setShoppingInput(e.target.value)} placeholder="Add something to your list..." aria-label="New shopping item"/></div><input className="qty-input" value={shoppingQty} onChange={e => setShoppingQty(e.target.value)} aria-label="Quantity" placeholder="Qty"/><button type="submit" className="button button-primary"><Plus size={16}/> Add</button></form><div className="shopping-section-label"><span>TO PICK UP</span><span>{shopping.filter(i => !i.done).length} ITEMS</span></div><div className="shopping-full-list">{shopping.filter(i => !i.done).map(item => <div className="shopping-full-row" key={item.id}><button className="custom-check" onClick={() => toggleShopping(item.id)} aria-label={`Mark ${item.name} complete`}/><IconTile category={item.category} small/><div className="shopping-item-copy"><strong>{item.name}</strong><span>{item.quantity}</span></div><strong className="shopping-price">{Number(item.price) ? money(item.price) : '—'}</strong><button className="icon-button delete-list-item" onClick={() => deleteShopping(item.id)} aria-label={`Remove ${item.name}`}><X size={15}/></button></div>)}{shopping.filter(i => !i.done).length === 0 && <div className="empty-inline"><div className="empty-illustration">🛍️</div><strong>All caught up!</strong><span>Your open list is empty. Enjoy the well-stocked kitchen.</span></div>}</div><div className="shopping-section-label completed-label"><span>ALREADY IN THE BASKET</span><span>{checkedCount} ITEMS</span></div>{shopping.filter(i => i.done).map(item => <div className="shopping-full-row completed-row" key={item.id}><button className="custom-check checked" onClick={() => toggleShopping(item.id)} aria-label={`Uncheck ${item.name}`}><Check size={12}/></button><IconTile category={item.category} small/><div className="shopping-item-copy"><strong>{item.name}</strong><span>{item.quantity}</span></div><button className="icon-button delete-list-item" onClick={() => deleteShopping(item.id)} aria-label={`Remove ${item.name}`}><X size={15}/></button></div>)}</article><aside className="panel shopping-side-panel"><div className="shopping-side-illustration">🧺</div><div className="panel-kicker">A PLAN THAT PAYS OFF</div><h3>Your grocery estimate</h3><div className="estimate-total">{money(listTotal)}</div><p>Estimated total for items you haven’t checked off yet. Actual store prices may differ.</p><div className="side-divider"/><div className="estimate-row"><span>Items to pick up</span><strong>{shopping.filter(i => !i.done).length}</strong></div><div className="estimate-row"><span>Items completed</span><strong>{checkedCount}</strong></div><div className="estimate-row"><span>Completion</span><strong>{shopping.length ? Math.round(checkedCount/shopping.length*100) : 0}%</strong></div><div className="side-tip"><Leaf size={16}/><span>Tip: Check your pantry before shopping to avoid buying doubles.</span></div><button className="button button-outline full-button" onClick={() => setPage('My pantry')}>Check my pantry <ArrowUpRight size={15}/></button></aside></section>}

        {page === 'Insights' && <><section className="insights-top-grid"><article className="panel insight-highlight"><div className="insight-plant">🌱</div><div className="panel-kicker">YOUR PANTRY AT A GLANCE</div><h3>A little more mindful, every week.</h3><p>Keeping track of what you have can help cut down on forgotten food and duplicate grocery buys.</p><div className="impact-numbers"><div><strong>{items.length}</strong><span>items tracked</span></div><div><strong>{expiring.length}</strong><span>use soon</span></div><div><strong>{money(inventoryValue)}</strong><span>tracked value</span></div></div></article><article className="panel category-panel"><div className="panel-heading"><div><div className="panel-kicker">WHAT YOU KEEP</div><h3>Pantry by category</h3></div><span className="tiny-badge">{categoryCounts.length} categories</span></div><div className="category-chart-list">{categoryCounts.map((c,index) => <div className="category-chart-row" key={c.name}><IconTile category={c.name} small/><div className="category-chart-main"><div><span>{c.name}</span><strong>{c.count}</strong></div><div className="category-bar-track"><div className={`category-bar bar-${CATEGORY_META[c.name]?.color || 'gold'}`} style={{width: `${Math.max(5, c.count / Math.max(1,...categoryCounts.map(a=>a.count))*100)}%`}}/></div></div></div>)}</div></article></section><section className="panel value-panel"><div className="panel-heading"><div><div className="panel-kicker">MONEY ON YOUR SHELVES</div><h3>Estimated inventory value</h3><p className="panel-subtitle">Calculated from each item's quantity and listed unit price.</p></div><div className="large-value">{money(inventoryValue)}</div></div><div className="value-locations">{['Fridge','Cupboard','Freezer','Counter'].map(loc => { const subset = items.filter(i=>i.location===loc); const value = subset.reduce((sum,i)=>sum+Number(i.price)*Number(i.quantity),0); return <div key={loc} className="location-value-card"><div className="location-value-icon">{loc==='Fridge'?'🧊':loc==='Cupboard'?'🫙':loc==='Freezer'?'❄️':'🥖'}</div><span>{loc}</span><strong>{money(value)}</strong><small>{subset.length} {subset.length===1?'item':'items'}</small></div>; })}</div><div className="fine-print"><CircleHelp size={14}/> Values are estimates based on the unit prices you enter—not a valuation of nutritional or retail value.</div></section></>}

        <footer className="app-footer"><span><Leaf size={14}/> A little less waste, a little more taste.</span><span>PantryPal <span className="footer-dot">·</span> Your kitchen companion</span></footer>
      </div>
    </main>

    {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setModalOpen(false); }}><section className="item-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><div className="panel-kicker">KEEP YOUR PANTRY IN THE KNOW</div><h2 id="modal-title">{editing ? 'Edit pantry item' : 'Add to your pantry'}</h2><p>Track what you have, one good ingredient at a time.</p></div><button className="icon-button" onClick={() => setModalOpen(false)} aria-label="Close modal"><X size={20}/></button></div><form className="item-form" onSubmit={submitItem}><label className="field full-field">Item name<input autoFocus required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Fresh strawberries"/></label><div className="field-grid"><label className="field">Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></label><label className="field">Storage location<select value={form.location} onChange={e=>setForm({...form,location:e.target.value})}>{['Fridge','Cupboard','Freezer','Counter','Spice rack','Other'].map(c=><option key={c}>{c}</option>)}</select></label><label className="field">Quantity<input type="number" min="0" step="0.1" required value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})}/></label><label className="field">Unit<select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}>{['pcs','kg','g','litre','ml','pack','packs','carton','cans','loaf','bunch','cups','bags','bottles'].map(c=><option key={c}>{c}</option>)}</select></label><label className="field">Best before<input type="date" value={form.expiry} onChange={e=>setForm({...form,expiry:e.target.value})}/></label><label className="field">Price per unit (₹)<input type="number" min="0" step="0.5" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="0"/></label><label className="field full-field">Note (optional)<input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Anything to remember about this item"/></label></div><div className="modal-actions"><button type="button" className="button button-quiet" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="button button-primary"><Check size={16}/>{editing ? 'Save changes' : 'Add to pantry'}</button></div></form></section></div>}
    {toast && <div className="toast-message" role="status"><span><CheckCheck size={17}/></span>{toast}</div>}
  </div>;
}
export default App;
