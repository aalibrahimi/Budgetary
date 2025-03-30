import React, { useState, useEffect, useContext } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { useDarkModeStore } from '../routes/__root';

// Define notification types for consistent styling
export enum NotificationType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info'
}

// Interface for both in-app and desktop notifications
export interface NotificationProps {
  type: NotificationType;
  category: string;
  message: string;
  isVisible?: boolean;
  duration?: number;
  onClose?: () => void;
}

// Create notification context to be used across components
const NotificationContext = React.createContext<{
  notification: {
    show: boolean;
    type: NotificationType;
    category: string;
    message: string;
  };
  showNotification: (
    category: string, 
    message: string, 
    type?: NotificationType
  ) => void;
  handleCloseNotification: () => void;
}>({
  notification: {
    show: false,
    type: NotificationType.INFO,
    category: '',
    message: ''
  },
  showNotification: () => {},
  handleCloseNotification: () => {}
});

/**
 * InAppNotification - Renders a notification within the application UI
 * This component adapts to light/dark mode based on system preferences
 */
export const InAppNotification: React.FC<NotificationProps> = ({
  type = NotificationType.INFO,
  category = '',
  message = '',
  isVisible = false,
  duration = 5000,
  onClose = () => {}
}) => {
  const [isShown, setIsShown] = useState(isVisible);
  const { isDarkMode } = useDarkModeStore();

  // Handle showing and auto-hiding of notification
  useEffect(() => {
    setIsShown(isVisible);
    
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        setIsShown(false);
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  // Handle manual close
  const handleClose = () => {
    setIsShown(false);
    onClose();
  };

  // Exit early if not visible
  if (!isShown) return null;

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

  const { icon, baseClasses, iconClasses } = configs[type] || configs[NotificationType.INFO];

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-start max-w-sm p-4 mb-4 rounded-lg shadow-lg ${baseClasses} border transition-all duration-300 ease-in-out`}>
      <div className={`inline-flex items-center justify-center flex-shrink-0 ${iconClasses}`}>
        {icon}
      </div>
      <div className="ml-3 text-sm font-normal">
        {category && <div className="font-medium">{category}</div>}
        <div>{message}</div>
      </div>
      <button 
        type="button" 
        className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 ${baseClasses} hover:opacity-80 focus:ring-2 focus:outline-none`}
        onClick={handleClose}
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
};

/**
 * Hook to manage both in-app and desktop notifications
 * This centralizes notification logic for the application
 */
export const useNotificationSystem = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationSystem must be used within a NotificationProvider");
  }
  return context;
};

/**
 * NotificationProvider - Component to be used at the app root level
 * This handles rendering the in-app notification based on the notification state
 */
export const NotificationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [notification, setNotification] = useState<{
    show: boolean;
    type: NotificationType;
    category: string;
    message: string;
  }>({
    show: false,
    type: NotificationType.INFO,
    category: '',
    message: ''
  });

  /**
   * Show a notification - displays both in-app and desktop notifications with the same message
   * @param category The notification category (e.g., "Success", "Error")
   * @param message The notification message content
   * @param type The type of notification (success, warning, error, info)
   */
  const showNotification = (
    category: string,
    message: string,
    type: NotificationType = NotificationType.INFO
  ) => {
    // Set in-app notification state
    setNotification({
      show: true,
      type,
      category,
      message
    });
    
    // Send desktop notification with the same information
    // The desktop notification API might not support all the same properties
    // so we format the message to include the category
    const desktopTitle = category || getDefaultTitleForType(type);
    
    // Call the app's desktop notification API
    if (window.api && window.api.notify) {
      window.api.notify({
        title: desktopTitle,
        body: message,
        type: type.toLowerCase()
      });
    }
    
    // Auto-hide the in-app notification after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({
        ...prev,
        show: false
      }));
    }, 5000);
  };

  // Helper function to get default titles based on notification type
  const getDefaultTitleForType = (type: NotificationType): string => {
    switch(type) {
      case NotificationType.SUCCESS: return 'Success';
      case NotificationType.ERROR: return 'Error';
      case NotificationType.WARNING: return 'Warning';
      case NotificationType.INFO: 
      default: return 'Information';
    }
  };

  // Handle closing the notification manually
  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      show: false
    }));
  };

  const contextValue = {
    notification,
    showNotification,
    handleCloseNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <InAppNotification
        isVisible={notification.show}
        type={notification.type}
        category={notification.category}
        message={notification.message}
        onClose={handleCloseNotification}
      />
    </NotificationContext.Provider>
  );
};

export default InAppNotification;