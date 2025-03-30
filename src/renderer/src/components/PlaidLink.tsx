// src/renderer/src/components/PlaidLink.tsx
import React, { useEffect, useState, useCallback } from 'react';

import { usePlaidStore } from '../stores/plaidStore';
import { 
  CircleX, 
  CircleCheck, 
  Loader, 
  BanknoteIcon 
} from 'lucide-react';
import { plaidService } from '@renderer/stores/plaidService';

interface PlaidLinkButtonProps {
  buttonText?: string;
  onSuccess?: () => void;
  onExit?: () => void;
  className?: string;
}

// Helper to load the Plaid Link script
const loadPlaidLinkScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('plaid-link-script')) {
      return resolve();
    }
    
    const script = document.createElement('script');
    script.id = 'plaid-link-script';
    script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Plaid Link script'));
    document.head.appendChild(script);
  });
};

const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({
  buttonText = 'Connect your bank account',
  onSuccess,
  onExit,
  className = ''
}) => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [plaidLinkLoaded, setPlaidLinkLoaded] = useState(false);
  
  const { fetchItems } = usePlaidStore();

  // Load the Plaid Link script
  useEffect(() => {
    const loadScript = async () => {
      try {
        await loadPlaidLinkScript();
        setPlaidLinkLoaded(true);
      } catch (error) {
        console.error('Error loading Plaid Link script:', error);
        setStatus('error');
        setError('Failed to load banking connection script. Please try again later.');
      }
    };
    
    loadScript();
  }, []);

  // Function to get a link token from our server
  const generateLinkToken = useCallback(async () => {
    try {
      setStatus('loading');
      const token = await plaidService.createLinkToken();
      setLinkToken(token);
      setStatus('idle');
    } catch (err) {
      console.error('Error generating link token:', err);
      setStatus('error');
      setError('Failed to initialize bank connection. Please try again later.');
    }
  }, []);

  // Get a link token when the component mounts
  useEffect(() => {
    if (plaidLinkLoaded) {
      generateLinkToken();
    }
  }, [generateLinkToken, plaidLinkLoaded]);

  // Define the success callback
  const handleSuccess = useCallback(async (publicToken: string, metadata: any) => {
    try {
      setStatus('loading');
      await plaidService.exchangePublicToken(
        publicToken,
        metadata.institution.institution_id,
        metadata.institution.name
      );
      
      // Refresh our items list
      await fetchItems();
      
      setStatus('success');
      
      // Call the onSuccess prop if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error in Plaid success handler:', err);
      setStatus('error');
      setError('Failed to link account. Please try again.');
    }
  }, [fetchItems, onSuccess]);

  // Open Plaid Link
  const openPlaidLink = useCallback(() => {
    if (!plaidLinkLoaded || !linkToken) {
      console.error('Plaid Link is not ready');
      return;
    }
    
    // Access the global Plaid object
    const Plaid = (window as any).Plaid;
    
    if (!Plaid) {
      console.error('Plaid not found in window');
      setStatus('error');
      setError('Banking connection interface failed to load');
      return;
    }
    
    // Configure and open Plaid Link
    const handler = Plaid.create({
      token: linkToken,
      onSuccess: (public_token: string, metadata: any) => {
        handler.destroy();
        handleSuccess(public_token, metadata);
      },
      onExit: (err: any, metadata: any) => {
        handler.destroy();
        console.log('Plaid Link exited', err, metadata);
        
        if (err !== null && err.error_code !== 'item-no-error') {
          setStatus('error');
          setError(err.display_message || 'Connection error. Please try again.');
        }
        
        // Call the onExit prop if provided
        if (onExit) {
          onExit();
        }
      },
      onLoad: () => {
        // Link loaded successfully
      },
      receivedRedirectUri: window.location.href,
    });
    
    handler.open();
  }, [plaidLinkLoaded, linkToken, handleSuccess, onExit]);

  // Handle retry - generate a new link token and reset status
  const handleRetry = useCallback(() => {
    setStatus('idle');
    setError(null);
    generateLinkToken();
  }, [generateLinkToken]);

  // Render button based on status
  const renderButton = () => {
    switch (status) {
      case 'loading':
        return (
          <button 
            className={`flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded cursor-not-allowed ${className}`}
            disabled
          >
            <Loader className="animate-spin h-4 w-4" />
            <span>Processing...</span>
          </button>
        );
        
      case 'success':
        return (
          <button 
            className={`flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded ${className}`}
            disabled
          >
            <CircleCheck className="h-4 w-4" />
            <span>Account Connected</span>
          </button>
        );
        
      case 'error':
        return (
          <button 
            onClick={handleRetry}
            className={`flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${className}`}
          >
            <CircleX className="h-4 w-4" />
            <span>Retry Connection</span>
          </button>
        );
        
      default:
        return (
          <button 
            onClick={openPlaidLink}
            disabled={!plaidLinkLoaded || !linkToken}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-700 ${className}`}
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <BanknoteIcon className="h-4 w-4" />
            <span>{buttonText}</span>
          </button>
        );
    }
  };

  return (
    <div>
      {renderButton()}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default PlaidLinkButton;