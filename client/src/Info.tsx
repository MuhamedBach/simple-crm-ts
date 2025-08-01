import { Link } from 'react-router-dom';

export default function Info() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, background: '#f4f6fa', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24, color: '#2c3e50' }}>Info & Impressum</h1>
      <p>Dieses Projekt wurde mit React, TypeScript und Express erstellt. Es dient als Beispiel für eine einfache CRM-Anwendung.</p>
      <p>Autor: Muhamed Bachir</p>
      <p>GitHub: <a href="https://github.com/" target="_blank" rel="noopener noreferrer">Mein Github</a></p>
      <div style={{ marginTop: 32 }}>
        <Link to="/" style={{ background: '#2980b9', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>Zurück zur Kundenliste</Link>
      </div>
    </div>
  );
}
