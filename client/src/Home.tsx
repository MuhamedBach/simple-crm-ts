import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ maxWidth: 600, margin: '32px auto 0 auto', padding: 16, background: '#f4f6fa', borderRadius: 12, fontFamily: 'system-ui, sans-serif', boxShadow: '0 2px 8px #0001' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 16, color: '#2c3e50', fontSize: 32 }}>Simple CRM</h1>
      <p style={{ textAlign: 'center', marginBottom: 16, fontSize: 18 }}>Willkommen! Dieses Projekt zeigt eine einfache Kundenverwaltung mit React und Express.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 8 }}>
        <Link to="/list" style={{ background: '#2980b9', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>Kundenliste</Link>
        <Link to="/info" style={{ background: '#27ae60', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>Info</Link>
      </div>
    </div>
  );
}
