import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

interface Bid {
  id: number;
  supplier: { id: number; name: string };
  price: string;
  submitted_at: string;
}

interface RFQ {
  id: number;
  item: string;
  quantity: number;
  deadline: string;
  created_at: string;
}

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bids, setBids] = useState<Bid[]>([]);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deadline, setDeadline] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');

  // FETCH DATA
  const fetchBids = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/bids/');
      setBids(res.data);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  const fetchRfqs = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/rfq/');
      setRfqs(res.data);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/suppliers/');
      setSuppliers(res.data);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  useEffect(() => {
    fetchBids();
    fetchRfqs();
    fetchSuppliers();
    const interval = setInterval(() => {
      fetchBids();
      fetchRfqs();
      fetchSuppliers();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // POST RFQ
  const handleSubmitRFQ = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/rfq/', {
        item,
        quantity: parseInt(quantity),
        deadline
      });
      alert("RFQ Sent! Suppliers will bid soon.");
      setItem(''); setQuantity(''); setDeadline('');
      fetchRfqs();
    } catch (err) {
      alert("Error sending RFQ");
    }
  };

  // POST SUPPLIER
  const handleSubmitSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/suppliers/', {
        name: supplierName,
        email: supplierEmail,
        phone: supplierPhone
      });
      alert("Supplier added successfully!");
      setSupplierName(''); setSupplierEmail(''); setSupplierPhone('');
      fetchSuppliers();
    } catch (err) {
      alert("Error adding supplier");
    }
  };

  const chartData = bids
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    .slice(0, 5)
    .map(bid => ({
      name: bid.supplier.name,
      price: parseFloat(bid.price)
    }));

  const renderDashboard = () => (
    <section className="section fade-in">
      <h2>📈 Live Bidding Dashboard</h2>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={12}
              tick={{ fill: '#64748b' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tick={{ fill: '#64748b' }}
              label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value) => [`₹${value}`, 'Price']}
            />
            <Legend />
            <Bar
              dataKey="price"
              fill="url(#gradient)"
              radius={[4, 4, 0, 0]}
              name="Bid Price"
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>💰 Recent Bids</h3>
      <div className="fade-in">
        {bids.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-title">No Bids Yet</div>
            <div className="empty-state-description">
              Bids will appear here once suppliers start responding to your RFQs.
            </div>
          </div>
        ) : (
          bids.slice(0, 10).map(bid => (
            <div key={bid.id} className="card slide-up">
              <div className="card-header">
                <div className="card-title">{bid.supplier.name}</div>
                <div className="card-meta">
                  <span className="status-badge status-success">Active Bid</span>
                  <span>{new Date(bid.submitted_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="card-content">
                <strong style={{ fontSize: '1.2em', color: '#2563eb' }}>
                  ₹{parseFloat(bid.price).toLocaleString('en-IN')}
                </strong>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );

  const renderRFQs = () => (
    <section className="section fade-in">
      <h2>📋 RFQ Management</h2>

      {/* RFQ FORM */}
      <div className="form-container">
        <h3>📝 Create New RFQ</h3>
        <form onSubmit={handleSubmitRFQ}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Item Description</label>
              <input
                type="text"
                placeholder="e.g. Surgical Gloves, X-Ray Film, Medical Equipment"
                value={item}
                onChange={e => setItem(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                required
                className="form-input"
                min="1"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                required
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            🚀 Send RFQ to Suppliers
          </button>
        </form>
      </div>

      {/* RFQ LIST */}
      <h3>📄 All RFQs</h3>
      <div className="fade-in">
        {rfqs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No RFQs Created Yet</div>
            <div className="empty-state-description">
              Create your first RFQ to start receiving bids from suppliers.
            </div>
          </div>
        ) : (
          rfqs.map(rfq => (
            <div key={rfq.id} className="card slide-up">
              <div className="card-header">
                <div className="card-title">{rfq.item}</div>
                <div className="card-meta">
                  <span className="status-badge status-warning">
                    Deadline: {new Date(rfq.deadline).toLocaleDateString()}
                  </span>
                  <span>Created: {new Date(rfq.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="card-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><strong>Quantity:</strong> {rfq.quantity.toLocaleString()}</span>
                  <span style={{ color: new Date(rfq.deadline) < new Date() ? '#ef4444' : '#10b981' }}>
                    {new Date(rfq.deadline) < new Date() ? '⏰ Expired' : '🟢 Active'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );

  const renderSuppliers = () => (
    <section className="section fade-in">
      <h2>🏢 Supplier Management</h2>

      {/* SUPPLIER FORM */}
      <div className="form-container">
        <h3>➕ Add New Supplier</h3>
        <form onSubmit={handleSubmitSupplier}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                placeholder="Enter supplier company name"
                value={supplierName}
                onChange={e => setSupplierName(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="supplier@company.com"
                value={supplierEmail}
                onChange={e => setSupplierEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={supplierPhone}
                onChange={e => setSupplierPhone(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success">
            ✅ Add Supplier
          </button>
        </form>
      </div>

      {/* SUPPLIER LIST */}
      <h3>📞 All Suppliers</h3>
      <div className="fade-in">
        {suppliers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏢</div>
            <div className="empty-state-title">No Suppliers Added Yet</div>
            <div className="empty-state-description">
              Add your first supplier to start sending RFQs and receiving bids.
            </div>
          </div>
        ) : (
          suppliers.map(supplier => (
            <div key={supplier.id} className="card slide-up">
              <div className="card-header">
                <div className="card-title">{supplier.name}</div>
                <div className="card-meta">
                  <span className="status-badge status-success">Active Supplier</span>
                  <span>ID: #{supplier.id}</span>
                </div>
              </div>
              <div className="card-content">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <strong style={{ color: '#64748b' }}>📧 Email:</strong><br />
                    <a href={`mailto:${supplier.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                      {supplier.email}
                    </a>
                  </div>
                  <div>
                    <strong style={{ color: '#64748b' }}>📱 Phone:</strong><br />
                    <a href={`tel:${supplier.phone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                      {supplier.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );

  return (
    <div className="app-container">
      <header className="header">
        <h1>🏥 MediQuote SaaS - Medical Procurement Platform</h1>
      </header>

      <nav className="navigation">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-tab ${activeTab === 'rfqs' ? 'active' : ''}`}
            onClick={() => setActiveTab('rfqs')}
          >
            📋 RFQs
          </button>
          <button
            className={`nav-tab ${activeTab === 'suppliers' ? 'active' : ''}`}
            onClick={() => setActiveTab('suppliers')}
          >
            🏢 Suppliers
          </button>
        </div>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'rfqs' && renderRFQs()}
        {activeTab === 'suppliers' && renderSuppliers()}
      </main>
    </div>
  );
}

export default App;