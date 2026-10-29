import { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [complaints, setComplaints] = useState([]); // Ab data database se aayega
  const [loading, setLoading] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  
  const [trackId, setTrackId] = useState('');
  const [trackedComplaint, setTrackedComplaint] = useState(null);

  // 1. Backend se saari complaints fetch karna (GET API)
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/complaints');
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  // Jab page pehli baar load ho, toh data le aao
  useEffect(() => {
    fetchComplaints();
  }, []);

  // 2. Nayi complaint submit karna (POST API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle) return alert("Please enter a title");

    try {
      const response = await fetch('http://localhost:8000/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDesc })
      });
      
      const result = await response.json();
      alert(`Complaint Submitted! Auto-routed to: ${result.data.department}`);
      
      setNewTitle('');
      setNewDesc('');
      setActiveTab('dashboard');
      fetchComplaints(); // Naya data wapas fetch karo
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Failed to submit complaint");
    }
  };

  // 3. Track function
  const handleTrack = () => {
    // Database se aayi list mein ID dhoondo
    const found = complaints.find(c => c.id.toString() === trackId);
    if (found) {
      setTrackedComplaint(found);
    } else {
      alert("Complaint ID not found!");
      setTrackedComplaint(null);
    }
  };

  // 4. Officer Action: Resolve Complaint (POST API)
  const resolveComplaint = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/resolve/${id}`, { method: 'POST' });
      alert(`Complaint #${id} marked as Resolved!`);
      
      fetchComplaints(); // Table refresh karo
      
      if (trackedComplaint && trackedComplaint.id === id) {
        setTrackedComplaint({ ...trackedComplaint, status: 'Resolved', sla_time: 'Completed' });
      }
    } catch (error) {
      console.error("Error resolving:", error);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '250px', backgroundColor: '#1e293b', color: 'white', padding: '20px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '30px', color: '#38bdf8' }}>GrievanceIQ</h1>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <li onClick={() => setActiveTab('dashboard')} style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: activeTab === 'dashboard' ? '#334155' : 'transparent' }}>📊 Officer Dashboard</li>
          <li onClick={() => setActiveTab('submit')} style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: activeTab === 'submit' ? '#334155' : 'transparent' }}>📝 Submit Complaint</li>
          <li onClick={() => setActiveTab('track')} style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: activeTab === 'track' ? '#334155' : 'transparent' }}>🔍 Track Status</li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '30px' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '20px', color: '#0f172a' }}>
            {activeTab === 'dashboard' && 'Officer Dashboard (Live DB)'}
            {activeTab === 'submit' && 'Submit a New Complaint'}
            {activeTab === 'track' && 'Track Complaint Status'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>HR</div>
            <span style={{ fontWeight: '500' }}>Harshad (Admin)</span>
          </div>
        </header>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            {loading ? <p>Loading data from cloud...</p> : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
                    <h3 style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>Total Complaints</h3>
                    <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{complaints.length}</p>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
                    <h3 style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>Pending Actions</h3>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>
                      {complaints.filter(c => c.status !== 'Resolved').length}
                    </p>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
                    <h3 style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>Resolved</h3>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>
                      {complaints.filter(c => c.status === 'Resolved').length}
                    </p>
                  </div>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ marginBottom: '20px' }}>Recent Complaints (From Cloud DB)</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th style={{ padding: '12px' }}>Title & Dept</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px' }}>SLA Timer</th>
                        <th style={{ padding: '12px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((c) => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px', fontWeight: '500' }}>#{c.id}</td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: '500' }}>{c.title}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Dept: {c.department}</div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ padding: '4px 8px', borderRadius: '20px', fontSize: '12px', backgroundColor: c.status === 'Resolved' ? '#dcfce7' : '#fee2e2', color: c.status === 'Resolved' ? '#166534' : '#991b1b' }}>
                              {c.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px', fontWeight: 'bold', color: c.sla_time === 'Completed' ? '#22c55e' : '#ef4444' }}>{c.sla_time}</td>
                          <td style={{ padding: '12px' }}>
                            {c.status !== 'Resolved' ? (
                              <button onClick={() => resolveComplaint(c.id)} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Mark Resolved</button>
                            ) : (
                              <span style={{ color: '#64748b', fontSize: '12px' }}>Done ✅</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* SUBMIT COMPLAINT TAB */}
        {activeTab === 'submit' && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '600px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Complaint Title</label>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="E.g. Water leakage in area..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description (NLP will process)</label>
                <textarea rows="4" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Describe your issue..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}></textarea>
              </div>
              <button type="submit" style={{ backgroundColor: '#38bdf8', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Submit & Auto-Route</button>
            </form>
          </div>
        )}

        {/* TRACK STATUS TAB */}
        {activeTab === 'track' && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px' }}>
             <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
              <input type="text" value={trackId} onChange={(e) => setTrackId(e.target.value)} placeholder="Enter ID (e.g. 1)" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <button onClick={handleTrack} style={{ backgroundColor: '#1e293b', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Track</button>
            </div>

            {trackedComplaint && (
              <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px' }}>
                
                <div style={{ backgroundColor: '#f0f9ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #38bdf8' }}>
                  <p style={{ fontSize: '14px', color: '#0369a1' }}><strong>AI NLP Analysis:</strong> Routed to <strong>{trackedComplaint.department}</strong> department.</p>
                </div>

                <h3 style={{ marginBottom: '10px' }}>Complaint #{trackedComplaint.id}: <span style={{color: '#0f172a'}}>{trackedComplaint.title}</span></h3>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '30px' }}>Current Status: <strong>{trackedComplaint.status}</strong></p>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '4px', backgroundColor: '#e2e8f0', zIndex: 1 }}></div>
                  
                  {['Submitted', 'NLP Processed', 'Routed', 'In Progress', 'Resolved'].map((step, index) => {
                    const isActive = trackedComplaint.status === 'Resolved' ? true : index <= 2; 
                    return (
                      <div key={index} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: isActive ? '#38bdf8' : '#e2e8f0', color: isActive ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {index + 1}
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: isActive ? '#0f172a' : '#64748b' }}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}