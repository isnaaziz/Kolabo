import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useToast, TOAST_TYPES } from '../../contexts/ToastContext';
import Icon from '../AppIcon';

// Individual toast component
const Toast = ({ toast, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Show animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleRemove = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 300);
    };

    // Auto-close logic is handled in ToastContext
    useEffect(() => {
        if (toast.autoClose && toast.type !== TOAST_TYPES.LOADING && toast.duration) {
            const timer = setTimeout(handleRemove, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast.autoClose, toast.duration, toast.type]);

    // Get toast styling based on type
    const getToastStyles = () => {
        const baseStyles = "relative flex items-start space-x-3 p-4 rounded-lg shadow-lg border max-w-sm w-full";

        switch (toast.type) {
            case TOAST_TYPES.SUCCESS:
                return `${baseStyles} bg-success-50 border-success-200 text-success-800`;
            case TOAST_TYPES.ERROR:
                return `${baseStyles} bg-error-50 border-error-200 text-error-800`;
            case TOAST_TYPES.WARNING:
                return `${baseStyles} bg-warning-50 border-warning-200 text-warning-800`;
            case TOAST_TYPES.INFO:
                return `${baseStyles} bg-primary-50 border-primary-200 text-primary-800`;
            case TOAST_TYPES.LOADING:
                return `${baseStyles} bg-secondary-50 border-secondary-200 text-secondary-800`;
            default:
                return `${baseStyles} bg-surface border-border text-text-primary`;
        }
    };

    // Get icon based on toast type
    const getIcon = () => {
        switch (toast.type) {
            case TOAST_TYPES.SUCCESS:
                return <Icon name="CheckCircle" size={20} className="text-success-600 flex-shrink-0 mt-0.5" />;
            case TOAST_TYPES.ERROR:
                return <Icon name="XCircle" size={20} className="text-error-600 flex-shrink-0 mt-0.5" />;
            case TOAST_TYPES.WARNING:
                return <Icon name="AlertTriangle" size={20} className="text-warning-600 flex-shrink-0 mt-0.5" />;
            case TOAST_TYPES.INFO:
                return <Icon name="Info" size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />;
            case TOAST_TYPES.LOADING:
                return <Icon name="Loader" size={20} className="text-secondary-600 flex-shrink-0 mt-0.5 animate-spin" />;
            default:
                return <Icon name="Bell" size={20} className="text-secondary-600 flex-shrink-0 mt-0.5" />;
        }
    };

    // Progress bar for non-loading toasts
    const ProgressBar = () => {
        if (toast.type === TOAST_TYPES.LOADING || !toast.autoClose) return null;

        return (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-10 rounded-b-lg overflow-hidden">
                <div
                    className="h-full bg-current opacity-30 transition-all ease-linear"
                    style={{
                        animation: `toast-progress ${toast.duration}ms linear forwards`
                    }}
                />
            </div>
        );
    };

    return (
        <div
            className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting
                    ? 'translate-x-0 opacity-100 scale-100'
                    : 'translate-x-full opacity-0 scale-95'
                }
      `}
        >
            <div className={getToastStyles()}>
                {/* Icon */}
                {getIcon()}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {toast.title && (
                        <h4 className="text-sm font-medium mb-1">{toast.title}</h4>
                    )}
                    <p className="text-sm opacity-90">{toast.message}</p>

                    {/* Actions */}
                    {toast.actions && toast.actions.length > 0 && (
                        <div className="flex space-x-2 mt-3">
                            {toast.actions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={action.onClick}
                                    className={`
                    px-3 py-1 text-xs font-medium rounded
                    ${action.variant === 'primary'
                                            ? 'bg-current text-white opacity-90 hover:opacity-100'
                                            : 'bg-black bg-opacity-10 hover:bg-opacity-20'
                                        }
                    transition-all duration-200
                  `}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Close button */}
                {toast.type !== TOAST_TYPES.LOADING && (
                    <button
                        onClick={handleRemove}
                        className="flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors duration-200"
                    >
                        <Icon name="X" size={16} className="opacity-60" />
                    </button>
                )}

                {/* Progress bar */}
                <ProgressBar />
            </div>
        </div>
    );
};

// Main toast container component
const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    // Create portal for toasts
    return createPortal(
        <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
            <div className="space-y-3 pointer-events-auto">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        toast={toast}
                        onRemove={removeToast}
                    />
                ))}
            </div>
        </div>,
        document.body
    );
};

// Add CSS for progress bar animation
const style = document.createElement('style');
style.textContent = `
  @keyframes toast-progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;
document.head.appendChild(style);

export default ToastContainer;
