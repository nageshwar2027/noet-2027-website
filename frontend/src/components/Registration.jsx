import React, { useState } from 'react';
import './Registration.css';
import { API_BASE_URL, warmupBackend } from '../config.js';

const Registration = () => {
  const [formData, setFormData] = useState({
    full_name: '', email: '', institution: '', payment_mode: '', participant_type: 'Others', transaction_id: ''
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus('Submitting registration...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    // Progressive status updates for slower cloud backend wake-ups
    const stage1Timer = setTimeout(() => {
      setStatus('Connecting to server (cloud instance may be starting up, please wait)...');
    }, 4000);
    const stage2Timer = setTimeout(() => {
      setStatus('Still processing with server, almost done...');
    }, 18000);

    try {
      const response = await fetch(`${API_BASE_URL}/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(timeoutId);

      if (response.ok) {
        setStatus('Registration successful!');
        setFormData({
          full_name: '',
          email: '',
          institution: '',
          payment_mode: '',
          participant_type: 'Others',
          transaction_id: '',
        });
      } else {
        let errorMsg = 'Failed to register. Please try again.';
        try {
          const errData = await response.json();
          if (errData && typeof errData === 'object') {
            const firstKey = Object.keys(errData)[0];
            const val = errData[firstKey];
            if (Array.isArray(val) && val.length > 0) {
              errorMsg = `${firstKey.replace('_', ' ')}: ${val[0]}`;
            } else if (typeof val === 'string') {
              errorMsg = val;
            }
          }
        } catch (_) {}
        setStatus(errorMsg);
      }
    } catch (err) {
      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        setStatus('Request timed out. The server took too long to respond. Please try again.');
      } else {
        setStatus('Error connecting to server. Please check your internet connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="registration" className="registration-section">
      <div className="container">
        <h2 className="fade-in-up">Registration</h2>
        
        <div className="registration-grid">
          <div className="fees-info glass fade-in-up">
            <h3>Registration Fees</h3>
            <div className="fees-list">
              <div className="fee-item">
                <span className="fee-category">Industrial Personnel</span>
                <span className="fee-amount">₹12,000</span>
              </div>
              <div className="fee-item">
                <span className="fee-category">Faculty & Scientists</span>
                <span className="fee-amount">₹8,000</span>
              </div>
              <div className="fee-item">
                <span className="fee-category">Students & Scholars</span>
                <span className="fee-amount">₹3,000</span>
              </div>
              <div className="fee-item">
                <span className="fee-category">Others</span>
                <span className="fee-amount">₹8,000</span>
              </div>
            </div>

            <div className="bank-details">
              <h4>Payment Details</h4>
              <div className="payment-methods">
                <div className="qr-code-container">
                  <img src="/assets/qr_code.png" alt="Payment QR Code" />
                  <p>Scan to Pay</p>
                </div>
                <div className="bank-text-info">
                  <div className="bank-detail-row">
                    <strong>Name:</strong>
                    <span>IIT ISM CEP ACCOUNT</span>
                  </div>
                  <div className="bank-detail-row">
                    <strong>Account:</strong>
                    <span>110261358281</span>
                  </div>
                  <div className="bank-detail-row">
                    <strong>Bank:</strong>
                    <span>CANARA BANK</span>
                  </div>
                  <div className="bank-detail-row">
                    <strong>IFSC:</strong>
                    <span>CNRB0000986</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="registration-form glass fade-in-up delay-1">
            <h3>Register Now</h3>
            <form onSubmit={handleSubmit} onFocus={warmupBackend} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="full_name">Full Name *</label>
                  <input type="text" id="full_name" name="full_name" required value={formData.full_name} onChange={handleChange}/>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}/>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="institution">Institution / Organization</label>
                  <input type="text" id="institution" name="institution" value={formData.institution} onChange={handleChange}/>
                </div>
                <div className="form-group">
                  <label htmlFor="participant_type">Participant Type *</label>
                  <select id="participant_type" name="participant_type" value={formData.participant_type} onChange={handleChange} required>
                    <option value="Industrial Personnel">Industrial Personnel</option>
                    <option value="Faculty/Scientist">Faculty / Scientist</option>
                    <option value="Student/Scholar">Student / Scholar</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="payment_mode">Payment Mode</label>
                  <input type="text" id="payment_mode" name="payment_mode" placeholder="e.g. UPI, NEFT, Bank Transfer" value={formData.payment_mode} onChange={handleChange}/>
                </div>
                <div className="form-group">
                  <label htmlFor="transaction_id">Transaction ID / UTR Number</label>
                  <input type="text" id="transaction_id" name="transaction_id" value={formData.transaction_id} onChange={handleChange}/>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting Registration...' : 'Submit Registration'}
              </button>
              {status && <p className="status-msg">{status}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
