import { useState, useEffect } from 'react';
import * as api from '../api';

const Dashboard = () => {
  const [dashboards, setDashboards] = useState([]);
  const [projects, setProjects] = useState([]);
  const [landTitles, setLandTitles] = useState([]);
  const [compliance, setCompliance] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, titlesData, complianceData, contractorsData] = await Promise.all([
          api.get('/projects'),
          api.get('/land-titles'),
          api.get('/compliance'),
          api.get('/contractors')
        ]);
        setProjects(projectsData.data || []);
        setLandTitles(titlesData.data || []);
        setCompliance(complianceData.data || []);
        setContractors(contractorsData.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#7c9a6d', marginBottom: '2rem' }}>Management Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#b6a179', marginBottom: '1rem' }}>Active Projects</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c9a6d' }}>{projects.length}</div>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Smart contractor scheduling</p>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#b6a179', marginBottom: '1rem' }}>Land Titles</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c9a6d' }}>{landTitles.length}</div>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Digital title vaults</p>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#b6a179', marginBottom: '1rem' }}>Compliance Items</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c9a6d' }}>{compliance.length}</div>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Permit tracking</p>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#b6a179', marginBottom: '1rem' }}>Contractors</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c9a6d' }}>{contractors.length}</div>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Available contractors</p>
        </div>

      </div>

      <div style={{ marginTop: '3rem', background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#b6a179', marginBottom: '1rem' }}>Recent Projects</h3>
        {projects.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e9e4d5' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left', color: '#7c9a6d' }}>Project</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left', color: '#7c9a6d' }}>Status</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left', color: '#7c9a6d' }}>Budget</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left', color: '#7c9a6d' }}>End Date</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 5).map(project => (
                  <tr key={project._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.5rem' }}>{project.name}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        background: project.status === 'completed' ? '#d4edda' : project.status === 'active' ? '#fff3cd' : '#f8d7da',
                        color: project.status === 'completed' ? '#155724' : project.status === 'active' ? '#856404' : '#721c24'
                      }}>
                        {project.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem' }}>KES {project.budget?.toLocaleString()}</td>
                    <td style={{ padding: '0.5rem' }}>{new Date(project.end_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#666' }}>No projects found</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;