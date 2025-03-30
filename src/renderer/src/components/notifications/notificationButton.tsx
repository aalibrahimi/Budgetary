import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
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
      baseClasses: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 border-green-200 dark:border-green-700",
      iconClasses: "text-green-500 dark:text-green-300"
    },
    [NotificationType.WARNING]: {
      icon: <AlertTriangle size={20} />,
      baseClasses: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 border-yellow-200 dark:border-yellow-700",
      iconClasses: "text-yellow-500 dark:text-yellow-300"
    },
    [NotificationType.ERROR]: {
      icon: <XCircle size={20} />,
      baseClasses: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 border-red-200 dark:border-red-700",
      iconClasses: "text-red-500 dark:text-red-300"
    },
    [NotificationType.INFO]: {
      icon: <Info size={20} />,
      baseClasses: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 border-blue-200 dark:border-blue-700",
      iconClasses: "text-blue-500 dark:text-blue-300"
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