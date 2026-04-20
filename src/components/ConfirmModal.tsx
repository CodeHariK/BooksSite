import React from 'react';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  isDanger?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
  isDanger = false
}) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        animation: 'modalEntrance 0.3s ease-out'
      }}>
        <style>
          {`
            @keyframes modalEntrance {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}
        </style>
        
        {/* Header */}
        <div style={{ 
          padding: '24px 32px 16px', 
          textAlign: 'center'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '22px', 
            fontWeight: '800', 
            color: '#0f172a',
            letterSpacing: '-0.02em'
          }}>
            {title}
          </h3>
        </div>

        {/* Message */}
        <div style={{ 
          padding: '0 32px 32px', 
          textAlign: 'center'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '16px', 
            color: '#64748b', 
            lineHeight: '1.6' 
          }}>
            {message}
          </p>
        </div>

        {/* Actions */}
        <div style={{ 
          padding: '0 32px 32px', 
          display: 'flex', 
          gap: '12px' 
        }}>
          <button
            onClick={onClose}
            style={{ 
              flex: 1,
              padding: '14px', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              backgroundColor: '#fff', 
              color: '#64748b',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '15px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{ 
              flex: 1,
              padding: '14px', 
              borderRadius: '12px', 
              border: 'none', 
              backgroundColor: isDanger ? '#ef4444' : '#ffa100', 
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '15px',
              boxShadow: isDanger ? '0 4px 12px rgba(239, 68, 68, 0.2)' : '0 4px 12px rgba(255, 161, 0, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
