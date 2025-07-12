import { useState } from 'react';
import { useProperties } from './PropertiesContext';

const Properties = () => {
  const { properties } = useProperties();
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');

  const filtered = properties.filter((p) => {
    if (p.status !== 'Active') return false;
    const matchesLocation = location ? p.location.toLowerCase().includes(location.toLowerCase()) : true;
    const matchesType = type ? p.type === type : true;
    const matchesPrice = price ? p.price <= parseInt(price) : true;
    return matchesLocation && matchesType && matchesPrice;
  });

  return (
    <section className="properties-page">
      <h2>Properties</h2>
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price (KES)"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="">Type</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Land">Land</option>
        </select>
        <button disabled>Filter</button>
      </div>
      <div className="properties-grid">
        {filtered.length === 0 ? (
          <div style={{color:'#b6a179'}}>No properties found.</div>
        ) : (
          filtered.map((p) => (
            <div className="property-card" key={p.id}>
              {p.image ? (
                <img src={p.image} alt="Property" style={{width:'100%',height:'120px',objectFit:'cover',borderRadius:'8px',marginBottom:'1rem'}} />
              ) : (
                <div className="property-img" style={{background:'#e9e4d5',height:'120px',borderRadius:'8px',marginBottom:'1rem'}}></div>
              )}
              <h3>{p.title}</h3>
              <p>Location: {p.location}</p>
              <p>Type: {p.type}</p>
              <p>Price: KES {p.price.toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Properties; 