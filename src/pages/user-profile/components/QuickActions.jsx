import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickActions = ({
    setShowPasswordForm,
    loadUserSessions,
    loadingSessions
}) => {
    return (
        <div className="mt-6 bg-surface border border-border rounded-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-secondary-50 to-secondary-100 border-b border-border">
                <h3 className="text-lg font-semibold text-text-primary flex items-center">
                    <Icon name="Zap" size={20} className="mr-2 text-primary" />
                    Quick Actions
                </h3>
                <p className="text-sm text-secondary-600 mt-1">Manage your account settings</p>
            </div>
            <div className="p-4 space-y-3">
                <button
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full p-4 bg-gradient-to-r from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 border border-primary-200 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md group"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-200 rounded-lg flex items-center justify-center group-hover:bg-primary-300 transition-colors duration-200">
                            <Icon name="Lock" size={18} className="text-primary-700" />
                        </div>
                        <div className="text-left flex-1">
                            <p className="font-medium text-primary-700">Change Password</p>
                            <p className="text-sm text-primary-600">Update your account security</p>
                        </div>
                        <Icon name="ChevronRight" size={16} className="text-primary-600 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                </button>

                <button
                    onClick={loadUserSessions}
                    disabled={loadingSessions}
                    className="w-full p-4 bg-gradient-to-r from-secondary-50 to-secondary-100 hover:from-secondary-100 hover:to-secondary-200 border border-secondary-200 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md group disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-secondary-200 rounded-lg flex items-center justify-center group-hover:bg-secondary-300 transition-colors duration-200">
                            <Icon name={loadingSessions ? "Loader" : "Monitor"} size={18} className={`text-secondary-700 ${loadingSessions ? 'animate-spin' : ''}`} />
                        </div>
                        <div className="text-left flex-1">
                            <p className="font-medium text-secondary-700">
                                {loadingSessions ? 'Loading Sessions...' : 'Refresh Sessions'}
                            </p>
                            <p className="text-sm text-secondary-600">View active login sessions</p>
                        </div>
                        <Icon name="ChevronRight" size={16} className="text-secondary-600 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                </button>

                <button
                    disabled
                    className="w-full p-4 bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200 rounded-lg cursor-not-allowed opacity-60"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-warning-200 rounded-lg flex items-center justify-center">
                            <Icon name="Download" size={18} className="text-warning-700" />
                        </div>
                        <div className="text-left flex-1">
                            <p className="font-medium text-warning-700">Export Data</p>
                            <p className="text-sm text-warning-600">Download your account data</p>
                        </div>
                        <span className="text-xs bg-warning-200 text-warning-700 px-2 py-1 rounded-full font-medium">
                            Coming Soon
                        </span>
                    </div>
                </button>

                <button
                    disabled
                    className="w-full p-4 bg-gradient-to-r from-error-50 to-error-100 border border-error-200 rounded-lg cursor-not-allowed opacity-60"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-error-200 rounded-lg flex items-center justify-center">
                            <Icon name="Trash" size={18} className="text-error-700" />
                        </div>
                        <div className="text-left flex-1">
                            <p className="font-medium text-error-700">Delete Account</p>
                            <p className="text-sm text-error-600">Permanently remove your account</p>
                        </div>
                        <span className="text-xs bg-error-200 text-error-700 px-2 py-1 rounded-full font-medium">
                            Coming Soon
                        </span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default QuickActions;
