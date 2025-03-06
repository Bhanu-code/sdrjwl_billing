import React, { createContext, useState, useContext, ReactNode } from 'react';

// Toast types
type ToastVariant = 'default' | 'success' | 'destructive';

// Toast interface
interface Toast {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

// Toast context type
interface ToastContextType {
  toast: (options: Toast) => void;
}

// Create context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast provider component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (options: Toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...options, id };
    
    setToasts((currentToasts) => [...currentToasts, newToast]);

    // Automatically remove toast after 5 seconds
    setTimeout(() => {
      setToasts((currentToasts) => 
        currentToasts.filter((t) => t.id !== id)
      );
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

// Custom hook for using toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast container component
const ToastContainer: React.FC<{ toasts: Toast[] }> = ({ toasts }) => {
  const getVariantClasses = (variant?: ToastVariant) => {
    switch (variant) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'destructive':
        return 'bg-red-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            ${getVariantClasses(toast.variant)} 
            p-4 rounded-lg shadow-lg 
            transition-all duration-300 
            animate-slide-in-right
          `}
        >
          {toast.title && (
            <div className="font-bold mb-1">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};