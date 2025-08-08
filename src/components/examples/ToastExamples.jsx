import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { useApiService } from '../../hooks/useApiService';

/**
 * Example component showing how to use the toast system
 * This can be used as a reference for implementing toasts throughout the app
 */
const ToastExamples = () => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        showSuccessToast,
        showErrorToast,
        showWarningToast,
        showInfoToast,
        showLoadingToast,
        removeToast,
        showApiErrorToast
    } = useToast();

    const apiService = useApiService();

    // Example: Manual toast notifications
    const handleSuccessToast = () => {
        showSuccessToast('Task completed successfully!', {
            duration: 3000,
            actions: [
                {
                    label: 'View Task',
                    variant: 'primary',
                    onClick: () => console.log('View task clicked')
                },
                {
                    label: 'Dismiss',
                    onClick: () => console.log('Dismissed')
                }
            ]
        });
    };

    const handleErrorToast = () => {
        showErrorToast('Failed to save changes. Please try again.', {
            title: 'Save Failed',
            duration: 6000,
            actions: [
                {
                    label: 'Retry',
                    variant: 'primary',
                    onClick: () => console.log('Retry clicked')
                }
            ]
        });
    };

    const handleWarningToast = () => {
        showWarningToast('You have unsaved changes that will be lost.', {
            title: 'Unsaved Changes',
            actions: [
                {
                    label: 'Save Changes',
                    variant: 'primary',
                    onClick: () => console.log('Save clicked')
                },
                {
                    label: 'Discard',
                    onClick: () => console.log('Discard clicked')
                }
            ]
        });
    };

    const handleInfoToast = () => {
        showInfoToast('New sprint planning features are now available!', {
            title: 'Feature Update',
            duration: 8000,
            actions: [
                {
                    label: 'Learn More',
                    variant: 'primary',
                    onClick: () => console.log('Learn more clicked')
                }
            ]
        });
    };

    const handleLoadingToast = () => {
        const loadingId = showLoadingToast('Processing your request...', {
            title: 'Please Wait'
        });

        // Simulate API call
        setTimeout(() => {
            removeToast(loadingId);
            showSuccessToast('Request processed successfully!');
        }, 3000);
    };

    // Example: API operation with automatic toast
    const handleApiOperation = async () => {
        setIsLoading(true);
        try {
            // This will automatically show loading and success/error toasts
            const taskData = {
                title: 'Example Task',
                description: 'This is an example task created via API',
                status: 'todo',
                priority: 'medium'
            };

            await apiService.createTask(taskData);
            // Success toast will be shown automatically by apiService
        } catch (error) {
            // Error toast will be shown automatically by apiService
            console.error('API operation failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Example: Manual API error handling
    const handleManualApiError = () => {
        // Simulate API error response
        const mockError = {
            response: {
                status: 422,
                data: {
                    message: 'Validation failed',
                    errors: [
                        { field: 'title', message: 'Title is required' },
                        { field: 'assignee', message: 'Invalid assignee ID' }
                    ]
                }
            }
        };

        showApiErrorToast(mockError, {
            title: 'Validation Error'
        });
    };

    // Example: Network error
    const handleNetworkError = () => {
        const networkError = new Error('Network Error');
        showApiErrorToast(networkError);
    };

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Toast Examples</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Manual Toast Examples */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-text-primary">Manual Toasts</h3>

                    <button
                        onClick={handleSuccessToast}
                        className="w-full px-4 py-2 bg-success text-white rounded-lg hover:bg-success-700 transition-colors"
                    >
                        Show Success Toast
                    </button>

                    <button
                        onClick={handleErrorToast}
                        className="w-full px-4 py-2 bg-error text-white rounded-lg hover:bg-error-700 transition-colors"
                    >
                        Show Error Toast
                    </button>

                    <button
                        onClick={handleWarningToast}
                        className="w-full px-4 py-2 bg-warning text-white rounded-lg hover:bg-warning-700 transition-colors"
                    >
                        Show Warning Toast
                    </button>

                    <button
                        onClick={handleInfoToast}
                        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Show Info Toast
                    </button>

                    <button
                        onClick={handleLoadingToast}
                        className="w-full px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                    >
                        Show Loading Toast
                    </button>
                </div>

                {/* API Integration Examples */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-text-primary">API Integration</h3>

                    <button
                        onClick={handleApiOperation}
                        disabled={isLoading}
                        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating Task...' : 'Create Task (Auto Toast)'}
                    </button>

                    <button
                        onClick={handleManualApiError}
                        className="w-full px-4 py-2 bg-error text-white rounded-lg hover:bg-error-700 transition-colors"
                    >
                        Show Validation Error
                    </button>

                    <button
                        onClick={handleNetworkError}
                        className="w-full px-4 py-2 bg-error text-white rounded-lg hover:bg-error-700 transition-colors"
                    >
                        Show Network Error
                    </button>
                </div>

                {/* Usage Examples */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-text-primary">Common Patterns</h3>

                    <div className="text-sm text-text-secondary space-y-2">
                        <p><strong>Automatic:</strong> Use apiService methods for automatic toast handling</p>
                        <p><strong>Manual:</strong> Use toast hooks for custom notifications</p>
                        <p><strong>Loading:</strong> Show progress for long operations</p>
                        <p><strong>Actions:</strong> Add buttons for user interaction</p>
                    </div>

                    <div className="mt-4 p-3 bg-secondary-50 rounded-lg">
                        <p className="text-xs text-secondary-600">
                            Check browser console for action button logs
                        </p>
                    </div>
                </div>
            </div>

            {/* Code Examples */}
            <div className="mt-8 p-4 bg-surface border border-border rounded-lg">
                <h3 className="text-lg font-semibold text-text-primary mb-3">Usage Examples</h3>

                <pre className="text-xs text-text-secondary overflow-x-auto">
                    {`// Basic usage
const { showSuccessToast, showErrorToast } = useToast();

// Simple toast
showSuccessToast('Operation completed!');

// Toast with actions
showWarningToast('Unsaved changes', {
  actions: [
    { label: 'Save', variant: 'primary', onClick: handleSave },
    { label: 'Discard', onClick: handleDiscard }
  ]
});

// API with automatic toasts
const apiService = useApiService();
await apiService.createTask(data); // Auto shows loading/success/error toasts

// Manual API error handling
try {
  await apiCall();
} catch (error) {
  showApiErrorToast(error);
}`}
                </pre>
            </div>
        </div>
    );
};

export default ToastExamples;
