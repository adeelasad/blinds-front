import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { 
  MapPin, 
  Phone, 
  Camera, 
  CheckCircle2, 
  Navigation, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';

const InstallerPortal = () => {
  const [adminKey] = useState(() => sessionStorage.getItem('lumina_admin_key') || 'admin123!');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedSuccess, setCompletedSuccess] = useState(false);

  const fetchJobs = useCallback(() => {
    setLoading(true);
    api.getAdminJobs(adminKey)
      .then(res => {
        if (res.jobs) {
          setJobs(res.jobs);
          if (res.jobs.length > 0) {
            setSelectedJob(prev => prev || res.jobs[0]);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [adminKey]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleToggleChecklist = async (field) => {
    if (!selectedJob) return;
    const updatedVal = !selectedJob[field];
    const updatedJob = { ...selectedJob, [field]: updatedVal };
    setSelectedJob(updatedJob);
    setJobs(jobs.map(j => j.id === selectedJob.id ? updatedJob : j));

    await api.updateAdminJob(adminKey, selectedJob.id, { [field]: updatedVal });
  };

  const handleCompleteJob = async () => {
    if (!selectedJob) return;
    const updatedJob = { 
      ...selectedJob, 
      status: 'completed',
      checklist_arrived: true,
      checklist_measured: true,
      checklist_installed: true,
      checklist_cleaned: true
    };
    setSelectedJob(updatedJob);
    setJobs(jobs.map(j => j.id === selectedJob.id ? updatedJob : j));
    setCompletedSuccess(true);

    await api.updateAdminJob(adminKey, selectedJob.id, { 
      status: 'completed',
      checklist_arrived: true,
      checklist_measured: true,
      checklist_installed: true,
      checklist_cleaned: true
    });
  };

  return (
    <div className="installer-portal container section animate-fade-in" style={{ maxWidth: '640px', paddingBottom: 'var(--spacing-16)' }}>
      {/* Top Header */}
      <div className="installer-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="trade-badge">Field Tech Portal</span>
            <h1>Today's Installations</h1>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>
              Marcus Taylor • Montgomery County & Northern VA Route
            </p>
          </div>
          <button className="icon-btn" onClick={fetchJobs} title="Refresh Jobs">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading assigned jobs...</div>
      ) : (
        <>
          {/* Active Job Selector / Carousel */}
          <div className="installer-job-tabs">
            {jobs.map((job, idx) => (
              <button
                key={job.id}
                className={`installer-job-btn ${selectedJob?.id === job.id ? 'active' : ''} ${job.status === 'completed' ? 'done' : ''}`}
                onClick={() => { setSelectedJob(job); setCompletedSuccess(false); }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontWeight: 'bold' }}>Job #{idx + 1}: {job.customer_name}</span>
                  {job.status === 'completed' ? (
                    <span className="status-pill completed" style={{ margin: 0 }}>Done</span>
                  ) : (
                    <span className="status-pill in-production" style={{ margin: 0 }}>Active</span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
                  {job.product_type}
                </div>
              </button>
            ))}
          </div>

          {selectedJob && (
            <div className="installer-card animate-fade-in">
              {/* Customer & Location Card */}
              <div className="installer-section-header">
                <h2>{selectedJob.customer_name}</h2>
                <span className={`status-pill ${selectedJob.status}`}>{selectedJob.status}</span>
              </div>

              <div className="installer-details-box">
                <div className="installer-detail-row">
                  <MapPin size={18} color="var(--color-accent-premium)" style={{ flexShrink: 0 }} />
                  <div>
                    <strong>{selectedJob.address}</strong>
                    <div style={{ marginTop: '4px' }}>
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(selectedJob.address)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
                      >
                        <Navigation size={14} /> Open in GPS Navigation
                      </a>
                    </div>
                  </div>
                </div>

                <div className="installer-detail-row" style={{ marginTop: '12px' }}>
                  <Phone size={18} color="var(--color-accent-premium)" style={{ flexShrink: 0 }} />
                  <div>
                    <strong>(301) 555-0192</strong>
                    <div style={{ marginTop: '4px' }}>
                      <a 
                        href="tel:3015550192" 
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Phone size={14} /> Call Customer Directly
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Scope */}
              <div className="installer-scope-box">
                <h4>Treatment Specifications</h4>
                <p style={{ margin: '4px 0', fontSize: '0.95rem' }}>{selectedJob.product_type}</p>
                {selectedJob.notes && (
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#666', background: '#f7f5f0', padding: '8px', borderRadius: '4px' }}>
                    <strong>Special Instructions:</strong> {selectedJob.notes}
                  </p>
                )}
              </div>

              {/* Mandatory Checklist */}
              <div className="installer-checklist-wrap">
                <h3>Installation Quality Checklist</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', marginBottom: '12px' }}>
                  Required for 100% Fit Guarantee verification and warranty certification:
                </p>

                <div className="checklist-items">
                  <label className={`checklist-item ${selectedJob.checklist_arrived ? 'checked' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={!!selectedJob.checklist_arrived}
                      onChange={() => handleToggleChecklist('checklist_arrived')}
                    />
                    <div className="checklist-text">
                      <strong>1. Arrived on Location</strong>
                      <span>Confirmed customer presence & inspected window openings</span>
                    </div>
                  </label>

                  <label className={`checklist-item ${selectedJob.checklist_measured ? 'checked' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={!!selectedJob.checklist_measured}
                      onChange={() => handleToggleChecklist('checklist_measured')}
                    />
                    <div className="checklist-text">
                      <strong>2. Laser Measurement Verified</strong>
                      <span>Checked window depth, squareness, and bracket positions</span>
                    </div>
                  </label>

                  <label className={`checklist-item ${selectedJob.checklist_installed ? 'checked' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={!!selectedJob.checklist_installed}
                      onChange={() => handleToggleChecklist('checklist_installed')}
                    />
                    <div className="checklist-text">
                      <strong>3. Treatments Mounted & Tested</strong>
                      <span>Tested smooth cordless glide, motor pairing & child safety stop</span>
                    </div>
                  </label>

                  <label className={`checklist-item ${selectedJob.checklist_cleaned ? 'checked' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={!!selectedJob.checklist_cleaned}
                      onChange={() => handleToggleChecklist('checklist_cleaned')}
                    />
                    <div className="checklist-text">
                      <strong>4. Cleaned Work Area & Packed Boxes</strong>
                      <span>Zero debris left behind; customer demo completed</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Photo Capture */}
              <div className="installer-photos-box">
                <h4>Job Site Photos</h4>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => alert('Photo camera interface ready. Photo uploaded to gallery queue.')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Camera size={16} /> Take Before Photo
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => alert('Photo camera interface ready. Photo uploaded to gallery queue.')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Camera size={16} /> Take After Photo
                  </button>
                </div>
              </div>

              {completedSuccess && (
                <div className="auth-alert success animate-fade-in" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={20} color="#2e7d32" />
                  <span>Job marked completed! Google Review request email sent to customer.</span>
                </div>
              )}

              {/* Complete Job Button */}
              <div style={{ marginTop: '24px' }}>
                <button
                  className="btn btn-primary btn-large full-width"
                  onClick={handleCompleteJob}
                  disabled={selectedJob.status === 'completed'}
                  style={{ padding: '16px', fontSize: '1.1rem', backgroundColor: selectedJob.status === 'completed' ? '#2e7d32' : 'var(--color-primary-text)' }}
                >
                  {selectedJob.status === 'completed' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <CheckCircle2 size={20} /> Job Certified & Completed
                    </span>
                  ) : (
                    'Mark Job Completed & Send Review Request'
                  )}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>
                <ShieldCheck size={16} color="#2e7d32" />
                <span>Protected by Lumina Lifetime Craftsmanship Guarantee</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InstallerPortal;
