import React, { useState } from 'react';
import './Call.css';

const Call = ({ contactPerson, onClose }) => {
  const [callStatus, setCallStatus] = useState('ready'); // ready, calling, active

  const initiateCall = () => {
    setCallStatus('calling');
    
    // In a real application, this would integrate with a service like Twilio, WebRTC, etc.
    // For now, we'll just open the phone dialer
    if (contactPerson.phone) {
      window.location.href = `tel:${contactPerson.phone}`;
      
      // Simulate call status
      setTimeout(() => {
        setCallStatus('active');
      }, 2000);
    }
  };

  const endCall = () => {
    setCallStatus('ready');
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="call-container">
      <div className="call-modal">
        <div className="call-header">
          <h3>Call {contactPerson.fullName}</h3>
          <button className="call-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="call-body">
          <div className="call-avatar">
            <div className="call-avatar-circle">
              {contactPerson.fullName?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="call-info">
            <h2>{contactPerson.fullName}</h2>
            <p className="call-phone">{contactPerson.phone}</p>
            {contactPerson.village && (
              <p className="call-village">{contactPerson.village}</p>
            )}
          </div>

          <div className="call-status">
            {callStatus === 'ready' && <p>Ready to call</p>}
            {callStatus === 'calling' && (
              <p className="call-status-calling">Calling...</p>
            )}
            {callStatus === 'active' && (
              <p className="call-status-active">Call in progress</p>
            )}
          </div>

          <div className="call-actions">
            {callStatus === 'ready' && (
              <button className="call-btn call-btn-start" onClick={initiateCall}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Start Call
              </button>
            )}

            {(callStatus === 'calling' || callStatus === 'active') && (
              <button className="call-btn call-btn-end" onClick={endCall}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                End Call
              </button>
            )}
          </div>

          <div className="call-note">
            <p>
              <strong>Note:</strong> This will open your device's phone dialer.
              Make sure you have {contactPerson.fullName}'s permission before calling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Call;
