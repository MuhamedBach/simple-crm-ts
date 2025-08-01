import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Customer } from './App';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/customers/${id}`)
      .then(res => res.json())
      .then(data => { setCustomer(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Lade...</div>;
  if (!customer) return <div>Kunde nicht gefunden</div>;

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 16 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>Zurück</button>
      <h2>{customer.name}</h2>
      <p><strong>Email:</strong> {customer.email}</p>
      <p><strong>Telefon:</strong> {customer.phone ? <a href={`tel:${customer.phone}`}>{customer.phone}</a> : '-'}</p>
      <p><strong>Notizen:</strong> {customer.notes || '-'}</p>
      <p><strong>ID:</strong> {customer.id}</p>
    </div>
  );
}
