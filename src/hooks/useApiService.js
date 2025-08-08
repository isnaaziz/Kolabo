import { useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import apiService from '../services/apiService';

// Custom hook to use API service with toast context
export const useApiService = () => {
    const toastContext = useToast();

    // Set toast context on the service
    useEffect(() => {
        apiService.setToastContext(toastContext);
    }, [toastContext]);

    return apiService;
};
