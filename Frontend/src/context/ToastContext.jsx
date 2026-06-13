import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast container on top-right */}
      <div className="fixed top-6 right-6 z-100 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Single Toast Card Component
const ToastCard = ({ toast, onClose }) => {
  const { id, message, type, duration } = toast;

  const getToastStyles = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-slate-900/95 border-red-500/30',
          text: 'text-red-400',
          progress: 'bg-red-500',
          icon: <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />,
        };
      case 'info':
        return {
          bg: 'bg-slate-900/95 border-cyan-500/30',
          text: 'text-cyan-400',
          progress: 'bg-cyan-500',
          icon: <Info className="h-5 w-5 text-cyan-500 shrink-0" />,
        };
      default: // success
        return {
          bg: 'bg-slate-900/95 border-emerald-500/30',
          text: 'text-emerald-400',
          progress: 'bg-emerald-500',
          icon: <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />,
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`relative flex items-center justify-between p-4 rounded-xl border shadow-xl backdrop-blur-md pointer-events-auto transition-all duration-300 animate-slide-in ${styles.bg}`}
      style={{
        animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      <div className="flex items-center gap-3 pr-4">
        {styles.icon}
        <span className="text-sm font-semibold text-slate-200">{message}</span>
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-slate-500 hover:text-slate-200 transition-colors shrink-0"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Lifeline progress bar at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 rounded-b-xl overflow-hidden">
        <div
          className={`h-full rounded-r-full ${styles.progress}`}
          style={{
            animation: `toastLifeline ${duration}ms linear forwards`,
          }}
        />
      </div>

      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes toastLifeline {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};
