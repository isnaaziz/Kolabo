import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Toast types based on common API response patterns - moved inside to avoid HMR issues
const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    LOADING: 'loading'
};

// Toast actions
const TOAST_ACTIONS = {
    ADD_TOAST: 'ADD_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST',
    UPDATE_TOAST: 'UPDATE_TOAST',
    CLEAR_ALL: 'CLEAR_ALL'
};

// Initial state
const initialState = {
    toasts: []
};

// Reducer function
const toastReducer = (state, action) => {
    switch (action.type) {
        case TOAST_ACTIONS.ADD_TOAST:
            return {
                ...state,
                toasts: [...state.toasts, action.payload]
            };

        case TOAST_ACTIONS.REMOVE_TOAST:
            return {
                ...state,
                toasts: state.toasts.filter(toast => toast.id !== action.payload)
            };

        case TOAST_ACTIONS.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map(toast =>
                    toast.id === action.payload.id
                        ? { ...toast, ...action.payload.updates }
                        : toast
                )
            };

        case TOAST_ACTIONS.CLEAR_ALL:
            return {
                ...state,
                toasts: []
            };

        default:
            return state;
    }
};

// Create context
const ToastContext = createContext();

// Toast provider component
export const ToastProvider = ({ children }) => {
    const [state, dispatch] = useReducer(toastReducer, initialState);

    // Add toast function
    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            type: TOAST_TYPES.INFO,
            title: '',
            message: '',
            duration: 5000,
            autoClose: true,
            actions: [],
            ...toast
        };

        dispatch({
            type: TOAST_ACTIONS.ADD_TOAST,
            payload: newToast
        });

        // Auto remove toast if autoClose is enabled
        if (newToast.autoClose && newToast.type !== TOAST_TYPES.LOADING) {
            setTimeout(() => {
                removeToast(id);
            }, newToast.duration);
        }

        return id;
    }, []);

    // Remove toast function
    const removeToast = useCallback((id) => {
        dispatch({
            type: TOAST_ACTIONS.REMOVE_TOAST,
            payload: id
        });
    }, []);

    // Update toast function
    const updateToast = useCallback((id, updates) => {
        dispatch({
            type: TOAST_ACTIONS.UPDATE_TOAST,
            payload: { id, updates }
        });
    }, []);

    // Clear all toasts
    const clearAllToasts = useCallback(() => {
        dispatch({
            type: TOAST_ACTIONS.CLEAR_ALL
        });
    }, []);

    // Parse API response and create appropriate toast
    const showApiResponseToast = useCallback((response, options = {}) => {
        const { data, status } = response;

        // Default success patterns
        if (status >= 200 && status < 300) {
            const successMessage = data?.message || data?.detail || 'Operation completed successfully';
            return addToast({
                type: TOAST_TYPES.SUCCESS,
                title: options.successTitle || 'Success',
                message: successMessage,
                ...options
            });
        }

        // Error patterns
        if (status >= 400) {
            const errorMessage = data?.message || data?.detail || data?.error || 'An error occurred';
            const errorTitle = data?.error_code ? `Error ${data.error_code}` : 'Error';

            return addToast({
                type: TOAST_TYPES.ERROR,
                title: options.errorTitle || errorTitle,
                message: errorMessage,
                duration: 7000,
                ...options
            });
        }
    }, [addToast]);

    // Parse API error and create toast
    const showApiErrorToast = useCallback((error, options = {}) => {
        const response = error?.response;
        const data = response?.data;

        let title = 'Error';
        let message = 'An unexpected error occurred';

        if (response?.status) {
            // Handle specific HTTP status codes
            switch (response.status) {
                case 400:
                    title = 'Bad Request';
                    message = data?.message || 'Invalid request data';
                    break;
                case 401:
                    title = 'Unauthorized';
                    message = data?.message || 'Please login to continue';
                    break;
                case 403:
                    title = 'Forbidden';
                    message = data?.message || 'You don\'t have permission to perform this action';
                    break;
                case 404:
                    title = 'Not Found';
                    message = data?.message || 'The requested resource was not found';
                    break;
                case 422:
                    title = 'Validation Error';
                    // Handle validation errors array
                    if (data?.errors && Array.isArray(data.errors)) {
                        message = data.errors.map(err => err.message || err).join(', ');
                    } else {
                        message = data?.message || 'Please check your input and try again';
                    }
                    break;
                case 429:
                    title = 'Too Many Requests';
                    message = data?.message || 'Please wait before making another request';
                    break;
                case 500:
                    title = 'Server Error';
                    message = data?.message || 'Internal server error. Please try again later';
                    break;
                case 502:
                    title = 'Service Unavailable';
                    message = 'Service is temporarily unavailable';
                    break;
                default:
                    title = `Error ${response.status}`;
                    message = data?.message || error.message || 'An error occurred';
            }
        } else if (error?.message) {
            // Network errors
            if (error.message.includes('Network Error')) {
                title = 'Connection Error';
                message = 'Unable to connect to server. Please check your internet connection';
            } else {
                message = error.message;
            }
        }

        return addToast({
            type: TOAST_TYPES.ERROR,
            title: options.title || title,
            message: options.message || message,
            duration: 8000,
            ...options
        });
    }, [addToast]);

    // Show loading toast for async operations
    const showLoadingToast = useCallback((message = 'Loading...', options = {}) => {
        return addToast({
            type: TOAST_TYPES.LOADING,
            title: 'Please wait',
            message,
            autoClose: false,
            ...options
        });
    }, [addToast]);

    // Show success toast
    const showSuccessToast = useCallback((message, options = {}) => {
        return addToast({
            type: TOAST_TYPES.SUCCESS,
            title: 'Success',
            message,
            ...options
        });
    }, [addToast]);

    // Show error toast
    const showErrorToast = useCallback((message, options = {}) => {
        return addToast({
            type: TOAST_TYPES.ERROR,
            title: 'Error',
            message,
            duration: 7000,
            ...options
        });
    }, [addToast]);

    // Show warning toast
    const showWarningToast = useCallback((message, options = {}) => {
        return addToast({
            type: TOAST_TYPES.WARNING,
            title: 'Warning',
            message,
            duration: 6000,
            ...options
        });
    }, [addToast]);

    // Show info toast
    const showInfoToast = useCallback((message, options = {}) => {
        return addToast({
            type: TOAST_TYPES.INFO,
            title: 'Info',
            message,
            ...options
        });
    }, [addToast]);

    const value = {
        toasts: state.toasts,
        addToast,
        removeToast,
        updateToast,
        clearAllToasts,
        showApiResponseToast,
        showApiErrorToast,
        showLoadingToast,
        showSuccessToast,
        showErrorToast,
        showWarningToast,
        showInfoToast
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
};

// Custom hook to use toast context
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Export TOAST_TYPES for use in other components
export { TOAST_TYPES };

export default ToastContext;
