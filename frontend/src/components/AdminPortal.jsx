import { useState, useRef, useEffect } from 'react';
import {
  getProperties, addProperty, updateProperty, deleteProperty,
  getAppointments, addAppointment, updateAppointment, deleteAppointment,
  getInquiries, addInquiry, updateInquiry, deleteInquiry,
  getProjects, addProject, updateProject, deleteProject,
  getContractors, addContractor, updateContractor, deleteContractor,
  getLandTitles, addLandTitle, updateLandTitle, deleteLandTitle,
  getCompliance, addCompliance, updateCompliance, deleteCompliance,
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
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'properties', label: 'Properties' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'inquiries', label: 'Inquiries' },
  { key: 'projects', label: 'Projects' },
  { key: 'contractors', label: 'Contractors' },
  { key: 'landtitles', label: 'Land Titles' },
  { key: 'compliance', label: 'Compliance' },
];

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
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

  // --- Dashboard ---
  const [dashboardData, setDashboardData] = useState({
    totalProperties: 0,
    activeProjects: 0,
    pendingCompliance: 0,
    availableContractors: 0
  });

  // --- Toast notification ---
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); };
  const closeToast = () => setToast('');

  // --- Projects ---
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [projectStartDate, setProjectStartDate] = useState('');
  const [projectEndDate, setProjectEndDate] = useState('');
  const [projectEditId, setProjectEditId] = useState(null);

  // --- Contractors ---
  const [contractors, setContractors] = useState([]);
  const [contractorsLoading, setContractorsLoading] = useState(true);
  const [contractorName, setContractorName] = useState('');
  const [contractorCompany, setContractorCompany] = useState('');
  const [contractorPhone, setContractorPhone] = useState('');
  const [contractorEmail, setContractorEmail] = useState('');
  const [contractorRate, setContractorRate] = useState('');
  const [contractorEditId, setContractorEditId] = useState(null);

  // --- Land Titles ---
  const [landTitles, setLandTitles] = useState([]);
  const [landTitlesLoading, setLandTitlesLoading] = useState(true);
  const [titleNumber, setTitleNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [landSize, setLandSize] = useState('');
  const [titleLocation, setTitleLocation] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [titleEditId, setTitleEditId] = useState(null);

  // --- Compliance ---
  const [compliance, setCompliance] = useState([]);
  const [complianceLoading, setComplianceLoading] = useState(true);
  const [permitType, setPermitType] = useState('');
  const [permitNumber, setPermitNumber] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [complianceEditId, setComplianceEditId] = useState(null);

  // --- Change Password ---
  const [showChangePw, setShowChangePw] = useState(false);
  const [pwOld, setPwOld] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwStatus, setPwStatus] = useState('');

  // --- Fetch data on mount ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [propertiesData, projectsData, complianceData, contractorsData] = await Promise.all([
          getProperties(),
          fetch('/api/projects', { headers: { Authorization: `Bearer ${localStorage.getItem('pesante_admin_token')}` } }).then(r => r.json()).catch(() => []),
          fetch('/api/compliance', { headers: { Authorization: `Bearer ${localStorage.getItem('pesante_admin_token')}` } }).then(r => r.json()).catch(() => []),
          fetch('/api/contractors', { headers: { Authorization: `Bearer ${localStorage.getItem('pesante_admin_token')}` } }).then(r => r.json()).catch(() => [])
        ]);
        setDashboardData({
          totalProperties: propertiesData.length,
          activeProjects: projectsData.filter(p => p.status === 'active').length,
          pendingCompliance: complianceData.filter(c => c.status === 'pending').length,
          availableContractors: contractorsData.filter(c => c.availability === 'available').length
        });
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      }
    };
    
    fetchDashboardData();
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
    setProjectsLoading(true);
    getProjects()
      .then(setProjects)
      .catch(() => console.error('Failed to load projects'))
      .finally(() => setProjectsLoading(false));
    setContractorsLoading(true);
    getContractors()
      .then(setContractors)
      .catch(() => console.error('Failed to load contractors'))
      .finally(() => setContractorsLoading(false));
    setLandTitlesLoading(true);
    getLandTitles()
      .then(setLandTitles)
      .catch(() => console.error('Failed to load land titles'))
      .finally(() => setLandTitlesLoading(false));
    setComplianceLoading(true);
    getCompliance()
      .then(setCompliance)
      .catch(() => console.error('Failed to load compliance'))
      .finally(() => setComplianceLoading(false));
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

  // --- Projects CRUD ---
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectName || !projectBudget || !projectStartDate || !projectEndDate) {
      showToast('Please fill in all project fields.');
      return;
    }
    try {
      const projectData = { name: projectName, budget: parseInt(projectBudget), start_date: projectStartDate, end_date: projectEndDate };
      if (projectEditId) {
        await updateProject(projectEditId, projectData);
        showToast('Project updated!');
      } else {
        await addProject(projectData);
        showToast('Project added!');
      }
      getProjects().then(setProjects);
      resetProjectForm();
    } catch {
      showToast('Failed to save project.');
    }
  };
  const handleProjectEdit = (project) => {
    setProjectEditId(project._id);
    setProjectName(project.name);
    setProjectBudget(project.budget);
    setProjectStartDate(project.start_date?.split('T')[0]);
    setProjectEndDate(project.end_date?.split('T')[0]);
  };
  const deleteProjectHandler = async (id) => {
    try {
      await deleteProject(id);
      showToast('Project deleted.');
      getProjects().then(setProjects);
      if (projectEditId === id) resetProjectForm();
    } catch {
      showToast('Failed to delete project.');
    }
  };
  const resetProjectForm = () => {
    setProjectEditId(null);
    setProjectName('');
    setProjectBudget('');
    setProjectStartDate('');
    setProjectEndDate('');
  };

  // --- Contractors CRUD ---
  const handleContractorSubmit = async (e) => {
    e.preventDefault();
    if (!contractorName || !contractorCompany || !contractorPhone || !contractorEmail || !contractorRate) {
      showToast('Please fill in all contractor fields.');
      return;
    }
    try {
      const contractorData = { name: contractorName, company: contractorCompany, phone: contractorPhone, email: contractorEmail, hourly_rate: parseInt(contractorRate) };
      if (contractorEditId) {
        await updateContractor(contractorEditId, contractorData);
        showToast('Contractor updated!');
      } else {
        await addContractor(contractorData);
        showToast('Contractor added!');
      }
      getContractors().then(setContractors);
      resetContractorForm();
    } catch {
      showToast('Failed to save contractor.');
    }
  };
  const handleContractorEdit = (contractor) => {
    setContractorEditId(contractor._id);
    setContractorName(contractor.name);
    setContractorCompany(contractor.company);
    setContractorPhone(contractor.phone);
    setContractorEmail(contractor.email);
    setContractorRate(contractor.hourly_rate);
  };
  const deleteContractorHandler = async (id) => {
    try {
      await deleteContractor(id);
      showToast('Contractor deleted.');
      getContractors().then(setContractors);
      if (contractorEditId === id) resetContractorForm();
    } catch {
      showToast('Failed to delete contractor.');
    }
  };
  const resetContractorForm = () => {
    setContractorEditId(null);
    setContractorName('');
    setContractorCompany('');
    setContractorPhone('');
    setContractorEmail('');
    setContractorRate('');
  };

  // --- Land Titles CRUD ---
  const handleTitleSubmit = async (e) => {
    e.preventDefault();
    if (!titleNumber || !ownerName || !landSize || !titleLocation || !registrationDate) {
      showToast('Please fill in all land title fields.');
      return;
    }
    try {
      const titleData = { title_number: titleNumber, property_id: properties[0]?._id, owner_name: ownerName, land_size: parseFloat(landSize), location: titleLocation, registration_date: registrationDate };
      if (titleEditId) {
        await updateLandTitle(titleEditId, titleData);
        showToast('Land title updated!');
      } else {
        await addLandTitle(titleData);
        showToast('Land title added!');
      }
      getLandTitles().then(setLandTitles);
      resetTitleForm();
    } catch {
      showToast('Failed to save land title.');
    }
  };
  const handleTitleEdit = (title) => {
    setTitleEditId(title._id);
    setTitleNumber(title.title_number);
    setOwnerName(title.owner_name);
    setLandSize(title.land_size);
    setTitleLocation(title.location);
    setRegistrationDate(title.registration_date?.split('T')[0]);
  };
  const deleteTitleHandler = async (id) => {
    try {
      await deleteLandTitle(id);
      showToast('Land title deleted.');
      getLandTitles().then(setLandTitles);
      if (titleEditId === id) resetTitleForm();
    } catch {
      showToast('Failed to delete land title.');
    }
  };
  const resetTitleForm = () => {
    setTitleEditId(null);
    setTitleNumber('');
    setOwnerName('');
    setLandSize('');
    setTitleLocation('');
    setRegistrationDate('');
  };

  // --- Compliance CRUD ---
  const handleComplianceSubmit = async (e) => {
    e.preventDefault();
    if (!permitType || !permitNumber || !issuingAuthority || !issueDate || !expiryDate) {
      showToast('Please fill in all compliance fields.');
      return;
    }
    try {
      const complianceData = { property_id: properties[0]?._id, permit_type: permitType, permit_number: permitNumber, issuing_authority: issuingAuthority, issue_date: issueDate, expiry_date: expiryDate };
      if (complianceEditId) {
        await updateCompliance(complianceEditId, complianceData);
        showToast('Compliance updated!');
      } else {
        await addCompliance(complianceData);
        showToast('Compliance added!');
      }
      getCompliance().then(setCompliance);
      resetComplianceForm();
    } catch {
      showToast('Failed to save compliance.');
    }
  };
  const handleComplianceEdit = (comp) => {
    setComplianceEditId(comp._id);
    setPermitType(comp.permit_type);
    setPermitNumber(comp.permit_number);
    setIssuingAuthority(comp.issuing_authority);
    setIssueDate(comp.issue_date?.split('T')[0]);
    setExpiryDate(comp.expiry_date?.split('T')[0]);
  };
  const deleteComplianceHandler = async (id) => {
    try {
      await deleteCompliance(id);
      showToast('Compliance deleted.');
      getCompliance().then(setCompliance);
      if (complianceEditId === id) resetComplianceForm();
    } catch {
      showToast('Failed to delete compliance.');
    }
  };
  const resetComplianceForm = () => {
    setComplianceEditId(null);
    setPermitType('');
    setPermitNumber('');
    setIssuingAuthority('');
    setIssueDate('');
    setExpiryDate('');
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
    <section className="admin-portal" style={{ maxWidth: '95vw', margin: '1rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(60,40,20,0.10)', padding: '1.5rem', minHeight: '85vh', overflow: 'visible' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: '#7c9a6d', margin: 0, letterSpacing: 1, fontSize: '1.5rem' }}>Admin Portal</h2>
        <button onClick={() => setShowChangePw(true)} style={{ background: '#b6a179', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4rem 1rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Change Password</button>
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
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap', gap: '0.3rem' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: activeTab === tab.key ? '#7c9a6d' : '#e9e4d5',
              color: activeTab === tab.key ? '#fff' : '#7c9a6d',
              border: 'none',
              borderRadius: 6,
              padding: '0.4rem 0.8rem',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: activeTab === tab.key ? '0 2px 8px rgba(60,40,20,0.10)' : 'none',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ color: '#b6a179', marginBottom: 18 }}>Management Dashboard</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#f7f5ef', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c9a6d' }}>{dashboardData.totalProperties}</div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Properties</div>
            </div>
            <div style={{ background: '#f7f5ef', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c9a6d' }}>{dashboardData.activeProjects}</div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Active Projects</div>
            </div>
            <div style={{ background: '#f7f5ef', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c9a6d' }}>{dashboardData.pendingCompliance}</div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Pending Compliance</div>
            </div>
            <div style={{ background: '#f7f5ef', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c9a6d' }}>{dashboardData.availableContractors}</div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Available Contractors</div>
            </div>
          </div>
          <div style={{ background: '#f7f5ef', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ color: '#b6a179', marginBottom: '1rem' }}>Quick Actions</h4>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => setActiveTab('properties')} style={{ background: '#7c9a6d', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', cursor: 'pointer' }}>Manage Properties</button>
              <button onClick={() => setActiveTab('appointments')} style={{ background: '#b6a179', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', cursor: 'pointer' }}>View Appointments</button>
              <button onClick={() => window.open('/dashboard', '_blank')} style={{ background: '#e9e4d5', color: '#7c9a6d', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', cursor: 'pointer' }}>Full Dashboard</button>
            </div>
          </div>
        </div>
      )}
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
      {activeTab === 'projects' && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ color: '#b6a179', marginBottom: 12, fontSize: '1.2rem' }}>Manage Projects</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',marginBottom:'1rem'}}>
            <input value={projectName} onChange={e=>setProjectName(e.target.value)} placeholder="Project Name" required style={{flex:'1',minWidth:'120px'}} />
            <input value={projectBudget} onChange={e=>setProjectBudget(e.target.value)} placeholder="Budget (KES)" type="number" required style={{flex:'1',minWidth:'120px'}} />
            <input value={projectStartDate} onChange={e=>setProjectStartDate(e.target.value)} type="date" required style={{flex:'1',minWidth:'120px'}} />
            <input value={projectEndDate} onChange={e=>setProjectEndDate(e.target.value)} type="date" required style={{flex:'1',minWidth:'120px'}} />
            <button type="submit" onClick={handleProjectSubmit} style={{ background: '#7c9a6d', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', minWidth:'80px' }}>{projectEditId ? 'Update' : 'Add'}</button>
            {projectEditId && <button type="button" onClick={resetProjectForm} style={{ background: '#e9e4d5', color: '#7c9a6d', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', minWidth:'80px' }}>Cancel</button>}
          </div>

          <div style={{overflowX:'auto'}}><table className="admin-table" style={{marginTop:18}}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Budget</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>KES {p.budget?.toLocaleString()}</td>
                  <td>{new Date(p.start_date).toLocaleDateString()}</td>
                  <td>{new Date(p.end_date).toLocaleDateString()}</td>
                  <td style={{display:'flex',gap:8}}>
                    <button onClick={()=>handleProjectEdit(p)} style={{ background: '#b6a179', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Edit</button>
                    <button onClick={()=>deleteProjectHandler(p._id)} style={{ background: '#b60000', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}
      {activeTab === 'contractors' && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ color: '#b6a179', marginBottom: 12, fontSize: '1.2rem' }}>Manage Contractors</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',marginBottom:'1rem'}}>
            <input value={contractorName} onChange={e=>setContractorName(e.target.value)} placeholder="Name" required style={{flex:'1',minWidth:'120px'}} />
            <input value={contractorCompany} onChange={e=>setContractorCompany(e.target.value)} placeholder="Company" required style={{flex:'1',minWidth:'120px'}} />
            <input value={contractorPhone} onChange={e=>setContractorPhone(e.target.value)} placeholder="Phone" required style={{flex:'1',minWidth:'120px'}} />
            <input value={contractorEmail} onChange={e=>setContractorEmail(e.target.value)} placeholder="Email" type="email" required style={{flex:'1',minWidth:'120px'}} />
            <input value={contractorRate} onChange={e=>setContractorRate(e.target.value)} placeholder="Hourly Rate (KES)" type="number" required style={{flex:'1',minWidth:'120px'}} />
            <button type="submit" onClick={handleContractorSubmit} style={{ background: '#7c9a6d', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', minWidth:'80px' }}>{contractorEditId ? 'Update' : 'Add'}</button>
            {contractorEditId && <button type="button" onClick={resetContractorForm} style={{ background: '#e9e4d5', color: '#7c9a6d', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', minWidth:'80px' }}>Cancel</button>}
          </div>

          <div style={{overflowX:'auto'}}><table className="admin-table" style={{marginTop:18}}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Rate/Hour</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contractors.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.company}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                  <td>KES {c.hourly_rate}</td>
                  <td style={{display:'flex',gap:8}}>
                    <button onClick={()=>handleContractorEdit(c)} style={{ background: '#b6a179', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Edit</button>
                    <button onClick={()=>deleteContractorHandler(c._id)} style={{ background: '#b60000', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}
      {activeTab === 'landtitles' && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ color: '#b6a179', marginBottom: 12, fontSize: '1.2rem' }}>Manage Land Titles</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',marginBottom:'1rem'}}>
            <input value={titleNumber} onChange={e=>setTitleNumber(e.target.value)} placeholder="Title Number" required style={{flex:'1',minWidth:'120px'}} />
            <input value={ownerName} onChange={e=>setOwnerName(e.target.value)} placeholder="Owner Name" required style={{flex:'1',minWidth:'120px'}} />
            <input value={landSize} onChange={e=>setLandSize(e.target.value)} placeholder="Land Size (acres)" type="number" step="0.01" required style={{flex:'1',minWidth:'120px'}} />
            <input value={titleLocation} onChange={e=>setTitleLocation(e.target.value)} placeholder="Location" required style={{flex:'1',minWidth:'120px'}} />
            <input value={registrationDate} onChange={e=>setRegistrationDate(e.target.value)} type="date" required style={{flex:'1',minWidth:'120px'}} />
            <button type="submit" onClick={handleTitleSubmit} style={{ background: '#7c9a6d', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', minWidth:'80px' }}>{titleEditId ? 'Update' : 'Add'}</button>
            {titleEditId && <button type="button" onClick={resetTitleForm} style={{ background: '#e9e4d5', color: '#7c9a6d', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', minWidth:'80px' }}>Cancel</button>}
          </div>

          <div style={{overflowX:'auto'}}><table className="admin-table" style={{marginTop:18}}>
            <thead>
              <tr>
                <th>Title Number</th>
                <th>Owner</th>
                <th>Size (acres)</th>
                <th>Location</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {landTitles.map((t) => (
                <tr key={t._id}>
                  <td>{t.title_number}</td>
                  <td>{t.owner_name}</td>
                  <td>{t.land_size}</td>
                  <td>{t.location}</td>
                  <td>{new Date(t.registration_date).toLocaleDateString()}</td>
                  <td style={{display:'flex',gap:8}}>
                    <button onClick={()=>handleTitleEdit(t)} style={{ background: '#b6a179', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Edit</button>
                    <button onClick={()=>deleteTitleHandler(t._id)} style={{ background: '#b60000', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}
      {activeTab === 'compliance' && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ color: '#b6a179', marginBottom: 12, fontSize: '1.2rem' }}>Manage Compliance</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',marginBottom:'1rem'}}>
            <input value={permitType} onChange={e=>setPermitType(e.target.value)} placeholder="Permit Type" required style={{flex:'1',minWidth:'120px'}} />
            <input value={permitNumber} onChange={e=>setPermitNumber(e.target.value)} placeholder="Permit Number" required style={{flex:'1',minWidth:'120px'}} />
            <input value={issuingAuthority} onChange={e=>setIssuingAuthority(e.target.value)} placeholder="Issuing Authority" required style={{flex:'1',minWidth:'120px'}} />
            <input value={issueDate} onChange={e=>setIssueDate(e.target.value)} type="date" required style={{flex:'1',minWidth:'120px'}} />
            <input value={expiryDate} onChange={e=>setExpiryDate(e.target.value)} type="date" required style={{flex:'1',minWidth:'120px'}} />
            <button type="submit" onClick={handleComplianceSubmit} style={{ background: '#7c9a6d', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', minWidth:'80px' }}>{complianceEditId ? 'Update' : 'Add'}</button>
            {complianceEditId && <button type="button" onClick={resetComplianceForm} style={{ background: '#e9e4d5', color: '#7c9a6d', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', minWidth:'80px' }}>Cancel</button>}
          </div>

          <div style={{overflowX:'auto'}}><table className="admin-table" style={{marginTop:18}}>
            <thead>
              <tr>
                <th>Permit Type</th>
                <th>Permit Number</th>
                <th>Authority</th>
                <th>Issue Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {compliance.map((c) => (
                <tr key={c._id}>
                  <td>{c.permit_type}</td>
                  <td>{c.permit_number}</td>
                  <td>{c.issuing_authority}</td>
                  <td>{new Date(c.issue_date).toLocaleDateString()}</td>
                  <td>{new Date(c.expiry_date).toLocaleDateString()}</td>
                  <td>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: 4,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: c.status === 'active' ? '#d4edda' : c.status === 'expired' ? '#f8d7da' : '#fff3cd',
                      color: c.status === 'active' ? '#155724' : c.status === 'expired' ? '#721c24' : '#856404'
                    }}>
                      {c.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </td>
                  <td style={{display:'flex',gap:8}}>
                    <button onClick={()=>handleComplianceEdit(c)} style={{ background: '#b6a179', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Edit</button>
                    <button onClick={()=>deleteComplianceHandler(c._id)} style={{ background: '#b60000', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}
      <Toast message={toast} onClose={closeToast} />
    </section>
  );
};

export default AdminPortal; 