import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: isDark 
      ? 'bg-green-900/90 text-green-100 border-green-700' 
      : 'bg-green-50 text-green-800 border-green-200',
    error: isDark 
      ? 'bg-red-900/90 text-red-100 border-red-700' 
      : 'bg-red-50 text-red-800 border-red-200',
    warning: isDark 
      ? 'bg-yellow-900/90 text-yellow-100 border-yellow-700' 
      : 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: isDark 
      ? 'bg-blue-900/90 text-blue-100 border-blue-700' 
      : 'bg-blue-50 text-blue-800 border-blue-200'
  };

  const Icon = icons[type];

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
      isVisible 
        ? 'translate-x-0 opacity-100 scale-100' 
        : 'translate-x-full opacity-0 scale-95'
    }`}>
      <div className={`
        max-w-md p-4 rounded-xl border shadow-lg backdrop-blur-sm
        flex items-center gap-3
        ${colors[type]}
      `}>
        <Icon className="h-5 w-5 flex-shrink-0" />
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="p-1 rounded-lg hover:bg-black/10 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;