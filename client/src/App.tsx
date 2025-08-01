import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerDetail from './CustomerDetail';
import Home from './Home';
import Info from './Info';
import './App.css';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [edit, setEdit] = useState<Partial<Customer>>({});
  const [loading, setLoading] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({ name: '', email: '' });
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/customers')
      .then(res => res.json())
      .then(setCustomers)
      .catch(() => setError('Kunden konnten nicht geladen werden.'));
  }, []);

  const handleEdit = (customer: Customer) => {
    setSelected(customer);
    setEdit(customer);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEdit({ ...edit, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  const handleSave = async () => {
    if (!selected) return;
    if (!edit.name || !edit.email) {
      setError('Name und Email sind erforderlich.');
      return;
    }
    if (!validateEmail(edit.email)) {
      setError('Ungültige Email-Adresse.');
      return;
    }
    setLoading(true);
    setError('');
    await fetch(`http://localhost:4000/api/customers/${selected.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edit),
    });
    const updated = customers.map(c => c.id === selected.id ? { ...c, ...edit } : c);
    setCustomers(updated);
    setSelected(null);
    setEdit({});
    setLoading(false);
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      setError('Name und Email sind erforderlich.');
      return;
    }
    if (!validateEmail(newCustomer.email)) {
      setError('Ungültige Email-Adresse.');
      return;
    }
    setLoading(true);
    setError('');
    const res = await fetch('http://localhost:4000/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer),
    });
    const created = await res.json();
    setCustomers([...customers, created]);
    setNewCustomer({ name: '', email: '' });
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError('');
    await fetch(`http://localhost:4000/api/customers/${id}`, { method: 'DELETE' });
    setCustomers(customers.filter(c => c.id !== id));
    setLoading(false);
    setDeleteId(null);
  };

  // CSV-Export
  const handleExportCSV = () => {
    const header = ['Name', 'Email', 'Telefon', 'Notizen'];
    const rows = customers.map(c => [c.name, c.email, c.phone || '', c.notes || '']);
    const csv = [header, ...rows].map(r => r.map(x => `"${x}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kunden.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) =>
    sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  return (
    <div className="container" style={{ maxWidth: 600, margin: '0 auto', padding: 24, background: '#f4f6fa', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
        <Link to="/" style={{ color: '#2980b9', fontWeight: 500 }}>Home</Link>
        <Link to="/info" style={{ color: '#27ae60', fontWeight: 500 }}>Info</Link>
      </nav>
      <h1 style={{ textAlign: 'center', marginBottom: 24, color: '#2c3e50' }}>Kundenliste</h1>
      <button onClick={handleExportCSV} style={{ marginBottom: 16, width: '100%', background: '#2980b9', color: '#fff', border: 'none', borderRadius: 6, padding: 10, fontWeight: 500, cursor: 'pointer' }}>Export als CSV</button>
      <form onSubmit={e => { e.preventDefault(); handleAdd(); }} style={{ marginBottom: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 16 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input name="name" value={newCustomer.name || ''} onChange={handleNewChange} placeholder="Name" required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          <input name="email" value={newCustomer.email || ''} onChange={handleNewChange} placeholder="Email" required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <input name="phone" value={newCustomer.phone || ''} onChange={handleNewChange} placeholder="Telefon" style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          <input name="notes" value={newCustomer.notes || ''} onChange={handleNewChange} placeholder="Notizen" style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 12, width: '100%', background: '#27ae60', color: '#fff', border: 'none', borderRadius: 6, padding: 10, fontWeight: 500, cursor: 'pointer' }}>Kunde anlegen</button>
      </form>
      <input
        type="text"
        placeholder="Suche nach Name oder Email"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 16, width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ color: '#555' }}>{sortedCustomers.length} Kunden gefunden</span>
        <button onClick={() => setSortAsc(!sortAsc)} style={{ fontSize: 14, background: '#eee', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>
          Sortierung: {sortAsc ? 'A-Z' : 'Z-A'}
        </button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {loading && <div style={{ color: '#2980b9', marginBottom: 8 }}>Lade...</div>}
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {sortedCustomers.map(c => (
          <li key={c.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: 12, borderRadius: 8, background: '#fff', boxShadow: '0 1px 4px #0001', padding: 12, transition: 'box-shadow 0.2s', border: '1px solid #eaeaea' }}>
            <span style={{ flex: 1 }}>
              <Link to={`/customer/${c.id}`} style={{ textDecoration: 'none', color: '#2980b9', fontWeight: 600, fontSize: 18 }}>
                {c.name}
              </Link> <span style={{ color: '#555' }}>({c.email})</span>
              {c.phone && (
                <span> | <a href={`tel:${c.phone}`} style={{ color: '#27ae60', textDecoration: 'none' }}>{c.phone}</a></span>
              )}
              {c.notes && (
                <span title={c.notes} style={{ marginLeft: 8, cursor: 'help', color: '#888' }}>🛈</span>
              )}
            </span>
            <button onClick={() => handleEdit(c)} style={{ marginLeft: 8, background: '#f1c40f', color: '#222', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>Bearbeiten</button>
            <button onClick={() => setDeleteId(c.id)} style={{ marginLeft: 8, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>Löschen</button>
          </li>
        ))}
      </ul>
      {deleteId !== null && (
        <div style={{ background: '#fff', border: '1px solid #ccc', padding: 16, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: 300 }}>
            <p>Möchtest du diesen Kunden wirklich löschen?</p>
            <button onClick={() => handleDelete(deleteId)} style={{ color: 'red', marginRight: 8 }}>Ja, löschen</button>
            <button onClick={() => setDeleteId(null)}>Abbrechen</button>
          </div>
        </div>
      )}
      {selected && (
        <div className="edit-form" style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, marginTop: 16 }}>
          <h2>Kunde bearbeiten</h2>
          <input name="name" value={edit.name || ''} onChange={handleChange} placeholder="Name" style={{ width: '100%', marginBottom: 4 }} />
          <input name="email" value={edit.email || ''} onChange={handleChange} placeholder="Email" style={{ width: '100%', marginBottom: 4 }} />
          <input name="phone" value={edit.phone || ''} onChange={handleChange} placeholder="Telefon" style={{ width: '100%', marginBottom: 4 }} />
          <input name="notes" value={edit.notes || ''} onChange={handleChange} placeholder="Notizen" style={{ width: '100%', marginBottom: 4 }} />
          <button onClick={handleSave} disabled={loading} style={{ width: '100%' }}>Speichern</button>
          <button onClick={() => setSelected(null)} style={{ marginLeft: 8, width: '100%' }}>Abbrechen</button>
        </div>
      )}
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: 80 }}>
      <h2>404 - Seite nicht gefunden</h2>
      <Link to="/" style={{ color: '#2980b9' }}>Zurück zur Startseite</Link>
    </div>
  );
}

export default function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  useEffect(() => {
    fetch('http://localhost:4000/api/customers')
      .then(res => res.json())
      .then(setCustomers);
  }, []);
  const total = customers.length;
  const withPhone = customers.filter(c => c.phone).length;
  const last = customers[customers.length - 1];
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<CustomerList />} />
        <Route path="/customer/:id" element={<CustomerDetail />} />
        <Route path="/info" element={<Info />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* Statistiken auf Home anzeigen */}
      <Routes>
        <Route path="/" element={
          <div style={{ maxWidth: 600, margin: '24px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 24 }}>
            <h2 style={{ color: '#2c3e50' }}>Statistiken</h2>
            <p>Gesamtanzahl Kunden: <strong>{total}</strong></p>
            <p>Mit Telefonnummer: <strong>{withPhone}</strong></p>
            <p>Zuletzt hinzugefügt: <strong>{last ? last.name : '-'}</strong></p>
            <Link to="/list" style={{ background: '#2980b9', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>Zur Kundenliste</Link>
          </div>
        } />
      </Routes>
    </Router>
  );
}
