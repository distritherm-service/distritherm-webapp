import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useToast = () => {
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message, {
          duration: 3000,
          style: {
            background: '#10b981',
            color: '#fff',
          },
        });
        break;
      case 'error':
        toast.error(message, {
          duration: 4000,
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        });
        break;
      case 'warning':
        toast(message, {
          duration: 3500,
          icon: '⚠️',
          style: {
            background: '#f59e0b',
            color: '#fff',
          },
        });
        break;
      case 'info':
      default:
        toast(message, {
          duration: 3000,
          style: {
            background: '#3b82f6',
            color: '#fff',
          },
        });
        break;
    }
  }, []);

  return { showToast };
}; 