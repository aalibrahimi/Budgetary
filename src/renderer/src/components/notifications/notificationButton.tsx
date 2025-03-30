import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { useDarkModeStore } from '@renderer/routes/__root';
import { NotificationType } from '../NotificationSystem';


interface NotifyButtonProps {
  category: string;
  msg: string;
  type?: NotificationType;
  isVisible: boolean;
}

/**
 * NotifyButton - Legacy component for displaying in-app notifications
 * This maintains backward compatibility with existing code while using the new styling
 */
const NotifyButton: React.FC<NotifyButtonProps> = ({
  category,
  msg,
  type = NotificationType.SUCCESS,
  isVisible
}) => {
  const [show, setShow] = useState(false);
  const { isDarkMode } = useDarkModeStore();
  
  useEffect(() => {
    setShow(isVisible);
    
    if (isVisible) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]);
  
  if (!show) return null;
  
  // Configuration for different notification types with light/dark mode support
  const configs = {
    [NotificationType.SUCCESS]: {
      icon: <CheckCircle size={20} />,
      baseClasses: isDarkMode 
        ? "bg-green-800 text-green-100 border-green-700" 
        : "bg-green-100 text-green-800 border-green-200",
      iconClasses: isDarkMode ? "text-green-300" : "text-green-500"
    },
    [NotificationType.WARNING]: {
      icon: <AlertTriangle size={20} />,
      baseClasses: isDarkMode 
        ? "bg-yellow-800 text-yellow-100 border-yellow-700" 
        : "bg-yellow-100 text-yellow-800 border-yellow-200",
      iconClasses: isDarkMode ? "text-yellow-300" : "text-yellow-500"
    },
    [NotificationType.ERROR]: {
      icon: <XCircle size={20} />,
      baseClasses: isDarkMode 
        ? "bg-red-800 text-red-100 border-red-700" 
        : "bg-red-100 text-red-800 border-red-200",
      iconClasses: isDarkMode ? "text-red-300" : "text-red-500"
    },
    [NotificationType.INFO]: {
      icon: <Info size={20} />,
      baseClasses: isDarkMode 
        ? "bg-blue-800 text-blue-100 border-blue-700" 
        : "bg-blue-100 text-blue-800 border-blue-200",
      iconClasses: isDarkMode ? "text-blue-300" : "text-blue-500"
    }
  };

  const { icon, baseClasses, iconClasses } = configs[type] || configs[NotificationType.SUCCESS];

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-start max-w-sm p-4 rounded-lg shadow-lg ${baseClasses} border transition-all duration-300 ease-in-out`}>
      <div className={`inline-flex items-center justify-center flex-shrink-0 ${iconClasses}`}>
        {icon}
      </div>
      <div className="ml-3 text-sm font-normal">
        {category && <div className="font-medium">{category}</div>}
        <div>{msg}</div>
      </div>
    </div>
  );
};

export default NotifyButton;