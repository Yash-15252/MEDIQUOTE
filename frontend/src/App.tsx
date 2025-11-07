import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Bid {
  id: number;
  supplier: { id: number; name: string };
  price: string;
  submitted_at: string;
}

function App() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deadline, setDeadline] = useState('');

  // FETCH BIDS
  const fetchBids = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/bids/');
      setBids(res.data);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  useEffect(() => {
    fetchBids();
    const interval = setInterval(fetchBids, 5000);
    return () => clearInterval(interval);
  }, []);

  // POST RFQ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/rfq/', {
        item,
        quantity: parseInt(quantity),
        deadline
      });
      alert("RFQ Sent! Suppliers will bid soon.");
      setItem(''); setQuantity(''); setDeadline('');
    } catch (err) {
      alert("Error sending RFQ");
    }
  };

  const chartData = bids
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    .slice(0, 3)
    .map(bid => ({
      name: bid.supplier.name,
      price: parseFloat(bid.price)
    }));

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>MediQuote SaaS - Live Bidding</h1>

      {/* RFQ FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Send RFQ</h2>
        <input placeholder="Item (e.g. Steel Rods)" value={item} onChange={e => setItem(e.target.value)} required style={{ margin: '5px', padding: '10px', width: '220px' }} />
        <input placeholder="Quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required style={{ margin: '5px', padding: '10px', width: '100px' }} />
        <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required style={{ margin: '5px', padding: '10px' }} />
        <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>Send RFQ</button>
      </form>

      {/* LIVE CHART + LIST */}
      <h2>Live Bids</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="price" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ marginTop: '20px' }}>
        {bids.map(bid => (
          <div key={bid.id} style={{ border: '1px solid #ddd', margin: '5px', padding: '10px', borderRadius: '5px' }}>
            <strong>{bid.supplier.name}</strong> - ₹{bid.price}
            <span style={{ fontSize: '12px', color: '#666' }}> at {new Date(bid.submitted_at).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;