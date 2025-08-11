import { useState, useRef, useEffect } from 'react';
import {
  getProperties, addProperty, updateProperty, deleteProperty,
  getAppointments, addAppointment, updateAppointment, deleteAppointment,
  getInquiries, addInquiry, updateInquiry, deleteInquiry,
  changePassword
} from '../api';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div style={{position:'fixed',top:20,right:20,background:'#7c9a6d',color:'#fff',padding:'1rem 1.5rem',borderRadius:8,boxShadow:'0 2px 8px rgba(60,40,20,0.12)',zIndex:9999,display:'flex',alignItems:'center',gap:'1rem'}}>
      <span>{message}</span>
      <button onClick={onClose} style={{background:'none',border:'none',color:'#fff',fontWeight:'bold',fontSize:'1.2rem',cursor:'pointer'}}>&times;</button>
    </div>
  );
}

const TABS = [
  { key: 'properties', label: 'Properties' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'inquiries', label: 'Inquiries' },
];

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('properties');
  // --- Properties ---
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState('');
  const [listingTitle, setListingTitle] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [listingStatus, setListingStatus] = useState('Active');
  const [listingLocation, setListingLocation] = useState('');
  const [listingType, setListingType] = useState('Residential');
  const [listingImage, setListingImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [editId, setEditId] = useState(null);
  const fileInputRef = useRef();

  // --- Appointments ---
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState('');
  const [apptName, setApptName] = useState('');
  const [apptPhone, setApptPhone] = useState('');
  const [apptPropertyId, setApptPropertyId] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptStatus, setApptStatus] = useState('pending');
  const [apptEditId, setApptEditId] = useState(null);

  // --- Inquiries ---
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [inquiriesError, setInquiriesError] = useState('');
  const [inqName, setInqName] = useState('');
  const [inqMsg, setInqMsg] = useState('');
  const [inqEditId, setInqEditId] = useState(null);

  // --- Toast notification ---
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); };
  const closeToast = () => setToast('');

  // --- Change Password ---
  const [showChangePw, setShowChangePw] = useState(false);
  const [pwOld, setPwOld] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwStatus, setPwStatus] = useState('');

  // --- Fetch data on mount ---
  useEffect(() => {
    setPropertiesLoading(true);
    getProperties()
      .then(setProperties)
      .catch(() => setPropertiesError('Failed to load properties'))
      .finally(() => setPropertiesLoading(false));
    setAppointmentsLoading(true);
    getAppointments()
      .then(setAppointments)
      .catch(() => setAppointmentsError('Failed to load appointments'))
      .finally(() => setAppointmentsLoading(false));
    setInquiriesLoading(true);
    getInquiries()
      .then(setInquiries)
      .catch(() => setInquiriesError('Failed to load inquiries'))
      .finally(() => setInquiriesLoading(false));
  }, []);

  // --- Properties CRUD ---
  const fetchProperties = () => {
    setPropertiesLoading(true);
    getProperties()
      .then(setProperties)
      .catch(() => setPropertiesError('Failed to load properties'))
      .finally(() => setPropertiesLoading(false));
  };
  const validate = () => {
    if (!listingTitle || !listingPrice || !listingLocation) {
      showToast('Please fill in all required fields.');
      return false;
    }
    if (listingImage && listingImage.length > 5000000) {
      showToast('Image is too large.');
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (editId) {
        await updateProperty(editId, {
          title: listingTitle, price: parseInt(listingPrice), status: listingStatus, location: listingLocation, type: listingType, image: listingImage
        });
        showToast('Property updated successfully!');
      } else {
        await addProperty({
          title: listingTitle, price: parseInt(listingPrice), status: listingStatus, location: listingLocation, type: listingType, image: listingImage
        });
        showToast('Property added successfully!');
      }
      fetchProperties();
      resetForm();
    } catch {
      showToast('Failed to save property.');
    }
  };
  const handleEdit = (prop) => {
    setEditId(prop._id);
    setListingTitle(prop.title);
    setListingPrice(prop.price);
    setListingStatus(prop.status);
    setListingLocation(prop.location);
    setListingType(prop.type);
    setListingImage(prop.image);
    setImagePreview(prop.image);
    showToast('Editing property...');
  };
  const deleteListing = async (id) => {
    try {
      await deleteProperty(id);
      showToast('Property deleted.');
      fetchProperties();
      if (editId === id) resetForm();
    } catch {
      showToast('Failed to delete property.');
    }
  };
  const toggleStatus = async (id) => {
    try {
      const prop = properties.find(l => l._id === id);
      await updateProperty(id, { ...prop, status: prop.status === 'Active' ? 'Inactive' : 'Active' });
      showToast('Status updated.');
      fetchProperties();
    } catch {
      showToast('Failed to update status.');
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Only image files are allowed.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      showToast('Image must be less than 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setListingImage(ev.target.result);
      setImagePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };
  const resetForm = () => {
    setEditId(null);
    setListingTitle('');
    setListingPrice('');
    setListingStatus('Active');
    setListingLocation('');
    setListingType('Residential');
    setListingImage('');
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Appointments CRUD ---
  const fetchAppointments = () => {
    setAppointmentsLoading(true);
    getAppointments()
      .then(setAppointments)
      .catch(() => setAppointmentsError('Failed to load appointments'))
      .finally(() => setAppointmentsLoading(false));
  };
  const handleApptSubmit = async (e) => {
    e.preventDefault();
    if (!apptName || !apptPhone || !apptPropertyId || !apptDate) {
      showToast('Please fill in all appointment fields.');
      return;
    }
    try {
      const appointmentData = {
        name: apptName,
        phone: apptPhone,
        property_id: apptPropertyId,
        date: apptDate,
        status: apptStatus
      };
      if (apptEditId) {
        await updateAppointment(apptEditId, appointmentData);
        showToast('Appointment updated!');
      } else {
        await addAppointment(appointmentData);
        showToast('Appointment added!');
      }
      fetchAppointments();
      resetApptForm();
    } catch {
      showToast('Failed to save appointment.');
    }
  };
  const handleApptEdit = (appt) => {
    setApptEditId(appt._id);
    setApptName(appt.name);
    setApptPhone(appt.phone);
    setApptPropertyId(appt.property_id);
    setApptDate(appt.date);
    setApptStatus(appt.status || 'pending');
    showToast('Editing appointment...');
  };
  const deleteAppointmentHandler = async (id) => {
    try {
      await deleteAppointment(id);
      showToast('Appointment deleted.');
      fetchAppointments();
      if (apptEditId === id) resetApptForm();
    } catch {
      showToast('Failed to delete appointment.');
    }
  };
  const resetApptForm = () => {
    setApptEditId(null);
    setApptName('');
    setApptPhone('');
    setApptPropertyId('');
    setApptDate('');
    setApptStatus('pending');
  };

  // --- Inquiries CRUD ---
  const fetchInquiries = () => {
    setInquiriesLoading(true);
    getInquiries()
      .then(setInquiries)
      .catch(() => setInquiriesError('Failed to load inquiries'))
      .finally(() => setInquiriesLoading(false));
  };
  const handleInqSubmit = async (e) => {
    e.preventDefault();
    if (!inqName || !inqMsg) {
      showToast('Please fill in all inquiry fields.');
      return;
    }
    try {
      if (inqEditId) {
        await updateInquiry(inqEditId, { name: inqName, message: inqMsg });
        showToast('Inquiry updated!');
      } else {
        await addInquiry({ name: inqName, message: inqMsg });
        showToast('Inquiry added!');
      }
      fetchInquiries();
      resetInqForm();
    } catch {
      showToast('Failed to save inquiry.');
    }
  };
  const handleInqEdit = (inq) => {
    setInqEditId(inq._id);
    setInqName(inq.name);
    setInqMsg(inq.message);
    showToast('Editing inquiry...');
  };
  const deleteInquiryHandler = async (id) => {
    try {
      await deleteInquiry(id);
      showToast('Inquiry deleted.');
      fetchInquiries();
      if (inqEditId === id) resetInqForm();
    } catch {
      showToast('Failed to delete inquiry.');
    }
  };
  const resetInqForm = () => {
    setInqEditId(null);
    setInqName('');
    setInqMsg('');
  };

  // --- Change Password ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwStatus('');
    try {
      await changePassword({ username: 'admin', oldPassword: pwOld, newPassword: pwNew });
      setPwStatus('Password changed successfully!');
      setShowChangePw(false);
      setPwOld('');
      setPwNew('');
      showToast('Password changed!');
    } catch (error) {
      setPwStatus(error.response?.data?.error || 'Failed to change password.');
    }
  };

  // --- UI Modernization ---
  return (
    <section className="admin-portal" style={{ maxWidth: 1100, margin: '2.5rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(60,40,20,0.10)', padding: '2.5rem 2rem', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h2 style={{ textAlign: 'center', color: '#7c9a6d', margin: 0, letterSpacing: 2 }}>Admin Portal</h2>
        <button onClick={() => setShowChangePw(true)} style={{ background: '#b6a179', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginLeft: 16 }}>Change Password</button>
      </div>
      {/* Change Password Modal */}
      {showChangePw && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(60,40,20,0.18)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleChangePassword} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(60,40,20,0.18)', padding: '2rem 2.5rem', minWidth: 320, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h3 style={{ color: '#7c9a6d', margin: 0 }}>Change Password</h3>
            <input type="password" placeholder="Current Password" value={pwOld} onChange={e=>setPwOld(e.target.value)} required />
            <input type="password" placeholder="New Password" value={pwNew} onChange={e=>setPwNew(e.target.value)} required />
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" style={{ background: '#7c9a6d', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Save</button>
              <button type="button" onClick={()=>setShowChangePw(false)} style={{ background: '#e9e4d5', color: '#7c9a6d', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Cancel</button>
            </div>
            {pwStatus && <div style={{ color: '#b60000', marginTop: 4 }}>{pwStatus}</div>}
          </form>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: activeTab === tab.key ? '#7c9a6d' : '#e9e4d5',
              color: activeTab === tab.key ? '#fff' : '#7c9a6d',
              border: 'none',
              borderRadius: 8,
              padding: '0.7rem 2.2rem',
              margin: '0 0.5rem',
              fontWeight: 600,
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: activeTab === tab.key ? '0 2px 8px rgba(60,40,20,0.10)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'properties' && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ color: '#b6a179', marginBottom: 18 }}>Manage Properties</h3>
        <form className="admin-form" onSubmit={handleSubmit} style={{marginBottom:'1rem',display:'flex',gap:'0.5rem',flexWrap:'wrap',justifyContent:'center'}}>
          <input value={listingTitle} onChange={e=>setListingTitle(e.target.value)} placeholder="Title" required />
            <input value={listingPrice} onChange={e=>setListingPrice(e.target.value)} placeholder="Price" type="number" required />
          <input value={listingLocation} onChange={e=>setListingLocation(e.target.value)} placeholder="Location" required />
          <select value={listingType} onChange={e=>setListingType(e.target.value)}>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Land">Land</option>
          </select>
          <select value={listingStatus} onChange={e=>setListingStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
              <option value="Sold">Sold</option>
              <option value="Pending">Pending</option>
          </select>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{maxWidth:180}} />
            <button type="submit" style={{ background: '#7c9a6d', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>{editId ? 'Update' : 'Add'}</button>
            {editId && <button type="button" onClick={resetForm} style={{ background: '#e9e4d5', color: '#7c9a6d', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Cancel</button>}
        </form>
          {imagePreview && <img src={imagePreview} alt="Preview" style={{maxWidth:120,maxHeight:80,marginBottom:10,borderRadius:6,boxShadow:'0 2px 8px rgba(60,40,20,0.10)'}} />}
        {propertiesLoading ? (
            <div>Loading...</div>
        ) : propertiesError ? (
            <div style={{color:'#b60000'}}>{propertiesError}</div>
        ) : (
            <table className="admin-table" style={{marginTop:18}}>
            <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {properties.map((p) => (
                  <tr key={p._id}>
                    <td>{p.title}</td>
                    <td>{p.price}</td>
                    <td>{p.location}</td>
                    <td>{p.type}</td>
                    <td>{p.status}</td>
                    <td style={{display:'flex',gap:8}}>
                      <button onClick={()=>handleEdit(p)} style={{ background: '#b6a179', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Edit</button>
                      <button onClick={()=>deleteListing(p._id)} style={{ background: '#b60000', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      )}
      {activeTab === 'appointments' && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ color: '#b6a179', marginBottom: 18 }}>Manage Appointments</h3>
          <form className="admin-form" onSubmit={handleApptSubmit} style={{marginBottom:'1rem',display:'flex',gap:'0.5rem',flexWrap:'wrap',justifyContent:'center'}}>
            <input value={apptName} onChange={e=>setApptName(e.target.value)} placeholder="Client Name" required />
            <input value={apptPhone} onChange={e=>setApptPhone(e.target.value)} placeholder="Phone Number" required />
            <select value={apptPropertyId} onChange={e=>setApptPropertyId(e.target.value)} required>
              <option value="">Select Property</option>
              {properties.map(p => (
                <option key={p._id} value={p._id}>{p.title} - {p.location}</option>
              ))}
            </select>
            <input value={apptDate} onChange={e=>setApptDate(e.target.value)} type="datetime-local" required />
            <select value={apptStatus} onChange={e=>setApptStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button type="submit" style={{ background: '#7c9a6d', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>{apptEditId ? 'Update' : 'Add'}</button>
            {apptEditId && <button type="button" onClick={resetApptForm} style={{ background: '#e9e4d5', color: '#7c9a6d', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Cancel</button>}
          </form>
          {appointmentsLoading ? (
            <div>Loading appointments...</div>
          ) : appointmentsError ? (
            <div style={{color:'#b60000'}}>{appointmentsError}</div>
          ) : (
            <table className="admin-table" style={{marginTop:18}}>
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Phone</th>
                  <th>Property</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => {
                  const property = properties.find(p => p._id === a.property_id);
                  return (
                    <tr key={a._id}>
                      <td>{a.name}</td>
                      <td>{a.phone}</td>
                      <td>{property ? `${property.title} - ${property.location}` : 'Property not found'}</td>
                      <td>{new Date(a.date).toLocaleString()}</td>
                      <td>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: 4,
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          background: a.status === 'confirmed' ? '#d4edda' : a.status === 'cancelled' ? '#f8d7da' : '#fff3cd',
                          color: a.status === 'confirmed' ? '#155724' : a.status === 'cancelled' ? '#721c24' : '#856404'
                        }}>
                          {a.status?.toUpperCase() || 'PENDING'}
                        </span>
                      </td>
                      <td style={{display:'flex',gap:8}}>
                        <button onClick={()=>handleApptEdit(a)} style={{ background: '#b6a179', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Edit</button>
                        <button onClick={()=>deleteAppointmentHandler(a._id)} style={{ background: '#b60000', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
      {activeTab === 'inquiries' && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ color: '#b6a179', marginBottom: 18 }}>Manage Inquiries</h3>
        <form className="admin-form" onSubmit={handleInqSubmit} style={{marginBottom:'1rem',display:'flex',gap:'0.5rem',flexWrap:'wrap',justifyContent:'center'}}>
          <input value={inqName} onChange={e=>setInqName(e.target.value)} placeholder="Name" required />
          <input value={inqMsg} onChange={e=>setInqMsg(e.target.value)} placeholder="Message" required />
          <button type="submit">{inqEditId ? 'Update' : 'Add'} Inquiry</button>
          {inqEditId && <button type="button" onClick={resetInqForm} style={{background:'#e9e4d5',color:'#3e2c18'}}>Cancel</button>}
        </form>
        {inquiriesLoading ? (
          <div>Loading inquiries...</div>
        ) : inquiriesError ? (
          <div style={{color:'#c0392b'}}>{inquiriesError}</div>
        ) : (
          <ul>
            {inquiries.map(i => (
              <li key={i.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem'}}>
                <span>{i.name}: {i.message}</span>
                <span style={{display:'flex',gap:'0.5rem'}}>
                  <button onClick={() => handleInqEdit(i)} style={{background:'#7c9a6d',color:'#fff',border:'none',borderRadius:'5px',padding:'2px 8px',cursor:'pointer'}}>Edit</button>
                  <button onClick={() => deleteInquiryHandler(i.id)} style={{background:'#c0392b',color:'#fff',border:'none',borderRadius:'5px',padding:'2px 8px',cursor:'pointer'}}>Delete</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      )}
      <Toast message={toast} onClose={closeToast} />
    </section>
  );
};

export default AdminPortal; 